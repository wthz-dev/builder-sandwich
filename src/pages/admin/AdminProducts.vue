<template>
  <div class="mx-auto max-w-6xl px-4 py-10">
    <h1 class="font-display text-2xl font-bold text-slate-900">Admin: จัดการสินค้า</h1>

    <div class="mt-6 grid gap-6 sm:grid-cols-2">
      <form @submit.prevent="onCreate" class="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 class="mb-4 text-lg font-semibold">เพิ่มสินค้า</h2>
        <div class="grid gap-3">
          <input v-model="form.id" class="input" placeholder="รหัสสินค้า (เช่น club)" required />
          <input v-model="form.name" class="input" placeholder="ชื่อสินค้า" required />
          <input v-model.number="form.price" class="input" type="number" min="0" step="1" placeholder="ราคา (บาท)" required />
          <input v-model="form.image" class="input" placeholder="รูปภาพ (URL)" />
          <input v-model="form.badge" class="input" placeholder="ป้าย (เช่น ใหม่, ลดราคา)" />
          <textarea v-model="form.description" class="input" placeholder="รายละเอียด"></textarea>
          <button type="submit" class="btn-primary" :disabled="loading">บันทึก</button>
          <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
        </div>
      </form>

      <div class="rounded-2xl border border-slate-200 bg-white p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold">สินค้าทั้งหมด</h2>
          <button class="btn" @click="refresh" :disabled="loading">รีเฟรช</button>
        </div>
        <div v-if="loading" class="text-slate-600">กำลังโหลด...</div>
        <div v-else class="divide-y">
          <div v-for="p in products" :key="p.id" class="py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div class="font-medium">{{ p.name }} <span class="text-xs text-slate-500">(#{{ p.id }})</span></div>
                <div class="text-sm text-slate-600">฿{{ p.price }}</div>
              </div>
              <div class="flex gap-2">
                <button class="btn" @click="edit(p)">แก้ไข</button>
                <button class="btn-danger" @click="remove(p.id)">ลบ</button>
              </div>
            </div>
            <div v-if="editId === p.id" class="mt-3 grid gap-2 rounded-lg border border-slate-200 p-3">
              <input v-model="editForm.name" class="input" placeholder="ชื่อสินค้า" />
              <input v-model.number="editForm.price" type="number" min="0" step="1" class="input" placeholder="ราคา" />
              <input v-model="editForm.image" class="input" placeholder="รูปภาพ (URL)" />
              <input v-model="editForm.badge" class="input" placeholder="ป้าย" />
              <textarea v-model="editForm.description" class="input" placeholder="รายละเอียด"></textarea>
              <div class="flex gap-2">
                <button class="btn-primary" @click="applyEdit(p.id)">บันทึก</button>
                <button class="btn" @click="cancelEdit">ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types'

const store = useProductsStore()
const { products, loading } = store
const error = ref<string | null>(store.error)

const form = reactive<Product>({ id: '', name: '', price: 0, image: '', description: '', badge: '' })

const editId = ref<string | null>(null)
const editForm = reactive<Partial<Product>>({})

async function refresh() {
  await store.fetchAll()
}

async function onCreate() {
  try {
    await store.createProduct({ ...form })
    Object.assign(form, { id: '', name: '', price: 0, image: '', description: '', badge: '' })
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'เพิ่มสินค้าไม่สำเร็จ'
  }
}

function edit(p: Product) {
  editId.value = p.id
  Object.assign(editForm, { name: p.name, price: p.price, image: p.image, description: p.description, badge: p.badge })
}

function cancelEdit() {
  editId.value = null
  Object.keys(editForm).forEach((k) => delete (editForm as any)[k])
}

async function applyEdit(id: string) {
  try {
    await store.updateProduct(id, { ...editForm })
    cancelEdit()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'แก้ไขสินค้าไม่สำเร็จ'
  }
}

async function remove(id: string) {
  if (!confirm('แน่ใจว่าจะลบสินค้านี้?')) return
  try {
    await store.deleteProduct(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'ลบสินค้าไม่สำเร็จ'
  }
}

onMounted(refresh)
</script>

<style scoped>
.input { @apply w-full rounded-md border border-slate-200 px-3 py-2 text-sm; }
.btn { @apply rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50; }
.btn-primary { @apply rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-95; }
.btn-danger { @apply rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:opacity-95; }
</style>
