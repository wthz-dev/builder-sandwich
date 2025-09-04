import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'

interface CreateOrderItem {
  productId: string
  qty: number
}

interface CreateOrderPayload {
  memberId?: number
  items: CreateOrderItem[]
}

export interface OrderResponse {
  id: number
  order_id: string
  member_id?: number | null
  subtotal: number
  member_discount: number
  grand_total: number
  status: 'pending' | 'paid' | 'cancelled'
  created_at: string
  items?: Array<{
    product_id: string
    price: number
    qty: number
  }>
}

export const useOrdersStore = defineStore('orders', () => {
  const lastOrder = ref<OrderResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post<OrderResponse>('/orders', payload)
      lastOrder.value = data
      return data
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to create order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getById(id: string): Promise<OrderResponse> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<OrderResponse>(`/orders/${encodeURIComponent(id)}`)
      lastOrder.value = data
      return data
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to load order'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function listByMember(memberId: number): Promise<OrderResponse[]> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<OrderResponse[]>(`/orders`, { params: { memberId } })
      return data
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to list orders'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function listAll(): Promise<OrderResponse[]> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.get<OrderResponse[]>(`/orders`)
      return data
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to list orders'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string | number, status: OrderResponse['status']): Promise<OrderResponse> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.put<OrderResponse>(`/orders/${encodeURIComponent(String(id))}`,{ status })
      return data
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to update order status'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { lastOrder, loading, error, createOrder, getById, listByMember, listAll, updateStatus }
})
