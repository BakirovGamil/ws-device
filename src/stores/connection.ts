import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { Storage } from "@/storage.ts";

export const useConnectionStore = defineStore("connection", () => {
  const isConnected = ref(false);
  const isConnecting = ref(false);
  const connectionAddress = computed(() => (isConnecting.value ? recentAddress.value : null));

  const storage = Storage.GetInstance();
  const savedAddresses = storage.loadAddresses();

  const recentAddress = ref(savedAddresses.recentAddress);
  const addressHistory = ref<string[]>(savedAddresses.addressHistory);

  const connect = async (address: string) => {
    address = address.trim();
    if (!address) {
      isConnecting.value = false;
      return;
    }

    isConnecting.value = true;
    try {
      setRecentAddress(address);
      updateAddressHistory(address);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      isConnected.value = true;
    } catch (error) {
      isConnected.value = false;
    } finally {
      isConnecting.value = false;
    }
  };

  const disconnect = () => {
    cancelConnection();
    isConnected.value = false;
  };

  const cancelConnection = () => {
    isConnecting.value = false;
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
    connectionAddress,
    connect,
    disconnect,
    cancelConnection,
    removeAddress,
    clearAddressHistory,
  };
});
