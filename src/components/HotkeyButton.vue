<template>
  <n-tooltip trigger="hover" placement="top" :show-arrow="false">
    <template #trigger>
      <ToggleButton v-if="toggleValue !== undefined" v-model:active="toggleValue" :disabled="disabled">
        <template #icon>
          <slot name="icon" />
        </template>
        <slot />
      </ToggleButton>
      <n-button tertiary v-else :disabled="disabled" @click="onClick">
        <template #icon>
          <slot name="icon" />
        </template>
        <slot />
      </n-button>
    </template>
    <kbd>{{ formattedHotkey }}</kbd>
  </n-tooltip>
</template>

<script setup lang="ts">
import { useMagicKeys, useVModel, whenever } from "@vueuse/core";
import ToggleButton from "@/components/ToggleButton.vue";
import { NButton, NTooltip } from "naive-ui";
import { computed } from "vue";

interface Emits {
  (e: "update:toggleValue", value: boolean): void;
}

interface Props {
  hotkey: string;
  toggleValue?: boolean;
  action?: () => void;
  disabled?: boolean;
}

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  toggleValue: undefined,
});

const toggleValue = useVModel(props, "toggleValue", emit);

const keys = useMagicKeys();
const hotKeyPressed = keys[props.hotkey];
const formattedHotkey = computed(() => {
  const { hotkey } = props;
  if (!hotkey) return "Горячая клавиша не задана";
  return hotkey.split("+").join(" + ");
});

whenever(hotKeyPressed, () => {
  if (props.disabled) {
    return;
  }

  if (toggleValue.value !== undefined) {
    toggleValue.value = !toggleValue.value;
  } else if (props.action) {
    props.action();
  }
});

const onClick = () => {
  props.action?.();
};
</script>
