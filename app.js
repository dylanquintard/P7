const express = require('express'); // Ici on importe express
const mongoose = require('mongoose'); // Ici on importe mongoose 
const bodyParser = require('body-parser'); // Ici on importe body-parser


const userRoutes = require('./routes/user'); // Ici on importe nos routes user
const stuffRoutes = require('./routes/stuff'); // Ici on importe nos routes stuff
const path = require('path'); // Ici on importe path pour le transfert de fichiers

mongoose.connect('mongodb+srv://quintarddylan:iPBaz0YTfgHit312@cluster0.lzaxby6.mongodb.net/?retryWrites=true&w=majority', // Ici la logique de connexion mongoose
    )
  .then(() => console.log('Connexion à MongoDB réussie !')) // Si la connexion est réussie un message est retourné dans la console
  .catch(() => console.log('Connexion à MongoDB échouée !')); // Sinon un message est retourné dans la console

const app = express(); // Ici on initialise l'application Express

// Middleware pour gérer les paramètres CORS
app.use((req, res, next) => {
  // Autoriser l'accès depuis n'importe quelle origine ('*')
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Autoriser les en-têtes spécifiés lors des requêtes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  
  // Autoriser les méthodes HTTP spécifiées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Passer au middleware suivant
  next();
});

app.use(bodyParser.json()); // Middleware bodyParser pour traiter les données JSON dans les requêtes

app.use('/api/auth', userRoutes) // Utiliser les routes spécifiées pour gérer les endpoints user
app.use('/api/books', stuffRoutes); // Utiliser les routes spécifiées pour gérer les endpoints stuff
app.use('/files', express.static(path.join(__dirname, 'files'))); // Servir les fichiers statiques depuis le répertoire 'files' à partir de l'URL '/files'

module.exports = app;