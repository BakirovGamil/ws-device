<template>
  <n-button secondary type="error" @click="$emit('shutdown')">
    <template #icon>
      <n-icon>
        <power-settings-new-round />
      </n-icon>
    </template>
    Выключить
  </n-button>
</template>

<script setup lang="ts">
import { PowerSettingsNewRound } from "@vicons/material";
import { NButton, NIcon } from "naive-ui";

interface Emits {
  (e: "shutdown"): void;
}

defineEmits<Emits>();
</script>
