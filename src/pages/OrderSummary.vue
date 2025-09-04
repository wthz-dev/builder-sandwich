<template>
  <div class="mx-auto max-w-3xl px-4 py-10">
    <h1 class="font-display text-2xl font-bold text-slate-900">สรุปออเดอร์</h1>

    <div v-if="loading" class="mt-6 text-slate-600">กำลังโหลด...</div>
    <div v-else-if="error" class="mt-6 text-red-600">{{ error }}</div>

    <div v-else-if="order" class="mt-6 space-y-6">
      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div class="text-sm text-slate-500">หมายเลขออเดอร์</div>
            <div class="font-medium">{{ order.order_id || order.id }}</div>
          </div>
          <div class="text-sm text-slate-600">สถานะ: <span class="font-medium">{{ order.status }}</span></div>
        </div>
        <div class="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <div>วันที่สั่งซื้อ: {{ formatDate(order.created_at) }}</div>
          <div v-if="order.member_id">สมาชิก ID: {{ order.member_id }}</div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="mb-3 font-display text-lg font-semibold text-slate-900">รายการสินค้า</h2>
        <div class="divide-y divide-slate-100">
          <div
            v-for="(it, idx) in (order.items || [])"
            :key="idx"
            class="flex items-center justify-between py-3 text-sm"
          >
            <div class="text-slate-700">
              <div class="font-medium">{{ it.product_id || it.productId }}</div>
              <div class="text-slate-500">x {{ it.qty }}</div>
            </div>
            <div class="text-slate-900">฿{{ (it.price || 0) * it.qty }}</div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="mb-3 font-display text-lg font-semibold text-slate-900">ยอดชำระ</h2>
        <div class="space-y-1 text-sm">
          <div class="flex justify-between text-slate-700">
            <span>Subtotal</span>
            <span>฿{{ order.subtotal }}</span>
          </div>
          <div class="flex justify-between text-slate-700">
            <span>ส่วนลดสมาชิก</span>
            <span>-฿{{ order.member_discount }}</span>
          </div>
          <div class="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <span>รวมสุทธิ</span>
            <span>฿{{ order.grand_total }}</span>
          </div>
        </div>
      </div>

      <router-link
        to="/"
        class="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-primaryDark"
      >กลับหน้าแรก</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore, type OrderResponse } from '@/stores/orders'

const route = useRoute()
const ordersStore = useOrdersStore()
const order = ref<OrderResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

function formatDate(dt: string) {
  try {
    return new Date(dt).toLocaleString()
  } catch {
    return dt
  }
}

onMounted(async () => {
  const id = String(route.params.id)
  loading.value = true
  error.value = null
  try {
    order.value = await ordersStore.getById(id)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'ไม่สามารถโหลดออเดอร์ได้'
  } finally {
    loading.value = false
  }
})
</script>
