const Book = require('../models/book');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  const book = new Book({
      ...bookObject,
      imageUrl: `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  });

  book.save()
      .then(() => {
          res.status(201).json({ message: 'Livre enregistré !' });
      })
      .catch(error => {
          res.status(400).json({ error });
      });
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
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    year: req.body.year,
    genre: req.body.genre,
    rating: req.body.rating,
    imageUrl: req.body.imageUrl,
    userId: req.body.userId
  });
  Book.updateOne({_id: req.params.id}, book).then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
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