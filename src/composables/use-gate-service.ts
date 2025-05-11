import { computed, onUnmounted } from "vue";
import { useConnectedDeviceService } from "./use-connected-device-service.ts";
import type { InputKey } from "@/types.ts";

export const useGateService = () => {
  const timeoutMap = new Map<InputKey, ReturnType<typeof setTimeout>>();
  const removeTimeout = (key: InputKey) => {
    if (!timeoutMap.has(key)) {
      return;
    }

    clearTimeout(timeoutMap.get(key));
    timeoutMap.delete(key);
  };

  const addTimeout = (key: InputKey, cb: () => void, ms: number) => {
    removeTimeout(key);
    const id = setTimeout(() => {
      cb();
      removeTimeout(key);
    }, ms);

    timeoutMap.set(key, id);
  };

  const cleanupTimeouts = () => {
    timeoutMap.forEach((id) => clearTimeout(id));
    timeoutMap.clear();
  };

  onUnmounted(cleanupTimeouts);

  const service = useConnectedDeviceService(cleanupTimeouts);
  const { inputs, setSingleInput } = service;

  const createInputControl = (inputKey: InputKey, disableTimeout?: number) => {
    const index = +inputKey.slice(2) - 1;
    return computed<boolean>({
      get: () => !!inputs.value[inputKey],
      set: (enabled) => {
        setSingleInput(index, enabled);
        removeTimeout(inputKey);
        if (enabled && disableTimeout && disableTimeout > 0) {
          addTimeout(inputKey, () => setSingleInput(index, false), disableTimeout);
        }
      },
    });
  };

  const firstLoop = createInputControl("in1");
  const secondLoop = createInputControl("in2");
  const ticketPrint = createInputControl("in5", 500);
  const voiceCall = createInputControl("in4", 500);

  const pickupTicket = () => {
    service.send({ type: "mock.ticketPickup", "ticket-pickup": "done" });
  };

  return {
    firstLoop,
    secondLoop,
    ticketPrint,
    voiceCall,
    pickupTicket,
    ...service,
  };
};
