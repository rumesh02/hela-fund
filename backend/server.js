import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import requestRoutes from './routes/request.routes.js';
import foundRoutes from './routes/found.routes.js';
import contributionRoutes from './routes/contribution.routes.js';
import messageRoutes from './routes/message.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { setIo } from './socket.js';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Socket.io setup
const io = new Server(httpServer, { cors: corsOptions });

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  socket.join(`user_${socket.userId}`);
  socket.on('disconnect', () => {});
});

setIo(io);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hela Fund API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/founds', foundRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server using httpServer (not app.listen) so socket.io works
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
});

export default app;
