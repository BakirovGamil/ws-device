<template>
  <n-input-group>
    <n-input v-model:value="plateNumber" placeholder="A777AA77" />
    <HotkeyButton title="Распознать номер" :disabled="!plateNumber" hotkey="Shift+Y" :action="recognizePlateNumber">
      <template #icon>
        <n-icon>
          <videocam-filled />
        </n-icon>
      </template>
    </HotkeyButton>
  </n-input-group>
</template>

<script lang="ts" setup>
import { NIcon, NInput, NInputGroup } from "naive-ui";
import { VideocamFilled } from "@vicons/material";
import { useLocalStorage } from "@vueuse/core";
import HotkeyButton from "@/components/HotkeyButton.vue";

interface Emits {
  (e: "recognizePlateNumber", plateNumber: string): void;
}

const emit = defineEmits<Emits>();
const plateNumber = useLocalStorage("recognitionPlateNumber", "");

const recognizePlateNumber = () => {
  emit("recognizePlateNumber", plateNumber.value);
};
</script>
