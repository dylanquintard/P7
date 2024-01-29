// Importer le module Express et créer un routeur Express
const express = require('express');
const router = express.Router();

// Importer le contrôleur des opérations liées aux utilisateurs
const userCtrl = require('../controllers/user')

// Définir les routes avec les méthodes HTTP correspondantes et les gestionnaires de contrôle
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exporter le routeur
module.exports = router;