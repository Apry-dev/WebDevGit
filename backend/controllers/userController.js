const User = require('../models/userModel');
const db = require('../utils/db');
const bcrypt = require('bcrypt');

async function list(req, res, next) {
	try {
		const data = await User.getAllUsers();
		res.json(data);
	} catch (e) {
		next(e);
	}
}

async function get(req, res, next) {
	try {
		const item = await User.getUserById(req.params.id);
		if (!item) return res.status(404).json({ message: 'User not found' });
		res.json(item);
	} catch (e) {
		next(e);
	}
}

async function create(req, res, next) {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const existing = await User.getUserByEmail(email);
		if (existing) return res.status(409).json({ message: 'Email already registered' });
		const hashed = await bcrypt.hash(password, 10);
		const created = await User.createUser({ username, email, password: hashed });
		res.status(201).json(created);
	} catch (e) {
		next(e);
	}
}

async function update(req, res, next) {
	try {
		const updated = await User.updateUser(req.params.id, req.body);
		if (!updated) return res.status(404).json({ message: 'User not found' });
		res.json(updated);
	} catch (e) {
		next(e);
	}
}

async function remove(req, res, next) {
	try {
		const ok = await User.deleteUser(req.params.id);
		if (!ok) return res.status(404).json({ message: 'User not found' });
		res.status(204).send();
	} catch (e) {
		next(e);
	}
}

async function register(req, res, next) {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) return res.status(400).json({ message: 'username, email, and password are required' });
		const existing = await User.getUserByEmail(email);
		if (existing) return res.status(409).json({ message: 'Email already registered' });
		const hashed = await bcrypt.hash(password, 10);
		const created = await User.createUser({ username, email, password: hashed });
		res.status(201).json(created);
	} catch (e) {
		next(e);
	}
}

async function getMe(req, res) {
	if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
	const { id, username, email, role } = req.user;
	res.json({ id, username, email, role });
}

async function updateUser(req, res) {
	try {
		if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
		if (Number(req.user.id) !== Number(req.params.id)) return res.status(403).json({ msg: 'Not allowed' });

		const { username, email, password } = req.body;
		const updates = {};
		if (username) updates.username = username;
		if (email) updates.email = email;

		const updated = await User.updateUser(req.params.id, updates);

		if (password) {
			const hashed = await bcrypt.hash(password, 10);
			await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id]);
		}

		const fresh = await User.getUserById(req.params.id);
		res.json(fresh);
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error' });
	}
}

async function deleteUser(req, res) {
	try {
		if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
		if (Number(req.user.id) !== Number(req.params.id)) return res.status(403).json({ msg: 'Not allowed' });
		await User.deleteUser(req.params.id);
		res.json({ msg: 'Deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ msg: 'Server error' });
	}
}

async function getMyFavourites(req, res, next) {
	try {
		if (!req.user || !req.user.id) return res.status(401).json({ msg: 'Not authenticated' });
		const userId = req.user.id;
		const [rows] = await db.query(
			`SELECT a.id, a.name AS title, a.bio AS craft, a.location, a.lat, a.lng, a.icon, f.created_at
			 FROM favourites f
			 JOIN artisans a ON f.artisan_id = a.id
			 WHERE f.user_id = ?
			 ORDER BY f.created_at DESC`, [userId]
		);
		res.json(rows);
	} catch (err) { next(err); }
}

module.exports = {
	list,
	get,
	create,
	update,
	remove,
	register,
	getMe,
	updateUser,
	deleteUser,
	getMyFavourites
};


