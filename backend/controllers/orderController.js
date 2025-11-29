const db = require('../utils/db');

async function createOrder(req, res, next) {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Not authenticated' });
    const userId = req.user.id;
    const { total = 0 } = req.body;
    const [result] = await db.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [userId, total]);
    res.status(201).json({ id: result.insertId, user_id: userId, total, status: 'pending' });
  } catch (err) { next(err); }
}

async function listMyOrders(req, res, next) {
  try {
    const userId = req.user.id;
    const [rows] = await db.query('SELECT id, user_id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
  } catch (err) { next(err); }
}

module.exports = { createOrder, listMyOrders };