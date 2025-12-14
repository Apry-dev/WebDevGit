// routes/orders.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

// USER ROUTES
router.post('/', auth, ctrl.createOrder);
router.get('/me', auth, ctrl.listMyOrders);
router.put('/:id/cancel', auth, ctrl.cancelOrder);

// ARTISAN ROUTES
router.get('/artisan', auth, ctrl.listArtisanOrders);
router.put('/:id', auth, ctrl.updateOrderStatus);

module.exports = router;
