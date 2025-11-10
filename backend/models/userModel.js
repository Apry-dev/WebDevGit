const db = require("../utils/db");

async function getAllUsers() {
	const [rows] = await db.query("SELECT id, username, email, role FROM users ORDER BY id DESC");
	return rows;
}

async function getUserById(id) {
	const [rows] = await db.query("SELECT id, username, email, role FROM users WHERE id = ?", [id]);
	return rows[0] || null;
}

async function getUserByEmail(email) {
	const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
	return rows[0] || null;
}

async function createUser(user) {
	const { username, email, password, role } = user;
	const [result] = await db.query(
		"INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
		[username, email, password, role || "user"]
	);
	return { id: result.insertId, username, email, role: role || "user" };
}

async function updateUser(id, updates) {
	const existing = await getUserById(id);
	if (!existing) return null;
	const username = updates.username ?? existing.username;
	const email = updates.email ?? existing.email;
	const role = updates.role ?? existing.role;
	await db.query("UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?", [username, email, role, id]);
	return { id: Number(id), username, email, role };
}

async function deleteUser(id) {
	const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
	return result.affectedRows > 0;
}

module.exports = {
	getAllUsers,
	getUserById,
	getUserByEmail,
	createUser,
	updateUser,
	deleteUser
};


