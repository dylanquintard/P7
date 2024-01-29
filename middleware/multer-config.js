// Importer le module multer pour la gestion des fichiers
const multer = require('multer');

// Définir les types MIME acceptés pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Utiliser multer avec le stockage en mémoire
const storage = multer.memoryStorage();

// Configurer multer pour gérer le téléchargement de fichiers
const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    // Vérifier si le type MIME du fichier est accepté
    const isValid = !!MIME_TYPES[file.mimetype];
    // Si le MIME est invalide on a une erreur
    let error = isValid ? null : new Error('Invalid file type.');
    // Appeler le callback avec l'erreur et une indication de validité
    callback(error, isValid);
  }
}).single('image');

// Exporter la configuration multer
module.exports = multer({storage: storage}).single('image');