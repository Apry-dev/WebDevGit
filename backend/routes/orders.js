const router = require('express').Router();
const auth = require('../middleware/auth');
const orderCtrl = require('../controllers/orderController');

router.post('/', auth, orderCtrl.createOrder);
router.get('/me', auth, orderCtrl.listMyOrders);

module.exports = router;