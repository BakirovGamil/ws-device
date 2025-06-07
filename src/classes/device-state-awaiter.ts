export class DeviceStateAwaiter {
  private readonly DEFAULT_TIMEOUT = 2000;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private targetState: string | null = null;
  private stateResolve: (() => void) | null = null;
  private stateReject: ((error: Error) => void) | null = null;

  async waitFor(state: string): Promise<void> {
    this.clearPending();
    this.targetState = state;

    return new Promise<void>((resolve, reject) => {
      this.stateResolve = resolve;
      this.stateReject = reject;
      this.startTimeout();
    });
  }

  onStateUpdated(newState: string) {
    if (newState === this.targetState && this.stateResolve) {
      this.clearPending();
      this.stateResolve();
    }
  }

  private startTimeout(): void {
    this.timeoutId = setTimeout(() => {
      this.stateReject?.(new Error(`Timeout waiting for state: ${this.targetState}`));
      this.clearPending();
    }, this.DEFAULT_TIMEOUT);
  }

  private clearPending(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.targetState = null;
    this.stateResolve = null;
    this.stateReject = null;
  }

  reject(reason: Error): void {
    if (this.stateReject) {
      this.stateReject(reason);
      this.clearPending();
    }
  }
}
