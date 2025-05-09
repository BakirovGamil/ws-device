import { onUnmounted, watch } from "vue";
import { useDeviceService } from "./use-device-service.ts";
import { useConnectionStore } from "@/stores/connection";

export function useConnectedDeviceService() {
  const service = useDeviceService();
  const connection = useConnectionStore();
  let timeout: ReturnType<typeof setTimeout>;

  watch(
    () => connection.currentConnection,
    (socket) => {
      service.setSocket(socket);
      socket?.disableQueue();

      // Input and relay states are updated only
      // after the first interaction with them. Since we
      // cannot accurately determine the current state,
      // we explicitly set both states to ensure
      // they are updated correctly
      clearTimeout(timeout);
      service.setInput(0, true);
      timeout = setTimeout(() => {
        service.setInput(0, false);
      }, 500);
    },
    { immediate: true },
  );

  onUnmounted(() => {
    clearTimeout(timeout);
    service.setSocket(null);
  });

  return service;
}
