const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get("/", userController.list);
router.get("/:id", userController.get);
router.post("/", userController.create);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

// Convenience registration endpoint
router.post("/register", userController.register);

module.exports = router;


