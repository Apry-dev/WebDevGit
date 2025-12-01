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
const Order = require("../models/orderModel");

async function createOrder(req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Not authenticated" });
		}
		
		const { items } = req.body; // items: [{ productId, quantity }]
		if (!items || !Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ message: "items array is required" });
		}
		
		const order = await Order.createOrder(req.user.id, items);
		res.status(201).json(order);
	} catch (e) {
		next(e);
	}
}

async function getMyOrders(req, res, next) {
	try {
		if (!req.user) {
			return res.status(401).json({ message: "Not authenticated" });
		}
		
		const orders = await Order.getUserOrders(req.user.id);
		res.json(orders);
	} catch (e) {
		next(e);
	}
}

module.exports = {
	createOrder,
	getMyOrders
};

