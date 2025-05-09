<template>
  <div class="h-full">
    <header class="sticky w-full top-0 left-0 bg-neutral-950 z-50">
      <div class="flex gap-2 max-w-screen-xl p-4 mx-auto bg-zinc text-neutral-200">
        <ConnectionSelector class="max-w-56" />
        <DeviceState :state="state" @set:state="onSetState" />
      </div>
    </header>
    <main class="max-w-screen-xl mx-auto space-y-4 h-full p-4 sm:pt-10 bg-zinc-900">
      <slot />
      <div class="grid grid-flow-col auto-cols-fr gap-2 bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-4">
        <StateInput :state="state" @set:state="onSetState" />
        <ErrorInput @set:error="onSetError" />
      </div>
      <DeviceLogs :logs="logs" @clear="onClearLogs" />
    </main>
  </div>
</template>

<script setup lang="ts">
import ConnectionSelector from "@/components/ConnectionSelector.vue";
import DeviceState from "@/components/DeviceState.vue";
import DeviceLogs from "@/components/DeviceLogs.vue";
import StateInput from "@/components/StateInput.vue";
import ErrorInput from "@/components/ErrorInput.vue";

interface Emits {
  (e: "set:state", state: string): void;

  (e: "set:error", error: string): void;

  (e: "clear:logs"): void;
}

interface Props {
  state: string;
  logs: string[];
}

const emit = defineEmits<Emits>();
defineProps<Props>();

const onSetState = (state: string) => {
  emit("set:state", state);
};

const onSetError = (error: string) => {
  emit("set:error", error);
};

const onClearLogs = () => {
  emit("clear:logs");
};
</script>
