<template>
  <n-float-button
    v-if="connection.currentConnection"
    width="44"
    height="44"
    title="Отключиться"
    @click="onClick"
    right="40"
    bottom="40"
  >
    <n-icon class="text-2xl translate-x-[1px]">
      <log-out-round />
    </n-icon>
  </n-float-button>
</template>

<script lang="ts" setup>
import { NFloatButton, NIcon } from "naive-ui";
import { LogOutRound } from "@vicons/material";
import { useConnectionStore } from "@/stores/connection.js";

const connection = useConnectionStore();

const onClick = () => {
  connection.disconnect();
};
</script>
