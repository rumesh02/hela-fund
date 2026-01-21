import express from 'express';
import { 
  getRequests, 
  getRequestById, 
  createRequest, 
  updateRequest, 
  deleteRequest,
  getMyRequests
} from '../controllers/request.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getRequests);
router.get('/my-requests', protect, getMyRequests);
router.get('/:id', getRequestById);
router.post('/', protect, createRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

export default router;
