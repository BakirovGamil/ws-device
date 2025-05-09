<template>
  <div class="pt-1 px-2 pb-2">
    <div class="text-neutral-200 text-center mb-1">{{ title }}</div>
    <div
      class="flex flex-row-reverse gap-1"
      @keydown.left="moveFocus(1)"
      @keydown.right="moveFocus(-1)"
    >
      <button
        v-for="(bit, index) in bits"
        :key="index"
        ref="buttons"
        class="rounded-md w-6 h-6 border-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
        :class="{
          'cursor-pointer hover:brightness-110': editable,
          'bg-zinc-500': !bit,
          'bg-green-500': bit && editable,
          'bg-blue-500': bit && !editable,
        }"
        :disabled="!editable"
        @click="emit('update:bit', { index, enabled: !bit })"
        @dblclick="emit('update:bit', { index, enabled: !!bit })"
        @focus="currentFocusIndex = index"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Bit, UpdateBitEvent } from "@/types.ts";
import { ref } from "vue";

interface Emits {
  (e: "update:bit", event: UpdateBitEvent): void;
}

interface Props {
  title: string;
  bits: Bit[];
  editable: boolean;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const buttons = ref<HTMLButtonElement[]>([]);
const currentFocusIndex = ref(0);
const moveFocus = (direction: number) => {
  if (!props.editable) return;

  currentFocusIndex.value += direction;
  if (currentFocusIndex.value < 0) {
    currentFocusIndex.value = buttons.value.length - 1;
  } else if (currentFocusIndex.value >= buttons.value.length) {
    currentFocusIndex.value = 0;
  }

  buttons.value[currentFocusIndex.value]?.focus();
};
</script>
