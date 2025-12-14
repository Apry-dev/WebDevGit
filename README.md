Project: Tradition Connect
Students: Alexandra Bud, Andrew Carty
Module: Web Development

Description:
TraditionConnect is a full-stack web application designed to support
Romanian artisans by providing a digital platform for showcasing
handcrafted products, managing artisan profiles, and enabling customers
to browse, search, and place orders.

The application separates public and private content, supports user
authentication, artisan dashboards, product management with images,
and order processing, all backed by a persistent MySQL database.

----------------------------------------
SYSTEM REQUIREMENTS
----------------------------------------

Operating System:
- macOS / Linux / Windows

Software:
- Node.js (v18 or later)
- npm (Node Package Manager)
- MySQL Server 8.0+
- MySQL Workbench (optional, recommended)
- Web Browser (Chrome, Firefox, Safari)


----------------------------------------
DATABASE CONFIGURATION
----------------------------------------

Database Name:
traditionconnect

Database Dump Location:
database/

The database dump contains:
- Database schema
- Tables for users, artisans, products, orders, favourites, etc
- Sample data for testing


----------------------------------------
DATABASE SETUP INSTRUCTIONS
----------------------------------------

1. Start MySQL Server.

2. Open MySQL Workbench.

3. Create a new database:
   CREATE DATABASE tradition_connect;

4. Import the database dump:
   - Open the database folder
   - Run the provided SQL script

Alternatively, using terminal:

mysql -u YOUR_USERNAME -p traditionconnect < database_dump.sql


----------------------------------------
APPLICATION CONFIGURATION
----------------------------------------

Create a `.env` file in the project root based on `env.example`.

Required environment variables:

HOST=127.0.0.1
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_NAME=tradition_connect
DB_USER=YOUR_MYSQL_USERNAME
DB_PASSWORD=YOUR_MYSQL_PASSWORD

JWT_SECRET=your_secret_key


----------------------------------------
APPLICATION INSTALLATION
----------------------------------------

1. Extract the project files.

2. Navigate to the backend directory:

   cd backend

3. Install dependencies:

   npm install
   install cookies dependencies

----------------------------------------
RUNNING THE APPLICATION
----------------------------------------

1. Start the backend server:

   node server.js

2. The application will be available at:

   http://127.0.0.1:3001

3. The frontend is served statically by the backend and can be accessed
   directly through the browser.


----------------------------------------
FILE UPLOADS
----------------------------------------

Uploaded product images are stored on the server at:

backend/uploads/products/

This directory is managed automatically by the application.


----------------------------------------
TESTING
----------------------------------------

Testing can be performed manually through the browser by:
- Registering and logging in users
- Creating artisan accounts
- Adding products
- Adding Favourites Crafts
- Viewing and placing orders
- Verifying database changes via MySQL


----------------------------------------
KNOWN ISSUES
----------------------------------------

None known at the time of submission.
