// /routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');

// Rutas de autenticación
router.post('/register', authController.register); // No necesita token
router.post('/login', authController.login);     // No necesita token

module.exports = router;