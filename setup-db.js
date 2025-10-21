// Simple database setup script
// This will create the database and tables from init.sql

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🚀 Setting up database...');
    
    // First, connect without specifying database
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true
    });

    try {
        // Read the SQL file
        const sqlPath = path.join(__dirname, '..', 'database', 'init.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('📋 Running SQL schema...');
        
        // Execute the SQL
        await connection.promise().query(sqlContent);
        
        console.log('✅ Database setup completed successfully!');
        console.log('💡 You can now start your server with: npm start');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        console.log('💡 Make sure MySQL is running and check your .env file');
    } finally {
        connection.end();
    }
}

// Run setup
setupDatabase();
