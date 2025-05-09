import { computed, ref, shallowRef, watch } from "vue";
import { defineStore } from "pinia";
import type { Config } from "@/types";
import { SocketService } from "@/classes";
import { useHistoryStore } from "@/stores/history.ts";

export const useConnectionStore = defineStore("connection", () => {
  const history = useHistoryStore();

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

  watch(deviceType, () => {
    console.log("DEVICE TYPE", deviceType.value);
  });

  const connect = async (address: string) => {
    address = address.trim();
    if (!address) {
      return;
    }

    history.promote(address);
    const socketService = new SocketService(address);
    socketService.enableQueue();
    socketService.on("open", () => onConnect(socketService));
    socketService.connect();
    pendingConnection.value = socketService;
  };

  const onConnect = (socket: SocketService) => {
    disconnectCurrentSocket();
    currentConnection.value = socket;
    config.value = null;
    const stopListen = socket.on("receivedMessage", (event) => {
      const { data: rawData } = event;
      const { type, value } = JSON.parse(rawData);
      if (type === "configUpdate") {
        config.value = value;
      }

      stopListen();
    });
  };

  const disconnectCurrentSocket = () => {
    if (currentConnection.value) {
      currentConnection.value.disconnect();
    }
  };

  const disconnect = () => {
    cancelConnection();
    disconnectCurrentSocket();
  };

  const cancelConnection = () => {
    if (pendingConnection.value) {
      pendingConnection.value.disconnect();
    }
  };

  return {
    currentConnection,
    pendingConnection,
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
