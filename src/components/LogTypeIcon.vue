<template>
  <n-icon :class="classes">
    <component :is="icon" />
  </n-icon>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { NIcon } from "naive-ui";
import { ArrowDownwardRound, ArrowUpwardRound } from "@vicons/material";
import type { LogType } from "@/types.ts";

interface Props {
  type: LogType;
}

const props = defineProps<Props>();
const icon = computed(() => (props.type === "outgoing" ? ArrowUpwardRound : ArrowDownwardRound));
const classes = computed(() => ({
  "outgoing-log-icon": props.type === "outgoing",
  "incoming-log-icon": props.type === "incoming",
}));
</script>

<style>
.outgoing-log-icon {
  @apply text-green-500;
}

.incoming-log-icon {
  @apply text-blue-500;
}
</style>
