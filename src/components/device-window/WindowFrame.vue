<template>
  <div class="w-full aspect-video flex items-center justify-center border-black bg-neutral-200 border-8 rounded-lg">
    <div class="w-full aspect-video overflow-hidden relative">
      <iframe ref="frameRef" :key="address" class="absolute inset-0 w-full h-full" :src="`http://${address}`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface Props {
  address: string;
}

defineProps<Props>();
const frameRef = ref<HTMLIFrameElement | null>(null);

const refresh = () => {
  if (!frameRef.value) return;
  frameRef.value.src += "";
};

defineExpose({
  refresh,
});
</script>
