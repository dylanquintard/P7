const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');
const stuffRoutes = require('./routes/stuff');
const path = require('path');

mongoose.connect('mongodb+srv://quintarddylan:iPBaz0YTfgHit312@cluster0.lzaxby6.mongodb.net/?retryWrites=true&w=majority',
    )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/api/auth', userRoutes)
app.use('/api/books', stuffRoutes);
app.use('/files', express.static(path.join(__dirname, 'files')));

module.exports = app;