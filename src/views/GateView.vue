<template>
  <DeviceLayout
    :logs="logs"
    :inputs="inputs"
    :relays="relays"
    :state="state"
    @set:state="setState"
    @set:error="onSetError"
    @set:inputs="onSetInputs"
    @set:single-input="onSetSingleInput"
    @set:reverse="onSetReverse"
    @send:card="onSendCard"
    @send:scanner="onSendScanner"
    @clear:logs="clearLogs"
  />
</template>

<script setup lang="ts">
import type { CardData, ScannerData, SetInputEvent } from "@/types.ts";
import DeviceLayout from "@/layouts/DeviceLayout.vue";
import { useGateService } from "@/composables";

const {
  state,
  inputs,
  relays,
  logs,
  setSingleInput,
  setInputs,
  setState,
  setError,
  setReverse,
  sendCard,
  sendScanner,
  clearLogs,
} = useGateService();

const onSetSingleInput = ({ num, enabled }: SetInputEvent) => {
  setSingleInput(num, enabled);
};

const onSetInputs = (inputs: number) => {
  setInputs(inputs);
};

const onSetError = (error: string) => {
  setError(error);
};

const onSetReverse = () => {
  setReverse();
};

const onSendCard = (data: CardData) => {
  sendCard(data);
};

const onSendScanner = (data: ScannerData) => {
  sendScanner(data);
};
</script>
