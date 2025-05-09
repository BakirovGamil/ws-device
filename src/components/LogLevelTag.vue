<template>
  <n-tag class="text-lg" :title="title" :type="level" :bordered="false">
    <n-icon class="translate-y-[2px]">
      <component :is="icon" />
    </n-icon>
  </n-tag>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { NIcon, NTag } from "naive-ui";
import { CircleOutlined, ErrorOutlined, InfoOutlined } from "@vicons/material";
import type { LogLevel } from "@/types.ts";

interface Props {
  level: LogLevel;
}

const props = defineProps<Props>();

const ICON_MAP: Record<LogLevel, typeof ErrorOutlined> = {
  default: CircleOutlined,
  error: ErrorOutlined,
  info: InfoOutlined,
};

const TITLE_MAP: Record<LogLevel, string> = {
  default: "Основной",
  error: "Ошибка",
  info: "Информация",
};

const title = computed(() => TITLE_MAP[props.level]);
const icon = computed(() => {
  return ICON_MAP[props.level];
});
</script>
