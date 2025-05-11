<template>
  <div class="ticket-viewer">
    <div class="header-header">
      <div class="header-title">
        <n-icon size="20" class="text-blue-400">
          <receipt-outlined />
        </n-icon>
        <h3>Чек</h3>
      </div>
      <div class="ticket-controls">
        <n-button title="Очистить" class="h-8 px-2" size="small" @click="clearTicket">
          <template #icon>
            <n-icon>
              <delete-outline-round />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>

    <div class="ticket-container">
      <div v-if="ticket" class="ticket-content">
        <h2 class="ticket-header">{{ ticket.header }}</h2>

        <p class="ticket-contact">{{ ticket.contact }}</p>

        <pre class="ticket-hours">{{ ticket.parkingHours }}</pre>

        <div class="ticket-time">
          <span>Время:</span>
          <span>{{ formattedTime }}</span>
        </div>

        <div v-if="ticket.plateNumber" class="ticket-plate">
          <span>Номер ТС:</span>
          <span>{{ ticket.plateNumber }}</span>
        </div>

        <div v-if="ticket.rate" class="ticket-rate">
          <span>Тариф:</span>
          <span>{{ ticket.rate }}</span>
        </div>

        <div v-if="ticket.barcode" class="ticket-barcode">
          <svg id="barcode" ref="barcodeElement" />
        </div>
      </div>
      <div v-else>
        <n-empty class="py-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchPostEffect } from "vue";
import JsBarcode from "jsbarcode";
import { NButton, NEmpty, NIcon } from "naive-ui";
import { DeleteOutlineRound, ReceiptOutlined } from "@vicons/material";
import type { Ticket } from "@/types.ts";

interface Emits {
  (e: "update:ticket", ticket: Ticket | null): void;
}

interface Props {
  ticket: Ticket | null;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();
const barcodeElement = ref<SVGElement | null>(null);

const formattedTime = computed(() => {
  if (!props.ticket) return "";
  return props.ticket.time.split(".")[0];
});

const clearBarcode = () => {
  if (barcodeElement.value) {
    barcodeElement.value.innerHTML = "";
  }
};

watchPostEffect(() => {
  clearBarcode();
  if (props.ticket?.barcode && barcodeElement.value) {
    JsBarcode(barcodeElement.value, props.ticket.barcode, {
      displayValue: true,
      fontSize: 20,
      lineColor: "black",
      background: "transparent",
    });
  }
});

const clearTicket = () => {
  emit("update:ticket", null);
};
</script>

<style scoped>
.ticket-viewer {
  @apply h-full flex flex-col bg-zinc-800 rounded-lg shadow-lg overflow-hidden w-full sm:w-96;
}

.header-header {
  @apply flex items-center justify-between p-4 border-b border-zinc-700;
  background: rgba(39, 39, 42, 0.7);
  backdrop-filter: blur(4px);
}

.header-title {
  @apply flex items-center gap-2 text-neutral-200 font-medium;
}

.ticket-controls {
  @apply flex gap-2;
}

.ticket-container {
  @apply flex-1 overflow-y-auto p-4;
}

.ticket-content {
  @apply bg-zinc-700 rounded-lg p-4 text-gray-200;
}

.ticket-header {
  @apply text-xl font-bold text-center mb-4 text-white;
}

.ticket-contact {
  @apply text-center mb-4 text-gray-300;
}

.ticket-hours {
  @apply whitespace-pre-line mb-4 text-gray-300 text-sm;
}

.ticket-time,
.ticket-plate,
.ticket-rate {
  @apply flex justify-between mb-2 text-sm;
}

.ticket-time span:first-child,
.ticket-plate span:first-child,
.ticket-rate span:first-child {
  @apply text-gray-400;
}

.ticket-time span:last-child,
.ticket-plate span:last-child,
.ticket-rate span:last-child {
  @apply text-gray-200 font-medium;
}

.ticket-barcode {
  @apply mt-4 flex justify-center;
  background: white;
  padding: 10px;
  border-radius: 4px;
}
</style>
