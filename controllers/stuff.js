const Book = require('../models/book');
const sharp = require('sharp');

const fs = require('fs');

exports.createBook = async (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;

    // Utilisation de Sharp pour la compression et la conversion en webp
    const { buffer } = req.file;
    const timestamp = Date.now();
    const fileName = `${timestamp}.webp`;
    const outputPath = `./files/${fileName}`;

    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile(outputPath);

    const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get('host')}/files/${fileName}`
    });

    await book.save();

    res.status(201).json({ message: 'Livre enregistré !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.addRating = (req, res, next) => {
  const newRating = {
    userId: req.auth.userId,
    grade: req.body.rating,
  };

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        res.status(404).json({ message: 'Livre non trouvé' });
      } else {
        book.ratings.push(newRating);

        const totalRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
        book.averageRating = totalRating / book.ratings.length;

        book.save()
          .then(() => res.status(200).json({ message: 'Note ajoutée!' }))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
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

exports.bestRatedBooks = (req, res, next) => {
  Book.find().sort({ averageRating: 'desc' }).limit(3).then(
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