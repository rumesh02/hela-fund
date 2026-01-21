# Authentication System - Login & Signup

This document describes the authentication system implemented in the Hela Fund platform.

## Overview

The platform has a role-based authentication system with two primary user types:

1. **Requesters** - University students who can seek support
2. **Supporters** - Anyone who wants to help students

## Key Features

### Role Selection

- Users must select their role (Requester or Supporter) before logging in or signing up
- The UI adapts based on the selected role

### Requester (University Student) Registration

When registering as a Requester, users must provide:

- Full Name
- Email Address
- University (from a predefined list of Sri Lankan universities)
- Faculty
- Student ID Number
- Student ID Image (upload - not stored for now)
- NIC Number (validates Sri Lankan NIC format: 9 digits + V/X or 12 digits)
- Mobile Number (validates Sri Lankan mobile format: 10 digits starting with 0)
- Password (minimum 6 characters)
- Confirm Password

### Supporter Registration

When registering as a Supporter, users must provide:

- Full Name
- Email Address
- NIC Number (validates Sri Lankan NIC format)
- Password (minimum 6 characters)
- Confirm Password

### Login System

Users must:

1. Select their role (Requester or Supporter)
2. Enter email and password
3. Get redirected to the appropriate dashboard based on selected role

### Special Role Access Rules

**Important:** Requesters (university students) can login as either:

- Requester (to create requests and seek help)
- Supporter (to help other students)

Supporters can only login as:

- Supporter (they don't have requester privileges)

This is managed through the `accountType` field:

- `accountType: 'student'` - Can access both roles
- `accountType: 'supporter'` - Can only access supporter role

## File Structure

```
frontend/src/
├── pages/
│   ├── Login.jsx           # Login page with role selection
│   └── Signup.jsx          # Signup page with role-based forms
├── context/
│   └── AuthContext.jsx     # Authentication state management
├── components/
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   └── RoleSwitcher.jsx    # Component for students to switch roles
└── App.jsx                 # Routes with protection
```

## Components

### Login Page (`Login.jsx`)

Features:

- Two-step process: Role selection → Credentials
- Animated gradient background
- Password visibility toggle
- Form validation
- Loading states
- Error handling
- Links to signup page

### Signup Page (`Signup.jsx`)

Features:

- Role selection with animated cards
- Dynamic forms based on role
- Image upload with preview for student ID
- Comprehensive form validation
- Sri Lankan NIC validation
- Mobile number validation
- University selection dropdown
- Password strength requirements
- Loading states
- Error handling

### AuthContext (`AuthContext.jsx`)

Manages:

- User authentication state
- Login/signup functions
- Role switching for students
- Access control (canAccessRole)
- Local storage persistence
- Account type tracking

### ProtectedRoute (`ProtectedRoute.jsx`)

- Protects routes from unauthenticated access
- Validates role-based access
- Redirects unauthorized users

### RoleSwitcher (`RoleSwitcher.jsx`)

- Floating component for students to switch between Requester and Supporter roles
- Only visible for users with `accountType: 'student'`
- Highlights current active role

## Usage

### How to Test

1. **Sign Up as a Requester:**
   - Visit `/signup`
   - Click "Requester" role
   - Fill in all required fields
   - Upload a student ID image
   - Submit the form
   - You'll be redirected to login

2. **Sign Up as a Supporter:**
   - Visit `/signup`
   - Click "Supporter" role
   - Fill in required fields (fewer than requester)
   - Submit the form
   - You'll be redirected to login

3. **Login:**
   - Visit `/login`
   - Select your role (Requester or Supporter)
   - Enter credentials
   - Get redirected to appropriate dashboard

4. **Role Switching (Students Only):**
   - After logging in as a Requester
   - Use the floating RoleSwitcher component in bottom-right
   - Switch to Supporter role to help others
   - Switch back to Requester as needed

## Validation Rules

### Email

- Required
- Must be valid email format

### Password

- Required
- Minimum 6 characters
- Must match confirmation password

### NIC (Sri Lankan)

- Old format: 9 digits + V/X/v/x
- New format: 12 digits
- Regex: `^([0-9]{9}[x|X|v|V]|[0-9]{12})$`

### Mobile Number (Sri Lankan)

- 10 digits
- Must start with 0
- Regex: `^0[0-9]{9}$`

### Image Upload

- Only image files accepted
- Maximum size: 5MB
- Preview shown after upload

## Future Enhancements

- [ ] Connect to actual backend API
- [ ] Store and verify student ID images
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Remember me functionality
- [ ] Social login options
- [ ] Two-factor authentication
- [ ] Account verification status

## API Integration (TODO)

The current implementation uses mock authentication. To integrate with a real backend:

1. Update `AuthContext.jsx`:

   ```javascript
   const login = async (email, password, role) => {
     const response = await fetch("/api/auth/login", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password, role }),
     });
     const data = await response.json();
     setUser(data.user);
     return data.user;
   };
   ```

2. Update `signup` function similarly
3. Add JWT token management
4. Implement refresh token logic
5. Add proper error handling

## Security Considerations

- Passwords should be hashed on the backend
- Use HTTPS in production
- Implement CSRF protection
- Rate limit login attempts
- Sanitize all user inputs
- Validate file uploads on backend
- Store JWT tokens securely
- Implement session timeout

## Universities List

The signup form includes the following Sri Lankan universities:

- University of Colombo
- University of Peradeniya
- University of Sri Jayewardenepura
- University of Kelaniya
- University of Moratuwa
- University of Jaffna
- University of Ruhuna
- Eastern University
- South Eastern University
- Rajarata University
- Sabaragamuwa University
- Wayamba University
- Uva Wellassa University
- Open University of Sri Lanka
- Buddhist and Pali University
- Other

## Design Features

Both pages feature:

- Animated gradient backgrounds with blob animations
- Glassmorphism effects
- Smooth transitions and hover effects
- Responsive design for mobile and desktop
- Accessible form controls
- Clear error messages
- Loading states
- Brand consistency with Hela Fund design system
