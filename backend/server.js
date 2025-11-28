// server.js — Express API + static serving
require('dotenv').config();
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "127.0.0.1";

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static frontend (kept as-is)
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});
app.get("/pottery", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/public/pottery.html"));
});
app.get("/sewing", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/public/sewing.html"));
});
app.get("/weaving", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/public/weaving.html"));
});
app.get("/woodcraft", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/public/woodcraft.html"));
});

// API routes
app.use("/api/artisans", require("./routes/artisans"));
app.use("/api/products", require("./routes/products"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

// Backward compatibility for existing frontend form posting to /register
try {
	const userCtrl = require("./controllers/userController");
	app.post("/register", userCtrl.register);
} catch (e) {
	// controller missing should not crash server
}
// Global 404 for API
app.use("/api", (req, res) => {
	res.status(404).json({ message: "Not found" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({
		message: err.message || "Internal Server Error"
	});
});

function listenWithRetry(startPort, maxAttempts = 5) {
	let attempts = 0;
	let port = startPort;

	function tryListen() {
		const server = app.listen(port, HOST, () => {
			console.log(`✅ Server running at http://${HOST}:${port}`);
		});

		server.on("error", (err) => {
			if ((err.code === "EACCES" || err.code === "EADDRINUSE") && attempts < maxAttempts) {
				attempts += 1;
				port += 1;
				console.warn(`⚠️  Port ${port - 1} unavailable (${err.code}). Retrying on ${port}...`);
				setTimeout(tryListen, 100);
			} else if (attempts >= maxAttempts) {
				console.warn("⚠️  Max retries reached. Falling back to an ephemeral port.");
				const fallback = app.listen(0, HOST, () => {
					const addr = fallback.address();
					console.log(`✅ Server running at http://${HOST}:${addr.port}`);
				});
				fallback.on("error", (e) => {
					console.error("❌ Failed to bind to any port:", e);
					process.exit(1);
				});
			} else {
				console.error("❌ Server failed to start:", err);
				process.exit(1);
			}
		});
	}

	tryListen();
}

listenWithRetry(PORT);