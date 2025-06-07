<template>
  <div class="@container flex flex-col gap-2">
    <div class="grid gap-2 max-w-80 @[320px]:grid-cols-2">
      <div class="flex flex-col gap-2">
        <template v-for="btn in buttonConfigs" :key="btn.key">
          <HotkeyButton
            v-if="btn.model"
            v-model:toggle-value="btn.model.value"
            :hotkey="btn.hotkey"
            :disabled="isAutoProcessActive"
          >
            {{ btn.label }}
          </HotkeyButton>
          <HotkeyButton v-else :hotkey="btn.hotkey" :action="btn.action" :disabled="isAutoProcessActive">
            {{ btn.label }}
          </HotkeyButton>
        </template>
      </div>
      <div class="flex flex-col gap-2">
        <HotkeyButton v-model:toggle-value="voiceCallModel" :hotkey="'Shift+T'">
          Вызов
        </HotkeyButton>
        <PlateNumberInput :disabled="isAutoProcessActive" @recognize-plate-number="recognizePlateNumber" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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

  (e: "makeOneTimeVisit"): void;
}

interface Props {
  firstLoop: boolean;
  secondLoop: boolean;
  ticketPrint: boolean;
  voiceCall: boolean;
  isAutoProcessActive: boolean;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const buttonConfigs = computed(() => [
  {
    key: "firstLoop",
    label: "Первая петля",
    hotkey: "Shift+Q",
    model: useVModel(props, "firstLoop", emit),
  },
  {
    key: "ticketPrint",
    label: "Печать чека",
    hotkey: "Shift+W",
    model: useVModel(props, "ticketPrint", emit),
  },
  {
    key: "pickupTicket",
    label: "Взять чек",
    hotkey: "Shift+E",
    action: () => emit("pickupTicket"),
  },
  {
    key: "secondLoop",
    label: "Вторая петля",
    hotkey: "Shift+R",
    model: useVModel(props, "secondLoop", emit),
  },
  {
    key: "oneTimeVisit",
    label: "Разовое посещение",
    hotkey: "Shift+Y",
    action: () => emit("makeOneTimeVisit"),
  },
]);

const voiceCallModel = useVModel(props, "voiceCall", emit);

const recognizePlateNumber = (plateNumber: string) => {
  emit("recognizePlateNumber", plateNumber);
};
</script>
