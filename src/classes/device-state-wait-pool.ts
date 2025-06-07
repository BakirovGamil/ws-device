import { DeviceStateAwaiter } from "./device-state-awaiter.ts";

export class DeviceStateWaitPool {
  private readonly awaiters = new Set<DeviceStateAwaiter>();

  async waitFor(state: string): Promise<void> {
    const awaiter = new DeviceStateAwaiter();
    this.awaiters.add(awaiter);
    return awaiter.waitFor(state).finally(() => this.awaiters.delete(awaiter));
  }

  notifyAll(newState: string): void {
    for (const awaiter of this.awaiters) {
      awaiter.onStateUpdated(newState);
    }
  }

  rejectAll(reason: Error): void {
    for (const awaiter of this.awaiters) {
      awaiter.reject(reason);
    }
    this.awaiters.clear();
  }
}
