<template>
  <div class="@container flex flex-col gap-2">
    <div class="grid gap-2 max-w-80 @[320px]:grid-cols-2">
      <div class="flex flex-col gap-2">
        <template v-for="btn in buttons" :key="btn.key">
          <HotkeyButton v-if="btn.model" v-model:toggle-value="btn.model.value" :hotkey="btn.hotkey">
            {{ btn.label }}
          </HotkeyButton>
          <HotkeyButton v-else :hotkey="btn.hotkey" :action="btn.action">
            {{ btn.label }}
          </HotkeyButton>
        </template>
      </div>
      <div class="flex flex-col gap-2">
        <HotkeyButton
          v-model:toggle-value="hotkeyActions.voiceCall.model!.value"
          :hotkey="hotkeyActions.voiceCall.hotkey"
        >
          Вызов
        </HotkeyButton>
        <PlateNumberInput @recognize-plate-number="recognizePlateNumber" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue";
import { useVModel } from "@vueuse/core";
import HotkeyButton from "@/components/HotkeyButton.vue";
import PlateNumberInput from "@/components/PlateNumberInput.vue";

interface Emits {
  (e: "update:firstLoop", enabled: boolean): void;

  (e: "update:secondLoop", enabled: boolean): void;

  (e: "update:ticketPrint", enabled: boolean): void;

  (e: "update:voiceCall", enabled: boolean): void;

  (e: "pickupTicket"): void;

  (e: "recognizePlateNumber", plateNumber: string): void;
}

interface Props {
  firstLoop: boolean;
  secondLoop: boolean;
  ticketPrint: boolean;
  voiceCall: boolean;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

interface HotKeyAction {
  hotkey: string; // example: "Shift+Q"
  model?: Ref<boolean>;
  action?: () => void;
}

const hotkeyActions = {
  firstLoop: {
    model: useVModel(props, "firstLoop", emit),
    hotkey: "Shift+Q",
  } as HotKeyAction,
  ticketPrint: {
    model: useVModel(props, "ticketPrint", emit),
    hotkey: "Shift+W",
  } as HotKeyAction,
  pickupTicket: {
    hotkey: "Shift+E",
    action: () => emit("pickupTicket"),
  } as HotKeyAction,
  secondLoop: {
    model: useVModel(props, "secondLoop", emit),
    hotkey: "Shift+R",
  } as HotKeyAction,
  voiceCall: {
    model: useVModel(props, "voiceCall", emit),
    hotkey: "Shift+T",
  } as HotKeyAction,
};

const buttons = computed(() => [
  {
    label: "Первая петля",
    key: "firstLoop",
    model: hotkeyActions.firstLoop.model,
    hotkey: hotkeyActions.firstLoop.hotkey,
  },
  {
    label: "Печать чека",
    key: "ticketPrint",
    model: hotkeyActions.ticketPrint.model,
    hotkey: hotkeyActions.ticketPrint.hotkey,
  },
  {
    label: "Взять чек",
    key: "pickupTicket",
    hotkey: hotkeyActions.pickupTicket.hotkey,
    action: hotkeyActions.pickupTicket.action,
  },
  {
    label: "Вторая петля",
    key: "secondLoop",
    model: hotkeyActions.secondLoop.model,
    hotkey: hotkeyActions.secondLoop.hotkey,
  },
]);

const recognizePlateNumber = (plateNumber: string) => {
  emit("recognizePlateNumber", plateNumber);
};
</script>
