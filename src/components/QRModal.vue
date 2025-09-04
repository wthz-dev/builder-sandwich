<template>
  <teleport to="body">
    <div v-show="open" class="fixed inset-0 z-50 grid place-items-center">
      <div class="fixed inset-0 bg-slate-900/60" @click="$emit('close')"></div>
      <div class="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          class="absolute right-3 top-3 rounded-full p-2 text-slate-600 hover:bg-slate-100"
          @click="$emit('close')"
          aria-label="ปิด"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-5 w-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-brand-gradient"></div>
          <h3 class="font-display text-xl font-semibold text-slate-900">สแกนเพื่อช���ระเงิน</h3>
        </div>
        <p class="mt-1 text-sm text-slate-600">ยอดชำระ {{ amountText }}</p>
        <div
          class="mt-4 grid place-items-center rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <img :src="qrUrl" alt="QR Code" class="h-60 w-60 rounded-md bg-white p-2 shadow" />
        </div>
        <div class="mt-4 space-y-1 text-center text-xs text-slate-500">
          <p>เปิดแอปธนาคารของคุณและสแกน QR เพื่อชำระเงิน</p>
          <p>
            เลขคำสั่งซื้อ: <span class="font-mono">{{ orderId }}</span>
          </p>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-2">
          <button
            class="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
            @click="$emit('close')"
          >
            ปิด
          </button>
          <button
            class="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            @click="$emit('paid')"
          >
            ฉันชำระแล้ว
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { formatTHB } from '@/utils/format'

const props = defineProps<{ open: boolean; amount: number; orderId: string }>()

const amountText = computed(() => formatTHB(props.amount))

const qrUrl = computed(() => {
  const payload = encodeURIComponent(
    JSON.stringify({
      merchant: 'แซนวิชดี',
      orderId: props.orderId,
      amount: props.amount,
      currency: 'THB',
      note: 'Sandwich Order QR',
    }),
  )
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${payload}`
})
</script>
