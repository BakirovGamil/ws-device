import { useConnectedDeviceService } from "./use-connected-device-service.ts";

export const useCashService = () => {
  const service = useConnectedDeviceService();

  return {
    ...service,
  };
};
