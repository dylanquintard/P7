// Importer le module mongoose
const mongoose = require('mongoose');

// Définir le schéma de données pour les livres
const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],
  averageRating: { type: Number, required: true },
});

// Créer un modèle MongoDB appelé 'Book' basé sur le schéma défini
module.exports = mongoose.model('Book', bookSchema);