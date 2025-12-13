console.log("🔥🔥 DB.JS LOADED FROM UTILS FOLDER 🔥🔥");

const mysql = require('mysql2/promise');

console.log(
  "ENV USED:",
  process.env.DB_HOST,
  process.env.DB_USER,
  process.env.DB_NAME
);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306
});

module.exports = pool;
