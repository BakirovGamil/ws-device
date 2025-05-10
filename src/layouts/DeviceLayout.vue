<template>
  <div class="h-full">
    <header class="sticky w-full top-0 left-0 bg-neutral-950 z-50">
      <div class="flex gap-2 max-w-screen-xl p-4 mx-auto bg-zinc text-neutral-200">
        <ConnectionSelector class="max-w-56" />
        <DeviceState :state="state" @set:state="onSetState" />
      </div>
    </header>
    <main class="max-w-screen-xl mx-auto space-y-4 h-full p-4 sm:pt-10 bg-zinc-900">
      <div class="flex gap-4">
        <InputsRelays :inputs="inputs" :relays="relays" @set:input="onSetSingleInputs" />
        <div class="bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-4 flex-1">
          <slot name="controls" />
        </div>
      </div>
      <div class="grid xl:grid-cols-4 gap-4 bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-4">
        <div class="xl:col-span-3 grid md:grid-cols-2 gap-4">
          <StateInput :state="state" @set:state="onSetState" />
          <ErrorInput @set:error="onSetError" />
          <CardInput @send:card="onSendCard" />
          <ScannerInput @send:scanner="onSendScanner" />
        </div>
        <div class="flex xl:flex-col gap-4">
          <InputsInput @set:inputs="onSetInputs" />
          <n-button @click="onSetReverse"> Reverse</n-button>
        </div>
      </div>
      <DeviceLogs :logs="logs" @clear="onClearLogs" />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { CardData, Relays, ScannerData, SetInputEvent } from "@/types.ts";
import { NButton } from "naive-ui";
import ConnectionSelector from "@/components/ConnectionSelector.vue";
import DeviceState from "@/components/DeviceState.vue";
import DeviceLogs from "@/components/DeviceLogs.vue";
import StateInput from "@/components/StateInput.vue";
import ErrorInput from "@/components/ErrorInput.vue";
import CardInput from "@/components/CardInput.vue";
import ScannerInput from "@/components/ScannerInput.vue";
import InputsInput from "@/components/InputsInput.vue";
import InputsRelays from "@/components/InputsRelays.vue";

interface Emits {
  (e: "set:state", state: string): void;

  (e: "set:error", error: string): void;

  (e: "set:single-input", event: SetInputEvent): void;

  (e: "set:inputs", inputs: number): void;

  (e: "set:reverse"): void;

  (e: "send:card", data: CardData): void;

  (e: "send:scanner", data: ScannerData): void;

  (e: "clear:logs"): void;
}

interface Props {
  state: string;
  logs: string[];
  inputs: Inputs;
  relays: Relays;
}

const emit = defineEmits<Emits>();
defineProps<Props>();

const onSetState = (state: string) => {
  emit("set:state", state);
};

const onSetError = (error: string) => {
  emit("set:error", error);
};

const onSetSingleInputs = (event: SetInputEvent) => {
  emit("set:single-input", event);
};

const onSetInputs = (inputs: number) => {
  emit("set:inputs", inputs);
};

const onSetReverse = () => {
  emit("set:reverse");
};

const onSendCard = (data: CardData) => {
  emit("send:card", data);
};

const onSendScanner = (data: ScannerData) => {
  emit("send:scanner", data);
};

const onClearLogs = () => {
  emit("clear:logs");
};
</script>
