<template>
  <n-button :disabled="copied" @click="handleCopy">
    <n-icon :component="copied ? successIcon : copyIcon" />
  </n-button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { NButton, NIcon, useMessage } from "naive-ui";
import { CheckRound, ContentCopyRound } from "@vicons/material";
import type { Component } from "vue";

interface Props {
  text: string;
  timeout?: number;
  copyIcon?: Component;
  successIcon?: Component;
}

const props = withDefaults(defineProps<Props>(), {
  timeout: 2000,
  copyIcon: ContentCopyRound,
  successIcon: CheckRound,
});

const copied = ref(false);
const message = useMessage();
let timeoutId: number | null = null;

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    message.success("Скопировано");

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = window.setTimeout(() => {
      copied.value = false;
    }, props.timeout);
  } catch (err) {
    message.error("Не удалось скопировать");
    console.error("Copy failed:", err);
  }
};

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
