<template>
  <main class="max-h-full flex flex-col items-center p-4 sm:pt-20 bg-zinc-900">
    <div class="flex flex-col w-full min-h-0 max-w-md space-y-4 overflow-hidden">
      <template v-if="!isConnected">
        <ConnectionForm />
        <ConnectionHistory />
      </template>
      <template v-else>
        <DeviceTypeSelector />
      </template>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useConnectionStore } from "@/stores/connection.ts";
import ConnectionForm from "@/components/ConnectionForm.vue";
import ConnectionHistory from "@/components/ConnectionHistory.vue";
import DeviceTypeSelector from "@/components/DeviceTypeSelector.vue";

const store = useConnectionStore();
const isConnected = computed(() => store.isConnected);
</script>
