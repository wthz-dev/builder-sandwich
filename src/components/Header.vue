<template>
  <header class="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
      <a href="#home" class="group inline-flex items-center gap-3">
        <div class="h-9 w-9 rounded-xl bg-brand-gradient shadow-soft transition-transform group-hover:scale-105"></div>
        <div class="leading-tight">
          <div class="font-display text-xl font-semibold tracking-tight text-slate-900">
            แซนวิชดี
          </div>
          <div class="text-xs text-slate-500">สั่งง่าย จ่ายด้วย QR</div>
        </div>
      </a>

      <nav class="hidden items-center gap-1 sm:flex">
        <a href="#menu" class="nav-link">เมนู</a>
        <a href="#membership" class="nav-link">สมาชิก</a>
        <a href="#checkout" class="nav-link">ชำระเงิน</a>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="hidden rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary sm:inline-flex"
          @click="$emit('open-membership')"
        >
          สมัครสมาชิก
        </button>
        <button
          type="button"
          class="relative inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
          @click="$emit('open-cart')"
          aria-label="เปิดตะกร้า"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
            <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.493 9.222A3.75 3.75 0 0010.1 15h6.652a3.75 3.75 0 003.604-2.64l1.4-4.662A.75.75 0 0021.05 6h-15.8l-.6-2.218A1.875 1.875 0 003.636 2.25H2.25z" />
            <path d="M8.25 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>ตะกร้า</span>
          <span v-if="count > 0" class="absolute -right-2 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1 text-xs font-bold text-white">{{ count }}</span>
        </button>
        <button
          type="button"
          class="sm:hidden inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50"
          @click="mobileOpen = !mobileOpen"
          aria-label="เปิดเมนู"
        >
          <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-show="mobileOpen" class="sm:hidden border-t border-slate-200/70 bg-white/90 backdrop-blur">
      <div class="mx-auto max-w-7xl px-4 py-3">
        <a href="#menu" class="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50">เมนู</a>
        <a href="#membership" class="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50">สมาชิก</a>
        <a href="#checkout" class="block rounded px-3 py-2 text-slate-700 hover:bg-slate-50">ชำระเงิน</a>
        <button
          class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
          @click="$emit('open-membership'); mobileOpen=false"
        >สมัครสมาชิก</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps<{ count: number }>()
const mobileOpen = ref(false)
</script>

<style scoped>
.nav-link {
  @apply rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900;
}
</style>
