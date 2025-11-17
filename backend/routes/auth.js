const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../utils/db");
const auth = require('../middleware/auth');
const userController = require('../controllers/userController'); // create/adjust

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ msg: "name, email and password are required" });
		}

		const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
		if (existing.length > 0) {
			return res.status(400).json({ msg: "Email already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await db.query(
			"INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
			[name, email, hashedPassword]
		);

		return res.status(201).json({ msg: "User registered successfully" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: "Server error" });
	}
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ msg: "email and password are required" });
		}

		const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
		if (rows.length === 0) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}
		const user = rows[0];

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ msg: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET || "secret",
			{ expiresIn: "2h" }
		);

		return res.json({
			msg: "Login successful",
			token,
			user: { id: user.id, name: user.username, email: user.email }
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: "Server error" });
	}
});

// POST /api/auth/forgot-password (demo)
router.post("/forgot-password", async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) return res.status(400).json({ msg: "email is required" });
		const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
		if (rows.length === 0) {
			return res.status(404).json({ msg: "Email not found" });
		}
		return res.json({ msg: "Password reset link sent to email (demo)" });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ msg: "Server error" });
	}
});

router.get('/me', auth, userController.getMe);

module.exports = router;


