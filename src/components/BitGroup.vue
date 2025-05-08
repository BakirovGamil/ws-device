<template>
  <div class="pt-1 px-2 pb-2">
    <div class="text-neutral-200 text-center mb-1">{{ title }}</div>
    <div class="flex flex-row-reverse gap-1">
      <div
        v-for="(bit, index) in bits"
        :key="index"
        class="rounded-md w-6 h-6 border-zinc-900"
        :class="{
          'cursor-pointer hover:brightness-110': editable,
          'bg-zinc-500': !bit,
          'bg-green-500': bit && editable,
          'bg-blue-500': bit && !editable,
        }"
        @click="editable && $emit('update:bit', { index, enabled: !bit })"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Bit, UpdateBitEvent } from "@/types.ts";

interface Emits {
  (e: "update:bit", event: UpdateBitEvent): void;
}

interface Props {
  title: string;
  bits: Bit[];
  editable: boolean;
}

defineEmits<Emits>();
defineProps<Props>();
</script>
