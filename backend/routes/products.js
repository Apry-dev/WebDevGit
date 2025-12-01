const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController'); // <-- ensure this exists
const auth = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// protected actions
router.post('/:id/favourites', auth, ctrl.addFavourite);
router.post('/:id/comments', auth, ctrl.addComment);

// public comments read
router.get('/:id/comments', ctrl.listComments);

module.exports = router;


