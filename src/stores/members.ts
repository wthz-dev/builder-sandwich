import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'
import type { UserProfile } from '@/types'

interface RegisterPayload {
  name: string
  email: string
  phone?: string
}

interface MemberApiResponse {
  id: number
  name: string
  email: string
  phone?: string
  member_since: string
}

const STORAGE_KEY = 'sandwich.member'

export const useMembersStore = defineStore('members', () => {
  const current = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function loadFromStorage() {
    const m = localStorage.getItem(STORAGE_KEY)
    if (m) current.value = JSON.parse(m)
  }

  function saveToStorage() {
    if (current.value) localStorage.setItem(STORAGE_KEY, JSON.stringify(current.value))
    else localStorage.removeItem(STORAGE_KEY)
  }

  async function register(payload: RegisterPayload): Promise<UserProfile> {
    loading.value = true
    error.value = null
    try {
      const { data } = await api.post<MemberApiResponse>('/members', payload)
      const profile: UserProfile = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        memberSince: data.member_since,
      }
      current.value = profile
      saveToStorage()
      return profile
    } catch (e: unknown) {
      if (e instanceof Error) error.value = e.message
      else error.value = 'Failed to register member'
      throw e
    } finally {
      loading.value = false
    }
  }

  function signOut() {
    current.value = null
    saveToStorage()
  }

  return { current, loading, error, loadFromStorage, register, signOut }
})
