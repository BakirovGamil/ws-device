<template>
  <RouterView />
  <DisconnectButton />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useConnectionRouter } from "@/composables";
import DisconnectButton from "@/components/DisconnectButton.vue";

const { setupWatcher } = useConnectionRouter();
setupWatcher();
</script>
