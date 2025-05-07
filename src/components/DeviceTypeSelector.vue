<template>
  <div class="flex flex-col space-y-4 bg-zinc-800 p-4 rounded-lg shadow-lg">
    <n-button :loading="isNavigating" @click="navigateTo(PageName.Gate)"> Стойка</n-button>
    <n-button :loading="isNavigating" @click="navigateTo(PageName.Cash)"> Паркомат</n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import { PageName } from "@/router";
import { useNavigate } from "@/composables";

const { isNavigating, navigateTo } = useNavigate();
</script>
