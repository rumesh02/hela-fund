# Authentication API Test Examples

This file contains example requests for testing the Hela Fund authentication API.

## Base URL

```
http://localhost:5000/api
```

## 1. Health Check

**Request:**

```http
GET http://localhost:5000/api/health
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Hela Fund API is running",
  "timestamp": "2026-01-22T..."
}
```

---

## 2. Register New Requester (Student)

**Request:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "password": "password123",
  "role": "requester",
  "phone": "+94771234567"
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "requester",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 3. Register New Supporter

**Request:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "password456",
  "role": "supporter",
  "phone": "+94779876543"
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef67890",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "supporter",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 4. Login as Requester

**Request:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@university.edu",
  "password": "password123",
  "role": "requester"
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "requester",
    "avatar": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 5. Login as Supporter

**Request:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "jane.smith@example.com",
  "password": "password456",
  "role": "supporter"
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef67890",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "supporter",
    "avatar": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 6. Get Current User Profile (Protected Route)

**Request:**

```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "role": "requester",
    "phone": "+94771234567",
    "avatar": "",
    "bio": "",
    "isVerified": false,
    "totalContributions": 0,
    "totalRequests": 0,
    "createdAt": "2026-01-22T...",
    "updatedAt": "2026-01-22T..."
  }
}
```

---

## 7. Update User Profile (Protected Route)

**Request:**

```http
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json

{
  "name": "John Updated Doe",
  "bio": "Computer Science student seeking support for education",
  "location": {
    "city": "Colombo",
    "country": "Sri Lanka"
  }
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "name": "John Updated Doe",
    "email": "john.doe@university.edu",
    "role": "requester",
    "phone": "+94771234567",
    "avatar": "",
    "bio": "Computer Science student seeking support for education",
    "location": {
      "city": "Colombo",
      "country": "Sri Lanka"
    },
    "isVerified": false,
    "totalContributions": 0,
    "totalRequests": 0,
    "createdAt": "2026-01-22T...",
    "updatedAt": "2026-01-22T..."
  }
}
```

---

## Error Responses

### Invalid Credentials

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### User Already Exists

```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

### Wrong Role

```json
{
  "success": false,
  "message": "You are not registered as a supporter. Please select the correct role."
}
```

### Validation Errors

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

### Unauthorized (No Token)

```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### Unauthorized (Invalid Token)

```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "requester"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "requester"
  }'
```

### Get Profile

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with JavaScript/Fetch

### Register

```javascript
const response = await fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    role: "requester",
  }),
});

const data = await response.json();
console.log(data);
```

### Login

```javascript
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "test@example.com",
    password: "password123",
    role: "requester",
  }),
});

const data = await response.json();
const token = data.data.token;
console.log("Token:", token);
```

### Get Profile

```javascript
const response = await fetch("http://localhost:5000/api/auth/me", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log("User Profile:", data.data);
```
