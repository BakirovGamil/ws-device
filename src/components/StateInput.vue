<template>
  <n-input-group>
    <n-select v-model:value="value" :placeholder="state" :options="options" filterable tag clearable />
    <n-button class="w-[100px]" @click="setState"> Состояние</n-button>
  </n-input-group>
</template>

<script setup lang="ts">
import { NButton, NInputGroup, NSelect } from "naive-ui";
import { ref } from "vue";
import { useStateOptions } from "@/composables/use-state-options.ts";

interface Emits {
  (e: "set:state", v: string): void;
}

interface Props {
  state: string;
}

const emit = defineEmits<Emits>();
defineProps<Props>();
const value = ref(null);

const { options } = useStateOptions();
const setState = () => {
  if (!value.value) return;
  emit("set:state", value.value);
};
</script>
