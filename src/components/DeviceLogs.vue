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
        <div class="log-filters">
          <n-switch v-model:value="showOutgoing">
            <template #icon>
              <LogTypeIcon class="text-xl" type="outgoing" />
            </template>
          </n-switch>
          <n-switch v-model:value="showIncoming">
            <template #icon>
              <LogTypeIcon class="text-xl" type="incoming" />
            </template>
          </n-switch>
        </div>
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
        <div class="flex gap-2 mb-2 items-center">
          <LogTypeTag :type="log.type" />
          <LogLevelTag :level="log.level" />
        </div>
        <n-code :code="log.data" language="json" :hljs="hljs" class="log-content" word-wrap />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NCode, NEmpty, NIcon, NScrollbar, NSwitch } from "naive-ui";
import { CodeRound, DeleteOutlineRound } from "@vicons/material";
import { useLocalStorage } from "@vueuse/core";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import type { Log } from "@/types.ts";
import LogTypeIcon from "@/components/LogTypeIcon.vue";
import LogTypeTag from "@/components/LogTypeTag.vue";
import LogLevelTag from "@/components/LogLevelTag.vue";

hljs.registerLanguage("json", json);

interface Emits {
  (e: "clear"): void;
}

interface Props {
  logs: Log[];
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const showOutgoing = useLocalStorage("outgoingLogs", true);
const showIncoming = useLocalStorage("incomingLogs", true);
const filteredLogs = computed(() => {
  const result: Log[] = [];
  for (let i = 0; i < props.logs.length; i++) {
    const index = props.logs.length - 1 - i;
    const log = props.logs[index];
    const { type } = log;

    let isMatch = false;
    if (showOutgoing.value && type === "outgoing") {
      isMatch = true;
    }

    if (showIncoming.value && type === "incoming") {
      isMatch = true;
    }

    if (isMatch) {
      result.push(log);
    }
  }

  return result;
});

const formattedLogs = computed(() => filteredLogs.value.map(formatLog));

const clearLogs = () => {
  emit("clear");
};

const formatLog = (log: Log) => {
  return {
    ...log,
    class: log.type === "incoming" ? "incoming" : "outgoing",
    data: JSON.stringify(log.data, null, 2),
  };
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

.log-filters {
  @apply flex items-center gap-4 translate-y-[1px];
}

.log-title {
  @apply flex items-center gap-2 text-neutral-200 font-medium;
}

.log-controls {
  @apply flex gap-4;
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
