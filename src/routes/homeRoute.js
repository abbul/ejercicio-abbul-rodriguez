const express = require('express')
const router = express.Router()
const { home, verifyJSON, createModelo } = require('../controllers/homeController')

/**
 * Se muestra la vista con el formulario
 */
router.get('/', home)

router.post('/verify-json', verifyJSON)

router.post('/modelo', createModelo)

module.exports = router
