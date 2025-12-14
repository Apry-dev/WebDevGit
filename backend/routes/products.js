const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// ===============================
// MULTER CONFIG
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// ===============================
// ROUTES
// ===============================

// PUBLIC
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// ARTISAN ONLY
router.post('/', auth, upload.single('image'), ctrl.create);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
