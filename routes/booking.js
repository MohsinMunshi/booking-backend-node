const express = require('express')
const {newBooking,searchBooking} = require('../controllers/booking.js')

const router = express.Router()

router.post('/newbooking', newBooking)
router.get('/search/:id', searchBooking)

module.exports = router