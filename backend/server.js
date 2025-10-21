const express = require("express");
const db = require("./utils/db");
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

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "TraditionConnect backend is running!",
        status: "success",
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get("/health", async (req, res) => {
    try {
        await db.execute('SELECT 1');
        res.json({
            status: "healthy",
            database: "connected",
            timestamp: new Date().toISOString()
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
