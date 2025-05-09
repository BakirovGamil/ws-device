<template>
  <n-input-group>
    <n-input v-model:value="value" placeholder="Введите ошибку" clearable />
    <n-button @click="setError"> Ошибка</n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { NButton, NInputGroup, NInput } from "naive-ui";

interface Emits {
  (e: "set:error", v: string): void;
}

const emit = defineEmits<Emits>();
const value = ref("");

const setError = () => {
  emit("set:error", value.value);
};
</script>
