import { computed, watch } from "vue";
import { useNavigate } from "./use-navigate.ts";
import { PageName } from "@/router";
import { useConnectionStore } from "@/stores/connection.ts";

export function useConnectionRouter() {
  const connection = useConnectionStore();
  const deviceType = computed(() => connection.deviceType);
  const { navigateTo } = useNavigate();

  const DEVICE_ROUTES: Record<string, PageName> = {
    IN: PageName.Gate,
    OUT: PageName.Gate,
    CASH: PageName.Cash,

    DEFAULT: PageName.Connect,
  };

  const setupWatcher = () => {
    watch(deviceType, (type) => {
      const target = DEVICE_ROUTES[type as never] || DEVICE_ROUTES.DEFAULT;
      navigateTo(target);
    });
  };

  return { setupWatcher };
}
