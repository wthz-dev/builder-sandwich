<template>
  <teleport to="body">
    <div v-show="open" class="fixed inset-0 z-50 flex">
      <div class="fixed inset-0 bg-slate-900/50" @click="$emit('close')"></div>
      <aside class="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 class="font-display text-lg font-semibold text-slate-900">ตะกร้า</h2>
          <button
            class="rounded-full p-2 hover:bg-slate-100"
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
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="items.length === 0" class="grid h-full place-items-center text-slate-500">
            ยังไม่มีสินค้าในตะกร้า
          </div>
          <ul v-else class="space-y-4">
            <li v-for="(it, idx) in items" :key="it.product.id" class="flex gap-3">
              <img
                :src="it.product.image"
                :alt="it.product.name"
                class="h-16 w-16 rounded-lg object-cover"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between">
                  <div class="truncate pr-3 font-medium text-slate-900">{{ it.product.name }}</div>
                  <button
                    class="text-xs text-slate-500 hover:text-red-600"
                    @click="$emit('remove', idx)"
                  >
                    ลบ
                  </button>
                </div>
                <div class="mt-1 text-sm text-slate-600">{{ formatTHB(it.product.price) }}</div>
                <div
                  class="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-sm"
                >
                  <button class="px-2" @click="$emit('decrease', idx)">−</button>
                  <div class="min-w-[2ch] text-center font-semibold">{{ it.qty }}</div>
                  <button class="px-2" @click="$emit('increase', idx)">+</button>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="border-t border-slate-200 p-4">
          <div class="flex items-center justify-between text-sm text-slate-700">
            <span>ยอดรวม</span>
            <span class="font-semibold text-slate-900">{{ formatTHB(total) }}</span>
          </div>
          <div
            v-if="memberDiscount > 0"
            class="mt-1 flex items-center justify-between text-sm text-emerald-600"
          >
            <span>ส่วนลดสมาชิก</span>
            <span>-{{ formatTHB(memberDiscount) }}</span>
          </div>
          <div
            class="mt-1 flex items-center justify-between text-base font-semibold text-slate-900"
          >
            <span>สุทธิ</span>
            <span>{{ formatTHB(grandTotal) }}</span>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
              @click="$emit('continue')"
            >
              เลือกต่อ
            </button>
            <button
              class="rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white shadow-soft hover:bg-brand-primaryDark"
              @click="$emit('checkout')"
            >
              ชำระด้วย QR
            </button>
          </div>
          <p class="mt-2 text-center text-xs text-slate-500">รองรับธนาคารชั้นนำของไทย</p>
        </div>
      </aside>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { CartItem } from '@/types'
import { formatTHB } from '@/utils/format'

const props = defineProps<{
  open: boolean
  items: CartItem[]
  total: number
  memberDiscount: number
  grandTotal: number
}>()
</script>
