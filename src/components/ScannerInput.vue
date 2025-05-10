<template>
  <n-dynamic-input v-model:value="scannerData" :on-create="createEmpty">
    <template #create-button-default>Добавить сканер</template>
    <template #default="{ value }">
      <div class="flex items-center w-full">
        <n-auto-complete
          title="Код сканера"
          v-model:value="value.code"
          :options="getAutoCompleteOptions(value.code)"
          :get-show="getShow"
          type="text"
          placeholder="Код сканера"
          @blur="onBlur"
          clearable
        >
          <template #prefix>
            <n-icon>
              <qr-code-round />
            </n-icon>
          </template>
        </n-auto-complete>
      </div>
    </template>
    <template #action="{ index, create, remove, value }">
      <n-button-group class="ml-4 mr-2">
        <n-button
          class="height-[34px] px-2"
          title="Добавить сканер"
          :disabled="scannerData.length >= MAX_CARD_COUNT"
          @click="() => create(index)"
          round
        >
          <n-icon class="text-lg">
            <plus-round />
          </n-icon>
        </n-button>
        <n-button
          class="height-[34px] px-2"
          title="Удалить сканер"
          :disabled="scannerData.length <= MIN_CARD_COUNT"
          @click="() => remove(index)"
          round
        >
          <n-icon class="text-lg">
            <remove-round />
          </n-icon>
        </n-button>
      </n-button-group>
      <n-button
        class="height-[34px]"
        title="Отправить сканер"
        :disabled="!value.code"
        @click="() => onSend(value)"
        round
      >
        <template #icon>
          <n-icon class="text-lg translate-x-[2px]">
            <send-round />
          </n-icon>
        </template>
      </n-button>
    </template>
  </n-dynamic-input>
</template>

<script setup lang="ts">
import { QrCodeRound, PlusRound, RemoveRound, SendRound } from "@vicons/material";
import { NAutoComplete, NButton, NButtonGroup, NDynamicInput, NIcon } from "naive-ui";
import { MAX_CARD_COUNT, MAX_CARD_HISTORY, MIN_CARD_COUNT } from "@/defaults.ts";
import type { CardData, ScannerData } from "@/types.ts";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

interface Emits {
  (e: "send:scanner", data: ScannerData): void;
}

const emit = defineEmits<Emits>();

const createEmpty = (): ScannerData => {
  return {
    code: "",
  };
};

const scannerData = useLocalStorage<ScannerData[]>("scannerData", [createEmpty()]);
const history = useLocalStorage<string[]>("scannerHistory", []);
const codes = computed(() => scannerData.value.map((card) => card.code));

const historyOptions = computed(() =>
  history.value.map((code) => ({
    label: code,
    value: code,
  })),
);

const getShow = () => true;

const getAutoCompleteOptions = (code: string) => {
  if (code === "") {
    return historyOptions.value;
  }

  const filtered = historyOptions.value.filter((data) => data.value.includes(code));

  return filtered.sort((a, b) => {
    if (a.value === code) return -1;
    if (b.value === code) return 1;
    return 0;
  });
};

const updateHistory = (codes: string[]) => {
  codes.forEach((code) => {
    if (!code.trim()) return;

    const index = history.value.indexOf(code);
    if (index > -1) {
      history.value.splice(index, 1);
      history.value.unshift(code);
    } else {
      history.value.unshift(code);
      if (history.value.length > MAX_CARD_HISTORY) {
        history.value.pop();
      }
    }
  });
};

const onSend = (data: CardData) => {
  emit("send:scanner", data);
};

const onBlur = () => {
  updateHistory(codes.value);
};
</script>
