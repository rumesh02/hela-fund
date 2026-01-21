import express from 'express';
import { 
  getMessages, 
  sendMessage, 
  markAsRead,
  getConversation
} from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getMessages);
router.get('/conversation/:userId', protect, getConversation);
router.post('/', protect, sendMessage);
router.put('/:id/read', protect, markAsRead);

export default router;
