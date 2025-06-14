export const APP_NAME = "Device debugger";
export const DEFAULT_ADDRESS = "localhost:5000";
export const INPUTS_RELAYS_COUNT = 8;
export const MIN_CARD_COUNT = 1;
export const MAX_CARD_COUNT = 5;
export const MAX_CARD_HISTORY = 10;
export const MIN_SCANNER_COUNT = 1;
export const MAX_SCANNER_COUNT = 5;
export const MAX_SCANNER_HISTORY = 10;
export const CONFIG_MESSAGE_DEADLINE = 10_000;
export const EMPTY_STATE_MESSAGE = "Ожидаем состояние...";
export const STATES = [
  "regular",
  "outOfService",
  "active",
  "obstacleBehindBarrier",
  "ticketPrint",
  "ticketPickUp",
  "waiting",
  "finish"
];
export const WINDOW_ALERT_MESSAGE = "Это не дублирование экрана, а отдельное окно";
