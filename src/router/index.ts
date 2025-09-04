import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/products', component: () => import('@/pages/Products.vue') },
  { path: '/checkout', component: () => import('@/pages/Checkout.vue') },
  { path: '/cart', component: () => import('@/pages/Cart.vue') },
  { path: '/orders/:id', component: () => import('@/pages/OrderSummary.vue') },
  { path: '/orders', component: () => import('@/pages/Orders.vue') },
  { path: '/admin/products', component: () => import('@/pages/admin/AdminProducts.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/orders', component: () => import('@/pages/admin/AdminOrders.vue'), meta: { requiresAdmin: true } },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Simple admin guard using localStorage flag `sandwich.admin`
router.beforeEach((to) => {
  if (to.meta && (to.meta as any).requiresAdmin) {
    try {
      const raw = localStorage.getItem('sandwich.admin')
      const allowed = raw === 'true' || raw === '1'
      if (!allowed) return { path: '/' }
    } catch {
      return { path: '/' }
    }
  }
})

export default router
