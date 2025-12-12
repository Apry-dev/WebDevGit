const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const auth = require('../middleware/auth');

// PUBLIC
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// ARTISAN ONLY
router.post('/', auth, ctrl.create);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
