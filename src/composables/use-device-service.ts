import { readonly, ref, shallowRef } from "vue";
import { createEmptyInputsRelays } from "@/utils";
import { EventEmitter, SocketService } from "@/classes";
import type { DeviceServiceEvents, Inputs, MessageData, Relays } from "@/types";

export function useDeviceService() {
  const state = ref("Неизвестный статус");
  const logs = ref<string[]>([]);
  const inputs = ref(createEmptyInputsRelays("inputs"));
  const relays = ref(createEmptyInputsRelays("relays"));

  const socket = shallowRef<SocketService | null>(null);
  const emitter = new EventEmitter<DeviceServiceEvents>();

  const resetState = () => {
    state.value = "Неизвестный статус";
    logs.value = [];
    inputs.value = createEmptyInputsRelays("inputs");
    relays.value = createEmptyInputsRelays("relays");
  };

  const setSocket = (newSocket: SocketService | null) => {
    socket.value?.off("message", onMessage);
    resetState();
    socket.value = newSocket;
    socket.value?.on("message", onMessage);
  };

  const onMessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      processMessage(data, event);
    } catch (err) {
      console.error("Failed to parse message", err);
    }
  };

  const processMessage = (data: MessageData, event: MessageEvent) => {
    const { type, state: msgState, value } = data;

    emitter.emit("data", data);

    if (msgState !== "Ping" && type !== "inputs" && type !== "relays") {
      logs.value.push(event.data);
      emitter.emit("log", event.data);
    }

    switch (type) {
      case "inputs":
        const inputsData = JSON.parse(value as string) as Inputs;
        inputs.value = inputsData;
        emitter.emit("inputs", inputsData);
        break;

      case "relays":
        const relaysData = JSON.parse(value as string) as Relays;
        relays.value = relaysData;
        emitter.emit("relays", relaysData);
        break;

      case "newState":
        state.value = value as string;
        emitter.emit("newState", value as string);
        break;
    }
  };

  const send = (data: Record<string, unknown>) => {
    if (!socket.value) return;
    socket.value.send(JSON.stringify(data));
  };

  const clearLogs = () => {
    logs.value = [];
  };

  const setInput = (input: number, enabled: boolean) => {
    send({
      type: "mock.setSingleInput",
      input: input.toString(),
      value: enabled ? "on" : "off",
    });
  };

  const setState = (state: string) => {
    send({
      type: "mock.SetState",
      state,
    });
  };

  return {
    state: readonly(state),
    logs: readonly(logs),
    inputs: readonly(inputs),
    relays: readonly(relays),

    clearLogs,
    setSocket,
    send,
    setInput,
    setState,

    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    emit: emitter.emit.bind(emitter),

    processMessage,
  };
}
