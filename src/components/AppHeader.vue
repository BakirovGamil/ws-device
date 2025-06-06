<template>
  <header class="flex-grow-0 sticky w-full top-0 left-0 bg-neutral-950 z-50">
    <div class="flex gap-2 max-w-screen-xl p-4 mx-auto bg-zinc text-neutral-200">
      <ConnectionSelector class="max-w-64" />
      <DeviceState :state="state" @set:state="$emit('set:state', $event)" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import ConnectionSelector from "@/components/ConnectionSelector.vue";
import DeviceState from "@/components/DeviceState.vue";

interface Emits {
  (e: "set:state", state: string): void;
}

interface Props {
  state: string;
}

defineEmits<Emits>();
defineProps<Props>();
</script>
