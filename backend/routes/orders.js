const router = require("express").Router();
const auth = require("../middleware/auth");
const orderController = require("../controllers/orderController");

// ALL ROUTES ARE PROTECTED - require authentication
router.post("/", auth, orderController.createOrder);
router.get("/my", auth, orderController.getMyOrders);

module.exports = router;

