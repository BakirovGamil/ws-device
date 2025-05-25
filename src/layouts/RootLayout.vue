<template>
  <RouterView />
  <DisconnectButton />
</template>

<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { useLoadingBar, useMessage } from "naive-ui";
import DisconnectButton from "@/components/DisconnectButton.vue";
import { navigationService } from "@/classes/navigation-service.ts";
import { useConnectionStore } from "@/stores/connection.ts";
import { messageService } from "@/classes";

const router = useRouter();
const loadingBar = useLoadingBar();
navigationService.init(router, loadingBar);

const connection = useConnectionStore();
connection.tryConnectToRecent();

const message = useMessage();
messageService.init(message);
</script>
