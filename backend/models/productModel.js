const db = require("../utils/db");

async function getAllProducts() {
	const [rows] = await db.query(
		"SELECT p.*, a.name AS artisan_name FROM products p LEFT JOIN artisans a ON p.artisan_id = a.id ORDER BY p.id DESC"
	);
	return rows;
}

async function getProductById(id) {
	const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
	return rows[0] || null;
}

async function createProduct(product) {
	const { name, category, price, artisan_id, description } = product;
	const [result] = await db.query(
		"INSERT INTO products (name, category, price, artisan_id, description) VALUES (?, ?, ?, ?, ?)",
		[name, category || null, price || null, artisan_id || null, description || null]
	);
	return { id: result.insertId, name, category: category || null, price: price || null, artisan_id: artisan_id || null, description: description || null };
}

async function updateProduct(id, product) {
	const existing = await getProductById(id);
	if (!existing) return null;
	const name = product.name ?? existing.name;
	const category = product.category ?? existing.category;
	const price = product.price ?? existing.price;
	const artisan_id = product.artisan_id ?? existing.artisan_id;
	const description = product.description ?? existing.description;
	await db.query(
		"UPDATE products SET name = ?, category = ?, price = ?, artisan_id = ?, description = ? WHERE id = ?",
		[name, category, price, artisan_id, description, id]
	);
	return { id: Number(id), name, category, price, artisan_id, description };
}

async function deleteProduct(id) {
	const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
	return result.affectedRows > 0;
}

module.exports = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct
};


