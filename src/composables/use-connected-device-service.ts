import { onUnmounted, watch } from "vue";
import { useDeviceService } from "./use-device-service.ts";
import { useConnectionStore } from "@/stores/connection";

export function useConnectedDeviceService(onSocketUpdated?: () => void) {
  const service = useDeviceService();
  const connection = useConnectionStore();
  let timeout: ReturnType<typeof setTimeout>;

  watch(
    () => connection.currentConnection,
    (socket) => {
      onSocketUpdated?.();
      service.setSocket(socket);
      socket?.disableQueue();

      // Input and relay states are updated only
      // after the first interaction with them. Since we
      // cannot accurately determine the current state,
      // we explicitly set both states to ensure
      // they are updated correctly
      clearTimeout(timeout);
      service.setSingleInput(0, true);
      timeout = setTimeout(() => {
        service.setSingleInput(0, false);
      }, 500);
    },
    { immediate: true },
  );

  onUnmounted(() => {
    clearTimeout(timeout);
    onSocketUpdated?.();
    service.setSocket(null);
  });

  return service;
}
