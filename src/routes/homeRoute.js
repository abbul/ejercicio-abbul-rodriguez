const express = require('express')
const router = express.Router()
const { home, verifyJSON, createCableModem } = require('../controllers/homeController')

/**
 * Se muestra la vista con el formulario
 */
router.get('/', home)

router.post('/verify-json', verifyJSON)

router.post('/cable-modem', createCableModem)

module.exports = router
