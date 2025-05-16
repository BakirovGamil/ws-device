<template>
  <n-dynamic-input v-model:value="cardData" :on-create="createEmpty">
    <template #create-button-default>Добавить карту</template>
    <template #default="{ value }">
      <div class="flex items-center w-full">
        <n-input-number title="Адрес" class="mr-3 w-40" v-model:value="value.address" min="0" placeholder="Адрес" />
        <InputWithHistory
          storage-key="cardHistory"
          v-model:value="value.code"
          title="Код карты"
          placeholder="Код карты"
          :max-history-items="MAX_CARD_HISTORY"
        >
          <template #prefix>
            <n-icon>
              <credit-card-filled />
            </n-icon>
          </template>
        </InputWithHistory>
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
import { NButton, NButtonGroup, NDynamicInput, NIcon, NInputNumber } from "naive-ui";
import { MAX_CARD_COUNT, MAX_CARD_HISTORY, MIN_CARD_COUNT } from "@/defaults.ts";
import type { CardData } from "@/types.ts";
import { useLocalStorage } from "@vueuse/core";
import InputWithHistory from "@/components/InputWithHistory.vue";

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

const onSend = (data: CardData) => {
  emit("send:card", data);
};
</script>

<style scoped></style>
