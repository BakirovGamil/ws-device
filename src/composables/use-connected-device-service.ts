import { onUnmounted, watch } from "vue";
import { useDeviceService } from "./use-device-service.ts";
import { useConnectionStore } from "@/stores/connection";

export function useConnectedDeviceService() {
  const service = useDeviceService();
  const connection = useConnectionStore();

  watch(
    () => connection.currentConnection,
    (socket) => {
      service.setSocket(socket);
    },
    { immediate: true },
  );

  onUnmounted(() => {
    service.setSocket(null);
  });

  return service;
}
