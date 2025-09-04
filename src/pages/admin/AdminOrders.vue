<template>
  <div class="mx-auto max-w-7xl px-4 py-10">
    <h1 class="font-display text-2xl font-bold text-slate-900">Admin: จัดการออเดอร์</h1>

    <div class="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <button class="btn" @click="refresh" :disabled="loading">รีเฟรช</button>
          <select v-model="filterStatus" class="input w-auto">
            <option value="">สถานะทั้งหมด</option>
            <option value="pending">pending</option>
            <option value="paid">paid</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
        <div class="text-sm text-slate-500" v-if="orders.length">ทั้งหมด {{ orders.length }} ออเดอร์</div>
      </div>

      <div v-if="loading" class="text-slate-600">กำลังโหลด...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="border-b bg-slate-50 text-slate-600">
              <th class="px-3 py-2">วันที่</th>
              <th class="px-3 py-2">หมายเลข</th>
              <th class="px-3 py-2">สมาชิก</th>
              <th class="px-3 py-2">ยอดสุทธิ</th>
              <th class="px-3 py-2">สถานะ</th>
              <th class="px-3 py-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in filtered" :key="o.id" class="border-b">
              <td class="px-3 py-2 whitespace-nowrap">{{ fmt(o.created_at) }}</td>
              <td class="px-3 py-2 whitespace-nowrap">
                <RouterLink :to="`/orders/${o.order_id}`" class="text-brand-primary hover:underline">{{ o.order_id }}</RouterLink>
              </td>
              <td class="px-3 py-2">{{ o.member_id ?? '-' }}</td>
              <td class="px-3 py-2">฿{{ o.grand_total }}</td>
              <td class="px-3 py-2">
                <span :class="badgeClass(o.status)">{{ o.status }}</span>
              </td>
              <td class="px-3 py-2">
                <div class="flex gap-2">
                  <button class="btn" @click="setStatus(o, 'pending')" :disabled="loading || o.status==='pending'">pending</button>
                  <button class="btn" @click="setStatus(o, 'paid')" :disabled="loading || o.status==='paid'">paid</button>
                  <button class="btn-danger" @click="setStatus(o, 'cancelled')" :disabled="loading || o.status==='cancelled'">cancel</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrdersStore, type OrderResponse } from '@/stores/orders'

const store = useOrdersStore()
const loading = store.loading
const error = store.error
const list = ref<OrderResponse[]>([])
const filterStatus = ref('')

function fmt(v: string) {
  try { return new Date(v).toLocaleString() } catch { return v }
}

const orders = computed(() => list.value)
const filtered = computed(() => filterStatus.value ? orders.value.filter(o => o.status === filterStatus.value) : orders.value)

async function refresh() {
  try {
    list.value = await store.listAll()
  } catch (e) {
    // error already set in store
  }
}

async function setStatus(o: OrderResponse, status: OrderResponse['status']) {
  try {
    const updated = await store.updateStatus(o.order_id ?? o.id, status)
    const idx = list.value.findIndex(x => x.id === updated.id)
    if (idx !== -1) list.value[idx] = updated
  } catch (e) {
    // error already set
  }
}

function badgeClass(status: OrderResponse['status']) {
  if (status === 'paid') return 'rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700'
  if (status === 'cancelled') return 'rounded-full bg-rose-100 px-2 py-0.5 text-rose-700'
  return 'rounded-full bg-slate-100 px-2 py-0.5 text-slate-700'
}

onMounted(refresh)
</script>

<style scoped>
.input { @apply rounded-md border border-slate-200 px-3 py-1.5 text-sm; }
.btn { @apply rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50; }
.btn-danger { @apply rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:opacity-95; }
</style>
