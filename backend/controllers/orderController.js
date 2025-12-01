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

