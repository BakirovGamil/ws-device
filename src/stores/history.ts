import { ref } from "vue";
import { defineStore } from "pinia";
import { Storage } from "@/classes";

export const useHistoryStore = defineStore("history", () => {
  const storage = Storage.GetInstance();
  const savedAddresses = storage.loadAddresses();

  const recentAddress = ref(savedAddresses.recentAddress);
  const addressHistory = ref<string[]>(savedAddresses.addressHistory);

  const promoteRecent = (address: string) => {
    recentAddress.value = address;
    storage.saveRecentAddress(recentAddress.value);
  };

  const promote = (address: string) => {
    if (!addressHistory.value.includes(address)) {
      addAddress(address);
    } else {
      hoistAddress(address);
    }

    storage.saveAddressHistory(addressHistory.value);
  };

  const addAddress = (address: string) => {
    addressHistory.value.push(address);
  };

  const hoistAddress = (address: string) => {
    const index = addressHistory.value.indexOf(address);
    if (index > -1) {
      addressHistory.value.splice(index, 1);
      addressHistory.value.push(address);
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
    recentAddress,
    addressHistory,
    promoteRecent,
    promote,
    removeAddress,
    clearAddressHistory,
  };
});
