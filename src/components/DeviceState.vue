<template>
  <n-tag :bordered="false" :type="type">
    {{ state }}
  </n-tag>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NTag } from "naive-ui";

interface Props {
  state: string;
}

const props = defineProps<Props>();
const type = computed(() => {
  if (props.state === "outOfService") {
    return "error";
  }

  return "default";
});
</script>
