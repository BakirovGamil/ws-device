<template>
  <n-button :type="type" tertiary @click="onClick">
    <template #icon>
      <slot name="icon" />
    </template>
    <slot />
  </n-button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton } from "naive-ui";

interface Emits {
  (e: "update:active", active: boolean): void;
}

interface Props {
  active: boolean;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const type = computed(() => (props.active ? "primary" : "default"));
const onClick = () => {
  emit("update:active", !props.active);
};
</script>
