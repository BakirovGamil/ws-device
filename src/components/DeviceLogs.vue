<template>
  <n-log :lines="logs" :hljs="hljs" language="JavaScript" />
</template>

<script setup lang="ts">
import { NLog } from "naive-ui";
import { computed } from "vue";
import hljs from "highlight.js/lib/core";

interface Props {
  logs: string[];
}

const props = defineProps<Props>();
const logs = computed(() => [...props.logs].reverse());
</script>
