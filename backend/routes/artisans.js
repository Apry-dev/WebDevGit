const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const artisanController = require('../controllers/artisanController');

// public list
router.get('/', artisanController.list);

// create — protected
router.post('/', auth, artisanController.create);

// optional: get single artisan
router.get('/:id', artisanController.get);

module.exports = router;


