const Users = require("../models/userModel");

async function list(req, res, next) {
	try {
		const data = await Users.getAllUsers();
		res.json(data);
	} catch (e) {
		next(e);
	}
}

async function get(req, res, next) {
	try {
		const item = await Users.getUserById(req.params.id);
		if (!item) return res.status(404).json({ message: "User not found" });
		res.json(item);
	} catch (e) {
		next(e);
	}
}

async function create(req, res, next) {
	try {
		const created = await Users.createUser(req.body);
		res.status(201).json(created);
	} catch (e) {
		next(e);
	}
}

async function update(req, res, next) {
	try {
		const updated = await Users.updateUser(req.params.id, req.body);
		if (!updated) return res.status(404).json({ message: "User not found" });
		res.json(updated);
	} catch (e) {
		next(e);
	}
}

async function remove(req, res, next) {
	try {
		const ok = await Users.deleteUser(req.params.id);
		if (!ok) return res.status(404).json({ message: "User not found" });
		res.status(204).send();
	} catch (e) {
		next(e);
	}
}

async function register(req, res, next) {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({ message: "username, email, and password are required" });
		}
		const existing = await Users.getUserByEmail(email);
		if (existing) {
			return res.status(409).json({ message: "Email already registered" });
		}
		const created = await Users.createUser({ username, email, password });
		res.status(201).json(created);
	} catch (e) {
		next(e);
	}
}

module.exports = { list, get, create, update, remove, register };


