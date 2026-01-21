# Hela Fund Backend API

A RESTful API built with Node.js, Express.js, and MongoDB for the Hela Fund platform.

## Features

- User authentication and authorization with JWT
- Request management (create, read, update, delete)
- Contribution tracking
- Messaging system
- Role-based access control (Requester/Supporter)
- Input validation and error handling
- MongoDB integration with Mongoose

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

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

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

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

### User

- name, email, password (hashed)
- role (requester/supporter/both)
- profile information (phone, avatar, bio, location)
- statistics (totalContributions, totalRequests)

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

Run in development mode with auto-restart:

```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required environment variables.

## License

ISC
