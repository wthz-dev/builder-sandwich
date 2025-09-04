<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
    <div class="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <h3 class="font-display text-lg font-semibold text-slate-900">ค้นหาออเดอร์</h3>
      <p class="mt-1 text-sm text-slate-600">ใส่หมายเลขออเดอร์ (เช่น order_xxxx)</p>

      <form class="mt-4 space-y-4" @submit.prevent="submit">
        <input
          v-model.trim="inputId"
          type="text"
          placeholder="เช่น order_k3s8d2"
          class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-brand-primary focus:ring-brand-primary"
        />
        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            @click="$emit('close')"
          >ยกเลิก</button>
          <button
            type="submit"
            class="rounded-xl bg-brand-primary px-4 py-2 font-semibold text-white hover:bg-brand-primaryDark"
            :disabled="!inputId"
          >เปิดดูออเดอร์</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'

defineOptions({ name: 'FindOrderModal' })

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', id: string): void
}>()

const inputId = ref('')

watch(
  () => props.open,
  (v) => {
    if (v) inputId.value = ''
  }
)

function submit() {
  if (!inputId.value) return
  emit('submit', inputId.value)
}
</script>
