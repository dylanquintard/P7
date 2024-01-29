// Importer le module Express et créer un routeur Express
const express = require('express');
const router = express.Router(); 

// Importer les middlewares d'authentification et de configuration multer
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importer le contrôleur des opérations CRUD pour les book
const stuffCtrl = require('../controllers/stuff');

// Définir les routes avec les méthodes HTTP correspondantes et les gestionnaires de contrôle
router.get('/', stuffCtrl.getAllStuff);
router.get('/bestrating', stuffCtrl.bestRatedBooks);
router.post('/', auth, multer, stuffCtrl.createBook);
router.get('/:id', stuffCtrl.getOneBook);
router.put('/:id', auth, multer, stuffCtrl.modifyBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);
router.post('/:id/rating', auth, stuffCtrl.addRating);

// Exporter le routeur
module.exports = router;