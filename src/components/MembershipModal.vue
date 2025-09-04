<template>
  <teleport to="body">
    <div v-show="open" class="fixed inset-0 z-50 grid place-items-center">
      <div class="fixed inset-0 bg-slate-900/60" @click="$emit('close')"></div>
      <form
        class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        @submit.prevent="$emit('submit', { name, email, phone })"
      >
        <button
          class="absolute right-3 top-3 rounded-full p-2 text-slate-600 hover:bg-slate-100"
          @click="$emit('close')"
          aria-label="ปิด"
          type="button"
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
          <h3 class="font-display text-xl font-semibold text-slate-900">สมัครสมาชิก</h3>
        </div>
        <p class="mt-1 text-sm text-slate-600">รับส่วนลด 10% ทุกออเดอร์และสะสมแต้ม</p>

        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-slate-700">ชื่อ-นามสกุล</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="เช่น กานต์สุดา ใจดี"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">อีเมล</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700">เบอร์โทร</label>
            <input
              v-model="phone"
              type="tel"
              placeholder="08x-xxx-xxxx"
              class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            />
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
            @click="$emit('close')"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white shadow-soft hover:bg-brand-primaryDark"
          >
            สมัครสมาชิก
          </button>
        </div>
      </form>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps<{ open: boolean }>()

const name = ref('')
const email = ref('')
const phone = ref('')
</script>
