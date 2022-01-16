// Import module Express
const express = require('express');

// Création routeur Express
const router = express.Router();

// Import fichier P6-master/backend/controllers/userController
const userCtrl = require('../controllers/userControllers')

// Routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// Export des routes
module.exports = router