<template>
  <n-dynamic-input v-model:value="cardData" :on-create="onCreate">
    <template #create-button-default>Добавить карту</template>
    <template #default="{ value }">
      <div class="flex items-center w-full">
        <n-input-number class="mr-3 w-40" v-model:value="value.address" min="0" placeholder="Адрес" />
        <n-input v-model:value="value.code" type="text" placeholder="Код">
          <template #prefix>
            <n-icon>
              <credit-card-filled />
            </n-icon>
          </template>
        </n-input>
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
          <n-icon class="text-lg">
            <send-round />
          </n-icon>
        </template>
      </n-button>
    </template>
  </n-dynamic-input>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CreditCardFilled, PlusRound, RemoveRound, SendRound } from "@vicons/material";
import { NButton, NButtonGroup, NDynamicInput, NIcon, NInput, NInputNumber } from "naive-ui";
import { MAX_CARD_COUNT, MIN_CARD_COUNT } from "@/defaults.ts";
import type { CardData } from "@/types.ts";

interface Emits {
  (e: "send:card", data: CardData): void;
}

const emit = defineEmits<Emits>();

const cardData = ref<CardData[]>([
  {
    address: 0,
    code: "",
  },
]);

const onCreate = () => {
  return {
    address: 0,
    code: "",
  };
};

const onSend = (data: CardData) => {
  emit("send:card", data);
};
</script>

<style scoped></style>
