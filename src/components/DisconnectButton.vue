<template>
  <n-float-button v-if="isConnected" title="Отключиться" @click="onClick" right="40" bottom="40">
    <n-icon>
      <log-out-round />
    </n-icon>
  </n-float-button>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { NFloatButton, NIcon } from "naive-ui";
import { LogOutRound } from "@vicons/material";
import { useConnectionStore } from "@/stores/connection.js";

const connection = useConnectionStore();
const isConnected = computed(() => connection.isConnected);

const onClick = () => {
  connection.disconnect();
};
</script>
