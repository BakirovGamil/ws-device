<template>
  <n-select
    :value="activeAddress"
    :options="options"
    filterable
    tag
    :loading="isConnecting"
    @update:value="onUpdateValue"
  />
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { NSelect, useLoadingBar } from "naive-ui";
import { useConnectionStore } from "@/stores/connection.ts";

const store = useConnectionStore();

const isConnecting = computed(() => store.isConnecting);
const activeAddress = computed(() => store.activeAddress);
const addressHistory = computed(() => [...store.addressHistory].reverse());

const options = computed(() =>
  addressHistory.value.map((address) => ({
    label: address,
    value: address,
  })),
);

const onUpdateValue = (value: string) => {
  console.log(value);
  store.connect(value);
};

const loadingBar = useLoadingBar();
watch(isConnecting, () => {
  if (isConnecting.value) {
    loadingBar.start();
  } else {
    loadingBar.finish();
  }
});
</script>

<style scoped></style>
