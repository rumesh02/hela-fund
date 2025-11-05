# Hela Fund - Complete Project Structure

## 📂 Frontend Directory Structure

```
frontend/
│
├── public/                                    # Static assets
│
├── src/
│   ├── assets/                               # Images, icons, etc.
│   │
│   ├── components/                           # Reusable components
│   │   ├── Requester/                        # Requester-specific components
│   │   │   ├── Header.jsx                    ✅ Requester header
│   │   │   └── Sidebar.jsx                   ✅ Requester sidebar
│   │   │
│   │   ├── Supporter/                        # Supporter-specific components
│   │   │   ├── Header.jsx                    ✅ Supporter header
│   │   │   ├── Sidebar.jsx                   ✅ Supporter sidebar
│   │   │   └── RequestDetailsModal.jsx       ✅ Request details modal
│   │   │
│   │   └── RoleSwitcher.jsx                  ✅ Dev tool (remove in prod)
│   │
│   ├── data/
│   │   └── sampleData.js                     ✅ Sample data for both roles
│   │
│   ├── hooks/
│   │   └── useCustomHooks.js                 # Custom React hooks
│   │
│   ├── layouts/
│   │   ├── RequesterLayout.jsx               ✅ Requester layout wrapper
│   │   └── SupporterLayout.jsx               ✅ Supporter layout wrapper
│   │
│   ├── pages/
│   │   ├── Requester/                        # Requester pages
│   │   │   ├── Dashboard.jsx                 ✅ Requester dashboard
│   │   │   ├── CreateRequest.jsx             ✅ Create new request
│   │   │   ├── MyRequests.jsx                ✅ View all requests
│   │   │   ├── Messages.jsx                  ✅ Requester messages
│   │   │   ├── Profile.jsx                   ✅ Requester profile
│   │   │   └── Settings.jsx                  ✅ Requester settings
│   │   │
│   │   └── Supporter/                        # Supporter pages
│   │       ├── Dashboard.jsx                 ✅ Supporter dashboard
│   │       ├── BrowseRequests.jsx            ✅ Browse all requests
│   │       ├── MyContributions.jsx           ✅ Track contributions
│   │       ├── Messages.jsx                  ✅ Supporter messages
│   │       ├── Profile.jsx                   ✅ Supporter profile
│   │       └── Settings.jsx                  ✅ Supporter settings
│   │
│   ├── App.css                               # Global app styles
│   ├── App.jsx                               ✅ Main app with routes
│   ├── index.css                             # Tailwind imports
│   └── main.jsx                              # App entry point
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json                              ✅ Dependencies configured
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
│
├── IMPLEMENTATION_SUMMARY.md                 ✅ Complete summary
├── SUPPORTER_DASHBOARD_README.md             ✅ Supporter docs
├── REQUESTER_FRONTEND_README.md              # Requester docs
├── QUICK_START_GUIDE.md                      # Quick start
└── README.md                                 # Main readme
```

---

## 🗺️ Route Structure

### Root Routes

```
/                              → Redirects to /requester/dashboard
```

### Requester Routes (Existing)

```
/requester
  ├── /dashboard               → Requester Dashboard
  ├── /create-request          → Create New Request
  ├── /my-requests             → View All Requests
  ├── /messages                → Requester Messages
  ├── /profile                 → Requester Profile
  └── /settings                → Requester Settings
```

### Supporter Routes (NEW! ✨)

```
/supporter
  ├── /dashboard               → Supporter Dashboard
  ├── /browse-requests         → Browse All Requests
  ├── /my-contributions        → Track Contributions
  ├── /messages                → Supporter Messages
  ├── /profile                 → Supporter Profile
  └── /settings                → Supporter Settings
```

---

## 🎨 Component Hierarchy

### Requester Flow

```
App.jsx
└── RequesterLayout
    ├── Requester/Header
    ├── Requester/Sidebar
    └── Outlet (Page Content)
        ├── Dashboard
        ├── CreateRequest
        ├── MyRequests
        ├── Messages
        ├── Profile
        └── Settings
```

### Supporter Flow (NEW! ✨)

```
App.jsx
└── SupporterLayout
    ├── Supporter/Header
    ├── Supporter/Sidebar
    └── Outlet (Page Content)
        ├── Dashboard
        ├── BrowseRequests
        │   └── RequestDetailsModal
        ├── MyContributions
        ├── Messages
        ├── Profile
        └── Settings
```

---

## 📊 Data Flow (Current)

```
sampleData.js
    │
    ├── sampleUser (Requester)
    ├── sampleSupporter (Supporter)
    ├── sampleRequests
    ├── sampleBadges
    ├── sampleConversations
    ├── sampleMessages
    ├── sampleNotifications
    └── Helper functions
```

### Future API Integration

```
Frontend Component
    ↓ (fetch/axios)
Backend API
    ↓
Database
```

---

## 🎯 Feature Matrix

