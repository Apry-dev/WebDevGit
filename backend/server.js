const express = require("express");
const db = require("./utils/db");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Necesare pentru a folosi __dirname cu module type: "module"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to measure execution time of a DB query
async function measureDbExecTime(query) {
    const start = Date.now();
    const result = await db.execute(query);
    const execTime = (Date.now() - start).toFixed(3); // ms, 3 significant digits
    return { result, execTime };
}

// Routes
app.use('/src', express.static(path.join(__dirname, '../frontend/src')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/public/assets')));
app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});
console.log("🚀 Serving static files from /src and /assets");

// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        const { execTime } = await measureDbExecTime('SELECT 1');
        res.json({
            status: "healthy",
            database: "connected",
            timestamp: new Date().toISOString(),
            execTime: execTime // in milliseconds
        });
    } catch (error) {
        res.status(500).json({
            status: "unhealthy",
            database: "disconnected",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.get("/artisans", async (req, res) => {
    try {
        const { result, execTime } = await measureDbExecTime('SELECT * FROM artisans');
        const [rows] = result;
        res.json({
            status: "success",
            users: rows,
            timestamp: new Date().toISOString(),
            location: "backend/server.js:get(/artisans)",
            execTime: execTime
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/products", async (req, res) => {
    try {
        const { result, execTime } = await measureDbExecTime('SELECT * FROM products');
        const [rows] = result;
        res.json({
            status: "success",
            products: rows,
            timestamp: new Date().toISOString(),
            location: "backend/server.js:get(/products)",
            execTime: execTime
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
