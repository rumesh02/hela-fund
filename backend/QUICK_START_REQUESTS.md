# Quick Start Guide - Request API

## 🚀 Start the Backend Server

```bash
cd backend
npm run dev
```

Server should start on: `http://localhost:5000`

---

## 📝 Create a Request - Quick Examples

### 1️⃣ Lost Item Request

```json
POST http://localhost:5000/api/requests
Authorization: Bearer YOUR_TOKEN

{
  "title": "Lost Student ID Card",
  "description": "Blue card with photo, student number 12345",
  "category": "Lost Item",
  "urgency": "High",
  "itemLostLocation": "Main Library, 2nd Floor",
  "anonymous": false
}
```

### 2️⃣ Micro-Funding Request

```json
POST http://localhost:5000/api/requests
Authorization: Bearer YOUR_TOKEN

{
  "title": "Need funds for textbooks",
  "description": "Need $200 for required course textbooks",
  "category": "Micro-Funding",
  "urgency": "Medium",
  "amount": 200,
  "anonymous": false
}
```

### 3️⃣ Community Help Request

```json
POST http://localhost:5000/api/requests
Authorization: Bearer YOUR_TOKEN

{
  "title": "Campus cleanup volunteers needed",
  "description": "Need 10 volunteers for weekend cleanup",
  "category": "Community Help",
  "urgency": "Low",
  "anonymous": false
}
```

---

## 🔑 Get JWT Token First

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
    "password": "password123"
  }'
```

Copy the `token` from response and use it!

---

## ✅ Field Requirements

| Field            | Lost Item       | Micro-Funding   | Community Help |
| ---------------- | --------------- | --------------- | -------------- |
| title            | ✅ Required     | ✅ Required     | ✅ Required    |
| description      | ✅ Required     | ✅ Required     | ✅ Required    |
| category         | ✅ Required     | ✅ Required     | ✅ Required    |
| urgency          | ✅ Required     | ✅ Required     | ✅ Required    |
| itemLostLocation | ✅ **Required** | ❌ Not needed   | ❌ Not needed  |
| amount           | ❌ Not needed   | ✅ **Required** | ❌ Not needed  |
| anonymous        | ⚪ Optional     | ⚪ Optional     | ⚪ Optional    |
| proofDocument    | ⚪ Optional     | ⚪ Optional     | ⚪ Optional    |

---

## 📋 Valid Values

### Category (choose one):

- `"Lost Item"`
- `"Micro-Funding"`
- `"Community Help"`

### Urgency (choose one):

- `"Low"`
- `"Medium"`
- `"High"`

---

## 🔍 View Requests

### Get All Requests

```bash
curl http://localhost:5000/api/requests
```

### Filter by Category

```bash
curl "http://localhost:5000/api/requests?category=Lost%20Item"
```

### Filter by Urgency

```bash
curl "http://localhost:5000/api/requests?urgency=High"
```

### Search

```bash
curl "http://localhost:5000/api/requests?search=student"
```

### Get My Requests

```bash
curl http://localhost:5000/api/requests/my-requests \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Check Database

```bash
# MongoDB shell
mongosh

# Use your database
use hela_fund

# View all requests
db.requests.find().pretty()

# Count by category
db.requests.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```

---

## ⚠️ Common Errors

### "Item lost location is required"

- **Fix:** Add `itemLostLocation` field when category is "Lost Item"

### "Amount is required"

- **Fix:** Add `amount` field when category is "Micro-Funding"

### "Not authorized, no token"

- **Fix:** Include `Authorization: Bearer YOUR_TOKEN` header

### "Please provide all required fields"

- **Fix:** Include title, description, category, and urgency

---

## 📚 Full Documentation

- [API Documentation](./REQUEST_API_DOCUMENTATION.md)
- [Testing Guide](./TESTING_REQUESTS.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY_REQUESTS.md)

---

## ✨ What's Working

✅ Create requests for all 3 categories  
✅ Conditional field validation  
✅ JWT authentication  
✅ MongoDB storage  
✅ Get all requests  
✅ Filter by category, urgency, status  
✅ Search functionality  
✅ Anonymous requests  
✅ View count tracking

---

## 🎯 Ready to Test!

1. Start MongoDB
2. Start backend server
3. Login to get token
4. Create a request
5. View your requests

**That's it! You're all set! 🎉**
