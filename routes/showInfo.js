const express = require('express')
const {newShow,showData} = require('../controllers/showInfo.js')

const router = express.Router()

router.get('/', showData)
router.post('/newshow', newShow)


module.exports = router