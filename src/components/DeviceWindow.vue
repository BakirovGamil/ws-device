<template>
  <div class="w-full aspect-video flex items-center justify-center border-black border-8 rounded-lg">
    <div class="w-full aspect-video overflow-hidden relative">
      <iframe class="absolute inset-0 w-full h-full" :src="`https://${address}`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  address: string;
}

defineProps<Props>();
</script>
