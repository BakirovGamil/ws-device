<template>
  <DeviceLayout :state="state">
    <InputsRelays :inputs="inputs" :relays="relays" @set:input="onSetInput" />
    <DeviceLogs :logs="logs" />
  </DeviceLayout>
</template>

<script setup lang="ts">
import type { SetInputEvent } from "@/types.ts";
import InputsRelays from "@/components/InputsRelays.vue";
import DeviceLayout from "@/layouts/DeviceLayout.vue";
import DeviceLogs from "@/components/DeviceLogs.vue";
import { useGateService } from "@/composables";

const { state, inputs, relays, logs, setInput } = useGateService();

const onSetInput = ({ num, enabled }: SetInputEvent) => {
  setInput(num, enabled);
};
</script>
