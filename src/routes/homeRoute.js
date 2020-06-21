const express = require('express')
const router = express.Router()
const { home, verifyJSON } = require('../controllers/homeController')

/**
 * Se muestra la vista con el formulario
 */
router.get('/', home)

router.post('/verify-json', verifyJSON)

module.exports = router
