<template>
  <div class="flex flex-col h-full">
    <header class="flex-grow-0 sticky w-full top-0 left-0 bg-neutral-950 z-50">
      <div class="flex gap-2 max-w-screen-xl p-2 sm:p-4 mx-auto bg-zinc text-neutral-200">
        <ConnectionSelector class="max-w-56" />
        <DeviceState :state="state" @set:state="onSetState" />
      </div>
    </header>
    <n-scrollbar class="flex-1">
      <n-back-top :right="100" />
      <div class="max-w-screen-xl mx-auto space-y-2 sm:space-y-4 h-full p-2 sm:p-4 sm:pt-10 bg-zinc-900">
        <div class="flex gap-2 sm:gap-4">
          <div class="bg-zinc-800 rounded-lg shadow-lg p-2 sm:p-4 pt-2 flex flex-col basis-64 gap-2">
            <InputsRelays class="self-start shadow-none" content-class="!px-0 !text-left" :inputs="inputs" :relays="relays" @set:input="onSetSingleInputs" />
            <InputsInput @set:inputs="onSetInputs" />
            <n-button @click="onSetReverse"> Реверс</n-button>
            <ShutdownButton @shutdown="emit('shutdown')" />
          </div>
          <div class="bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-2 sm:p-4 flex-1 basis-64">
            <slot name="controls" />
          </div>
        </div>
        <div class="flex gap-2 sm:gap-4 flex-col min-[850px]:flex-row">
          <div class="bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-2 sm:p-4">
            <div class="grid min-[1250px]:grid-cols-2 gap-2 sm:gap-4">
              <StateInput :state="state" @set:state="onSetState" />
              <ErrorInput @set:error="onSetError" />
              <CardInput @send:card="onSendCard" />
              <ScannerInput @send:scanner="onSendScanner" />
            </div>
          </div>
          <ParkingTicket class="flex-shrink-[3]" v-model:ticket="ticket" />
        </div>
        <DeviceLogs :logs="logs" @clear="onClearLogs" />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import type { CardData, Inputs, Relays, ScannerData, SetInputEvent, Ticket } from "@/types.ts";
import { NBackTop, NButton, NScrollbar } from "naive-ui";
import { useVModel } from "@vueuse/core";
import ConnectionSelector from "@/components/ConnectionSelector.vue";
import DeviceState from "@/components/DeviceState.vue";
import DeviceLogs from "@/components/DeviceLogs.vue";
import StateInput from "@/components/StateInput.vue";
import ErrorInput from "@/components/ErrorInput.vue";
import CardInput from "@/components/CardInput.vue";
import ScannerInput from "@/components/ScannerInput.vue";
import InputsInput from "@/components/InputsInput.vue";
import InputsRelays from "@/components/InputsRelays.vue";
import ParkingTicket from "@/components/ParkingTicket.vue";
import ShutdownButton from "@/components/ShutdownButton.vue";

interface Emits {
  (e: "set:state", state: string): void;

  (e: "set:error", error: string): void;

  (e: "set:single-input", event: SetInputEvent): void;

  (e: "set:inputs", inputs: number): void;

  (e: "set:reverse"): void;

  (e: "update:ticket", ticket: Ticket | null): void;

  (e: "send:card", data: CardData): void;

  (e: "send:scanner", data: ScannerData): void;

  (e: "shutdown"): void;

  (e: "clear:logs"): void;
}

interface Props {
  state: string;
  logs: string[];
  inputs: Inputs;
  relays: Relays;
  ticket: Ticket | null;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const ticket = useVModel(props, "ticket", emit);

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
