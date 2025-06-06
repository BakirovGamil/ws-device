import { onUnmounted, watch } from "vue";
import { useDeviceService } from "./use-device-service.ts";
import { useConnectionStore } from "@/stores/connection";
import { SocketService } from "@/classes";

export function useConnectedDeviceService(onDisconnect?: () => void) {
  const service = useDeviceService();
  const connection = useConnectionStore();
  let timeout: ReturnType<typeof setTimeout>;
  let cleanupSocketListeners: (() => void) | null = null;

  watch(
    () => connection.currentConnection,
    (socket) => {
      cleanupPrevious();
      setSocket(socket);
    },
    { immediate: true },
  );

  function setSocket(socket: SocketService | null) {
    service.setSocket(socket);
    if (socket) {
      socket.disableQueue();
      toggleInputState();
      cleanupSocketListeners = setupSocketListeners(socket);
    }
  }

  function cleanupPrevious() {
    clearTimeout(timeout);
    cleanupSocketListeners?.();
    onDisconnect?.();
  }

  function setupSocketListeners(socket: SocketService) {
    const stopOpen = socket.on("open", () => {
      toggleInputState();
    });

    const stopClose = socket.on("close", () => {
      onDisconnect?.();
    });

    return () => {
      stopOpen();
      stopClose();
    };
  }

  // Input and relay states are updated only
  // after the first interaction with them. Since we
  // cannot accurately determine the current state,
  // we explicitly set both states to ensure
  // they are updated correctly
  function toggleInputState() {
    clearTimeout(timeout);
    service.setSingleInput(0, true);
    timeout = setTimeout(() => {
      service.setSingleInput(0, false);
    }, 500);
  }

  onUnmounted(() => {
    cleanupPrevious();
    setSocket(null);
  });

  return service;
}
