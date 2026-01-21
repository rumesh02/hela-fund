# Hela Fund Backend API

A RESTful API built with Node.js, Express.js, and MongoDB for the Hela Fund platform.

## Features

- **Role-based Authentication** - Requester (students) and Supporter user types
- **JWT-based Authorization** - Secure token-based authentication
- **Request Management** - Create, read, update, delete funding requests
- **Contribution Tracking** - Track and manage contributions
- **Messaging System** - Communication between requesters and supporters
- **Advanced Role Access Control** - Requesters can access both portals, supporters restricted
- **Input Validation** - Comprehensive validation with express-validator
- **MongoDB Integration** - Mongoose ODM with conditional field validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

## 🆕 Authentication System (Updated)

### User Roles

1. **Requester (University Students)**
   - Can login as both requester and supporter
   - Required fields: fullName, email, password, university, faculty, studentId, studentIdImage, nic, mobile

2. **Supporter (Financial Contributors)**
   - Can only login as supporter
   - Required fields: name, email, password, nic

### Role-Based Access Logic

```
┌─────────────┬──────────────────┬──────────────────┐
│ User Role   │ Can Access       │ Cannot Access    │
├─────────────┼──────────────────┼──────────────────┤
│ Requester   │ Both portals ✓   │ None             │
│ Supporter   │ Supporter only ✓ │ Requester portal │
└─────────────┴──────────────────┴──────────────────┘
```

### Quick Test

Seed the database with sample users:

```bash
npm run seed
```

This creates 4 test users:
- **Requesters**: requester1@university.edu, requester2@university.edu
- **Supporters**: supporter1@email.com, supporter2@email.com
- **Password**: password123 (for all users)

Clear database:
```bash
npm run seed:clear
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):

```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hela-fund
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Start MongoDB (if running locally):

```bash
mongod
```

4. Run the server:

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user (requester or supporter)
- `POST /api/auth/login` - Login user (with role validation)
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

**See [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md) for detailed authentication documentation**

### Users

- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (protected)

### Requests

- `GET /api/requests` - Get all requests (public)
- `GET /api/requests/:id` - Get request by ID (public)
- `GET /api/requests/my-requests` - Get user's requests (protected)
- `POST /api/requests` - Create request (protected)
- `PUT /api/requests/:id` - Update request (protected)
- `DELETE /api/requests/:id` - Delete request (protected)

### Contributions

- `GET /api/contributions` - Get all contributions (protected)
- `GET /api/contributions/:id` - Get contribution by ID (protected)
- `GET /api/contributions/my-contributions` - Get user's contributions (protected)
- `GET /api/contributions/request/:requestId` - Get request contributions (public)
- `POST /api/contributions` - Create contribution (protected)

### Messages

- `GET /api/messages` - Get all user messages (protected)
- `GET /api/messages/conversation/:userId` - Get conversation with user (protected)
- `POST /api/messages` - Send message (protected)
- `PUT /api/messages/:id/read` - Mark message as read (protected)

## API Response Format

Success response:

```json
{
  "success": true,
  "data": { ... }
}
```

Error response:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Models

### User (Updated Schema)

**Common Fields:**
- email (unique, required), password (hashed, required)
- nic (National ID, required), role (requester/supporter, required)
- avatar, bio, isVerified, timestamps

**Requester-Specific:**
- fullName, university, faculty, studentId, studentIdImage
- mobile, totalRequests

**Supporter-Specific:**
- name, totalContributions

**Note:** Field requirements are conditional based on the user's role.

### Request

- title, description, category
- targetAmount, currentAmount, currency
- deadline, status, urgency
- requester reference
- supporters array
- images and documents

### Contribution

- amount, currency, message
- supporter and request references
- payment details (method, status, transactionId)
- isAnonymous flag

### Message

- sender and recipient references
- content, attachments
- read status and timestamp
- optional request reference

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes require valid JWT token
- Input validation using express-validator
- CORS enabled for frontend communication

## Development

### Available Scripts

```bash
# Start server in production mode
npm start

# Start server in development mode with auto-restart
npm run dev

# Seed database with sample users
npm run seed

# Clear all users from database
npm run seed:clear
```

### Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── auth.controller.js   # Authentication logic (updated)
│   ├── user.controller.js   # User management
│   ├── request.controller.js
│   ├── contribution.controller.js
│   └── message.controller.js
├── models/
│   ├── User.model.js        # User schema (updated with roles)
│   ├── Request.model.js
│   ├── Contribution.model.js
│   └── Message.model.js
├── routes/
│   ├── auth.routes.js       # Auth endpoints (updated validation)
│   ├── user.routes.js
│   ├── request.routes.js
│   ├── contribution.routes.js
│   └── message.routes.js
├── middleware/
│   ├── auth.middleware.js   # JWT verification
│   └── error.middleware.js  # Error handling
├── utils/
│   ├── validators.js        # Validation helpers (NEW)
│   └── seeder.js            # Database seeder (NEW)
├── server.js                # Entry point
└── package.json
```

### Documentation

- [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md) - Complete authentication API reference
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation details and changes

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
