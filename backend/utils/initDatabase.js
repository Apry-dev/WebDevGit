const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class DatabaseInitializer {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            // Connect without specifying database first
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || 'Andrewc817!',
                port: process.env.DB_PORT || 3306,
                multipleStatements: true
            });

            console.log('Connected to MySQL server');
            return true;
        } catch (error) {
            console.error('Failed to connect to MySQL:', error);
            return false;
        }
    }

    async createDatabase() {
        try {
            const dbName = process.env.DB_NAME || 'traditionconnect';
            
            const [rows] = await this.connection.promise().query(
                `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
                [dbName]
            );

            if (rows.length === 0) {
                await this.connection.promise().query(`CREATE DATABASE ${dbName}`);
                console.log(`Database '${dbName}' created successfully`);
            } else {
                console.log(`Database '${dbName}' already exists`);
            }

            await this.connection.promise().query(`USE ${dbName}`);
            console.log(`Using database '${dbName}'`);
            
            return true;
        } catch (error) {
            console.error('Error creating database:', error);
            return false;
        }
    }

    async runSchemaFile(filePath) {
        try {
            const projectRoot = path.join(__dirname, '..', '..');
            const schemaPath = path.join(projectRoot, 'database', filePath);
            
            if (!fs.existsSync(schemaPath)) {
                console.log(`Schema file ${filePath} not found`);
                return false;
            }

            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            const statements = schema
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

            for (const statement of statements) {
                if (statement.toLowerCase().includes('create database')) {
                    continue; // Skip database creation as it's handled separately
                }
                
                try {
                    await this.connection.promise().query(statement);
                    console.log(`✓ Executed: ${statement.substring(0, 50)}...`);
                } catch (error) {
                    console.error(`✗ Failed to execute: ${statement.substring(0, 50)}...`);
                    console.error(`Error: ${error.message}`);
                }
            }

            return true;
        } catch (error) {
            console.error('Error running schema file:', error);
            return false;
        }
    }

    async seedDatabase() {
        try {
            const sampleData = [
                {
                    table: 'artisans',
                    data: [
                        { name: 'John Smith', location: 'New York', bio: 'Master craftsman specializing in woodwork' },
                        { name: 'Maria Garcia', location: 'California', bio: 'Traditional pottery artist' }
                    ]
                },
                {
                    table: 'products',
                    data: [
                        { name: 'Handcrafted Bowl', category: 'Pottery', price: 45.99, artisan_id: 1, description: 'Beautiful ceramic bowl' },
                        { name: 'Wooden Chair', category: 'Furniture', price: 199.99, artisan_id: 1, description: 'Hand-carved oak chair' }
                    ]
                }
            ];

            for (const { table, data } of sampleData) {
                for (const record of data) {
                    try {
                        const columns = Object.keys(record).join(', ');
                        const values = Object.values(record);
                        const placeholders = values.map(() => '?').join(', ');
                        
                        await this.connection.promise().query(
                            `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
                            values
                        );
                        console.log(`✓ Inserted into ${table}: ${record.name || record.id}`);
                    } catch (error) {
                        console.log(`⚠ Skipped duplicate in ${table}: ${record.name || record.id}`);
                    }
                }
            }

            return true;
        } catch (error) {
            console.error('Error seeding database:', error);
            return false;
        }
    }

    async initialize() {
        console.log('🚀 Starting database initialization...\n');

        // Step 1: Connect to MySQL
        const connected = await this.connect();
        if (!connected) {
            console.error('❌ Failed to connect to MySQL server');
            return false;
        }

        // Step 2: Create database
        const dbCreated = await this.createDatabase();
        if (!dbCreated) {
            console.error('❌ Failed to create database');
            return false;
        }

        // Step 3: Run schema
        console.log('\n📋 Running database schema...');
        const schemaRun = await this.runSchemaFile('init.sql');
        if (!schemaRun) {
            console.error('❌ Failed to run schema');
            return false;
        }

        // Step 4: Seed with sample data
        console.log('\n🌱 Seeding database with sample data...');
        const seeded = await this.seedDatabase();
        if (!seeded) {
            console.warn('⚠ Warning: Failed to seed database');
        }

        console.log('\n✅ Database initialization completed successfully!');
        return true;
    }

    async close() {
        if (this.connection) {
            await this.connection.promise().end();
            console.log('Database connection closed');
        }
    }
}

if (require.main === module) {
    const initializer = new DatabaseInitializer();
    
    initializer.initialize()
        .then(success => {
            if (success) {
                console.log('\n🎉 Database is ready to use!');
            } else {
                console.log('\n💥 Database initialization failed');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Unexpected error:', error);
            process.exit(1);
        })
        .finally(() => {
            initializer.close();
        });
}

module.exports = DatabaseInitializer;
