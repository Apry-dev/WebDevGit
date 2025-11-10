const Product = require("../models/productModel");

async function list(req, res, next) {
	try {
		const data = await Product.getAllProducts();
		res.json(data);
	} catch (e) {
		next(e);
	}
}

async function get(req, res, next) {
	try {
		const item = await Product.getProductById(req.params.id);
		if (!item) return res.status(404).json({ message: "Product not found" });
		res.json(item);
	} catch (e) {
		next(e);
	}
}

async function create(req, res, next) {
	try {
		const created = await Product.createProduct(req.body);
		res.status(201).json(created);
	} catch (e) {
		next(e);
	}
}

async function update(req, res, next) {
	try {
		const updated = await Product.updateProduct(req.params.id, req.body);
		if (!updated) return res.status(404).json({ message: "Product not found" });
		res.json(updated);
	} catch (e) {
		next(e);
	}
}

async function remove(req, res, next) {
	try {
		const ok = await Product.deleteProduct(req.params.id);
		if (!ok) return res.status(404).json({ message: "Product not found" });
		res.status(204).send();
	} catch (e) {
		next(e);
	}
}

module.exports = { list, get, create, update, remove };


