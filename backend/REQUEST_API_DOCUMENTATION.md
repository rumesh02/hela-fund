# Request API Documentation

## Overview

This document describes the API endpoints for managing requests in the Hela Fund application.

## Base URL

```
http://localhost:5000/api/requests
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create New Request

**POST** `/api/requests`

Creates a new help request with conditional fields based on category.

#### Authentication Required: Yes

#### Request Body

**Common Fields (Required for all categories):**

```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (required, max 2000 chars)",
  "category": "string (required) - 'Lost Item' | 'Micro-Funding' | 'Community Help'",
  "urgency": "string (required) - 'Low' | 'Medium' | 'High'",
  "anonymous": "boolean (optional, default: false)"
}
```

**Conditional Fields:**

For **Lost Item** category:

```json
{
  "itemLostLocation": "string (required for Lost Item, max 500 chars)"
}
```

For **Micro-Funding** category:

```json
{
  "amount": "number (required for Micro-Funding, min: 0)"
}
```

**Optional Field:**

```json
{
  "proofDocument": {
    "name": "string",
    "url": "string"
  }
}
```

#### Example Requests

**1. Lost Item Request:**

```json
{
  "title": "Lost Student ID Card",
  "description": "I lost my student ID card near the library. It has my photo and student number on it.",
  "category": "Lost Item",
  "urgency": "High",
  "itemLostLocation": "Main Library, Second Floor, near the computers",
  "anonymous": false,
  "proofDocument": {
    "name": "student_photo.jpg",
    "url": "placeholder_url"
  }
}
```

**2. Micro-Funding Request:**

```json
{
  "title": "Need funds for textbooks",
  "description": "I need help purchasing required textbooks for this semester. Total cost is around $200.",
  "category": "Micro-Funding",
  "urgency": "Medium",
  "amount": 200,
  "anonymous": false,
  "proofDocument": {
    "name": "book_list.pdf",
    "url": "placeholder_url"
  }
}
```

**3. Community Help Request:**

```json
{
  "title": "Need volunteers for campus cleanup",
  "description": "Looking for volunteers to help clean up the campus garden this weekend.",
  "category": "Community Help",
  "urgency": "Low",
  "anonymous": false
}
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Request created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Lost Student ID Card",
    "description": "I lost my student ID card...",
    "category": "Lost Item",
    "urgency": "High",
    "itemLostLocation": "Main Library, Second Floor",
    "anonymous": false,
    "requester": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "avatar_url"
    },
    "status": "active",
    "views": 0,
    "contributionsCount": 0,
    "currentAmount": 0,
    "isVerified": false,
    "createdAt": "2026-01-22T10:30:00.000Z",
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
}
```

#### Error Responses

**400 Bad Request - Missing Required Fields:**

```json
{
  "success": false,
  "message": "Please provide all required fields: title, description, category, and urgency"
}
```

**400 Bad Request - Missing Lost Item Location:**

```json
{
  "success": false,
  "message": "Item lost location is required for Lost Item category"
}
```

**400 Bad Request - Missing Amount for Micro-Funding:**

```json
{
  "success": false,
  "message": "Amount is required for Micro-Funding category"
}
```

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Error message details"
}
```

---

### 2. Get All Requests

**GET** `/api/requests`

Retrieve all requests with optional filtering.

#### Authentication Required: No

#### Query Parameters

- `category` (optional): Filter by category ('Lost Item', 'Micro-Funding', 'Community Help')
- `status` (optional): Filter by status ('draft', 'active', 'completed', 'cancelled', 'expired')
- `urgency` (optional): Filter by urgency ('Low', 'Medium', 'High')
- `search` (optional): Search in title and description
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of items per page

#### Example Request

```
GET /api/requests?category=Lost Item&urgency=High&page=1&limit=10
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 45
}
```

---

### 3. Get Single Request

**GET** `/api/requests/:id`

Get details of a specific request by ID.

#### Authentication Required: No

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Lost Student ID Card",
    "description": "...",
    "category": "Lost Item",
    "itemLostLocation": "Main Library",
    "urgency": "High",
    "requester": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "...",
      "bio": "...",
      "location": "..."
    },
    "supporters": [],
    "views": 15,
    "status": "active",
    "createdAt": "2026-01-22T10:30:00.000Z"
  }
}
```

---

### 4. Get My Requests

**GET** `/api/requests/my-requests`

Get all requests created by the authenticated user.

#### Authentication Required: Yes

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [...]
}
```

---

### 5. Update Request

**PUT** `/api/requests/:id`

Update an existing request (only by the owner).

#### Authentication Required: Yes

#### Request Body

Same as create request, but all fields are optional.

---

### 6. Delete Request

**DELETE** `/api/requests/:id`

Delete a request (only by the owner).

#### Authentication Required: Yes

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

---

## Field Validation Rules

### Category-Specific Fields

| Category       | Required Fields                               | Optional Fields          |
| -------------- | --------------------------------------------- | ------------------------ |
| Lost Item      | title, description, urgency, itemLostLocation | proofDocument, anonymous |
| Micro-Funding  | title, description, urgency, amount           | proofDocument, anonymous |
| Community Help | title, description, urgency                   | proofDocument, anonymous |

### Field Constraints

- **title**: 1-200 characters
- **description**: 1-2000 characters
- **itemLostLocation**: 1-500 characters (only for Lost Item)
- **amount**: Must be >= 0 (only for Micro-Funding)
- **urgency**: Must be one of: 'Low', 'Medium', 'High'
- **category**: Must be one of: 'Lost Item', 'Micro-Funding', 'Community Help'

---

## Testing with cURL

### Create Lost Item Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Lost Wallet",
    "description": "Lost my brown leather wallet with student ID inside",
    "category": "Lost Item",
    "urgency": "High",
    "itemLostLocation": "Cafeteria, near the cash register",
    "anonymous": false
  }'
```

### Create Micro-Funding Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Medical Emergency Fund",
    "description": "Need help with unexpected medical bills",
    "category": "Micro-Funding",
    "urgency": "High",
    "amount": 500,
    "anonymous": false
  }'
```

### Get All Requests

```bash
curl -X GET "http://localhost:5000/api/requests?category=Lost%20Item&urgency=High"
```

---

## Notes

1. **Anonymous Requests**: When `anonymous` is set to `true`, the requester's identity should be hidden in public views (implement this in frontend).

2. **Proof Document**: Currently a placeholder. File upload functionality can be added later using services like AWS S3, Cloudinary, etc.

3. **Conditional Validation**: The model enforces that:
   - `itemLostLocation` is required ONLY when category is 'Lost Item'
   - `amount` is required ONLY when category is 'Micro-Funding'

4. **Auto-populated Fields**: The following fields are automatically set:
   - `requester`: Set from authenticated user
   - `status`: Defaults to 'active'
   - `currentAmount`: Defaults to 0
   - `views`: Defaults to 0
   - `contributionsCount`: Defaults to 0
   - `isVerified`: Defaults to false
   - `createdAt` and `updatedAt`: Managed by MongoDB

5. **Progress Calculation**: For Micro-Funding requests, a virtual field `progress` is calculated as: `(currentAmount / amount) * 100`
