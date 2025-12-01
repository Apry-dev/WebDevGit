<<<<<<< HEAD
const router = require("express").Router();
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");

// ALL ROUTES ARE PROTECTED - require authentication
router.post("/", auth, orderController.createOrder);
router.get("/my", auth, orderController.getMyOrders);

module.exports = router;

=======
const router = require('express').Router();
const auth = require('../middleware/auth');
const orderCtrl = require('../controllers/orderController');

router.post('/', auth, orderCtrl.createOrder);
router.get('/me', auth, orderCtrl.listMyOrders);

module.exports = router;
>>>>>>> de9d45130569532228cea5ce9f0a9a01a7ac49ce
