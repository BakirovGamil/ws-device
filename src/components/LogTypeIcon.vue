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
  "text-green-500": props.type === "outgoing",
  "text-blue-500": props.type === "incoming",
}));
</script>
