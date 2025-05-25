import { h } from "vue";
import { type MessageReactive, type MessageRenderMessage, NAlert, NSpin } from "naive-ui";
import { messageService } from "@/classes/message-service.ts";

export class ReconnectionToast {
  private constructor() {}

  private static Instance: ReconnectionToast;

  static GetInstance() {
    if (!this.Instance) {
      this.Instance = new ReconnectionToast();
    }

    return this.Instance;
  }

  private toast: MessageReactive | null = null;
  private RECONNECTED_DURATION = 2000;
  private reconnectedTimeout: ReturnType<typeof setTimeout>;

  private renderMessage: MessageRenderMessage = (props) => {
    const { type, content, closable, onClose } = props;
    return h(
      NAlert,
      {
        closable: closable,
        onClose: onClose,
        type: type === "success" ? "success" : "warning",
        title: content,
        style: {
          boxShadow: "var(--n-box-shadow)",
          maxWidth: "300px",
        },
      },
      {
        icon: type === "success" ? undefined : () => h(NSpin, { size: 18, stroke: "white" }),
      },
    );
  };

  reconnecting() {
    this.close();
    this.toast = messageService.create("Потеряли связь, но не надежду!", {
      render: this.renderMessage,
      closable: false,
      duration: 0,
    });
  }

  reconnected() {
    if (!this.toast) {
      return;
    }

    this.toast.content = "Соединение восстановлено";
    this.toast.type = "success";
    this.reconnectedTimeout = setTimeout(() => this.close(), this.RECONNECTED_DURATION);
  }

  close() {
    clearTimeout(this.reconnectedTimeout);
    this.toast?.destroy();
  }
}
