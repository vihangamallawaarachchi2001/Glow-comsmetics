# imalsha

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## Description
imalsha is a modern backend API built with:
- **Express.js** 
- **MongoDB** database integration
- JWT Authentication
- Winston/Morgan logging

## Features
- RESTful API endpoints
- Database integration
- JWT Authentication
- Structured logging
- Environment variables
- Security headers (Helmet)
- CORS handling
- Cookie parsing
- Error handling middleware

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB server
- npm package manager

### Installation
```bash
# Navigate to project directory
cd imalsha

# Install dependencies
npm install (already installed on setup)
```

### Configuration
Create a `.env` file with:
```env
PORT=3000
NODE_ENV=development
DB_URL=mongodb://localhost:27017/mydb
JWT_SECRET=your-secret-key
```

## Usage
```bash
# Start development server
npm run dev

# Production build 
npm build
```

## Authentication
```bash
# Register new user
curl -X POST -H "Content-Type: application/json" \
-d '{ "username": "user", "email": "user@example.com", "password": "pass123" }' \
http://localhost:3000/api/register

# Login
curl -X POST -H "Content-Type: application/json" \
-d '{ "email": "user@example.com", "password": "pass123" }' \
http://localhost:3000/api/login
```


## API Documentation
```
GET /health - Health check
GET /api/users - Get all users (protected)
GET /api/users/:id - Get user by ID
PUT /api/users/:id - Update user
DELETE /api/users/:id - Delete user
```

## Project Structure
```
src/
├── config/        # Database configuration
├── controllers/   # Request handlers
├── middleware/    # Authentication middleware
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── utils/         # Logger utilities
└── server.js  # Entry point
```

## Technologies
- Express.js

- Mongoose

- Winston/Morgan logging
- Helmet security
- CORS
- Cookie-parser
- Dotenv

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details