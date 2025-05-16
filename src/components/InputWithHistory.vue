<template>
  <n-auto-complete
    v-model:value="value"
    :title="title"
    :options="getAutoCompleteOptions(value)"
    :placeholder="placeholder"
    :get-show="() => true"
    @blur="onBlur"
    clearable
  >
    <template #prefix>
      <slot name="prefix" />
    </template>
  </n-auto-complete>
</template>

<script setup lang="ts">
import { NAutoComplete } from "naive-ui";
import { computed } from "vue";
import { useLocalStorage, useVModel } from "@vueuse/core";

interface Emits {
  (e: "update:value", v: string): void;
}

interface Props {
  storageKey: string;
  value?: string;
  title?: string;
  maxHistoryItems?: number;
  placeholder?: string;
}

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  value: "",
  maxHistoryItems: 10,
  placeholder: "Введите значение",
});

const value = useVModel(props, "value", emit);
const history = useLocalStorage<string[]>(props.storageKey, [], {
  listenToStorageChanges: true,
});

const historyOptions = computed(() =>
  history.value.map((item) => ({
    label: item,
    value: item,
  })),
);

const getAutoCompleteOptions = (inputValue: string) => {
  if (!inputValue.trim()) {
    return historyOptions.value;
  }

  const filtered = historyOptions.value.filter((item) => item.value.includes(inputValue));
  const sorted = filtered.sort((a, b) => {
    if (a.value === inputValue) return -1;
    if (b.value === inputValue) return 1;
    return 0;
  });

  if (sorted.length && sorted[0].value !== inputValue) {
    return [{ label: inputValue, value: value }, ...sorted];
  } else if (!sorted.length) {
    return [{ label: inputValue, value: inputValue }];
  }

  return sorted;
};

const updateHistory = (value: string) => {
  if (!value.trim()) return;

  const index = history.value.indexOf(value);
  if (index > -1) {
    history.value.splice(index, 1);
  }
  history.value.unshift(value);

  if (history.value.length > props.maxHistoryItems) {
    history.value.pop();
  }
};

const onBlur = () => {
  updateHistory(value.value);
};
</script>
