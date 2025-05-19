<template>
  <div class="text-neutral-200 font-medium flex items-center gap-2 p-4">
    <div class="flex items-center gap-2 cursor-pointer select-none" @click="isExpanded = !isExpanded">
      <n-icon size="20" class="text-blue-400">
        <desktop-windows-round />
      </n-icon>
      <h3>Экран</h3>
    </div>
    <template v-if="isExpanded">
      <span class="font-normal text-xs text-zinc-400" title="Текущий адрес экрана">
        {{ address }}
      </span>
      <n-popover v-if="showInfoPopover">
        <template #trigger>
          <n-icon size="20" color="orange">
            <info-outlined />
          </n-icon>
        </template>
        {{ WINDOW_ALERT_MESSAGE}}
      </n-popover>
    </template>
  </div>
</template>

<script setup lang="ts">
import { NIcon, NPopover } from "naive-ui";
import { DesktopWindowsRound, InfoOutlined } from "@vicons/material";
import { useVModel } from "@vueuse/core";
import { WINDOW_ALERT_MESSAGE } from "@/defaults.ts";

interface Emits {
  (e: "update:isExpanded", v: boolean): void;
}

interface Props {
  showInfoPopover: boolean;
  isExpanded: boolean;
  address: string;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const isExpanded = useVModel(props, "isExpanded", emit);
</script>
