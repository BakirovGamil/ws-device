<template>
  <div class="w-full">
    <div class="w-full bg-zinc-800 rounded-lg shadow-lg mb-2">
      <WindowHeader v-model:is-expanded="isExpanded" :show-info-popover="!isWarningOpen" :address="address" />
      <n-collapse-transition v-model:show="isExpanded">
        <WindowBar v-model:pending-address="pendingAddress" @refresh="refresh" @connect="connect" />
      </n-collapse-transition>
    </div>

    <n-collapse-transition v-model:show="isExpanded">
      <n-alert
        v-if="isWarningOpen"
        class="rounded-lg mb-2"
        :title="WINDOW_ALERT_MESSAGE"
        type="warning"
        closable
        @close="isWarningOpen = false"
      />
      <WindowFrame ref="frameRef" :address="address" />
    </n-collapse-transition>
  </div>
</template>

<script lang="ts" setup>
import { type ComponentInstance, ref } from "vue";
import { NAlert, NCollapseTransition } from "naive-ui";
import { useLocalStorage } from "@vueuse/core";
import { WINDOW_ALERT_MESSAGE } from "@/defaults.ts";
import WindowFrame from "@/components/device-window/WindowFrame.vue";
import WindowBar from "@/components/device-window/WindowBar.vue";
import WindowHeader from "@/components/device-window/WindowHeader.vue";

interface Props {
  address: string | null;
}

const props = defineProps<Props>();
const address = useLocalStorage("deviceWindowAddress", props.address || "");
const pendingAddress = useLocalStorage("deviceWindowPendingAddress", props.address || "");
const isExpanded = useLocalStorage("deviceWindowExpanded", false);
const isWarningOpen = useLocalStorage("deviceWindowWarning", true);
const frameRef = ref<ComponentInstance<typeof WindowFrame> | null>(null);

const refresh = () => {
  if (!frameRef.value) return;
  frameRef.value.refresh();
};

const connect = () => {
  if (!pendingAddress) return;
  address.value = pendingAddress.value;
};
</script>
