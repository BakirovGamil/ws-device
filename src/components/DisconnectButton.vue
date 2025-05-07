<template>
  <n-float-button v-if="isConnected" title="Отключиться" :disabled="isNavigating" @click="onClick" right="40" bottom="40">
    <n-icon>
      <log-out-round />
    </n-icon>
  </n-float-button>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import { NFloatButton, NIcon } from "naive-ui";
import { LogOutRound } from "@vicons/material";
import { PageName } from "@/router";
import { useNavigate } from "@/composables";
import { useConnectionStore } from "@/stores/connection.js";

const store = useConnectionStore();
const isConnected = computed(() => store.isConnected);
const { isNavigating, navigateTo } = useNavigate();

const onClick = () => {
  store.disconnect();
};

watch(isConnected, () => {
  if (!isConnected.value) {
    navigateTo(PageName.Connect);
  }
});
</script>
