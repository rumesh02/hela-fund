# Authentication Testing Guide

## Quick Start Testing

Follow these steps to test the new authentication system.

## Prerequisites

1. MongoDB running locally or connection to MongoDB Atlas
2. Backend server running on `http://localhost:5000`
3. Environment variables configured in `.env` file

## Step 1: Seed the Database

Create sample users for testing:

```bash
cd backend
npm run seed
```

**This creates 4 test users:**

### Requesters (Students)
- Email: `requester1@university.edu` | Password: `password123`
- Email: `requester2@university.edu` | Password: `password123`

### Supporters
- Email: `supporter1@email.com` | Password: `password123`
- Email: `supporter2@email.com` | Password: `password123`

---

## Step 2: Test Registration

### Register a New Requester

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newstudent@university.edu",
    "password": "password123",
    "role": "requester",
    "nic": "200012345678",
    "fullName": "New Student",
    "university": "University of Colombo",
    "faculty": "Faculty of Science",
    "studentId": "SC/2023/9999",
    "mobile": "0771111111",
    "studentIdImage": "temp_image.jpg"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "newstudent@university.edu",
    "role": "requester",
    "name": "New Student",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register a New Supporter

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newsupporter@email.com",
    "password": "password123",
    "role": "supporter",
    "nic": "199012345678",
    "name": "New Supporter"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "newsupporter@email.com",
    "role": "supporter",
    "name": "New Supporter",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Step 3: Test Login - Success Cases

### ✅ Test 1: Requester Login as Requester

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "requester1@university.edu",
    "password": "password123",
    "role": "requester"
  }'
```

**Expected:** ✅ Success (200) - Requester can access requester portal

### ✅ Test 2: Requester Login as Supporter

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "requester1@university.edu",
    "password": "password123",
    "role": "supporter"
  }'
```

**Expected:** ✅ Success (200) - Requester can access supporter portal

### ✅ Test 3: Supporter Login as Supporter

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supporter1@email.com",
    "password": "password123",
    "role": "supporter"
  }'
```

**Expected:** ✅ Success (200) - Supporter can access supporter portal

---

## Step 4: Test Login - Failure Cases

### ❌ Test 4: Supporter Login as Requester (Should Fail)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supporter1@email.com",
    "password": "password123",
    "role": "requester"
  }'
```

**Expected:** ❌ Error (403)
```json
{
  "success": false,
  "message": "You are registered as a supporter and cannot access the requester portal. Please select the supporter role."
}
```

### ❌ Test 5: Invalid Credentials

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "requester1@university.edu",
    "password": "wrongpassword",
    "role": "requester"
  }'
```

**Expected:** ❌ Error (401)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### ❌ Test 6: Missing Role

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "requester1@university.edu",
    "password": "password123"
  }'
```

**Expected:** ❌ Error (400)
```json
{
  "success": false,
  "message": "Please select a role (requester or supporter)"
}
```

---

## Step 5: Test Protected Routes

### Get Current User

First, save the token from login response, then:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "requester1@university.edu",
    "role": "requester",
    "fullName": "Saman Perera",
    "university": "University of Colombo",
    // ... other user fields
  }
}
```

### Update Profile (Requester)

```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Saman Perera Updated",
    "bio": "Updated bio for testing",
    "mobile": "0779999999"
  }'
```

---

## Step 6: Test Validation Errors

### Missing Required Fields (Requester)

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "incomplete@university.edu",
    "password": "password123",
    "role": "requester"
  }'
```

**Expected:** ❌ Validation errors (400)

### Invalid Email Format

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "role": "supporter",
    "nic": "199012345678",
    "name": "Test User"
  }'
```

**Expected:** ❌ Email validation error (400)

### Invalid NIC Format

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "password123",
    "role": "supporter",
    "nic": "123",
    "name": "Test User"
  }'
```

**Expected:** ❌ NIC validation error (400)

---

## Step 7: Frontend Testing (Optional)

### Using Browser/Postman

1. **Open** `http://localhost:5173` (frontend)
2. **Navigate** to Sign Up page
3. **Select** Requester role
4. **Fill** all required fields
5. **Submit** registration
6. **Navigate** to Login page
7. **Try** logging in as requester ✅
8. **Logout** and try logging in as supporter ✅

For supporter users:
1. **Register** as supporter
2. **Try** logging in as supporter ✅
3. **Try** logging in as requester ❌ (should fail)

---

## Test Checklist

- [ ] Seed database with sample users
- [ ] Register new requester with all fields
- [ ] Register new supporter with all fields
- [ ] Requester login as requester (success)
- [ ] Requester login as supporter (success)
- [ ] Supporter login as supporter (success)
- [ ] Supporter login as requester (fail with proper error)
- [ ] Login with wrong password (fail)
- [ ] Login without role (fail)
- [ ] Get current user with valid token
- [ ] Update requester profile
- [ ] Update supporter profile
- [ ] Test validation errors (missing fields)
- [ ] Test duplicate email registration (fail)

---

## Clean Up

After testing, clear the database:

```bash
npm run seed:clear
```

---

## Common Issues

### Issue: "User already exists with this email"
**Solution:** Use a different email or clear the database

### Issue: "Invalid credentials"
**Solution:** Check email and password are correct

### Issue: "JWT malformed" or "No token provided"
**Solution:** Ensure token is included in Authorization header

### Issue: Connection refused
**Solution:** Ensure MongoDB is running and backend server is started

---

## Testing Tools

- **cURL** - Command line (as shown above)
- **Postman** - GUI tool for API testing
- **Thunder Client** - VS Code extension
- **Insomnia** - API testing tool

---

## Next Steps

1. Test file upload for student ID images
2. Test email verification flow (when implemented)
3. Test password reset functionality (when implemented)
4. Integration testing with frontend
5. Load testing for production readiness

---

**Happy Testing! 🚀**
