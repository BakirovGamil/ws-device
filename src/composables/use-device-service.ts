import { readonly, ref, shallowRef } from "vue";
import { createEmptyInputsRelays } from "@/utils";
import { EventEmitter, SocketService } from "@/classes";
import type { CardData, DeviceServiceEvents, Inputs, Log, LogLevel, MessageData, Relays, ScannerData } from "@/types";

export function useDeviceService() {
  const state = ref("Неизвестный статус");
  const logs = ref<Log[]>([]);
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

  const pushLog = (log: Log) => {
    logs.value.push(log);
    emitter.emit("log", log);
  };

  const logOutgoing = (data: Record<string, unknown>) => {
    const log: Log = {
      type: "outgoing",
      level: "default",
      data: data,
    };

    pushLog(log);
  };

  const getLevel = (data: MessageData): LogLevel => {
    const { type } = data;
    if (type === "info") {
      return "info";
    }

    if (type === "error") {
      return "error";
    }

    return "default";
  };

  const logIncoming = (data: MessageData) => {
    const { type, state } = data;
    if (state === "Ping" || ["inputs", "relays"].includes(type as never)) {
      return;
    }

    const log: Log = {
      type: "incoming",
      level: getLevel(data),
      data: data,
    };

    pushLog(log);
  };

  const processMessage = (data: MessageData, event: MessageEvent) => {
    const { type, value } = data;

    emitter.emit("data", data);
    logIncoming(data);

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
    logOutgoing(data);
    socket.value.send(JSON.stringify(data));
  };

  const clearLogs = () => {
    logs.value = [];
  };

  const setSingleInput = (input: number, enabled: boolean) => {
    send({
      type: "mock.setSingleInput",
      input: input.toString(),
      value: enabled ? "on" : "off",
    });
  };

  const setInputs = (inputs: number) => {
    send({
      type: "mock.setInputs",
      inputs: inputs.toString(),
    });
  };

  const setState = (state: string) => {
    send({
      type: "mock.SetState",
      state,
    });
  };

  const setError = (error: string) => {
    send({
      type: "mock.SetError",
      errorData: error,
    });
  };

  const setReverse = () => {
    send({
      type: "mock.SetReverse",
      reverse: "true",
    });
  };

  const sendCard = (cardData: CardData) => {
    const { code, address } = cardData;

    send({
      unit: "debugBoard",
      type: "mock.setCardID",
      "card-id": code,
      "card-addr": address.toString(),
    });
  };

  const sendScanner = (scannerData: ScannerData) => {
    const { code } = scannerData;

    send({
      type: "mock.codeRead",
      code: code,
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
    setSingleInput,
    setInputs,
    setState,
    setError,
    setReverse,
    sendCard,
    sendScanner,

    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
    emit: emitter.emit.bind(emitter),

    processMessage,
  };
}
