const express = require('express')
const { z } = require('zod')
const { pool } = require('../db')

const router = express.Router()

const ProductSchema = z.object({
  id: z.string().min(1), // using string IDs to match frontend sample (e.g., 'club')
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().int().nonnegative(),
  image: z.string().url().optional().nullable(),
  badge: z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY name ASC')
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  try {
    const data = ProductSchema.parse(req.body)
    await pool.query(
      'INSERT INTO products (id, name, description, price, image, badge) VALUES (?, ?, ?, ?, ?, ?)',
      [data.id, data.name, data.description || null, data.price, data.image || null, data.badge || null]
    )
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [data.id])
    res.status(201).json(rows[0])
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: 'Validation error', details: err.issues })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    // allow partial updates
    const Partial = ProductSchema.partial()
    const data = Partial.parse(req.body)
    const fields = []
    const values = []
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`)
      values.push(v)
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' })
    values.push(req.params.id)
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values)
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: 'Validation error', details: err.issues })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
