import mitt, { type EventType, type Handler } from "mitt";

export class EventEmitter<Events extends Record<EventType, unknown>> {
  protected emitter = mitt<Events>();

  on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
    this.emitter.on(type, handler);
  }

  off<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
    this.emitter.off(type, handler);
  }

  emit<Key extends keyof Events>(type: Key, event: Events[Key]) {
    this.emitter.emit(type, event);
  }
}
