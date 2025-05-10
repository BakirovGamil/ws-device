<template>
  <n-input-group>
    <n-input-group-label class="flex items-center justify-center">
      <n-icon>
        <lan-round />
      </n-icon>
    </n-input-group-label>
    <n-select
      :key="key"
      :value="currentAddress"
      :options="options"
      filterable
      tag
      :loading="isConnecting"
      @update:value="onUpdateValue"
    />
  </n-input-group>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { LanRound } from "@vicons/material";
import { NIcon, NInputGroup, NInputGroupLabel, NSelect, useLoadingBar } from "naive-ui";
import { useConnectionStore } from "@/stores/connection.ts";
import { useHistoryStore } from "@/stores/history.ts";

const connection = useConnectionStore();
const history = useHistoryStore();

const key = ref(0);
const isConnecting = computed(() => connection.isConnecting);
const pendingError = computed(() => connection.pendingError);
const currentAddress = computed(() => connection.currentAddress);
const addressHistory = computed(() => [...history.addressHistory].reverse());

const options = computed(() =>
  addressHistory.value.map((address) => ({
    label: address,
    value: address,
  })),
);

const onUpdateValue = (value: string) => {
  // since there are two copies of the same option,
  // as select also add the entered value to the options
  key.value++;
  connection.connect(value);
};

const loadingBar = useLoadingBar();
watch(isConnecting, () => {
  if (isConnecting.value) {
    loadingBar.start();
  } else {
    loadingBar.finish();
  }
});

watch(pendingError, () => {
  if (pendingError.value) {
    loadingBar.error();
  }
});
</script>

<style scoped></style>
