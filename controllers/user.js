const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const emailValidator = require('email-validator');

const User = require('../models/user')

// Fonction pour l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    const { email, password } = req.body;

    // Vérification de la validité de l'adresse email et du mot de passe
    if (!emailValidator.validate(email) || password === "") {
      res.status(400).json({ message: 'Invalid email address or password' });
      return;
    }

    // Hachage du mot de passe avant de le stocker dans la base de données
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Création d'un nouvel utilisateur avec l'adresse email et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Sauvegarde de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé'}))
                .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error}));
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur dans la base de données par son adresse email
    User.findOne({ email: req.body.email })
        .then(user => {
            // Vérification de l'existence de l'utilisateur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe fourni avec le mot de passe haché stocké
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Vérification de la validité du mot de passe
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Génération d'un token JWT pour l'authentification de l'utilisateur
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};