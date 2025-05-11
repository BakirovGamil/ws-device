<template>
  <div class="flex gap-2">
    <n-popselect v-model:value="state" :options="options" size="medium">
      <n-tag class="h-full w-56 justify-center" title="Состояние устройства" :bordered="false" :type="type">
        {{ state }}
      </n-tag>
    </n-popselect>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NTag, NPopselect } from "naive-ui";
import { useStateOptions } from "@/composables/use-state-options.ts";

interface Emits {
  (e: "set:state", v: string): void;
}

interface Props {
  state: string;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const state = computed({
  get: () => props.state,
  set: (v: string) => emit("set:state", v),
});

const { options } = useStateOptions();

const type = computed(() => {
  if (state.value === "outOfService") {
    return "error";
  }

  if (state.value === "obstacleBehindBarrier") {
    return "warning";
  }

  if(state.value === "waiting") {
    return "info";
  }

  if(state.value === "Неизвестный статус") {
    return "default";
  }

  return "primary";
});
</script>
