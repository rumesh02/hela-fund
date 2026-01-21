import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['requester', 'supporter']).withMessage('Role must be either requester or supporter'),
  body('nic').matches(/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/).withMessage('Valid NIC number is required'),
  
  // Requester-specific validation
  body('fullName').if(body('role').equals('requester')).trim().notEmpty().withMessage('Full name is required for requester'),
  body('university').if(body('role').equals('requester')).trim().notEmpty().withMessage('University is required for requester'),
  body('faculty').if(body('role').equals('requester')).trim().notEmpty().withMessage('Faculty is required for requester'),
  body('studentId').if(body('role').equals('requester')).trim().notEmpty().withMessage('Student ID is required for requester'),
  body('mobile').if(body('role').equals('requester')).matches(/^0[0-9]{9}$/).withMessage('Valid mobile number is required for requester'),
  
  // Supporter-specific validation
  body('name').if(body('role').equals('supporter')).trim().notEmpty().withMessage('Name is required for supporter')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['requester', 'supporter']).withMessage('Role must be either requester or supporter')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
