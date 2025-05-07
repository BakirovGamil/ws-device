import { EventEmitter } from "@/classes";
import type { Inputs, Relays } from "@/types";

type MessageData = Record<string, unknown>;
type DeviceServiceEvents = {
  data: MessageData;
  inputs: Inputs;
  relays: Relays;
  newState: string;
  log: string;
};

abstract class DeviceService extends EventEmitter<DeviceServiceEvents> {
  constructor(private readonly socket: WebSocket) {
    super();
    socket.onmessage = (event: MessageEvent) => this.onMessage(event);
  }

  private onMessage(event: MessageEvent) {
    const { data: rawData } = event;
    const data = JSON.parse(rawData);
    console.log("Received data", data);

    this.processMessage(data, event);
  }

  protected processMessage(data: MessageData, event: MessageEvent) {
    const { type, state } = data;
    const { data: rawData } = event;

    this.emit("data", data);
    if (state !== "Ping" && type !== "inputs" && type !== "relays") {
      this.emit("log", rawData);
    }

    switch (type) {
      case "inputs":
        this.emit("inputs", data.value as Inputs);
        break;
      case "relays":
        this.emit("relays", data.value as Relays);
        break;
      case "newState":
        this.emit("newState", data.value as string);
        break;
    }
  }

  protected send(data: Record<string, unknown>) {
    this.socket.send(JSON.stringify(data));
  }

  setInput(input: number, enabled: boolean) {
    const value = enabled ? "on" : "off";
    this.send({
      type: "mock.setSingleInput",
      input,
      value,
    });
  }

  //
  // setState(state: string) {
  //   this.send({ type: "mock.SetState", state });
  // }
}
