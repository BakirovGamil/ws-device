<template>
  <RouterView />
  <DisconnectButton />
  <n-back-top :right="100" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useConnectionRouter } from "@/composables";
import { NBackTop } from "naive-ui";
import DisconnectButton from "@/components/DisconnectButton.vue";

const { setupWatcher } = useConnectionRouter();
setupWatcher();
</script>
