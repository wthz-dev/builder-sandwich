import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/products', component: () => import('@/pages/Products.vue') },
  { path: '/checkout', component: () => import('@/pages/Checkout.vue') },
  { path: '/cart', component: () => import('@/pages/Cart.vue') },
  { path: '/orders/:id', component: () => import('@/pages/OrderSummary.vue') },
  { path: '/orders', component: () => import('@/pages/Orders.vue') },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
