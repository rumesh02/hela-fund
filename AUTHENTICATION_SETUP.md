# Hela Fund Authentication System

## Overview

This document describes the complete authentication system implementation for Hela Fund, including MongoDB schema, password hashing, JWT tokens, and role-based access control.

## Backend Implementation

### 1. User Model (MongoDB Schema)

**Location:** `backend/models/User.model.js`

The User schema includes:

- **Personal Information:** name, email, phone, avatar, bio, location
- **Authentication:** password (hashed using bcryptjs), email verification
- **Role Management:** role field (requester, supporter, or both)
- **Statistics:** totalContributions, totalRequests

**Password Security:**

- Passwords are automatically hashed using bcryptjs before saving (pre-save hook)
- Salt rounds: 10
- Password minimum length: 6 characters
- Password field is excluded from queries by default (select: false)

**Methods:**

- `matchPassword(enteredPassword)`: Compares entered password with hashed password

### 2. Authentication Controller

**Location:** `backend/controllers/auth.controller.js`

#### Endpoints:

**POST /api/auth/register**

- Creates new user account
- Validates input using express-validator
- Checks for existing email
- Hashes password automatically via model hook
- Returns user data and JWT token

**POST /api/auth/login**

- Authenticates user credentials
- Verifies email and password
- **Role Verification:** Checks if user has the requested role
  - Users with role 'both' can log in as either requester or supporter
  - Returns error if role doesn't match user's registered role
- Returns user data and JWT token

**GET /api/auth/me**

- Returns current authenticated user's profile
- Requires authentication (protected route)

**PUT /api/auth/profile**

- Updates user profile information
- Requires authentication (protected route)

### 3. Authentication Middleware

**Location:** `backend/middleware/auth.middleware.js`

**protect:** Verifies JWT token and attaches user to request
**authorize(...roles):** Restricts access based on user role

### 4. Environment Configuration

**Location:** `backend/.env`

Required environment variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hela-fund
JWT_SECRET=your_secure_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 5. Routes

**Location:** `backend/routes/auth.routes.js`

All routes include validation middleware:

- Email format validation
- Password strength validation
- Required field validation

## Frontend Implementation

### 1. Auth Context

**Location:** `frontend/src/context/AuthContext.jsx`

Manages authentication state across the application:

**Functions:**

- `login(email, password, role)`: Authenticates user with backend API
- `signup(formData, role)`: Registers new user
- `logout()`: Clears user session and token
- `switchRole(newRole)`: Allows students to switch between roles
- `canAccessRole(role)`: Checks if user can access a specific role

**State Management:**

- Stores user data in localStorage
- Stores JWT token separately
- Auto-loads user on app initialization

### 2. API Utility

**Location:** `frontend/src/utils/api.js`

Provides helper functions for authenticated API requests:

- Automatically includes JWT token in headers
- Handles 401 errors (redirects to login)
- Provides convenience methods (get, post, put, delete)

### 3. Environment Configuration

**Location:** `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Authentication Flow

### Registration Flow

1. User fills registration form (role: requester or supporter)
2. Frontend sends POST request to `/api/auth/register`
3. Backend validates input data
4. Backend checks if email already exists
5. Backend creates user with hashed password
6. Backend generates JWT token
7. Frontend stores token and user data
8. User is redirected to appropriate dashboard

### Login Flow

1. User selects role (requester or supporter)
2. User enters email and password
3. Frontend sends POST request to `/api/auth/login` with role
4. Backend validates credentials
5. Backend verifies user has the requested role
6. Backend generates JWT token
7. Frontend stores token and user data
8. User is redirected to role-specific dashboard

### Role Verification

**During Login:**

- If user registered as 'requester', can only login as requester
- If user registered as 'supporter', can only login as supporter
- If user registered with role 'both', can login as either

**After Login:**

- Students (requesters) can switch between requester and supporter views
- Supporters can only access supporter view

## Security Features

### Password Security

- **Hashing Algorithm:** bcryptjs
- **Salt Rounds:** 10
- **Minimum Length:** 6 characters
- **Storage:** Passwords are never stored in plain text
- **Selection:** Password field excluded from queries by default

### Token Security

- **Algorithm:** JWT (JSON Web Tokens)
- **Expiration:** 30 days
- **Storage:** Stored in localStorage (frontend)
- **Transmission:** Sent via Authorization header with Bearer scheme

### API Security

- **Protected Routes:** Require valid JWT token
- **Role-Based Access:** Middleware checks user role
- **CORS:** Configured to allow frontend origin only
- **Error Handling:** Sensitive information not exposed in errors

## API Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "requester",
    "avatar": "",
    "token": "jwt_token_here"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Testing the Authentication

### Using Postman/Thunder Client

**Register a new user:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "requester"
}
```

**Login:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "requester"
}
```

**Get Profile (Protected):**

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: String (enum: ['requester', 'supporter', 'both']),
  phone: String,
  avatar: String,
  bio: String,
  location: {
    city: String,
    country: String
  },
  isVerified: Boolean,
  totalContributions: Number,
  totalRequests: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file (or use existing):

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hela-fund
   JWT_SECRET=your_secure_secret_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. Ensure MongoDB is running locally or update MONGODB_URI

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Common Issues & Solutions

### Issue: "User already exists"

**Solution:** Email is already registered. Use a different email or login instead.

### Issue: "Invalid credentials"

**Solution:** Check email and password are correct.

### Issue: "You are not registered as a [role]"

**Solution:** User trying to login with wrong role. Select the role you registered with.

### Issue: "Not authorized, no token"

**Solution:** Token missing or expired. Login again.

### Issue: MongoDB connection error

**Solution:** Ensure MongoDB is running and MONGODB_URI is correct.

## Next Steps

Consider implementing:

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, Facebook)
- [ ] Session management
- [ ] Rate limiting for login attempts
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts

## Dependencies

### Backend

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation/verification
- `express-validator`: Input validation
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables

### Frontend

- `react`: UI framework
- `react-router-dom`: Routing
- No additional auth libraries needed (using native fetch API)

## Support

For issues or questions regarding authentication:

1. Check this documentation
2. Review console logs for error messages
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
