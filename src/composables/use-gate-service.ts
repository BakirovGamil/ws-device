import { useConnectedDeviceService } from "./use-connected-device-service.ts";

export const useGateService = () => {
  const service = useConnectedDeviceService();

  return {
    ...service,
  };
};
