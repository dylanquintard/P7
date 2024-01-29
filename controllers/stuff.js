const Book = require('../models/book');
const sharp = require('sharp');

const fs = require('fs');

// Fonction pour créer un nouveau livre
exports.createBook = async (req, res, next) => {
  try {
    // Extraction des données du livre à partir du corps de la requête
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;

    // Utilisation de Sharp pour la compression et la conversion en webp de l'image du livre
    const { buffer } = req.file;
    const timestamp = Date.now();
    const fileName = `${timestamp}.webp`;
    const outputPath = `./files/${fileName}`;

    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile(outputPath);

    // Création d'une nouvelle instance de Book avec les données du livre et l'URL de l'image
    const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get('host')}/files/${fileName}`
    });

    // Sauvegarde du livre dans la base de données
    await book.save();

    res.status(201).json({ message: 'Livre enregistré !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fonction pour récupérer un livre par son identifiant
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

// Fonction pour modifier les informations d'un livre
exports.modifyBook = (req, res, next) => {
  // Extraction des données du livre à partir du corps de la requête
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  } : { ...req.body };

  // Vérification de l'autorisation de modification
  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              // Mise à jour des informations du livre dans la base de données
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// Fonction pour ajouter une note à un livre
exports.addRating = (req, res, next) => {
  // Création d'un nouvel objet de note avec l'identifiant de l'utilisateur et la note fournie
  const newRating = {
    userId: req.auth.userId,
    grade: req.body.rating,
};

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(404).json({ message: 'Livre non trouvé' });
      } else {
        // Ajout de la nouvelle note au tableau de notes du livre
        book.ratings.push(newRating);

        // Calcul de la nouvelle moyenne des notes
        const totalRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
        book.averageRating = totalRating / book.ratings.length;

        // Sauvegarde des modifications dans la base de données
        book.save()
          .then(() => res.status(200).json({ message: 'Note ajoutée!' }))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          // Vérification de l'autorisation de suppression
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              // Suppression du fichier image associé et du livre dans la base de données
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// Fonction pour récupérer tous les livres
exports.getAllStuff = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// Fonction pour récupérer les trois livres les mieux notés
exports.bestRatedBooks = (req, res, next) => {
  // Utilisation de la méthode find() pour récupérer tous les livres dans la base de données
  // Ensuite, la méthode sort() est utilisée pour trier les livres en fonction de la propriété averageRating de manière décroissante
  // Enfin, la méthode limit(3) est utilisée pour limiter les résultats à trois livres
  Book.find().sort({ averageRating: 'desc' }).limit(3).then(
    // Succès de la requête
    (books) => {
      // Réponse avec un statut 200 et le tableau des trois livres les mieux notés
      res.status(200).json(books);
    }
  ).catch(
    // Gestion des erreurs
    (error) => {
      // Réponse avec un statut 400 et un objet JSON contenant l'erreur
      res.status(400).json({
        error: error
      });
    }
  );
};