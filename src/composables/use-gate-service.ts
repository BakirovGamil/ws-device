import { computed, onUnmounted, ref } from "vue";
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
  const { inputs, setSingleInput, waitForState } = service;

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

  const recognizePlateNumber = (plateNumber: string) => {
    service.send({ type: "mock.setPlateNum", value: plateNumber });
  };

  const isAutoProcessActive = ref(false);
  const autoProcessError = ref<Error | null>(null);

  const makeOneTimeVisit = async () => {
    isAutoProcessActive.value = true;
    autoProcessError.value = null;

    try {
      firstLoop.value = true;
      await waitForState("active");

      ticketPrint.value = true;
      await waitForState("ticketPrint");
      pickupTicket();

      await waitForState("ticketPickUp");

      await waitForState("waiting");
      secondLoop.value = true;
      await waitForState("finish");

    } catch (err) {
      autoProcessError.value = err as Error;
      console.error("Error in makeOneTimeVisit", err);
    } finally {
      firstLoop.value = false;
      secondLoop.value = false;
      isAutoProcessActive.value = false;
    }
  };

  return {
    firstLoop,
    secondLoop,
    ticketPrint,
    voiceCall,
    isAutoProcessActive,
    pickupTicket,
    recognizePlateNumber,
    makeOneTimeVisit,
    ...service,
  };
};
