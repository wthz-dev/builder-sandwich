const express = require('express')
const { z } = require('zod')
const { pool } = require('../db')

const router = express.Router()

const MemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM members ORDER BY id DESC')
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [req.params.id])
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  try {
    const data = MemberSchema.parse(req.body)
    const [result] = await pool.query(
      'INSERT INTO members (name, email, phone, member_since) VALUES (?, ?, ?, NOW())',
      [data.name, data.email, data.phone || null]
    )
    const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' })
    if (err?.issues) return res.status(400).json({ error: 'Validation error', details: err.issues })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const data = MemberSchema.partial().parse(req.body)
    const fields = []
    const values = []
    for (const [k, v] of Object.entries(data)) {
      fields.push(`${k} = ?`)
      values.push(v)
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' })
    values.push(req.params.id)
    await pool.query(`UPDATE members SET ${fields.join(', ')} WHERE id = ?`, values)
    const [rows] = await pool.query('SELECT * FROM members WHERE id = ?', [req.params.id])
    res.json(rows[0])
  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: 'Validation error', details: err.issues })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM members WHERE id = ?', [req.params.id])
  res.json({ ok: true })
})

module.exports = router
