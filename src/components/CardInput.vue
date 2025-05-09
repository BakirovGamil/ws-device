<template>
  <n-dynamic-input v-model:value="cardData" :on-create="createEmpty">
    <template #create-button-default>Добавить карту</template>
    <template #default="{ value }">
      <div class="flex items-center w-full">
        <n-input-number class="mr-3 w-40" v-model:value="value.address" min="0" placeholder="Адрес" />
        <n-auto-complete
          v-model:value="value.code"
          :options="getAutoCompleteOptions(value.code)"
          :get-show="getShow"
          type="text"
          placeholder="Код"
          @blur="onBlur"
          clearable
        >
          <template #prefix>
            <n-icon>
              <credit-card-filled />
            </n-icon>
          </template>
        </n-auto-complete>
      </div>
    </template>
    <template #action="{ index, create, remove, value }">
      <n-button-group class="ml-4 mr-2">
        <n-button
          class="height-[34px] px-2"
          title="Добавить карту"
          :disabled="cardData.length >= MAX_CARD_COUNT"
          @click="() => create(index)"
          round
        >
          <n-icon class="text-lg">
            <plus-round />
          </n-icon>
        </n-button>
        <n-button
          class="height-[34px] px-2"
          title="Удалить карту"
          :disabled="cardData.length <= MIN_CARD_COUNT"
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
        title="Отправить карту"
        :disabled="!value.code || isNaN(value.address)"
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
import { CreditCardFilled, PlusRound, RemoveRound, SendRound } from "@vicons/material";
import { NAutoComplete, NButton, NButtonGroup, NDynamicInput, NIcon, NInputNumber } from "naive-ui";
import { MAX_CARD_COUNT, MAX_CARD_HISTORY, MIN_CARD_COUNT } from "@/defaults.ts";
import type { CardData } from "@/types.ts";
import { useLocalStorage } from "@vueuse/core";
import { computed } from "vue";

interface Emits {
  (e: "send:card", data: CardData): void;
}

const emit = defineEmits<Emits>();

const createEmpty = (): CardData => {
  return {
    address: 0,
    code: "",
  };
};

const cardData = useLocalStorage<CardData[]>("cardData", [createEmpty()]);
const history = useLocalStorage<string[]>("history", []);
const codes = computed(() => cardData.value.map((card) => card.code));

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
  emit("send:card", data);
};

const onBlur = () => {
  updateHistory(codes.value);
};
</script>

<style scoped></style>
