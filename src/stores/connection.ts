import { computed, shallowRef } from "vue";
import { defineStore } from "pinia";
import { SocketService } from "@/services";
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

  const connect = async (address: string) => {
    address = address.trim();
    if (!address) {
      return;
    }

    history.promote(address);
    const socketService = new SocketService(address);
    socketService.on("open", () => {
      disconnectActiveSocket();
      currentConnection.value = socketService;
    });

    socketService.connect();
    pendingConnection.value = socketService;
  };

  const disconnectActiveSocket = () => {
    if (currentConnection.value) {
      currentConnection.value.disconnect();
    }
  };

  const disconnect = () => {
    cancelConnection();
    disconnectActiveSocket();
  };

  const cancelConnection = () => {
    if (pendingConnection.value) {
      pendingConnection.value.disconnect();
    }
  };

  return {
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
