<template>
  <div class="w-full bg-zinc-800 rounded-lg shadow-lg p-4 flex gap-3 items-center">
    <n-input v-model:value="address" :placeholder="DEFAULT_ADDRESS" class="flex-1" size="large" />
    <n-button class="w-10" size="large" :type="buttonType" :title="buttonTooltip" @click="onClick">
      <template #icon>
        <n-icon>
          <close-round v-if="isConnecting" />
          <log-in-round v-else />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DEFAULT_ADDRESS } from "@/defaults.ts";
import { NButton, NIcon, NInput } from "naive-ui";
import { CloseRound, LogInRound } from "@vicons/material";
import { useConnectionStore } from "@/stores/connection.ts";
import { useHistoryStore } from "@/stores/history.ts";

const connection = useConnectionStore();
const history = useHistoryStore();

const address = ref(history.recentAddress || DEFAULT_ADDRESS);
const isConnecting = computed(() => address.value === connection.pendingAddress);
const buttonType = computed(() => (isConnecting.value ? "error" : "primary"));
const buttonTooltip = computed(() => (isConnecting.value ? "Отменить" : "Подключиться"));

function onClick() {
  if (isConnecting.value) {
    connection.cancelConnection();
  } else {
    connection.connect(address.value || DEFAULT_ADDRESS);
  }
}
</script>
