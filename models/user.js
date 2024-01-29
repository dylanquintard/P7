// Importer le module mongoose
const mongoose = require('mongoose');

// Importer le module mongoose-unique-validator pour éviter plusieurs comptes avec la même adresse e-mail
const uniqueValidator = require('mongoose-unique-validator');

// Définir le schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Utiliser le plugin mongoose-unique-validator pour gérer la validation d'unicité de l'e-mail
userSchema.plugin(uniqueValidator);

// Créer un modèle MongoDB appelé 'User' basé sur le schéma défini
module.exports = mongoose.model('User', userSchema);