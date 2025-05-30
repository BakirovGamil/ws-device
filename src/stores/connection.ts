import { computed, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { PageName } from "@/router";
import type { Config } from "@/types";
import { navigationService, SocketService, type StopListen, ReconnectionToast } from "@/classes";
import { useHistoryStore } from "@/stores/history.ts";
import { getPageByDeviceType } from "@/utils.ts";
import { CONFIG_MESSAGE_DEADLINE } from "@/defaults.ts";
import { useLocalStorage } from "@vueuse/core";

export const useConnectionStore = defineStore("connection", () => {
  const history = useHistoryStore();

  let configDeadlineTimeout: ReturnType<typeof setTimeout>;
  let stopListenConfig: StopListen | null = null;
  let stopListenOpen: StopListen | null = null;
  let stopListenError: StopListen | null = null;

  let stopListenReconnected: StopListen | null = null;
  let stopListenReconnect: StopListen | null = null;

  const shouldConnectToRecent = useLocalStorage("shouldConnectToRecent", false);

  const currentConnection = shallowRef<SocketService | null>(null);
  const pendingConnection = shallowRef<SocketService | null>(null);

  const isConnected = computed(() => currentConnection.value?.isConnected.value || false);
  const isConnecting = computed(() => pendingConnection.value?.isConnecting.value || false);

  const currentAddress = computed(() => currentConnection.value?.address || null);
  const currentError = computed(() => currentConnection.value?.error || null);

  const pendingAddress = computed(() => (isConnecting.value ? pendingConnection.value!.address : null));
  const pendingError = computed(() => pendingConnection.value?.error.value || null);

  const config = ref<Config | null>(null);
  const deviceType = computed(() => (isConnected.value ? config.value?.deviceType || null : null));

  const reconnectionToast = ReconnectionToast.GetInstance();

  const connect = (address: string) => {
    address = address.trim();
    if (!address) {
      return;
    }

    history.promote(address);
    cancelConnection();
    createConnection(address);
  };

  const tryConnectToRecent = () => {
    if (!shouldConnectToRecent.value || !history.recentAddress) {
      return;
    }

    connect(history.recentAddress);
  };

  const createConnection = (address: string) => {
    const socket = new SocketService(address);
    setupPendingListeners(socket);
    socket.enableQueue();
    socket.connect();
    pendingConnection.value = socket;
  };

  const setupPendingListeners = (socket: SocketService) => {
    stopListenOpen = socket.on("open", () => onConnect(socket));
    stopListenError = socket.on("error", () => {
      stopListenOpen!();
      stopListenError!();
    });
  };

  const onConnect = async (socket: SocketService) => {
    stopListenOpen!();
    stopListenError!();
    commitConnection(socket);
    setupConfigListener(socket);
  };

  const setupConfigListener = (socket: SocketService) => {
    stopListenConfig = socket.on("receivedMessage", (event) => {
      const { data: rawData } = event;
      const { type, value } = JSON.parse(rawData);
      if (type === "configUpdate") {
        clearTimeout(configDeadlineTimeout);
        stopListenConfig!();

        console.log("CONFIG", value);
        const { deviceType } = value as Config;
        config.value = value;
        const page = getPageByDeviceType(deviceType);
        navigationService.navigateTo(page);
      }
    });

    configDeadlineTimeout = setTimeout(() => {
      console.log("CONFIG DEADLINE");
      stopListenConfig!();
      navigationService.navigateTo(PageName.Connect);
    }, CONFIG_MESSAGE_DEADLINE);
  };

  const commitConnection = (socket: SocketService) => {
    shouldConnectToRecent.value = true;
    history.promoteRecent(socket.address);
    disconnectCurrent();
    pendingConnection.value = null;
    currentConnection.value = socket;
    setupReconnection(socket);
  };

  const setupReconnection = (socket: SocketService) => {
    socket.enableReconnect();

    stopListenReconnect = socket.on("reconnect", () => {
      reconnectionToast.reconnecting();
    });

    stopListenReconnected = socket.on("open", () => {
      reconnectionToast.reconnected();
    });
  };

  const disconnectCurrent = () => {
    config.value = null;
    if (currentConnection.value) {
      stopListenReconnected!();
      stopListenReconnect!();
      reconnectionToast.close();
      currentConnection.value.disableReconnect();
      currentConnection.value.disconnect();
      currentConnection.value = null;
    }
  };

  const disconnect = () => {
    shouldConnectToRecent.value = false;
    cancelConnection();
    disconnectCurrent();
    navigationService.navigateTo(PageName.Connect);
  };

  const cancelConnection = () => {
    clearTimeout(configDeadlineTimeout);

    stopListenConfig?.();
    stopListenConfig = null;

    stopListenOpen?.();
    stopListenOpen = null;

    stopListenError?.();
    stopListenError = null;

    if (pendingConnection.value) {
      pendingConnection.value.disconnect();
      pendingConnection.value = null;
    }
  };

  return {
    currentConnection,
    deviceType,
    isConnecting,
    isConnected,
    currentAddress,
    currentError,
    pendingAddress,
    pendingError,
    tryConnectToRecent,
    connect,
    disconnect,
    cancelConnection,
  };
});
