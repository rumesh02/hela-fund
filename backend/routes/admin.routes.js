import express from 'express';
import { adminLogin, getAdminMe, getUsers, verifyUser, banUser, getAdminRequests, verifyRequest, blockRequest, getReports } from '../controllers/admin.controller.js';
import { protectAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/me', protectAdmin, getAdminMe);

router.get('/users', protectAdmin, getUsers);
router.put('/users/:id/verify', protectAdmin, verifyUser);
router.put('/users/:id/ban', protectAdmin, banUser);

router.get('/requests', protectAdmin, getAdminRequests);
router.put('/requests/:id/verify', protectAdmin, verifyRequest);
router.put('/requests/:id/block', protectAdmin, blockRequest);

router.get('/reports', protectAdmin, getReports);

export default router;
