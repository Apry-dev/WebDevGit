const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // asigură-te că exportă o funcție (req,res,next)
const userController = require('../controllers/userController');

router.get('/', userController.list);
router.get('/:id', userController.get);
router.post('/', userController.create);

// dacă vrei update protejat:
router.put('/:id', auth, userController.updateUser); // sau userController.update dacă e admin
router.delete('/:id', auth, userController.deleteUser);
router.get('/me/favourites', auth, userController.getMyFavourites);

module.exports = router;


