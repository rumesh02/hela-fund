# Authentication Flow Diagram

## User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          HELA FUND PLATFORM                              │
└─────────────────────────────────────────────────────────────────────────┘

                              Landing Page (/)
                                    │
                      ┌─────────────┴─────────────┐
                      │                           │
                 Get Started                 Sign In
                      │                           │
                      ▼                           ▼
                Signup Page                  Login Page
                  (/signup)                   (/login)
                      │                           │
            ┌─────────┴─────────┐       ┌─────────┴─────────┐
            │                   │       │                   │
       Select Role         Select Role  │              Select Role
            │                   │       │                   │
      ┌─────┴─────┐       ┌─────┴─────┐│            ┌─────┴─────┐
      │           │       │           ││            │           │
  Requester   Supporter   │       Requester     Supporter
  (Student)               │       (Student)
      │           │       │           │            │           │
      │           │       │           │            │           │
      ▼           ▼       │           ▼            ▼           ▼
  ┌─────────┐ ┌─────────┐│       ┌──────────────────────────────┐
  │Register │ │Register ││       │    Authentication Check      │
  │with:    │ │with:    ││       │                              │
  │         │ │         ││       │  - Verify Credentials        │
  │• Full   │ │• Name   ││       │  - Check Account Type        │
  │  Name   │ │• Email  ││       │  - Set Role                  │
  │• Email  │ │• NIC    ││       └──────────────┬───────────────┘
  │• Univ.  │ │• Pass   ││                      │
  │• Faculty│ │         ││              ┌───────┴────────┐
  │• Std ID │ │         ││              │                │
  │• ID Img │ │         ││         Success           Failure
  │• NIC    │ │         ││              │                │
  │• Mobile │ │         ││              │                ▼
  │• Pass   │ │         ││              │         Error Message
  └────┬────┘ └────┬────┘│              │         (Try Again)
       │           │     │              │
       └─────┬─────┘     │              │
             │           │              ▼
             ▼           │     ┌────────────────────┐
      Account Created    │     │  Role-Based Route  │
             │           │     └────────┬───────────┘
             │           │              │
             ▼           │      ┌───────┴────────┐
      Redirect to Login  │      │                │
                         │  Requester        Supporter
                         │      │                │
                         │      ▼                ▼
                         │  ┌─────────────┐  ┌─────────────┐
                         │  │ Requester   │  │ Supporter   │
                         │  │ Dashboard   │  │ Dashboard   │
                         │  └──────┬──────┘  └─────────────┘
                         │         │
                         │         │
                         │  accountType = 'student'?
                         │         │
                         │    ┌────┴─────┐
                         │    │          │
                         │   Yes         No
                         │    │          │
                         │    ▼          ▼
                         │  ┌──────────────────────┐
                         │  │  RoleSwitcher Shows  │
                         │  │  (Bottom Right)      │
                         │  └──────────┬───────────┘
                         │             │
                         │      User Can Switch
                         │             │
                         │      ┌──────┴──────┐
                         │      │             │
                         │  Requester    Supporter
                         │   Portal       Portal
                         │      │             │
                         └──────┴─────────────┘
```

## Account Types & Access Rights

```
┌────────────────────────────────────────────────────────────────┐
│                     ACCOUNT TYPE MATRIX                        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Registration Role        Account Type      Portal Access     │
│  ────────────────────────────────────────────────────────────  │
│                                                                │
│  Requester (Student) →    student      →   ✓ Requester        │
│                                            ✓ Supporter        │
│                                                                │
│  Supporter          →    supporter    →   ✗ Requester        │
│                                            ✓ Supporter        │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Legend:
  ✓ = Can Access
  ✗ = Cannot Access
