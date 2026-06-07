import express from 'express';
import {
  getMessages,
  getConversations,
  getConversation,
  sendMessage,
  markConversationRead,
  markAsRead,
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getMessages);
router.get('/conversations', protect, getConversations);
router.get('/conversation/:userId', protect, getConversation);
router.post('/', protect, sendMessage);
router.put('/conversation/:userId/read', protect, markConversationRead);
router.put('/:id/read', protect, markAsRead);

export default router;
