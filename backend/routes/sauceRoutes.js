// Import module Express
const express = require('express');

// Création routeur Express
const router = express.Router();

// Middleware d'authentification pour sécuriser les routes
const auth = require('../middlewares/auth');

// Gestion des fichiers entrants dans les requêtes HTTP
const multer = require('../middlewares/multer-config');

// import fichier P6-master/backend/controllers/sauceController 
const sauceCtrl = require('../controllers/sauceControllers');

// Routes
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

// Export des routes
module.exports = router;