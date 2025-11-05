# Hela Fund - Requester Frontend - Quick Start Guide

## 🚀 Quick Start

### Important: Node.js Version Issue

Your current Node.js version is **20.17.0**, but Vite requires **20.19+** or **22.12+**.

**Solution**: Upgrade Node.js before running the project.

---

## 📸 What You'll See

### Page Overview

#### 1. **Dashboard** (`/requester/dashboard`)

- Overview cards with total, pending, completed, and rejected requests
- Recent requests list
- Trust score widget
- Total funds received

#### 2. **Create Request** (`/requester/create-request`)

- Form with fields:
  - Request title
  - Detailed description
  - Category selector
  - Urgency level
  - Location
  - Proof upload
  - Anonymous option
- Submit and Clear buttons

#### 3. **My Requests** (`/requester/my-requests`)

- Filter tabs (All, Pending, In Progress, Completed, Rejected)
- Sortable table with:
  - Request title
  - Category
  - Status badges
  - Urgency levels
  - Date
  - Supporter count
  - Action buttons (View, Edit, Delete)
- Summary statistics

#### 4. **Messages** (`/requester/messages`)

- Left panel: List of conversations
  - Search bar
  - Online status indicators
  - Unread message counts
- Right panel: Active chat
  - Message history
  - Input field with emoji and attachment options

#### 5. **Profile** (`/requester/profile`)

- User avatar and basic info
- Contact details
- Academic information
- Trust score card
- Badges & achievements
- Activity summary
- Quick action buttons

#### 6. **Settings** (`/requester/settings`)

- Notification preferences (toggles)
- Privacy settings
- Security options
- Language & timezone
- Theme selection
- Help & support links

---

## 🎨 Design Highlights

### Color Palette

- **Primary**: Indigo-600 (#4F46E5)
- **Success**: Green-600
- **Warning**: Yellow-600
- **Danger**: Red-600
- **Background**: Gray-50
- **Cards**: White with shadow-sm

### Components

- **Rounded corners**: All cards use `rounded-xl`
- **Padding**: Consistent `p-6` for cards, `p-4` for smaller elements
- **Shadows**: Subtle `shadow-sm` for depth
- **Hover effects**: All interactive elements change on hover
- **Icons**: Lucide React icons throughout

### Responsive Breakpoints

- **Mobile**: < 768px (Sidebar collapses to hamburger menu)
- **Tablet**: 768px - 1024px (md:)
- **Desktop**: > 1024px (lg:)

---

## 🧩 Component Structure

```
App.jsx (Router)
└── RequesterLayout.jsx
    ├── Sidebar.jsx (Navigation)
    ├── Header.jsx (Top bar)
    └── [Page Component]
        ├── Dashboard.jsx
        ├── CreateRequest.jsx
        ├── MyRequests.jsx
        ├── Messages.jsx
        ├── Profile.jsx
        └── Settings.jsx
```

---

## 🔗 Navigation Flow

```
User lands on "/"
    → Redirects to "/requester/dashboard"

Sidebar Navigation:
    ├── Dashboard → "/requester/dashboard"
    ├── Create Request → "/requester/create-request"
    ├── My Requests → "/requester/my-requests"
    ├── Messages → "/requester/messages"
    ├── Profile → "/requester/profile"
    ├── Settings → "/requester/settings"
    └── Logout → (No functionality yet)
```

---

## 🛠️ Tech Stack

- **React 19.1.1**: UI library
- **React Router DOM 6**: Client-side routing
- **Tailwind CSS 4.1.16**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Vite 7.x**: Build tool and dev server

---

## ✅ Features Checklist

### Layout & Navigation

- [x] Responsive sidebar
- [x] Mobile hamburger menu
- [x] Top header with search
- [x] Active route highlighting
- [x] Smooth page transitions

### Dashboard

- [x] Statistics cards
- [x] Recent requests
- [x] Trust score display
- [x] Funds summary

### Create Request

- [x] Form validation
- [x] File upload
- [x] Category selection
- [x] Urgency levels
- [x] Anonymous option

### My Requests

- [x] Status filtering
- [x] Sortable table
- [x] Action buttons
- [x] Summary stats

### Messages

- [x] Conversation list
- [x] Chat interface
- [x] Online indicators
- [x] Unread counts
- [x] Message input

### Profile

- [x] User info display
- [x] Trust score
- [x] Badges system
- [x] Activity stats
- [x] Quick actions

### Settings

- [x] Notification toggles
- [x] Privacy controls
- [x] Theme selection
- [x] Language options
- [x] Help links

---

## 🐛 Known Issues

1. **Node.js Version**: Requires upgrade to 20.19+ or 22.12+
2. **No Backend**: All data is currently static/dummy data
3. **No Authentication**: Login/logout not implemented
4. **CSS Warnings**: `@tailwind` warnings in IDE (safe to ignore)

---

## 🎯 Next Development Steps

### Phase 1: Core Functionality

1. Upgrade Node.js
2. Test all pages
3. Fix any UI issues
4. Add more dummy data for testing

### Phase 2: Backend Integration

1. Set up API endpoints
2. Implement authentication
3. Connect forms to backend
4. Add real data fetching

### Phase 3: Advanced Features

1. Real-time messaging with WebSocket
2. File upload to server
3. Image optimization
4. Notification system

### Phase 4: Polish

1. Add loading states
2. Error handling
3. Form validation improvements
4. Performance optimization

---

## 💡 Tips for Development

1. **Mobile First**: Always test on mobile view first
2. **Component Reusability**: Extract repeated patterns into components
3. **State Management**: Consider Context API for global state
4. **Error Boundaries**: Add error boundaries for production
5. **Accessibility**: Test with keyboard navigation and screen readers

---

## 📱 Test on Different Screens

### Mobile (< 768px)

- Sidebar should collapse to hamburger menu
- Tables should be scrollable
- Cards should stack vertically

### Tablet (768px - 1024px)

- Sidebar visible
- 2-column grid layouts
- Chat interface should work

### Desktop (> 1024px)

- Full sidebar always visible
- 3-4 column grid layouts
- All features fully accessible

---

## 🎓 Learning Resources

- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [React Best Practices](https://react.dev)

---

**Happy Coding!** 🎉

Your Hela Fund Requester frontend is ready to go. Just upgrade Node.js and run `npm run dev`!
