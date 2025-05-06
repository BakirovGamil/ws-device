import { defineStore } from "pinia";
import { ref } from "vue";

export const useConnectionStore = defineStore("connection", () => {
  const isConnected = ref(false);
  const serverAddress = ref("");
  const savedAddresses = ref<string[]>([]);

  if (localStorage.getItem("savedAddresses")) {
    savedAddresses.value = JSON.parse(localStorage.getItem("savedAddresses")!);
  }

  const connect = async (address: string) => {
    try {
      isConnected.value = true;
      serverAddress.value = address;

      if (!savedAddresses.value.includes(address)) {
        savedAddresses.value.push(address);
        localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses.value));
      }

      return true;
    } catch (error) {
      isConnected.value = false;
      throw error;
    }
  };

  return { isConnected, serverAddress, savedAddresses, connect };
});
