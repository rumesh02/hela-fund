# Authentication API Documentation

## Overview
This document describes the authentication endpoints for the Hela Fund platform. The system supports two user roles: **Requester** (university students) and **Supporter** (financial contributors).

## Base URL
```
http://localhost:5000/api/auth
```

## Endpoints

### 1. Register User

**Endpoint:** `POST /auth/register`

**Description:** Register a new user as either a requester or supporter.

#### Request Body (Requester)
```json
{
  "email": "student@university.edu",
  "password": "password123",
  "role": "requester",
  "nic": "200012345678",
  "fullName": "John Doe",
  "university": "University of Colombo",
  "faculty": "Faculty of Science",
  "studentId": "SC/2022/1234",
  "mobile": "0771234567",
  "studentIdImage": "path/to/image.jpg"
}
```

#### Request Body (Supporter)
```json
{
  "email": "supporter@email.com",
  "password": "password123",
  "role": "supporter",
  "nic": "198512345678",
  "name": "Jane Smith"
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "student@university.edu",
    "role": "requester",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- **400 Bad Request:** Validation errors or user already exists
- **500 Internal Server Error:** Server error

---

### 2. Login User

**Endpoint:** `POST /auth/login`

**Description:** Authenticate a user and obtain a JWT token.

#### Role-Based Login Logic
- **Requester users** can login as both `requester` and `supporter`
- **Supporter users** can only login as `supporter`

#### Request Body
```json
{
  "email": "student@university.edu",
  "password": "password123",
  "role": "requester"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "student@university.edu",
    "role": "requester",
    "loginRole": "requester",
    "name": "John Doe",
    "avatar": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses
- **400 Bad Request:** Missing role parameter
- **401 Unauthorized:** Invalid credentials
- **403 Forbidden:** Role mismatch (e.g., supporter trying to login as requester)
- **500 Internal Server Error:** Server error

#### Example Error (Role Mismatch)
```json
{
  "success": false,
  "message": "You are registered as a supporter and cannot access the requester portal. Please select the supporter role."
}
```

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get the currently authenticated user's information.

**Headers:**
```
Authorization: Bearer <token>
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "student@university.edu",
    "role": "requester",
    "fullName": "John Doe",
    "university": "University of Colombo",
    "faculty": "Faculty of Science",
    "studentId": "SC/2022/1234",
    "nic": "200012345678",
    "mobile": "0771234567",
    "isVerified": false,
    "totalRequests": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Update Profile

**Endpoint:** `PUT /auth/profile`

**Description:** Update the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

#### Request Body (Requester)
```json
{
  "email": "newemail@university.edu",
  "fullName": "John Updated Doe",
  "mobile": "0779876543",
  "bio": "Updated bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Request Body (Supporter)
```json
{
  "email": "newemail@email.com",
  "name": "Jane Updated Smith",
  "bio": "Updated bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "email": "newemail@university.edu",
    "fullName": "John Updated Doe",
    "mobile": "0779876543",
    "bio": "Updated bio",
    "avatar": "https://example.com/avatar.jpg",
    // ... other fields
  }
}
```

---

## User Model Schema

### Common Fields
- `email` (String, required, unique): User's email address
- `password` (String, required, min 6 chars): Hashed password
- `nic` (String, required): National Identity Card number
- `role` (String, required): Either "requester" or "supporter"
- `avatar` (String): Profile picture URL
- `bio` (String, max 500 chars): User biography
- `isVerified` (Boolean, default: false): Account verification status
- `createdAt` (Date): Account creation timestamp
- `updatedAt` (Date): Last update timestamp

### Requester-Specific Fields
- `fullName` (String, required): Student's full name
- `university` (String, required): University name
- `faculty` (String, required): Faculty name
- `studentId` (String, required): Student ID number
- `studentIdImage` (String, required): Student ID card image URL
- `mobile` (String, required): Mobile number (format: 0XXXXXXXXX)
- `totalRequests` (Number, default: 0): Total requests created

### Supporter-Specific Fields
- `name` (String, required): Supporter's name
- `totalContributions` (Number, default: 0): Total contributions made

---

## Validation Rules

### Email
- Must be a valid email format
- Required for all users

### Password
- Minimum 6 characters
- Required for all users

### NIC
- Format: 9 digits + X/V or 12 digits
- Pattern: `^([0-9]{9}[x|X|v|V]|[0-9]{12})$`
- Required for all users

### Mobile (Requester only)
- Format: 10 digits starting with 0
- Pattern: `^0[0-9]{9}$`
- Required for requesters

### Role
- Must be either "requester" or "supporter"
- Required during registration

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Validation errors include an errors array:
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Authentication Flow

1. **Registration:**
   - User fills out role-specific registration form
   - Frontend sends POST request to `/auth/register`
   - Backend validates input and creates user
   - Returns user data (without password) and JWT token

2. **Login:**
   - User selects role (requester or supporter)
   - User enters email and password
   - Frontend sends POST request to `/auth/login` with role
   - Backend validates credentials and role access
   - Returns user data and JWT token

3. **Authenticated Requests:**
   - Include JWT token in Authorization header
   - Format: `Authorization: Bearer <token>`
   - Token expires in 30 days

4. **Role Access Rules:**
   - Supporters CANNOT access requester portal
   - Requesters CAN access both requester and supporter portals
   - Role is validated on every login attempt

---

## Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens are signed with a secret key from environment variables
- Student ID images should be uploaded separately using file upload endpoints
- All timestamps are in ISO 8601 format
