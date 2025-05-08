<template>
  <DeviceLayout>
    <InputsRelays :inputs="inputs" :relays="relays" @set:input="onSetInput" />
  </DeviceLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { createEmptyInputsRelays } from "@/utils.ts";
import type { SetInputEvent } from "@/types.ts";
import InputsRelays from "@/components/InputsRelays.vue";
import DeviceLayout from "@/layouts/DeviceLayout.vue";

const inputs = ref(createEmptyInputsRelays("inputs"));
const relays = ref(createEmptyInputsRelays("relays"));

const onSetInput = ({ num, enabled }: SetInputEvent) => {
  inputs.value[`in${num}`] = enabled ? 1 : 0;
};
</script>
