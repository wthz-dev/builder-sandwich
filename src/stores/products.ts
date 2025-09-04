import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import type { Product } from '@/types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    if (loading.value) return
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<Product[]>('/products')
      products.value = data
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, fetchAll }
})
