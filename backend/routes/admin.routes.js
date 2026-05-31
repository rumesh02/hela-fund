import express from 'express';
import { adminLogin, getAdminMe, getUsers, verifyUser, banUser } from '../controllers/admin.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', protectAdmin, getAdminMe);

router.get('/users', protectAdmin, getUsers);
router.put('/users/:id/verify', protectAdmin, verifyUser);
router.put('/users/:id/ban', protectAdmin, banUser);

export default router;
