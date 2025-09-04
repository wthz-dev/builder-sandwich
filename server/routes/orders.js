const express = require('express')
const { z } = require('zod')
const { pool } = require('../db')

const router = express.Router()

const OrderItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().positive(),
})

const CreateOrderSchema = z.object({
  memberId: z.number().int().positive().optional(),
  items: z.array(OrderItemSchema).min(1),
})

router.post('/', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const data = CreateOrderSchema.parse(req.body)

    // Fetch product prices
    const ids = data.items.map((it) => it.productId)
    const [products] = await conn.query('SELECT * FROM products WHERE id IN (?)', [ids])
    const pMap = new Map(products.map((p) => [p.id, p]))

    let subtotal = 0
    for (const it of data.items) {
      const p = pMap.get(it.productId)
      if (!p) throw new Error(`Product not found: ${it.productId}`)
      subtotal += p.price * it.qty
    }
    const memberDiscount = data.memberId ? Math.round(subtotal * 0.1) : 0
    const grandTotal = Math.max(0, subtotal - memberDiscount)

    await conn.beginTransaction()

    // Create order
    const orderPublicId = `order_${Date.now().toString(36)}`
    const [orderResult] = await conn.query(
      'INSERT INTO orders (order_id, member_id, subtotal, member_discount, grand_total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [orderPublicId, data.memberId || null, subtotal, memberDiscount, grandTotal, 'pending']
    )
    const orderId = orderResult.insertId

    // Insert order items
    const values = data.items.map((it) => {
      const p = pMap.get(it.productId)
      return [orderId, it.productId, p.price, it.qty]
    })
    await conn.query(
      'INSERT INTO order_items (order_id, product_id, price, qty) VALUES ?',[values]
    )

    await conn.commit()

    const [rows] = await conn.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    )

    res.status(201).json({
      ...rows[0],
      items: data.items,
      orderPublicId,
    })
  } catch (err) {
    await conn.rollback()
    if (err?.issues) return res.status(400).json({ error: 'Validation error', details: err.issues })
    console.error(err)
    res.status(400).json({ error: err.message || 'Order creation failed' })
  } finally {
    conn.release()
  }
})

// List orders (optionally by member)
router.get('/', async (req, res) => {
  const { memberId } = req.query
  try {
    let rows
    if (memberId) {
      ;[rows] = await pool.query(
        'SELECT * FROM orders WHERE member_id = ? ORDER BY created_at DESC',
        [memberId]
      )
    } else {
      ;[rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
    }
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list orders' })
  }
})

router.get('/:id', async (req, res) => {
  const key = req.params.id
  const isNumeric = /^\d+$/.test(String(key))
  const where = isNumeric ? 'id = ?' : 'order_id = ?'
  const [orders] = await pool.query(`SELECT * FROM orders WHERE ${where}`, [key])
  if (orders.length === 0) return res.status(404).json({ error: 'Not found' })
  const order = orders[0]
  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
  res.json({ ...order, items })
})

// Update order status
router.put('/:id', async (req, res) => {
  const { status } = req.body || {}
  const allowed = new Set(['pending', 'paid', 'cancelled'])
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid status' })
  const key = req.params.id
  const isNumeric = /^\d+$/.test(String(key))
  const where = isNumeric ? 'id = ?' : 'order_id = ?'
  await pool.query(`UPDATE orders SET status = ? WHERE ${where}`, [status, key])
  const [orders] = await pool.query(`SELECT * FROM orders WHERE ${where}`, [key])
  if (orders.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(orders[0])
})

module.exports = router