```

## Login Flow Detail

```
                    Login Page (/login)
                           │
                           ▼
                  ┌────────────────┐
                  │ Select Role    │
                  │ ┌──────────┐   │
                  │ │Requester │   │
                  │ │Supporter │   │
                  │ └──────────┘   │
                  └────────┬───────┘
                           │
                           ▼
                  ┌────────────────┐
                  │ Enter Email    │
                  │ Enter Password │
                  └────────┬───────┘
                           │
                           ▼
                  ┌────────────────────┐
                  │ Form Validation    │
                  │ • Email format     │
                  │ • Password length  │
                  └────────┬───────────┘
                           │
                           ▼
                  ┌────────────────────┐
                  │ Submit to Auth     │
                  └────────┬───────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                 Success       Failure
                    │             │
                    │             ▼
                    │      Show Error
                    │             │
                    │      Stay on Page
                    │
                    ▼
         ┌──────────────────┐
         │ Set User State   │
         │ • user object    │
         │ • role           │
         │ • accountType    │
         └──────┬───────────┘
                │
                ▼
         ┌──────────────────┐
         │ Navigate to      │
         │ Dashboard        │
         └──────────────────┘
```

## Signup Flow Detail - Requester

```
              Signup Page → Select "Requester"
                           │
                           ▼
              ┌────────────────────────────┐
              │  REQUESTER REGISTRATION    │
              │  ────────────────────────  │
              │                            │
              │  1. Personal Info          │
              │     • Full Name            │
              │     • Email                │
              │                            │
              │  2. University Info        │
              │     • Select University    │
              │     • Faculty              │
              │     • Student ID           │
              │     • Upload ID Image      │
              │                            │
              │  3. Contact & Identity     │
              │     • NIC Number           │
              │     • Mobile Number        │
              │                            │
              │  4. Security               │
              │     • Password             │
              │     • Confirm Password     │
              │                            │
              └────────────┬───────────────┘
                           │
                           ▼
              ┌────────────────────────────┐
              │  VALIDATION                │
              │  ────────────────────────  │
              │  ✓ All fields filled       │
              │  ✓ Email format valid      │
              │  ✓ NIC format valid        │
              │  ✓ Mobile format valid     │
              │  ✓ Image uploaded          │
              │  ✓ Passwords match         │
              │  ✓ Password length >= 6    │
              └────────────┬───────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                 Valid        Invalid
                    │             │
                    │             ▼
                    │      Show Errors
                    │             │
                    │      Stay on Form
                    │
                    ▼
         ┌────────────────────────┐
         │ Create Account         │
         │ accountType: 'student' │
         └──────────┬─────────────┘
                    │
                    ▼
         ┌────────────────────────┐
         │ Redirect to Login      │
         │ with success message   │
         └────────────────────────┘
```

## Role Switching Flow (Students Only)

```
     Student logged in as Requester
                │
                ▼
     ┌──────────────────────────┐
     │  Requester Dashboard     │
     │                          │
     │  [RoleSwitcher Widget]   │
     │   Bottom Right Corner    │
     │                          │
     │   ┌──────────────────┐   │
     │   │ [Requester] ✓    │   │
     │   │ [Supporter]      │   │
     │   └──────────────────┘   │
     └──────────┬───────────────┘
                │
         Click "Supporter"
                │
                ▼
     ┌──────────────────────────┐
     │  Update user.role        │
     │  role: 'supporter'       │
     └──────────┬───────────────┘
                │
                ▼
     ┌──────────────────────────┐
     │  Navigate to             │
     │  /supporter/dashboard    │
     └──────────┬───────────────┘
                │
                ▼
     ┌──────────────────────────┐
     │  Supporter Dashboard     │
     │                          │
     │  [RoleSwitcher Widget]   │
     │                          │
     │   ┌──────────────────┐   │
     │   │ [Requester]      │   │
     │   │ [Supporter] ✓    │   │
     │   └──────────────────┘   │
     └──────────────────────────┘

Note: Supporters don't see RoleSwitcher
      (accountType !== 'student')
```

## Protected Route Logic

```
   User visits /requester/dashboard or /supporter/dashboard
                        │
                        ▼
           ┌────────────────────────┐
           │ ProtectedRoute Check   │
           └────────────┬───────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
      isAuthenticated?        Not Authenticated
             │                     │
            Yes                    │
             │                     ▼
             │              Redirect to /login
             │
             ▼
    ┌────────────────────────┐
    │ Check canAccessRole    │
    └────────────┬───────────┘
                 │
          ┌──────┴──────┐
          │             │
    Can Access      Cannot Access
          │             │
          │             ▼
          │      Redirect to
          │      /supporter/dashboard
          │
          ▼
    ┌─────────────┐
    │ Allow Entry │
    │ Show Page   │
    └─────────────┘
```
