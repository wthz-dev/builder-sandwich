<template>
  <div class="mx-auto max-w-4xl px-4 py-10">
    <h1 class="font-display text-2xl font-bold text-slate-900">ออเดอร์ของฉัน</h1>

    <div v-if="!member" class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
      ยังไม่ได้เข้าสู่ระบบสมาชิก กรุณาไปที่ส่วน "สมาชิก" เพื่อสมัคร/เข้าสู่ระบบ จากนั้นกลับมาหน้านี้อีกครั้ง
    </div>

    <div v-else class="mt-6">
      <div v-if="loading" class="text-slate-600">กำลังโหลดรายการออเดอร์...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>

      <div v-else>
        <div v-if="orders.length === 0" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
          ยังไม่มีออเดอร์ ลองเลือกเมนูแล้วสั่งซื้อได้เลย
        </div>

        <ul v-else class="space-y-3">
          <li
            v-for="o in orders"
            :key="o.order_id"
            class="rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-primary/40"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="text-sm text-slate-500">หมายเลขออเดอร์</div>
                <RouterLink :to="`/orders/${o.order_id}`" class="font-medium text-brand-primary hover:underline">
                  {{ o.order_id }}
                </RouterLink>
              </div>
              <div class="text-sm text-slate-600">สถานะ: <span class="font-medium">{{ o.status }}</span></div>
            </div>
            <div class="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
              <div>วันที่สั่งซื้อ: {{ formatDate(o.created_at) }}</div>
              <div>ยอดสุทธิ: ฿{{ o.grand_total }}</div>
              <div>ส่วนลดสมาชิก: ฿{{ o.member_discount }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useOrdersStore, type OrderResponse } from '@/stores/orders'

interface MemberLS { id: number; name: string; email: string; phone?: string }

const ordersStore = useOrdersStore()
const member = ref<MemberLS | null>(null)
const orders = ref<OrderResponse[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

function formatDate(dt: string) {
  try { return new Date(dt).toLocaleString() } catch { return dt }
}

onMounted(async () => {
  try {
    const saved = localStorage.getItem('sandwich.member')
    if (saved) member.value = JSON.parse(saved)
    if (!member.value) return

    loading.value = true
    error.value = null
    orders.value = await ordersStore.listByMember(member.value.id)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'โหลดรายการออเดอร์ไม่สำเร็จ'
  } finally {
    loading.value = false
  }
})
</script>
