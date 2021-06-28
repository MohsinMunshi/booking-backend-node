const express = require('express')
const {newBooking,searchBooking,updateBooking} = require('../controllers/booking.js')

const router = express.Router()

router.post('/newbooking', newBooking)
router.get('/search/:id', searchBooking)
router.post('/update/', updateBooking)

module.exports = router