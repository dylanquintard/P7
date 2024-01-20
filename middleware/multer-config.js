const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPES[file.mimetype];
    let error = isValid ? null : new Error('Invalid file type.');
    callback(error, isValid);
  }
}).single('image');

module.exports = multer({storage: storage}).single('image');