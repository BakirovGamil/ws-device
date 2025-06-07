<template>
  <DeviceLayout
    :logs="logs"
    :inputs="inputs"
    :relays="relays"
    :state="state"
    v-model:ticket="ticket"
    @set:state="setState"
    @set:error="onSetError"
    @set:inputs="onSetInputs"
    @set:single-input="onSetSingleInput"
    @set:reverse="onSetReverse"
    @send:card="onSendCard"
    @send:scanner="onSendScanner"
    @shutdown="shutDown"
    @clear:logs="clearLogs"
  >
    <template #controls>
      <GateControls
        :is-auto-process-active="isAutoProcessActive"
        v-model:first-loop="firstLoop"
        v-model:second-loop="secondLoop"
        v-model:ticket-print="ticketPrint"
        v-model:voice-call="voiceCall"
        @recognize-plate-number="recognizePlateNumber"
        @pickup-ticket="pickupTicket"
        @make-one-time-visit="makeOneTimeVisit"
      />
    </template>
  </DeviceLayout>
</template>

<script setup lang="ts">
import type { CardData, ScannerData, SetInputEvent } from "@/types.ts";
import DeviceLayout from "@/layouts/DeviceLayout.vue";
import { useGateService } from "@/composables";
import GateControls from "@/components/GateControls.vue";

const {
  state,
  inputs,
  relays,
  logs,
  ticket,
  firstLoop,
  secondLoop,
  ticketPrint,
  voiceCall,
  pickupTicket,
  recognizePlateNumber,
  setSingleInput,
  setInputs,
  setState,
  setError,
  setReverse,
  sendCard,
  sendScanner,
  shutDown,
  clearLogs,
  makeOneTimeVisit,
  isAutoProcessActive,
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
