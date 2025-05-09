import { ref } from "vue";
import { EventEmitter } from "@/classes/index.ts";

type SocketServiceEvents = {
  receivedMessage: MessageEvent;
  queue: boolean;
  message: MessageEvent;
  open: Event;
  close: CloseEvent;
  error: Event;
};

export class SocketService extends EventEmitter<SocketServiceEvents> {
  url: string;
  address: string;
  socket: WebSocket | null = null;

  isConnecting = ref(false);
  isConnected = ref(false);
  error = ref<Error | null>(null);

  private queueEnabled = false;
  private queue: MessageEvent[] = [];

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
      this.setupSocketListeners(this.socket);
    } catch (err) {
      this.isConnecting.value = false;
      this.error.value = err as Error;
    }
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.cleanupState();
    this.cleanupSocketListeners(this.socket);
    this.socket.close();
    this.socket = null;
  }

  send(data: string) {
    if (this.socket) {
      this.socket.send(data);
    }
  }

  enableQueue() {
    console.log("queue enabled");
    this.queueEnabled = true;
    this.emit("queue", true);
  }

  disableQueue() {
    console.log("queue disabled");
    this.queueEnabled = false;
    this.flushQueue();
    this.emit("queue", false);
  }

  private flushQueue() {
    if (this.queueEnabled) {
      console.warn("Cannot flush queue");
      return;
    }

    console.log(`queue length ${this.queue.length}`);
    this.queue.forEach(this.processMessage.bind(this));
    this.queue.length = 0;
  }

  private setupSocketListeners(socket: WebSocket) {
    socket.onopen = (ev: Event) => this.onOpen(ev);
    socket.onclose = (ev: CloseEvent) => this.onClose(ev);
    socket.onerror = (ev: Event) => this.onError(ev);
    socket.onmessage = (ev: MessageEvent) => this.onMessage(ev);
  }

  private cleanupSocketListeners(socket: WebSocket) {
    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;
  }

  private cleanupState() {
    this.isConnected.value = false;
    this.isConnecting.value = false;
  }

  private onOpen(ev: Event) {
    this.isConnected.value = true;
    this.isConnecting.value = false;
    this.emit("open", ev);
  }

  private onClose(ev: CloseEvent) {
    this.cleanupState();
    this.emit("close", ev);
  }

  private onError(ev: Event) {
    this.cleanupState();
    this.error.value = new Error("Socket error");
    this.emit("error", ev);
  }

  private onMessage(ev: MessageEvent) {
    this.emit("receivedMessage", ev);
    console.count("message");
    this.processMessage(ev);
  }

  private processMessage(ev: MessageEvent) {
    if (this.queueEnabled) {
      this.queue.push(ev);
    } else {
      this.emit("message", ev);
    }
  }
}
