<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'
import CartDrawer from '@/components/CartDrawer.vue'
import QRModal from '@/components/QRModal.vue'
import MembershipModal from '@/components/MembershipModal.vue'
import FindOrderModal from '@/components/FindOrderModal.vue'
import type { CartItem, Product, UserProfile } from '@/types'
import { useProductsStore } from '@/stores/products'
import { useMembersStore } from '@/stores/members'
import { useOrdersStore } from '@/stores/orders'

const productsStore = useProductsStore()
const router = useRouter()
const qtyMap = reactive<Record<string, number>>({})
// Initialize qty for products once loaded
watch(
  () => productsStore.products,
  (list) => {
    list.forEach((p) => {
      if (!(p.id in qtyMap)) qtyMap[p.id] = 1
    })
  },
  { immediate: true },
)

const cart = ref<CartItem[]>([])
const isCartOpen = ref(false)
const isQROpen = ref(false)
const isMemberOpen = ref(false)
const isFindOrderOpen = ref(false)
const orderId = ref('')
const amountToPay = ref(0)
const user = ref<UserProfile | null>(null)
const membersStore = useMembersStore()
const ordersStore = useOrdersStore()

const subtotal = computed(() => cart.value.reduce((s, it) => s + it.product.price * it.qty, 0))
const memberDiscount = computed(() => (user.value ? Math.round(subtotal.value * 0.1) : 0))
const grandTotal = computed(() => Math.max(0, subtotal.value - memberDiscount.value))

function addToCart(p: Product, qty = 1) {
  const idx = cart.value.findIndex((it) => it.product.id === p.id)
  if (idx >= 0) cart.value[idx].qty += qty
  else cart.value.push({ product: p, qty })
  isCartOpen.value = true
}

function findOrder(id: string) {
  if (!id) return
  router.push(`/orders/${encodeURIComponent(id)}`)
  isFindOrderOpen.value = false
}

function removeItem(idx: number) {
  if (idx >= 0 && idx < cart.value.length) {
    cart.value.splice(idx, 1)
  }
}

function increaseItem(idx: number) {
  cart.value[idx].qty += 1
}

function decreaseItem(idx: number) {
  const it = cart.value[idx]
  if (it.qty <= 1) cart.value.splice(idx, 1)
  else it.qty -= 1
}

