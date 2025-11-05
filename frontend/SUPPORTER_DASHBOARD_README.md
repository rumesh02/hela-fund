# Hela Fund - Supporter Dashboard

## Overview

This is the complete UI implementation for the **Supporter** role in the Hela Fund platform - a micro-help and support platform for university students.

Supporters are community members who browse and help with student requests for assistance.

## Features Implemented

### 🎯 Dashboard

- Summary cards showing:
  - Total Contributions
  - Completed Helps
  - Ongoing Support
  - Trust Score
- Recent activity timeline
- Badges & achievements display
- Quick action buttons

### 🔍 Browse Requests

- Grid/card view of all active student requests
- Advanced filtering:
  - Category filter (Books, Electronics, Transport, Medical, Food, Other)
  - Urgency filter (High, Medium, Low)
  - Location filter
  - Search bar for keywords
- Request cards display:
  - Title, description, category icon
  - Urgency badge
  - Requester information
  - Location and posted date
  - Estimated amount
- View Details button opens modal with full information
- "Offer Help" button in modal

### ❤️ My Contributions

- List of all supported requests
- Status-based filtering (All, Pending, Ongoing, Completed)
- Summary statistics cards
- Each contribution shows:
  - Request details
  - Requester information
  - Contribution amount
  - Status badge
  - Message button with unread count
  - View details button

### 💬 Messages

- Chat interface layout
- Conversation list with:
  - Search functionality
  - Online status indicators
  - Unread message badges
- Active chat view with:
  - Chat header with requester info
  - Request context banner
  - Message history
  - Message input with send button
  - Attachment support (UI only)

### 👤 Profile

- View and edit supporter details:
  - Personal information (name, contact)
  - Bio and occupation
  - Location details
- Trust score display with verification badge
- Quick stats section
- Badges & achievements gallery
- Recent testimonials from requesters
- Editable form with save/cancel

### ⚙️ Settings

- **Notification Settings:**
  - Email notifications
  - Push notifications
  - New request alerts
  - Message notifications
  - Contribution updates
  - Weekly digest
- **Privacy Settings:**
  - Profile visibility control
  - Email/phone display options
  - Message permissions
- **Appearance:**
  - Theme selection (Light, Dark, Auto)
  - Language selection (English, Sinhala, Tamil)
- **Security:**
  - Two-factor authentication toggle
  - Change password
  - Login history
- Danger zone for account management

## Tech Stack

- **React 19** with Hooks
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons

## File Structure

```
frontend/src/
├── components/
│   └── Supporter/
│       ├── Header.jsx                 # Top navigation bar
│       ├── Sidebar.jsx                # Left navigation menu
│       └── RequestDetailsModal.jsx    # Modal for request details
├── layouts/
│   └── SupporterLayout.jsx           # Main layout wrapper
├── pages/
│   └── Supporter/
│       ├── Dashboard.jsx              # Overview page
│       ├── BrowseRequests.jsx         # Browse all requests
│       ├── MyContributions.jsx        # Track contributions
│       ├── Messages.jsx               # Chat interface
│       ├── Profile.jsx                # Supporter profile
│       └── Settings.jsx               # Settings page
├── data/
│   └── sampleData.js                 # Sample data including supporter info
└── App.jsx                           # Router configuration
```

## Routes

All Supporter routes are prefixed with `/supporter`:

- `/supporter/dashboard` - Main dashboard
- `/supporter/browse-requests` - Browse all requests
- `/supporter/my-contributions` - View contributions
- `/supporter/messages` - Chat with requesters
- `/supporter/profile` - Supporter profile
- `/supporter/settings` - Settings page

## Design Features

### Responsive Design

- Mobile-friendly with collapsible sidebar
- Responsive grid layouts
- Touch-friendly buttons and controls
- Optimized for all screen sizes

### Visual Consistency

- Matches Requester dashboard styling
- Consistent color scheme (blue primary)
- Soft shadows and rounded corners
- Clean, modern interface

### User Experience

- Intuitive navigation
- Clear visual hierarchy
- Status badges with color coding
- Loading states ready for backend integration
- Empty states with helpful messages

## Sample Data

The `sampleData.js` file includes:

- Sample supporter profile
- Mock request data
- Sample contributions
- Mock conversations
- All necessary dummy data for development

## Getting Started

### Run the Development Server

```bash
cd frontend
npm run dev
```

### Access the Supporter Dashboard

Open your browser and navigate to:

```
http://localhost:5173/supporter/dashboard
```

### Switch Between Roles

- Requester: `http://localhost:5173/requester/dashboard`
- Supporter: `http://localhost:5173/supporter/dashboard`

## Components Detail

### Header

- App name and role indicator
- Notification bell with badge
- User info with trust score
- Logout button

### Sidebar

- Collapsible on mobile
- Active route highlighting
- Icon-based navigation
- Logout option at bottom

### RequestDetailsModal

- Full request information
- Requester details
- Category and urgency
- "Offer Help" action button

## Next Steps for Backend Integration

1. **API Integration:**

   - Replace sample data with API calls
   - Implement authentication
   - Add real-time messaging
   - Connect payment processing

2. **State Management:**

   - Add Context API or Redux
   - Implement global state for user data
   - Handle authentication state

3. **Features to Add:**

   - File upload functionality
   - Payment gateway integration
   - Real-time notifications
   - Email notifications
   - Search with backend

4. **Security:**
   - Implement proper authentication
   - Add authorization checks
   - Secure API endpoints
   - Implement rate limiting

## Notes

- All functionality is UI-only (no backend logic)
- Authentication is assumed to be handled elsewhere
- Role selection happens before accessing these routes
- All data is currently from `sampleData.js`
- Ready for backend integration

## Styling Guidelines

- Primary color: Blue (#2563eb)
- Success: Green (#16a34a)
- Warning: Yellow (#eab308)
- Danger: Red (#dc2626)
- Gray shades for neutral elements
- Consistent spacing (4px grid)
- Shadow-sm for cards
- Rounded-lg for containers

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- Responsive down to 320px width

---

Built with ❤️ for the Hela Fund platform
