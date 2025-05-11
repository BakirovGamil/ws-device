<template>
  <div class="flex flex-col gap-2">
    <div class="grid sm:grid-cols-3 md:grid-cols-4 gap-2 xl:max-w-[600px]">
      <template v-for="btn in buttons" :key="btn.key">
        <HotkeyButton v-if="btn.model" v-model:toggle-value="btn.model.value" :hotkey="btn.hotkey">
          {{ btn.label }}
        </HotkeyButton>
        <HotkeyButton v-else :hotkey="btn.hotkey" :action="btn.action">
          {{ btn.label }}
        </HotkeyButton>
      </template>
      <HotkeyButton
        v-model:toggle-value="hotkeyActions.voiceCall.model!.value"
        :hotkey="hotkeyActions.voiceCall.hotkey"
      >
        Вызов
      </HotkeyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref } from "vue";
import { useVModel } from "@vueuse/core";
import HotkeyButton from "@/components/HotkeyButton.vue";

interface Emits {
  (e: "update:firstLoop", enabled: boolean): void;

  (e: "update:secondLoop", enabled: boolean): void;

  (e: "update:ticketPrint", enabled: boolean): void;

  (e: "update:voiceCall", enabled: boolean): void;

  (e: "pickupTicket"): void;
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
</script>
