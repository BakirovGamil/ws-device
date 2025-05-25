<template>
  <n-button title="Скопировать" :disabled="copied" @click="handleCopy">
    <n-icon :component="copied ? successIcon : copyIcon" />
  </n-button>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import { h, onBeforeUnmount, ref } from "vue";
import { NButton, NIcon, NInput, useMessage } from "naive-ui";
import { CheckRound, ContentCopyRound } from "@vicons/material";

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

const copyToClipboard = async (text: string): Promise<void> => {
  const previouslyFocusedElement = document.activeElement as HTMLElement | null;

  let textarea: HTMLTextAreaElement | null = null;
  try {
    if (isSecureContext && navigator.clipboard?.writeText) {
      return await navigator.clipboard.writeText(text);
    }

    textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.focus({ preventScroll: true });

    const success = document.execCommand('copy');
    if (!success) throw new Error('execCommand failed');

  } finally {
    if (textarea) document.body.removeChild(textarea);
    previouslyFocusedElement?.focus({ preventScroll: true });
  }
};

const handleCopy = async () => {
  try {
    await copyToClipboard(props.text);
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

    message.warning(() =>  h("div", [h("p", "Скопируйте текст:"), h(NInput, { value: props.text })]), {
      duration: 10000,
    });
  }
};

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});
</script>