async function checkout() {
  if (cart.value.length === 0) return
  try {
    const payload = {
      memberId: user.value?.id,
      items: cart.value.map((it) => ({ productId: it.product.id, qty: it.qty })),
    }
    const order = await ordersStore.createOrder(payload)
    orderId.value = order.order_id
    amountToPay.value = order.grand_total
    isQROpen.value = true
  } catch (e) {
    console.error(e)
    alert('สร้างออเดอร์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
  }
}

function handlePaid() {
  const id = orderId.value || ordersStore.lastOrder?.order_id
  if (id) {
    router.push(`/orders/${encodeURIComponent(id)}`)
  }
  cart.value = []
  isQROpen.value = false
  orderId.value = ''
  amountToPay.value = 0
}

async function saveMember(profile: { name: string; email: string; phone?: string }) {
  try {
    const created = await membersStore.register(profile)
    user.value = created
    isMemberOpen.value = false
  } catch (e) {
    console.error(e)
    alert('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
  }
}

onMounted(() => {
  // Load products from backend
  productsStore.fetchAll()
  // Load member from localStorage
  membersStore.loadFromStorage()
  user.value = membersStore.current
  const savedCart = localStorage.getItem('sandwich.cart')
  if (savedCart) cart.value = JSON.parse(savedCart)
})

watch(
  cart,
  (v) => {
    localStorage.setItem('sandwich.cart', JSON.stringify(v))
  },
  { deep: true },
)

// Routing state
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div id="home" class="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
    <Header
      :count="cart.length"
      @open-cart="isCartOpen = true"
      @open-membership="isMemberOpen = true"
      @open-find-order="isFindOrderOpen = true"
    />

    <!-- Render pages when not on home -->
    <RouterView v-if="!isHome" />

    <!-- Home sections -->
    <section v-else class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 -z-10 opacity-20">
        <div
          class="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand-gradient blur-3xl"
        ></div>
        <div
          class="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-brand-gradient blur-3xl"
        ></div>
      </div>
      <div
        class="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 pt-10 md:grid-cols-2 md:pt-16"
      >
        <div>
          <div
            class="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
          >
            สดใหม่ทุกวัน
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            ชำระด้วย QR ได้ทันที
          </div>
          <h1
            class="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl"
          >
            เว็ปขายแซนวิชทันสมัย ใช้งานง่าย ชำระเงินด้วย QR Code
          </h1>
          <p class="mt-3 text-slate-600">
            เลือกเมนูโปรดของคุณ สมัครสมาชิกเพื่อรับส่วนลด 10% และชำระเงินอย่างปลอดภัยผ่าน QR
            ทุกธนาคาร
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <a
              href="#menu"
              class="inline-flex items-center justify-center rounded-xl bg-brand-primary px-5 py-3 font-semibold text-white shadow-soft transition hover:bg-brand-primaryDark"
              >สั่งเลย</a
            >
            <a
              href="#membership"
              class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >สมัครสมาชิก</a
            >
            <RouterLink
              to="/checkout"
              class="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >ไปหน้าชำระเงิน</RouterLink>
          </div>
          <div
            v-if="user"
            class="mt-6 inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700"
          >
            <span
              class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white font-semibold text-emerald-600 shadow"
              >{{ user.name.charAt(0) }}</span
            >
            <div>
              <div class="text-sm">ยินดีต้อนรับกลับ</div>
              <div class="font-medium">สมาชิก: {{ user.name }}</div>
            </div>
          </div>
        </div>
        <div class="relative">
          <div
            class="absolute -right-6 -top-6 hidden h-32 w-32 rotate-12 rounded-3xl bg-brand-gradient opacity-40 blur-2xl md:block"
          ></div>
          <img
            src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=1865&auto=format&fit=crop"
            alt="Gourmet Sandwich"
            class="relative z-10 mx-auto w-full max-w-lg rounded-3xl border border-white/40 shadow-2xl"
          />
        </div>
      </div>
    </section>

    <section id="menu" class="mx-auto max-w-7xl px-4 py-12">
      <div class="flex items-end justify-between gap-4">
        <h2 class="font-display text-2xl font-bold text-slate-900 sm:text-3xl">เมนูแซนวิช</h2>
        <RouterLink
          to="/checkout"
          class="hidden text-sm font-medium text-brand-primary hover:underline sm:inline"
          >ไปหน้าชำระเงิน</RouterLink>
      </div>
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="p in productsStore.products"
          :key="p.id"
          :product="p"
          :qty="qtyMap[p.id]"
          @increase="qtyMap[p.id]++"
          @decrease="qtyMap[p.id] = Math.max(1, qtyMap[p.id] - 1)"
          @add="addToCart(p, qtyMap[p.id])"
        />
      </div>
    </section>

    <section v-if="isHome" id="membership" class="bg-white/60">
      <div class="mx-auto max-w-7xl px-4 py-12">
        <div class="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 class="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              สมาชิกแซนวิชดี
            </h2>
            <p class="mt-3 text-slate-600">
              สมัครฟรี รับทันทีส่วนลด 10% ทุกออเดอร์ พร้อมสะสมแต้มแลกรางวัล
            </p>
            <ul class="mt-4 space-y-2 text-slate-700">
              <li class="flex items-center gap-2">
                <span
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  >✓</span
                >
                ส่วนลดสมาชิก 10%
              </li>
              <li class="flex items-center gap-2">
                <span
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  >✓</span
                >
                สะสมแต้มทุกการสั่งซื้อ
              </li>
              <li class="flex items-center gap-2">
                <span
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                  >✓</span
                >
                โปรพิเศษเฉพาะสมาชิก
              </li>
            </ul>
            <div class="mt-6 flex gap-3">
              <button
                v-if="!user"
                class="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
                @click="isMemberOpen = true"
              >
                สมัครสมาชิก
              </button>
              <div
                v-else
                class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700"
              >
                คุณเป็นสมาชิกแล้ว {{ user.name }}
              </div>
              <a
                href="#menu"
                class="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >ดูเมนู</a
              >
            </div>
          </div>
          <div class="relative">
            <div
              class="absolute -left-6 -top-6 h-32 w-32 -rotate-12 rounded-3xl bg-brand-gradient opacity-40 blur-2xl"
            ></div>
            <img
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1887&auto=format&fit=crop"
              alt="Membership"
              class="relative z-10 w-full rounded-3xl border border-white/40 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    

    <Footer />

    <CartDrawer
      :open="isCartOpen"
      :items="cart"
      :total="subtotal"
      :memberDiscount="memberDiscount"
      :grandTotal="grandTotal"
      @close="isCartOpen = false"
      @remove="removeItem($event)"
      @increase="increaseItem($event)"
      @decrease="decreaseItem($event)"
      @continue="isCartOpen = false"
      @checkout="checkout"
    />

    <QRModal
      :open="isQROpen"
      :amount="amountToPay || grandTotal"
      :orderId="orderId"
      @close="isQROpen = false"
      @paid="handlePaid"
    />

    <MembershipModal :open="isMemberOpen" @close="isMemberOpen = false" @submit="saveMember" />
    <FindOrderModal :open="isFindOrderOpen" @close="isFindOrderOpen = false" @submit="findOrder" />
  </div>
</template>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}
</style>
