// server.js — Express API + static frontend serving
require('dotenv').config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "127.0.0.1";

// ===============================
// CORE MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// STATIC FRONTEND
// ===============================
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

// ===============================
// API ROUTES (ORDER MATTERS)
// ===============================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/artisans", require("./routes/artisans"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders")); // ✅ FIXED LOCATION

// ===============================
// LEGACY SUPPORT
// ===============================
try {
  const userCtrl = require("./controllers/userController");
  app.post("/register", userCtrl.register);
} catch (err) {
  // Optional controller — do not crash
}

// ===============================
// API 404 — MUST BE LAST
// ===============================
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ API ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// ===============================
// SAFE PORT BINDING
// ===============================
function listenWithRetry(startPort, maxAttempts = 5) {
  let attempts = 0;
  let port = startPort;

  function tryListen() {
    const server = app.listen(port, HOST, () => {
      console.log(`✅ Server running at http://${HOST}:${port}`);
    });

    server.on("error", (err) => {
      if ((err.code === "EADDRINUSE" || err.code === "EACCES") && attempts < maxAttempts) {
        attempts++;
        port++;
        console.warn(`⚠️ Port busy, retrying on ${port}...`);
        setTimeout(tryListen, 100);
      } else {
        console.error("❌ Server failed:", err);
        process.exit(1);
      }
    });
  }

  tryListen();
}

listenWithRetry(PORT);
