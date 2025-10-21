// Simple database setup script
// Run this to test your database connection

const mysql = require('mysql2');
require('dotenv').config();

async function testDatabaseConnection() {
    console.log('🔍 Testing database connection...');
    
    // Create connection
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'traditionconnect'
    });

    try {
        // Test connection
        await connection.promise().query('SELECT 1');
        console.log('✅ Database connection successful!');
        
        // Test if database exists
        const [rows] = await connection.promise().query('SHOW DATABASES LIKE ?', ['traditionconnect']);
        if (rows.length > 0) {
            console.log('✅ Database "traditionconnect" exists');
        } else {
            console.log('⚠️  Database "traditionconnect" does not exist');
            console.log('💡 You may need to create it manually or run the SQL schema');
        }
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('💡 Make sure MySQL is running and check your .env file');
    } finally {
        connection.end();
    }
}

// Run the test
testDatabaseConnection();
