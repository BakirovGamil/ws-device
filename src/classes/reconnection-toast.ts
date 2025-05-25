import { h } from "vue";
import type { MessageReactive, MessageRenderMessage } from "naive-ui";
import { NAlert, NSpin } from "naive-ui";
import { messageService } from "./message-service.ts";

export class ReconnectionToast {
  private constructor() {}
  private static Instance: ReconnectionToast;

  private toast: MessageReactive | null = null;
  private reconnectedTimeout: number | null = null;

  private readonly RECONNECTED_DURATION = 2000;
  private readonly MAX_WIDTH = "350px";
  private readonly RECONNECTING_MESSAGE = "Потеряли соединение, но не надежду!";
  private readonly RECONNECTED_MESSAGE = "Соединение восстановлено";

  static GetInstance(): ReconnectionToast {
    if (!this.Instance) {
      this.Instance = new ReconnectionToast();
    }
    return this.Instance;
  }

  private renderMessage: MessageRenderMessage = (props) => {
    const { type, content, closable, onClose } = props;

    return h(
      NAlert,
      {
        closable,
        onClose,
        type: type === "success" ? "success" : "warning",
        title: content as string,
        style: {
          boxShadow: "var(--n-box-shadow)",
          maxWidth: this.MAX_WIDTH,
        },
      },
      {
        icon: type === "success" ? undefined : () => h(NSpin, { size: 18, stroke: "white" }),
      },
    );
  };

  reconnecting(): void {
    this.clearTimeout();
    this.closeToast();

    this.toast = messageService.create(this.RECONNECTING_MESSAGE, {
      render: this.renderMessage,
      closable: false,
      duration: 0,
    });
  }

  reconnected(): void {
    if (!this.toast) {
      return;
    }

    this.toast.content = this.RECONNECTED_MESSAGE;
    this.toast.type = "success";

    this.clearTimeout();
    this.reconnectedTimeout = window.setTimeout(() => this.closeToast(), this.RECONNECTED_DURATION);
  }

  close(): void {
    this.clearTimeout();
    this.closeToast();
  }

  private closeToast(): void {
    this.toast?.destroy();
    this.toast = null;
  }

  private clearTimeout(): void {
    if (this.reconnectedTimeout) {
      clearTimeout(this.reconnectedTimeout);
      this.reconnectedTimeout = null;
    }
  }
}
