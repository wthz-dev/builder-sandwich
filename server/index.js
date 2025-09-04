const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const routes = require('./routes')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.use('/api', routes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
})
