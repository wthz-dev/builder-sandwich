<template>
  <footer class="border-t border-slate-200/60 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-10">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg bg-brand-gradient"></div>
          <div class="font-display text-lg font-semibold text-slate-900">แซนวิชดี</div>
        </div>
        <nav class="flex gap-4 text-sm text-slate-600">
          <a href="#menu" class="hover:text-slate-900">เมนู</a>
          <a href="#membership" class="hover:text-slate-900">สมาชิก</a>
          <RouterLink to="/checkout" class="hover:text-slate-900">ชำระเงิน</RouterLink>
        </nav>
      </div>
      <div class="mt-6 text-xs text-slate-500">
        {{ new Date().getFullYear() }} แซนวิชดี — สั่งง่าย จ่ายด้วย QR
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineOptions({ name: 'AppFooter' })
</script>
