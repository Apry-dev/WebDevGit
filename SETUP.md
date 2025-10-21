# WebDevGit - Backend Database Setup

## Current Status: Database Setup Complete ✅

This commit includes the basic database setup for the TraditionConnect backend.

### What's Included:
- Database connection utility (`backend/utils/db.js`)
- Database schema (`database/init.sql`)
- Database setup script (`setup-db.js`)
- Database test script (`test-db.js`)
- Updated package.json with database scripts

### Next Steps:
1. Create `.env` file with your MySQL credentials
2. Run `npm run setup-db` to create database and tables
3. Run `npm run test-db` to verify connection
4. Run `npm start` to start the server

### Database Schema:
- `users` table for user accounts
- `artisans` table for craft makers
- `products` table for items sold

### Available Commands:
- `npm run setup-db` - Create database and tables
- `npm run test-db` - Test database connection
- `npm start` - Start the server
