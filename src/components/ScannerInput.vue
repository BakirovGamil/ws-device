<template>
  <n-dynamic-input v-model:value="scannerData" :on-create="createEmpty">
    <template #create-button-default>Добавить сканер</template>
    <template #default="{ value }">
      <div class="flex items-center w-full">
        <InputWithHistory
          storage-key="scannerHistory"
          v-model:value="value.code"
          title="Код сканера"
          placeholder="Код сканера"
          :max-history-items="MAX_SCANNER_HISTORY"
        >
          <template #prefix>
            <n-icon>
              <qr-code-round />
            </n-icon>
          </template>
        </InputWithHistory>
      </div>
    </template>
    <template #action="{ index, create, remove, value }">
      <n-button-group class="ml-4 mr-2">
        <n-button
          class="height-[34px] px-2"
          title="Добавить сканер"
          :disabled="scannerData.length >= MAX_SCANNER_COUNT"
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
          :disabled="scannerData.length <= MIN_SCANNER_COUNT"
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
import { PlusRound, QrCodeRound, RemoveRound, SendRound } from "@vicons/material";
import { NButton, NButtonGroup, NDynamicInput, NIcon } from "naive-ui";
import { MAX_SCANNER_COUNT, MAX_SCANNER_HISTORY, MIN_SCANNER_COUNT } from "@/defaults.ts";
import type { CardData, ScannerData } from "@/types.ts";
import { useLocalStorage } from "@vueuse/core";
import InputWithHistory from "@/components/InputWithHistory.vue";

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

const onSend = (data: CardData) => {
  emit("send:scanner", data);
};

</script>
