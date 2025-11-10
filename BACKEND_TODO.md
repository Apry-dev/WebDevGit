# Backend Development Todo List - WebDevGit Project

## Overview

This document outlines the complete backend development plan for the TraditionConnect WebDevGit project. The tasks are organized into 7 logical commits to demonstrate progressive development for your lecturer.

## Current Status

✅ Database setup complete (users, artisans, products tables)
✅ Basic Express server with health check endpoint
✅ Database connection utility
✅ Package.json with required dependencies

## Commit Plan

### Commit 1: Environment & Basic Setup

**Goal**: Complete environment configuration and enable frontend communication

**Tasks:**

- [ ] Create `.env` file with database credentials and test connection
- [ ] Add CORS middleware for frontend communication
- [ ] Test database connection with new environment variables

**Files to modify:**

- Create `.env` (from `env.example`)
- Update `backend/server.js` to include CORS middleware
- Test with `npm run test-db`

---

### Commit 2: User Authentication System

**Goal**: Implement user registration and login functionality

**Tasks:**

- [ ] Create user authentication routes (register, login, profile)
- [ ] Implement password hashing for user registration/login
- [ ] Add bcrypt dependency for password security

**Files to create/modify:**

- `backend/routes/auth.js` - Authentication routes
- `backend/controllers/authController.js` - Authentication logic
- `backend/middleware/auth.js` - Authentication middleware
- Update `package.json` with bcrypt dependency

---

### Commit 3: Artisan Management

**Goal**: Create CRUD operations for artisan management

**Tasks:**

- [ ] Create artisan CRUD routes (create, read, update, delete)
- [ ] Implement artisan controller with database operations
- [ ] Add input validation for artisan data

**Files to create:**

- `backend/routes/artisans.js` - Artisan routes
- `backend/controllers/artisanController.js` - Artisan business logic
- `backend/models/Artisan.js` - Artisan data model

---

### Commit 4: Product Management

**Goal**: Implement product management with artisan relationships

**Tasks:**

- [ ] Create product CRUD routes with artisan relationships
- [ ] Implement product controller with foreign key handling
- [ ] Add product validation and error handling

**Files to create:**

- `backend/routes/products.js` - Product routes
- `backend/controllers/productController.js` - Product business logic
- `backend/models/Product.js` - Product data model

---

### Commit 5: Security & Validation

**Goal**: Add security measures and input validation

**Tasks:**

- [ ] Add JWT authentication middleware for protected routes
- [ ] Add input validation middleware for all routes
- [ ] Implement rate limiting for API endpoints

**Files to create/modify:**

- `backend/middleware/validation.js` - Input validation
- `backend/middleware/jwtAuth.js` - JWT authentication
- `backend/middleware/rateLimiter.js` - Rate limiting
- Update `package.json` with JWT and validation dependencies

---

### Commit 6: Error Handling & Documentation

**Goal**: Implement robust error handling and API documentation

**Tasks:**

- [ ] Implement centralized error handling middleware
- [ ] Create API documentation with endpoint descriptions
- [ ] Add logging for debugging and monitoring

**Files to create:**

- `backend/middleware/errorHandler.js` - Centralized error handling
- `API_DOCUMENTATION.md` - Complete API documentation
- `backend/utils/logger.js` - Logging utility

---

### Commit 7: Testing & Integration

**Goal**: Set up testing framework and ensure frontend integration

**Tasks:**

- [ ] Set up backend testing framework and write unit tests
- [ ] Test API endpoints with frontend and fix any integration issues
- [ ] Add integration tests for complete user flows

**Files to create:**

- `tests/backend/auth.test.js` - Authentication tests
- `tests/backend/artisans.test.js` - Artisan CRUD tests
- `tests/backend/products.test.js` - Product CRUD tests
- Update `package.json` with testing dependencies (Jest, Supertest)

---

## Dependencies to Add

```json
{
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "express-validator": "^7.0.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.7.0",
  "jest": "^29.0.0",
  "supertest": "^6.3.0"
}
```

## Testing Commands

```bash
# Test database connection
npm run test-db

# Start development server
npm start

# Run tests (after Commit 7)
npm test

# Run tests in watch mode
npm run test:watch
```

## API Endpoints Overview

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Artisans

- `GET /api/artisans` - Get all artisans
- `GET /api/artisans/:id` - Get specific artisan
- `POST /api/artisans` - Create artisan (protected)
- `PUT /api/artisans/:id` - Update artisan (protected)
- `DELETE /api/artisans/:id` - Delete artisan (protected)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `GET /api/artisans/:id/products` - Get products by artisan
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

## Notes for Lecturer

Each commit represents a logical progression in backend development:

1. **Environment Setup** - Basic configuration and CORS
2. **Authentication** - User management and security
3. **Core CRUD** - Artisan management
4. **Relationships** - Product management with foreign keys
5. **Security** - JWT, validation, and rate limiting
6. **Robustness** - Error handling and documentation
7. **Quality** - Testing and integration

This demonstrates understanding of:

- RESTful API design
- Database relationships
- Security best practices
- Error handling
- Testing methodologies
- Progressive development approach
