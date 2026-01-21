import express from 'express';
import { 
  getContributions, 
  getContributionById, 
  createContribution,
  getMyContributions,
  getRequestContributions
} from '../controllers/contribution.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getContributions);
router.get('/my-contributions', protect, getMyContributions);
router.get('/request/:requestId', getRequestContributions);
router.get('/:id', protect, getContributionById);
router.post('/', protect, createContribution);

export default router;
