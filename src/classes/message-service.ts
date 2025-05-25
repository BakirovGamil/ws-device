import { useMessage } from "naive-ui";

type MessageApiInjection = ReturnType<typeof useMessage>;

class MessageService {
  private messageApi: MessageApiInjection | null = null;

  init(api: MessageApiInjection): void {
    this.messageApi = api;
  }

  create: MessageApiInjection['create'] = (...args) => {
    return this.messageApi!.create(...args);
  }
}

export const messageService = new MessageService();
