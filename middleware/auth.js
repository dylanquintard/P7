// Importer le module jsonwebtoken pour la gestion des jetons JWT
const jwt = require('jsonwebtoken');

// Importer le modèle User pour les opérations liées aux utilisateurs
const user = require('../models/user');

// Middleware pour l'authentification par jeton JWT
module.exports = (req, res, next) => {
    try {
        // Extraire le jeton JWT du header
        const token = req.headers.authorization.split(' ')[1];
        // Décoder le jeton pour récupérer les informations utilisateur
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Extraire l'identifiant de l'utilisateur du jeton décodé
        const userId = decodedToken.userId;
        // Ajouter l'identifiant de l'utilisateur à la requête
        req.auth = {
            userId: userId
        };
        // Passer à la prochaine étape de traitement des requêtes
        next()
    } catch(error) {
        // En cas d'erreur de vérification du jeton, renvoyer une erreur 401
        res.status(401).json({ error });
    }
};