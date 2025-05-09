<template>
  <div class="log-viewer">
    <div class="log-header">
      <div class="log-title">
        <n-icon size="20" class="text-blue-400">
          <code-round />
        </n-icon>
        <h3>Логи</h3>
      </div>
      <div class="log-controls">
        <n-button size="small" @click="clearLogs">
          <template #icon>
            <n-icon>
              <delete-outline-round />
            </n-icon>
          </template>
          Очистить
        </n-button>
      </div>
    </div>

    <n-scrollbar class="log-container" content-class="log-list">
      <template v-if="!formattedLogs.length">
        <n-empty />
      </template>
      <div v-for="(log, index) in formattedLogs" :key="index" class="log-entry">
        <n-code :code="formatLogContent(log)" language="json" :hljs="hljs" class="log-content" word-wrap />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NCode, NIcon, NScrollbar, NEmpty } from "naive-ui";
import { CodeRound, DeleteOutlineRound } from "@vicons/material";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

interface Emits {
  (e: "clear"): void;
}

interface Props {
  logs: string[];
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const logs = computed(() => [...props.logs].reverse());
const formattedLogs = computed(() => logs.value.map(formatLogContent));

const clearLogs = () => {
  emit("clear");
};

const formatLogContent = (log: string) => {
  return JSON.stringify(JSON.parse(log), null, 2);
};
</script>

<style scoped>
.log-viewer {
  @apply h-full flex flex-col bg-zinc-800 rounded-lg shadow-lg overflow-hidden;
}

.log-header {
  @apply flex items-center justify-between p-4 border-b border-zinc-700;
  background: rgba(39, 39, 42, 0.7);
  backdrop-filter: blur(4px);
}

.log-title {
  @apply flex items-center gap-2 text-neutral-200 font-medium;
}

.log-controls {
  @apply flex gap-2;
}

:deep(.log-container) {
  @apply h-full;
}

:deep(.log-list) {
  @apply p-4 space-y-3;
}

.log-entry {
  @apply p-3 rounded-lg;
  background: rgba(63, 63, 70, 0.3);
  transition: all 0.2s ease;
}

.log-entry:hover {
  @apply bg-zinc-700;
}

.log-content {
  @apply bg-transparent p-0 !important;
}
</style>
