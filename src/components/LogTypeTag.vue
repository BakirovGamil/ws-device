<template>
  <n-tag class="flex items-center text-base" :type="tagType" :title="title" :bordered="false">
    <LogTypeIcon class="translate-y-[2px]" :type="type" />
  </n-tag>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NTag } from "naive-ui";
import type { LogType } from "@/types.ts";
import LogTypeIcon from "@/components/LogTypeIcon.vue";

interface Props {
  type: LogType;
}

const props = defineProps<Props>();
const title = computed(() => (props.type === "outgoing" ? "Исходящий" : "Входящий"));
const tagType = computed(() => {
  if (props.type === "outgoing") {
    return "success";
  } else {
    return "info";
  }
});
</script>

<style scoped></style>
