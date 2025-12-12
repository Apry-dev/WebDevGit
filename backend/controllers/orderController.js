// controllers/orderController.js
const db = require('../utils/db');

/* ===============================
   CREATE ORDER
   POST /api/orders
================================ */
async function createOrder(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: 'productId is required' });
    }

    // Fetch product price
    const [products] = await db.query(
      'SELECT price FROM products WHERE id = ?',
      [productId]
    );

    if (!products.length) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const price = Number(products[0].price);
    const qty = Number(quantity);
    const total = price * qty;

    // Create order
    const [orderRes] = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [req.user.id, total, 'pending']
    );

    const orderId = orderRes.insertId;

    // Create order item
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity)
       VALUES (?, ?, ?)`,
      [orderId, productId, qty]
    );

    res.status(201).json({
      id: orderId,
      total,
      status: 'pending'
    });
  } catch (err) {
    next(err);
  }
}

/* ===============================
   LIST MY ORDERS (ACTIVE ONLY)
   GET /api/orders/me
================================ */
async function listMyOrders(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const [rows] = await db.query(
      `
      SELECT 
        o.id,
        o.total,
        o.status,
        o.created_at,
        p.name AS product_name,
        oi.quantity,
        a.name AS artisan_name
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN artisans a ON p.artisan_id = a.id
      WHERE o.user_id = ?
        AND o.status != 'cancelled'
      ORDER BY o.created_at DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
}

/* ===============================
   CANCEL ORDER (USER)
   PUT /api/orders/:id/cancel
================================ */
async function cancelOrder(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'Not authenticated' });
    }

    const orderId = req.params.id;

    // Ensure order belongs to user and is cancellable
    const [orders] = await db.query(
      'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (!orders.length) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (orders[0].status !== 'pending') {
      return res.status(400).json({ msg: 'Order cannot be cancelled' });
    }

    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['cancelled', orderId]
    );

    res.json({ msg: 'Order cancelled' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  listMyOrders,
  cancelOrder
};
