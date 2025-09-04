const express = require('express')
const members = require('./members')
const products = require('./products')
const orders = require('./orders')

const router = express.Router()

router.use('/members', members)
router.use('/products', products)
router.use('/orders', orders)

module.exports = router
