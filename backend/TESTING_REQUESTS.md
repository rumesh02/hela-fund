# Testing the Request API

## Prerequisites

1. MongoDB should be running
2. Backend server should be running (`npm run dev` or `npm start`)
3. You need a valid JWT token (login first to get the token)

## How to Get JWT Token

### 1. Register a new user (if you don't have one)

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

### 2. Login to get the token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

Copy the token from the response and use it in the following tests.

---

## Test Cases

Replace `YOUR_JWT_TOKEN` with the actual token you received from login.

### Test 1: Create Lost Item Request (Success)

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Lost Student ID Card",
    "description": "I lost my student ID card near the library. It has my photo and student number 12345 on it. The card is blue with white text.",
    "category": "Lost Item",
    "urgency": "High",
    "itemLostLocation": "Main Library, Second Floor, near the computer lab",
    "anonymous": false
  }'
```

**Expected Result:** 201 Created with request data

---

### Test 2: Create Micro-Funding Request (Success)

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Need funds for textbooks",
    "description": "I need help purchasing required textbooks for this semester. The total cost is approximately $200 for 3 books required for my courses.",
    "category": "Micro-Funding",
    "urgency": "Medium",
    "amount": 200,
    "anonymous": false
  }'
```

**Expected Result:** 201 Created with request data including amount field

---

### Test 3: Create Community Help Request (Success)

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Need volunteers for campus cleanup",
    "description": "Looking for volunteers to help clean up the campus garden this weekend. We need at least 10 people.",
    "category": "Community Help",
    "urgency": "Low",
    "anonymous": false
  }'
```

**Expected Result:** 201 Created with request data

---

### Test 4: Create Lost Item without Location (Should Fail)

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Lost Wallet",
    "description": "Lost my brown leather wallet",
    "category": "Lost Item",
    "urgency": "High",
    "anonymous": false
  }'
```

**Expected Result:** 400 Bad Request

```json
{
  "success": false,
  "message": "Item lost location is required for Lost Item category"
}
```

---

### Test 5: Create Micro-Funding without Amount (Should Fail)

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Need medical funds",
    "description": "Need help with medical bills",
    "category": "Micro-Funding",
    "urgency": "High",
    "anonymous": false
  }'
```

**Expected Result:** 400 Bad Request

```json
{
  "success": false,
  "message": "Amount is required for Micro-Funding category"
}
```

---

### Test 6: Create Request without Authentication (Should Fail)

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Request",
    "description": "This should fail",
    "category": "Community Help",
    "urgency": "Low"
  }'
```

**Expected Result:** 401 Unauthorized

---

### Test 7: Create Anonymous Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Need confidential help",
    "description": "I need help but prefer to remain anonymous",
    "category": "Community Help",
    "urgency": "Medium",
    "anonymous": true
  }'
```

**Expected Result:** 201 Created with anonymous: true

---

### Test 8: Get All Requests

```bash
curl -X GET http://localhost:5000/api/requests
```

**Expected Result:** 200 OK with array of all requests

---

### Test 9: Get All Lost Item Requests

```bash
curl -X GET "http://localhost:5000/api/requests?category=Lost%20Item"
```

**Expected Result:** 200 OK with array of Lost Item requests only

---

### Test 10: Get High Urgency Requests

```bash
curl -X GET "http://localhost:5000/api/requests?urgency=High"
```

**Expected Result:** 200 OK with array of High urgency requests

---

### Test 11: Search Requests

```bash
curl -X GET "http://localhost:5000/api/requests?search=student"
```

**Expected Result:** 200 OK with requests containing "student" in title or description

---

### Test 12: Get My Requests

```bash
curl -X GET http://localhost:5000/api/requests/my-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Result:** 200 OK with array of requests created by the authenticated user

---

### Test 13: Get Single Request by ID

First, get a request ID from Test 8, then:

```bash
curl -X GET http://localhost:5000/api/requests/REPLACE_WITH_ACTUAL_ID
```

**Expected Result:** 200 OK with detailed request data and incremented view count

---

## Testing with Postman

### Setup

1. Open Postman
2. Create a new collection called "Hela Fund Requests"
3. Add environment variables:
   - `base_url`: http://localhost:5000
   - `token`: (leave empty, will be set after login)

### Steps

1. **Login** (POST `{{base_url}}/api/auth/login`)
   - Body: `{ "email": "test@example.com", "password": "password123" }`
   - In Tests tab, add: `pm.environment.set("token", pm.response.json().token);`

2. **Create Lost Item Request** (POST `{{base_url}}/api/requests`)
   - Headers: `Authorization: Bearer {{token}}`
   - Body: JSON with Lost Item fields

3. **Create Micro-Funding Request** (POST `{{base_url}}/api/requests`)
   - Headers: `Authorization: Bearer {{token}}`
   - Body: JSON with Micro-Funding fields

4. **Get All Requests** (GET `{{base_url}}/api/requests`)
   - No auth required

5. **Get My Requests** (GET `{{base_url}}/api/requests/my-requests`)
   - Headers: `Authorization: Bearer {{token}}`

---

## Verification Checklist

After running the tests, verify the following:

### Database Verification

Connect to MongoDB and check:

```javascript
// In MongoDB shell or Compass
use hela_fund  // or your database name

// Check if requests were created
db.requests.find().pretty()

// Count requests by category
db.requests.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])

// Check Lost Item requests have itemLostLocation
db.requests.find({ category: "Lost Item" })

// Check Micro-Funding requests have amount
db.requests.find({ category: "Micro-Funding" })
```

### Expected Schema in Database

```javascript
{
  _id: ObjectId("..."),
  title: "Lost Student ID Card",
  description: "...",
  category: "Lost Item",
  urgency: "High",
  itemLostLocation: "Main Library, Second Floor",  // Only for Lost Item
  // amount: 200,  // Only for Micro-Funding
  anonymous: false,
  requester: ObjectId("..."),
  status: "active",
  currentAmount: 0,
  currency: "USD",
  supporters: [],
  contributionsCount: 0,
  views: 0,
  isVerified: false,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## Common Issues and Solutions

### Issue 1: "Not authorized, no token"

**Solution:** Make sure you're including the JWT token in the Authorization header

### Issue 2: "Please provide all required fields"

**Solution:** Check that title, description, category, and urgency are all provided

### Issue 3: "Item lost location is required"

**Solution:** When category is "Lost Item", you must include itemLostLocation

### Issue 4: "Amount is required"

**Solution:** When category is "Micro-Funding", you must include amount

### Issue 5: Connection error

**Solution:**

- Check if MongoDB is running
- Check if backend server is running on port 5000
- Verify database connection string in .env file

---

## Next Steps

After successful testing:

1. Update the frontend CreateRequest.jsx to send data to this API
2. Add file upload functionality for proof documents
3. Implement request update and delete on frontend
4. Add validation messages on frontend based on API responses
