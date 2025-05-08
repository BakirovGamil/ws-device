import { computed, ref, shallowRef } from "vue";
import { defineStore } from "pinia";
import { Storage } from "@/classes";
import { SocketService } from "@/services";

export const useConnectionStore = defineStore("connection", () => {
  const storage = Storage.GetInstance();
  const savedAddresses = storage.loadAddresses();

  const recentAddress = ref(savedAddresses.recentAddress);
  const addressHistory = ref<string[]>(savedAddresses.addressHistory);

  const activeSocketService = shallowRef<SocketService | null>(null);
  const connectionSocketService = shallowRef<SocketService | null>(null);

  const isConnected = computed(() => activeSocketService.value?.isConnected.value || false);
  const isConnecting = computed(() => connectionSocketService.value?.isConnecting.value || false);
  const activeAddress = computed(() => (isConnected.value ? activeSocketService.value!.address : null));
  const connectionAddress = computed(() => (isConnecting.value ? connectionSocketService.value!.address : null));

  const connect = async (address: string) => {
    address = address.trim();
    if (!address) {
      return;
    }

    setRecentAddress(address);
    updateAddressHistory(address);

    const socketService = new SocketService(address);
    socketService.on("open", () => {
      disconnectActiveSocket();
      activeSocketService.value = socketService;
    });

    socketService.connect();
    connectionSocketService.value = socketService;
  };

  const disconnectActiveSocket = () => {
    if (activeSocketService.value) {
      activeSocketService.value.disconnect();
    }
  };

  const disconnect = () => {
    cancelConnection();
    disconnectActiveSocket();
  };

  const cancelConnection = () => {
    if (connectionSocketService.value) {
      connectionSocketService.value.disconnect();
    }
  };

  const setRecentAddress = (address: string) => {
    recentAddress.value = address;
    storage.saveRecentAddress(address);
  };

  const updateAddressHistory = (address: string) => {
    if (!addressHistory.value.includes(address)) {
      addAddress(address);
    } else {
      hoistAddress(address);
    }
  };

  const addAddress = (address: string) => {
    addressHistory.value.push(address);
    storage.saveAddressHistory(addressHistory.value);
  };

  const hoistAddress = (address: string) => {
    const index = addressHistory.value.indexOf(address);
    if (index > -1) {
      addressHistory.value.splice(index, 1);
      addressHistory.value.push(address);
      storage.saveAddressHistory(addressHistory.value);
    }
  };

  const clearAddressHistory = () => {
    addressHistory.value = [];
    storage.saveAddressHistory(addressHistory.value);
  };

  const removeAddress = async (address: string) => {
    addressHistory.value = addressHistory.value.filter((a) => a !== address);
    storage.saveAddressHistory(addressHistory.value);
  };

  return {
    isConnecting,
    isConnected,
    recentAddress,
    addressHistory,
    activeAddress,
    connectionAddress,
    connect,
    disconnect,
    cancelConnection,
    removeAddress,
    clearAddressHistory,
  };
});
