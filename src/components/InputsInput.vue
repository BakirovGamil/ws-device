<template>
  <n-input-group>
    <n-input-number class="flex-1" v-model:value="value" min="0" max="255" placeholder="Входы" />
    <n-button @click="onClick"> Входы</n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { NButton, NInputGroup, NInputNumber } from "naive-ui";
import { useLocalStorage } from "@vueuse/core";

interface Emits {
  (e: "set:inputs", inputs: number): void;
}

const emit = defineEmits<Emits>();
const value = useLocalStorage("inputs", 0);

const onClick = () => {
  emit("set:inputs", value.value);
};
</script>

<style scoped></style>
