import express from 'express';
import {
  initiatePayment,
  handleNotify,
  completePaymentFromClient,
  verifyPayment
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.post('/notify', handleNotify);           // Public — called by PayHere servers
router.post('/complete', protect, completePaymentFromClient);
router.get('/verify/:orderId', protect, verifyPayment);

export default router;
