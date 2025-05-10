<template>
  <RouterView />
  <DisconnectButton />
  <n-back-top :right="100" />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { NBackTop, useLoadingBar } from "naive-ui";
import DisconnectButton from "@/components/DisconnectButton.vue";
import { navigationService } from "@/classes/navigation-service.ts";

const router = useRouter();
const loadingBar = useLoadingBar();
navigationService.init(router, loadingBar);
</script>
