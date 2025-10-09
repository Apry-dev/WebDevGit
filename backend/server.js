import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

const app = express();

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
    console.error("Database connection failed:", err);
    } else {
    console.log("Connected to MySQL database!");
    }
});

app.get("/", (req, res) => {
    res.send("TraditionConnect backend is running!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
