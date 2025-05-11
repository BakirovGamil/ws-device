<template>
  <n-config-provider class="h-full" :theme="darkTheme" :locale="ruRU">
    <n-message-provider>
      <n-loading-bar-provider>
        <RootLayout />
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { darkTheme, NConfigProvider, NLoadingBarProvider, NMessageProvider, ruRU } from "naive-ui";
import { useTitle } from "@vueuse/core";
import { APP_NAME } from "@/defaults.ts";
import RootLayout from "@/layouts/RootLayout.vue";

const route = useRoute();
const title = computed(() => (route.meta.title as string | undefined) || APP_NAME);
useTitle(title);
</script>
