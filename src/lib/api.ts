import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
