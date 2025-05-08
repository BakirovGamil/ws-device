import { ref } from "vue";
import { EventEmitter } from "@/classes";

type SocketServiceEvents = {
  open: Event;
  close: CloseEvent;
  error: Event;
};

export class SocketService extends EventEmitter<SocketServiceEvents> {
  isConnecting = ref(false);
  isConnected = ref(false);
  error = ref<Error | null>(null);
  url: string;
  address: string;
  socket: WebSocket | null = null;

  constructor(address: string) {
    super();
    this.address = address;
    this.url = `ws://${address}/ws`;
  }

  connect() {
    if (this.socket) {
      this.disconnect();
    }

    this.isConnecting.value = true;
    this.error.value = null;
    try {
      this.socket = new WebSocket(this.url);
      this.setUpSocketListeners(this.socket);
    } catch (err) {
      this.isConnecting.value = false;
      this.error.value = err;
    }
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.cleanUpState();
    this.cleanUpSocketListeners(this.socket);
    this.socket.close();
    this.socket = null;
  }

  private setUpSocketListeners(socket: WebSocket) {
    socket.onopen = (ev: Event) => this.onOpen(ev);
    socket.onclose = (ev: CloseEvent) => this.onClose(ev);
    socket.onerror = (ev: Event) => this.onError(ev);
  }

  private cleanUpSocketListeners(socket: WebSocket) {
    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
  }

  private cleanUpState() {
    this.isConnected.value = false;
    this.isConnecting.value = false;
  }

  private onOpen(ev: Event) {
    this.isConnected.value = true;
    this.isConnecting.value = false;
    this.emit("open", ev);
  }

  private onClose(ev: CloseEvent) {
    this.cleanUpState();
    this.emit("close", ev);
  }

  private onError(ev: Event) {
    this.cleanUpState();
    this.error = new Error("Socket error");
    this.emit("error", ev);
  }
}
