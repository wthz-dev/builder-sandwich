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

  async function createProduct(p: Product) {
    loading.value = true
    error.value = null
    try {
      await api.post('/products', p)
      await fetchAll()
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to create product'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: string, data: Partial<Product>) {
    loading.value = true
    error.value = null
    try {
      await api.put(`/products/${encodeURIComponent(id)}`, data)
      await fetchAll()
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to update product'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: string) {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/products/${encodeURIComponent(id)}`)
      products.value = products.value.filter((p) => p.id !== id)
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to delete product'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { products, loading, error, fetchAll, createProduct, updateProduct, deleteProduct }
})
