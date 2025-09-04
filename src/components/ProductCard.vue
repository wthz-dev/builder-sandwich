<template>
  <div class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:shadow-lg">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img :src="product.image" :alt="product.name" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <span v-if="product.badge" class="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow">{{ product.badge }}</span>
    </div>
    <div class="flex flex-1 flex-col p-4">
      <h3 class="font-display text-lg font-semibold text-slate-900">{{ product.name }}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-slate-600">{{ product.description }}</p>
      <div class="mt-auto flex items-center justify-between pt-4">
        <div class="text-lg font-bold text-brand-primary">{{ formatTHB(product.price) }}</div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            @click="$emit('decrease')"
            aria-label="ลดจำนวน"
          >−</button>
          <div class="min-w-[2ch] text-center text-sm font-semibold text-slate-900">{{ qty }}</div>
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-full bg-brand-primary px-3 text-sm font-semibold text-white shadow-soft hover:bg-brand-primaryDark"
            @click="$emit('increase')"
            aria-label="เพิ่มจำนวน"
          >+</button>
        </div>
      </div>
      <button
        type="button"
        class="mt-3 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        @click="$emit('add')"
        aria-label="เพิ่มลงตะกร้า"
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { formatTHB } from '@/utils/format'
import type { Product } from '@/types'

const props = defineProps<{ product: Product; qty: number }>()
</script>
