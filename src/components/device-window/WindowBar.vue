<template>
  <div class="flex gap-2 p-4 pt-0">
    <n-button title="Обновить" class="px-0 w-8" @click="emit('refresh')" quaternary>
      <n-icon class="text-lg">
        <refresh-round />
      </n-icon>
    </n-button>

    <n-input-group>
      <InputWithHistory storage-key="deviceWindowHistory" placeholder="Введите адрес" v-model:value="pendingAddress">
        <template #prefix>
          <n-icon class="-ml-1 mr-2">
            <language-round class="text-lg rotate-[20deg]" />
          </n-icon>
        </template>
      </InputWithHistory>
      <n-button :disabled="!pendingAddress" @click="emit('connect')"> Подключиться</n-button>
    </n-input-group>
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { NButton, NIcon, NInputGroup } from "naive-ui";
import { LanguageRound, RefreshRound } from "@vicons/material";
import InputWithHistory from "@/components/InputWithHistory.vue";

interface Emits {
  (e: "update:pendingAddress", value: string): void;

  (e: "refresh"): void;

  (e: "connect"): void;
}

interface Props {
  pendingAddress: string;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const pendingAddress = useVModel(props, "pendingAddress", emit);
</script>
