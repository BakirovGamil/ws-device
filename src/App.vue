<template>
  <n-config-provider class="h-full" :theme="darkTheme">
    <n-loading-bar-provider>
      <RouterView />
      <DisconnectButton />
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { darkTheme, NConfigProvider, NLoadingBarProvider } from "naive-ui";
import { useTitle } from "@vueuse/core";
import { APP_NAME } from "@/defaults.ts";
import DisconnectButton from "@/components/DisconnectButton.vue";

const route = useRoute();
const title = computed(() => route.meta.title || APP_NAME);

useTitle(title);
</script>
