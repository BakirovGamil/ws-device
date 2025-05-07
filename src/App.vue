<template>
  <n-config-provider class="h-full" :theme="darkTheme">
    <n-loading-bar-provider>
      <RouterView />
      <DisconnectButton />
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { darkTheme, NConfigProvider, NLoadingBarProvider } from "naive-ui";
import DisconnectButton from "@/components/DisconnectButton.vue";
</script>
