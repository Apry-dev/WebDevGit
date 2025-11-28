console.log("🔥🔥 DB.JS LOADED FROM UTILS FOLDER 🔥🔥");
console.log("ENV USED:", process.env.DB_USER, process.env.DB_PASSWORD);

const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306   // <-- use DB_PORT
});

console.log("USING ENV:", process.env.DB_USER, process.env.DB_PASSWORD);

module.exports = pool.promise();