### Dashboard

| Feature         | Requester | Supporter | Status   |
| --------------- | --------- | --------- | -------- |
| Summary Cards   | ✅        | ✅        | Complete |
| Recent Activity | ✅        | ✅        | Complete |
| Quick Actions   | ✅        | ✅        | Complete |
| Badges Display  | ✅        | ✅        | Complete |

### Requests Management

| Feature         | Requester | Supporter   | Status   |
| --------------- | --------- | ----------- | -------- |
| Create Request  | ✅        | N/A         | Complete |
| View Requests   | ✅        | ✅          | Complete |
| Filter/Search   | ⚠️ Basic  | ✅ Advanced | Complete |
| Request Details | ✅        | ✅          | Complete |
| Status Tracking | ✅        | ✅          | Complete |

### Communication

| Feature           | Requester | Supporter | Status   |
| ----------------- | --------- | --------- | -------- |
| Messaging UI      | ✅        | ✅        | Complete |
| Conversation List | ✅        | ✅        | Complete |
| Search Chat       | ✅        | ✅        | Complete |
| Online Status     | ✅        | ✅        | Complete |
| Unread Badges     | ✅        | ✅        | Complete |

### Profile & Settings

| Feature          | Requester | Supporter | Status   |
| ---------------- | --------- | --------- | -------- |
| View Profile     | ✅        | ✅        | Complete |
| Edit Profile     | ✅        | ✅        | Complete |
| Settings Page    | ✅        | ✅        | Complete |
| Notifications    | ✅        | ✅        | Complete |
| Privacy Controls | ✅        | ✅        | Complete |
| Theme Selection  | ✅        | ✅        | Complete |

---

## 🔧 Technology Stack

### Frontend

- **React** 19.1.1 - UI Library
- **React Router DOM** 7.9.5 - Routing
- **Tailwind CSS** 4.1.16 - Styling
- **Lucide React** 0.552.0 - Icons
- **Vite** 7.1.7 - Build Tool

### Dev Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Browser compatibility

---

## 🚀 Quick Start Commands

### Install Dependencies

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

---

## 🎨 Design System

### Colors

```css
Primary:   #2563eb (Blue)
Success:   #16a34a (Green)
Warning:   #eab308 (Yellow)
Danger:    #dc2626 (Red)
Gray-50:   #f9fafb
Gray-100:  #f3f4f6
Gray-800:  #1f2937
```

### Spacing

```
4px grid system
px-4, py-2, gap-6, etc.
```

### Border Radius

```
rounded-lg:   0.5rem (8px)
rounded-full: 9999px
```

### Shadows

```
shadow-sm: Small shadows
shadow-md: Medium shadows
shadow-xl: Large shadows
```

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Small devices */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

---

## ✅ Checklist

### Requester Side (Existing)

- [x] Dashboard
- [x] Create Request
- [x] My Requests
- [x] Messages
- [x] Profile
- [x] Settings
- [x] Layout Components
- [x] Routing

### Supporter Side (NEW!)

- [x] Dashboard
- [x] Browse Requests
- [x] Request Details Modal
- [x] My Contributions
- [x] Messages
- [x] Profile
- [x] Settings
- [x] Layout Components
- [x] Routing

### General

- [x] React Router Setup
- [x] Tailwind CSS Configuration
- [x] Icon System (Lucide)
- [x] Sample Data
- [x] Responsive Design
- [x] Role Switcher (Dev)
- [x] Documentation

---

## 🔜 Ready for Backend Integration

### API Endpoints Needed

#### Authentication

- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`
- POST `/api/auth/verify`

#### Requests

- GET `/api/requests` (Browse)
- GET `/api/requests/:id` (Details)
- POST `/api/requests` (Create)
- PUT `/api/requests/:id` (Update)
- DELETE `/api/requests/:id` (Delete)

#### Contributions

- GET `/api/contributions` (My Contributions)
- POST `/api/contributions` (Offer Help)
- PUT `/api/contributions/:id` (Update)

#### Messages

- GET `/api/messages/conversations`
- GET `/api/messages/:conversationId`
- POST `/api/messages` (Send)
- PUT `/api/messages/:id/read`

#### Profile

- GET `/api/profile`
- PUT `/api/profile`
- GET `/api/profile/stats`

---

## 📚 Documentation Files

1. **IMPLEMENTATION_SUMMARY.md** - Complete implementation summary
2. **SUPPORTER_DASHBOARD_README.md** - Supporter-specific docs
3. **REQUESTER_FRONTEND_README.md** - Requester-specific docs
4. **PROJECT_STRUCTURE.md** - This file (architecture overview)
5. **QUICK_START_GUIDE.md** - Quick start instructions

---

## 🎉 Status: COMPLETE

**All UI components for both Requester and Supporter roles are fully implemented and ready for backend integration!**

---

**Built with ❤️ for Hela Fund - Micro-Help & Support Platform**
