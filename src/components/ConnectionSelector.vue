<template>
  <n-input-group class="relative">
    <template v-if="currentAddress">
      <CopyButton :text="currentAddress" :copy-icon="LanRound" />
    </template>
    <template v-else>
      <n-input-group-label class="flex items-center justify-center">
        <n-icon>
          <lan-round />
        </n-icon>
      </n-input-group-label>
    </template>
    <n-select
      :key="key"
      :value="currentAddress"
      :options="options"
      filterable
      tag
      :loading="isConnecting"
      @update:value="onUpdateValue"
    />
    <n-button :title="buttonTooltip" :type="buttonType" @click="onClick">
      <n-icon>
        <close-round v-if="isConnecting" />
        <log-out-round v-else />
      </n-icon>
    </n-button>
    <div v-if="pendingAddress" class="absolute top-full text-xs animate-pulse">
      Подключение к
      {{ pendingAddress }}
    </div>
  </n-input-group>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { CloseRound, LanRound, LogOutRound } from "@vicons/material";
import { NButton, NIcon, NInputGroup, NInputGroupLabel, NSelect, useLoadingBar } from "naive-ui";
import { useConnectionStore } from "@/stores/connection.ts";
import { useHistoryStore } from "@/stores/history.ts";
import CopyButton from "@/components/CopyButton.vue";

const connection = useConnectionStore();
const history = useHistoryStore();

const key = ref(0);
const isConnecting = computed(() => connection.isConnecting);
const pendingError = computed(() => connection.pendingError);
const currentAddress = computed(() => connection.currentAddress);
const pendingAddress = computed(() => connection.pendingAddress);
const addressHistory = computed(() => [...history.addressHistory].reverse());

const buttonType = computed(() => (isConnecting.value ? "error" : "default"));
const buttonTooltip = computed(() => (isConnecting.value ? "Отменить" : "Отключиться"));

function onClick() {
  if (isConnecting.value) {
    connection.cancelConnection();
  } else {
    connection.disconnect();
  }
}

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
