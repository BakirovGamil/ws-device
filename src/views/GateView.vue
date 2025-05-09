<template>
  <DeviceLayout
    :logs="logs"
    :state="state"
    @set:state="setState"
    @set:error="onSetError"
    @send:card="onSendCard"
    @clear:logs="clearLogs"
  >
    <InputsRelays :inputs="inputs" :relays="relays" @set:input="onSetInput" />
  </DeviceLayout>
</template>

<script setup lang="ts">
import type { CardData, SetInputEvent } from "@/types.ts";
import InputsRelays from "@/components/InputsRelays.vue";
import DeviceLayout from "@/layouts/DeviceLayout.vue";
import { useGateService } from "@/composables";

const { state, inputs, relays, logs, setInput, setState, setError, sendCard, clearLogs } = useGateService();

const onSetInput = ({ num, enabled }: SetInputEvent) => {
  setInput(num, enabled);
};

const onSetError = (error: string) => {
  setError(error);
};

const onSendCard = (data: CardData) => {
  sendCard(data);
};
</script>
