# Quick Start Guide - Authentication System

## Testing the Login & Signup Pages

### Prerequisites

Make sure the frontend development server is running:

```bash
cd frontend
npm install
npm run dev
```

## Step-by-Step Testing Guide

### 1. Access the Application

Open your browser and navigate to: `http://localhost:5173` (or your Vite dev server URL)

### 2. Test Signup Flow

#### A. Register as a Requester (Student)

1. From the landing page, click "Get Started" or "Sign Up"
2. On the signup page, click the **"Requester"** card (blue gradient)
3. Fill in the form:
   ```
   Full Name: John Doe
   Email: john.doe@university.edu
   University: [Select from dropdown, e.g., "University of Colombo"]
   Faculty: Engineering
   Student ID: 2024/CS/001
   Upload Image: [Click to upload a student ID image]
   NIC: 200012345678 (or 123456789V for old format)
   Mobile: 0771234567
   Password: password123
   Confirm Password: password123
   ```
4. Check the Terms and Conditions checkbox
5. Click "Create Account"
6. You'll be redirected to the login page

#### B. Register as a Supporter

1. Navigate to `/signup`
2. Click the **"Supporter"** card (rose/pink gradient)
3. Fill in the form:
   ```
   Full Name: Jane Smith
   Email: jane.smith@example.com
   NIC: 200012345678
   Password: password123
   Confirm Password: password123
   ```
4. Check the Terms and Conditions checkbox
5. Click "Create Account"
6. You'll be redirected to the login page

### 3. Test Login Flow

#### A. Login as Requester

1. Navigate to `/login`
2. Click the **"Requester"** card (blue gradient)
3. Enter credentials:
   ```
   Email: john.doe@university.edu
   Password: password123
   ```
4. Click "Sign In"
5. You'll be redirected to `/requester/dashboard`

#### B. Login as Supporter

1. Navigate to `/login`
2. Click the **"Supporter"** card (rose/pink gradient)
3. Enter credentials:
   ```
   Email: jane.smith@example.com
   Password: password123
   ```
4. Click "Sign In"
5. You'll be redirected to `/supporter/dashboard`

### 4. Test Role Switching (Students Only)

1. Login as a **Requester** (student account)
2. Look for the **RoleSwitcher** widget in the bottom-right corner
3. Click the "Supporter" button
4. You'll be switched to the Supporter dashboard
5. Click "Requester" to switch back
6. Note: If you login as a Supporter, this widget won't appear

### 5. Test Protected Routes

#### Test Unauthenticated Access

1. Open a new incognito/private browser window
2. Try to access: `http://localhost:5173/requester/dashboard`
3. You should be redirected to `/login`

#### Test Role-Based Access

1. Login as a **Supporter** (not a student)
2. Try to manually navigate to `/requester/dashboard`
3. You should be redirected to `/supporter/dashboard`
4. This is because supporters can't access requester features

## Form Validation Testing

### Test Email Validation

- Try: `invalid-email` → Should show error
- Try: `test@` → Should show error
- Try: `test@example.com` → Should be valid

### Test Password Validation

- Try: `12345` → Should show "minimum 6 characters" error
- Try: `password` and `different` → Should show "passwords do not match"
- Try: `password123` twice → Should be valid

### Test NIC Validation

- Try: `12345` → Should show invalid format
- Try: `123456789V` → Should be valid (old format)
- Try: `200012345678` → Should be valid (new format)
- Try: `123456789v` → Should be valid (lowercase accepted)

### Test Mobile Validation

- Try: `12345` → Should show invalid format
- Try: `771234567` → Should show invalid (must start with 0)
- Try: `0771234567` → Should be valid

### Test Image Upload

- Try uploading a text file → Should show "Please upload an image file"
- Try uploading a 10MB image → Should show "Image size should be less than 5MB"
- Try uploading a valid JPG/PNG < 5MB → Should show preview

## Features to Explore

### Login Page Features

- ✅ Animated gradient background
- ✅ Role selection cards
- ✅ Password visibility toggle (eye icon)
- ✅ Form validation with real-time error messages
- ✅ Loading state during authentication
- ✅ "Remember me" checkbox
- ✅ "Forgot password" link
- ✅ Link to signup page
- ✅ Responsive design (try resizing browser)

### Signup Page Features

- ✅ Animated gradient background (different from login)
- ✅ Role selection with large animated cards
- ✅ Dynamic form based on role
- ✅ University dropdown (Sri Lankan universities)
- ✅ Image upload with preview
- ✅ Remove image button (X on preview)
- ✅ Password visibility toggles
- ✅ Comprehensive validation
- ✅ Loading state during registration
- ✅ Link to login page
- ✅ Responsive design

## Browser Testing

Test in different browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

Test responsive design:

- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## Keyboard Navigation Testing

1. Try navigating through forms using Tab key
2. Try submitting forms using Enter key
3. Try toggling password visibility using keyboard
4. All interactive elements should be accessible

## Troubleshooting

### Issue: "useAuth must be used within an AuthProvider"

**Solution:** Make sure AuthProvider is wrapping the App in `main.jsx`

### Issue: Images not uploading

**Solution:** Check file size (<5MB) and file type (image/\*)

### Issue: Validation not working

**Solution:** Clear browser cache and reload

### Issue: Redirect not working after login

**Solution:** Check browser console for errors, ensure routes are configured correctly

### Issue: RoleSwitcher not showing for students

**Solution:** Make sure you registered as a Requester and logged in as Requester

## Current Limitations (Expected)

- Student ID images are **not stored** (as requested)
- Authentication is **mock-based** (no real backend yet)
- Password reset is **UI only** (not functional yet)
- Email verification is **not implemented**
- Remember me is **not functional** (just UI)

## Next Testing Phase

After backend is ready:

1. Test actual API integration
2. Test JWT token handling
3. Test session management
4. Test password reset flow
5. Test email verification
6. Test file upload to server

## Development Notes

- All user data is currently stored in `localStorage`
- You can view stored data in browser DevTools → Application → Local Storage
- Clear localStorage to reset authentication state
- Check console for any errors or warnings

## Useful Commands

```bash
# Start frontend dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Mock User Credentials (For Testing)

Since authentication is mock-based, any credentials will work, but for consistency:

**Requester:**

```
Email: student@university.edu
Password: password123
```

**Supporter:**

```
Email: supporter@example.com
Password: password123
```

## Questions or Issues?

Check the following documentation files:

- `AUTH_DOCUMENTATION.md` - Detailed technical documentation
- `AUTH_FLOW_DIAGRAM.md` - Visual flow diagrams
- `IMPLEMENTATION_SUMMARY_AUTH.md` - Feature summary

Happy testing! 🎉
