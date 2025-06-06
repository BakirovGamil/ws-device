<template>
  <div class="w-full flex flex-col bg-zinc-800 rounded-lg shadow-lg overflow-hidden">
    <div class="flex items-center justify-between p-4 border-b border-zinc-700">
      <h3 class="font-medium text-neutral-200">История подключений</h3>
      <n-button
        v-if="addresses.length > 0"
        title="Удалить все"
        class="w-7 h-7"
        secondary
        type="error"
        @click.stop="onRemoveAll"
      >
        <template #icon>
          <n-icon>
            <delete-outline-round />
          </n-icon>
        </template>
      </n-button>
    </div>

    <template v-if="addresses.length > 0">
      <n-scrollbar class="max-h-96">
        <div class="divide-y divide-zinc-700">
          <template v-for="address in addresses" :key="address">
            <div class="relative group/content cursor-pointer">
              <div :class="itemClasses(address === pendingAddress)">
                <button
                  title="Подключиться"
                  class="group w-full px-4 py-3 text-left hover:bg-zinc-750 transition-colors text-neutral-300"
                  @click="onConnect(address)"
                >
                  <span class="flex items-center justify-between">
                    <span :title="address" class="truncate">{{ address }}</span>
                    <n-button
                      title="Удалить"
                      class="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      text
                      type="error"
                      @click.stop="onRemove(address)"
                    >
                      <template #icon>
                        <n-icon>
                          <delete-outline-round />
                        </n-icon>
                      </template>
                    </n-button>
                  </span>
                </button>
              </div>
              <button
                v-if="address === pendingAddress"
                title="Отменить"
                class="flex items-center justify-center absolute inset-0"
                @click="onCancelConnection"
              >
                <n-spin size="small" />
                <n-icon
                  class="text-xl text-error transition-opacity opacity-0 group-hover/content:opacity-100 absolute top-1/2 -translate-y-1/2"
                >
                  <close-round />
                </n-icon>
              </button>
            </div>
          </template>
        </div>
      </n-scrollbar>
    </template>
    <template v-else>
      <div class="p-4 text-center text-neutral-400">Нет сохранённых адресов</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { NButton, NIcon, NScrollbar, NSpin } from "naive-ui";
import { CloseRound, DeleteOutlineRound } from "@vicons/material";
import { useHistoryStore } from "@/stores/history.ts";
import { useConnectionStore } from "@/stores/connection.ts";

const connection = useConnectionStore();
const history = useHistoryStore();

const pendingAddress = computed(() => connection.pendingAddress);
const addresses = computed(() => [...history.addressHistory].reverse());

const itemClasses = (show: boolean) => {
  if (!show) {
    return;
  }

  return ["pointer-events-none", "opacity-40"];
};

const onConnect = (address: string) => {
  connection.connect(address);
};

const onCancelConnection = () => {
  connection.cancelConnection();
};

const onRemove = (address: string) => {
  history.removeAddress(address);
};

const onRemoveAll = () => {
  history.clearAddressHistory();
};
</script>
