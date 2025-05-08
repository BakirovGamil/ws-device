<template>
  <div>
    <header class="sticky w-full top-0 left-0 bg-neutral-950">
      <div class="flex gap-2 max-w-screen-xl p-4 mx-auto bg-zinc text-neutral-200">
        <ConnectionSelector class="max-w-56" />
        <div>
          <DeviceState class="max-w-56 h-full" :state="state" />
        </div>
      </div>
    </header>
    <main class="max-w-screen-xl mx-auto p-4 sm:pt-10 bg-zinc-900">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DeviceState from "@/components/DeviceState.vue";
import ConnectionSelector from "@/components/ConnectionSelector.vue";

const state = ref("outOfService");
</script>
