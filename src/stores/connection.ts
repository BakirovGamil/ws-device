import { defineStore } from "pinia";
import { ref } from "vue";
import { Storage } from "@/storage.ts";

export const useConnectionStore = defineStore("connection", () => {
  const isConnected = ref(false);
  const isConnecting = ref(false);

  const storage = Storage.GetInstance();
  const savedAddresses = storage.loadAddresses();

  const recentAddress = ref(savedAddresses.recentAddress);
  const addresses = ref<string[]>(savedAddresses.addresses);

  const connect = async (address: string) => {
    isConnecting.value = true;
    try {
      isConnected.value = true;
      recentAddress.value = address;
      storage.saveRecentAddress(address);

      if (!addresses.value.includes(address)) {
        addresses.value.push(address);
        storage.saveAddresses(addresses.value);
      }
    } catch (error) {
      isConnected.value = false;
    } finally {
      isConnecting.value = false;
    }
  };

  return { isConnected, serverAddress: recentAddress, savedAddresses: addresses, connect };
});
