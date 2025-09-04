export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  badge?: string
}

export interface CartItem {
  product: Product
  qty: number
}

export interface UserProfile {
  name: string
  email: string
  phone?: string
  memberSince: string
}
