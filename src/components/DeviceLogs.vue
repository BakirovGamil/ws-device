<template>
  <div class="h-[calc(100dvh-100px)] flex flex-col bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
    <div
      class="flex items-center justify-between p-4 border-b border-zinc-700 bg-[rgba(39,39,42,0.7)] backdrop-blur-sm"
    >
      <div class="flex items-center gap-2 text-neutral-200 font-medium">
        <n-icon size="20" class="text-blue-400">
          <code-round />
        </n-icon>
        <h3>Логи</h3>
      </div>
      <div class="flex gap-4">
        <n-button title="Очистить" class="h-8 px-2" size="small" @click="clearLogs">
          <template #icon>
            <n-icon>
              <delete-outline-round />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <div class="flex flex-col items-start sm:flex-row sm:items-center gap-4 p-4">
      <n-input class="md:!w-72" v-model:value="searchText" placeholder="Поиск" clearable />
      <n-select
        class="md:w-72"
        placeholder="Уровень"
        v-model:value="levelFilter"
        :options="levelOptions"
        multiple
        clearable
      />
      <div class="flex gap-4 items-center">
        <n-switch title="Отображать исходящие" v-model:value="showOutgoing">
          <template #icon>
            <LogTypeIcon class="text-xl" type="outgoing" />
          </template>
        </n-switch>
        <n-switch title="Отображать входящие" v-model:value="showIncoming">
          <template #icon>
            <LogTypeIcon class="text-xl" type="incoming" />
          </template>
        </n-switch>
      </div>
    </div>

    <n-scrollbar class="h-full" content-class="p-4 pt-0 space-y-3">
      <template v-if="!postFilteredLogs.length">
        <n-empty class="py-12" />
      </template>
      <div
        v-for="(log, index) in postFilteredLogs"
        :key="index"
        class="p-3 rounded-lg bg-[rgba(63,63,70,0.3)] hover:bg-zinc-700 transition-all duration-200 ease-in-out"
      >
        <div class="flex gap-2 mb-2 items-center">
          <LogTypeTag :type="log.type" />
          <LogLevelTag :level="log.level" />
        </div>
        <n-code :code="log.data" language="json" :hljs="hljs" class="bg-transparent p-0 !important" word-wrap />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NCode, NEmpty, NIcon, NInput, NScrollbar, NSelect, NSwitch } from "naive-ui";
import { CodeRound, DeleteOutlineRound } from "@vicons/material";
import { useLocalStorage } from "@vueuse/core";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import type { Log, LogLevel } from "@/types.ts";
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

const levelFilter = useLocalStorage<LogLevel[]>("levelLog", []);
const searchText = useLocalStorage("searchTextLogs", "");
const showOutgoing = useLocalStorage("outgoingLogs", true);
const showIncoming = useLocalStorage("incomingLogs", true);
const preFilteredLogs = computed(() => {
  const result: Log[] = [];
  for (let i = 0; i < props.logs.length; i++) {
    const index = props.logs.length - 1 - i;
    const log = props.logs[index];
    const { type, level } = log;

    let isMatch = false;
    if (showOutgoing.value && type === "outgoing") {
      isMatch = true;
    }

    if (showIncoming.value && type === "incoming") {
      isMatch = true;
    }

    if (levelFilter.value.length) {
      isMatch = levelFilter.value.includes(level);
    }

    if (isMatch) {
      result.push(log);
    }
  }

  return result;
});

const formattedLogs = computed(() => preFilteredLogs.value.map(formatLog));
const postFilteredLogs = computed(() =>
  formattedLogs.value.filter((log) => {
    return log.data.includes(searchText.value);
  }),
);

const levelOptions: { label: string; value: LogLevel }[] = [
  {
    label: "Основной",
    value: "default",
  },
  {
    label: "Информация",
    value: "info",
  },
  {
    label: "Ошибка",
    value: "error",
  },
];

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
