import express from 'express';
import { createFound, getMyFounds, matchLostItem } from '../controllers/found.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 5), createFound);
router.get('/my-founds', protect, getMyFounds);
router.post('/match', protect, matchLostItem);

export default router;
