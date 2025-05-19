<template>
  <div class="w-full">
    <div class="w-full bg-zinc-800 rounded-lg shadow-lg mb-2">
      <div class="text-neutral-200 font-medium flex items-center gap-2  p-4 ">
        <div class="flex items-center gap-2 cursor-pointer select-none" @click="isExpanded = !isExpanded">
          <n-icon size="20" class="text-blue-400">
            <desktop-windows-round />
          </n-icon>
          <h3>Экран</h3>
        </div>
        <span v-if="isExpanded" class="font-normal text-xs text-zinc-400" title="Текущий адрес экрана">
          {{ address }}
        </span>
      </div>
      <n-collapse-transition v-model:show="isExpanded">
        <div class="flex gap-2 p-4 pt-0">
          <n-button title="Обновить" class="px-0 w-8" @click="refresh" quaternary>
            <n-icon class="text-lg">
              <refresh-round />
            </n-icon>
          </n-button>

          <n-input-group>
            <InputWithHistory
              storage-key="deviceWindowHistory"
              placeholder="Введите адрес"
              v-model:value="pendingAddress"
            >
              <template #prefix>
                <n-icon class="-ml-1 mr-2">
                  <language-round class="text-lg rotate-[20deg]" />
                </n-icon>
              </template>
            </InputWithHistory>
            <n-button :disabled="!pendingAddress" @click="onClick"> Подключиться</n-button>
          </n-input-group>
        </div>
      </n-collapse-transition>
    </div>

    <n-collapse-transition v-model:show="isExpanded">
      <n-alert
        v-if="isWarningOpen"
        class="rounded-lg mb-2"
        title="Это не дублирование экрана, а новое отдельное окно"
        type="warning"
        closable
        @close="isWarningOpen = false"
      />
      <div class="w-full aspect-video flex items-center justify-center border-black border-8 rounded-lg">
        <div class="w-full aspect-video overflow-hidden relative">
          <iframe ref="frameRef" :key="address" class="absolute inset-0 w-full h-full" :src="`http://${address}`" />
        </div>
      </div>
    </n-collapse-transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { NAlert, NButton, NCollapseTransition, NIcon, NInputGroup } from "naive-ui";
import { useLocalStorage } from "@vueuse/core";
import { DesktopWindowsRound, LanguageRound, RefreshRound } from "@vicons/material";
import InputWithHistory from "@/components/InputWithHistory.vue";

interface Props {
  address: string | null;
}

const props = defineProps<Props>();
const address = useLocalStorage("deviceWindowAddress", props.address || "");
const pendingAddress = useLocalStorage("deviceWindowPendingAddress", props.address || "");
const isExpanded = useLocalStorage("deviceWindowExpanded", false);
const isWarningOpen = useLocalStorage("deviceWindowWarning", true);
const frameRef = ref<HTMLFrameElement | null>(null);

const refresh = () => {
  if (!frameRef.value) return;
  frameRef.value.src += "";
};

const onClick = () => {
  if (!pendingAddress) return;
  address.value = pendingAddress.value;
};
</script>
