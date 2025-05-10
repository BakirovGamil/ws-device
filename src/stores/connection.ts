import { computed, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { PageName } from "@/router";
import type { Config } from "@/types";
import { SocketService } from "@/classes";
import { useHistoryStore } from "@/stores/history.ts";
import { getPageByDeviceType } from "@/utils.ts";
import { navigationService } from "@/classes/navigation-service.ts";
import { CONFIG_MESSAGE_DEADLINE } from "@/defaults.ts";
import type { StopListen } from "@/classes/event-emitter.ts";

export const useConnectionStore = defineStore("connection", () => {
  const history = useHistoryStore();

  let configDeadlineTimeout: ReturnType<typeof setTimeout>;
  let stopListenConfig: StopListen | null = null;
  let stopListenOpen: StopListen | null = null;
  let stopListenError: StopListen | null = null;

  const currentConnection = shallowRef<SocketService | null>(null);
  const pendingConnection = shallowRef<SocketService | null>(null);

  const isConnected = computed(() => currentConnection.value?.isConnected.value || false);
  const isConnecting = computed(() => pendingConnection.value?.isConnecting.value || false);

  const currentAddress = computed(() => (isConnected.value ? currentConnection.value!.address : null));
  const currentError = computed(() => currentConnection.value?.error || null);

  const pendingAddress = computed(() => (isConnecting.value ? pendingConnection.value!.address : null));
  const pendingError = computed(() => pendingConnection.value?.error.value || null);

  const config = ref<Config | null>(null);
  const deviceType = computed(() => (isConnected.value ? config.value?.deviceType || null : null));

  const connect = async (address: string) => {
    address = address.trim();
    if (!address) {
      return;
    }

    history.promote(address);
    cancelConnection();
    createConnection(address);
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
    stopListenConfig = socket.on("receivedMessage", (event) => {
      const { data: rawData } = event;
      const { type, value } = JSON.parse(rawData);
      if (type === "configUpdate") {
        clearTimeout(configDeadlineTimeout);
        stopListenConfig!();
        commitConnection(socket);

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
      commitConnection(socket);
      navigationService.navigateTo(PageName.Connect);
    }, CONFIG_MESSAGE_DEADLINE);
  };

  const commitConnection = (socket: SocketService) => {
    disconnectCurrent();
    pendingConnection.value = null;
    currentConnection.value = socket;
  };

  const disconnectCurrent = () => {
    config.value = null;
    if (currentConnection.value) {
      currentConnection.value.disconnect();
      currentConnection.value = null;
    }
  };

  const disconnect = () => {
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
    connect,
    disconnect,
    cancelConnection,
  };
});
