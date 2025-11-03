const express = require("express");
const db = require("./utils/db");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
async function testConnection() {
    try {
        await db.execute('SELECT 1');
        console.log("✅ Connected to MySQL database!");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        console.log("💡 Make sure to run 'npm run init-db' first");
    }
}

// Test connection on startup
testConnection();

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
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
