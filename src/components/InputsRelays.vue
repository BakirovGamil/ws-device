<template>
  <div class="inline-flex flex-col gap-1 shadow-lg rounded-lg bg-zinc-800 divide-y divide-zinc-700">
    <BitGroup
      v-for="group in groups"
      :key="group.key"
      :title="group.title"
      :bits="toValue(group.value)"
      :editable="group.editable"
      @update:bit="onUpdateBit"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toValue } from "vue";
import { toBits } from "@/utils.ts";
import type { Inputs, Relays, SetInputEvent, UpdateBitEvent } from "@/types.ts";
import BitGroup from "@/components/BitGroup.vue";

interface Emits {
  (e: "set:input", event: SetInputEvent): void;
}

interface Props {
  inputs: Inputs;
  relays: Relays;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const inputs = computed(() => props.inputs);
const relays = computed(() => props.relays);

const inputBits = computed(() => toBits(inputs.value));
const relayBits = computed(() => toBits(relays.value));

const groups = [
  {
    key: "inputs",
    title: "Входы",
    editable: true,
    value: inputBits,
  },
  {
    key: "relays",
    title: "Реле",
    editable: false,
    value: relayBits,
  },
];

const onUpdateBit = ({ index, enabled }: UpdateBitEvent) => {
  emit("set:input", { num: index, enabled });
};
</script>
