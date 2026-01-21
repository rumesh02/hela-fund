import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.model.js';
import { checkRoleAccess, isValidRole } from '../utils/validators.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, role, ...otherFields } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate role
    if (!role || !isValidRole(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either requester or supporter'
      });
    }

    // Prepare user data based on role
    let userData = {
      email,
      password,
      role,
      nic: otherFields.nic
    };

    if (role === 'requester') {
      // Requester-specific fields
      userData = {
        ...userData,
        fullName: otherFields.fullName,
        university: otherFields.university,
        faculty: otherFields.faculty,
        studentId: otherFields.studentId,
        studentIdImage: otherFields.studentIdImage, // Handle file upload separately
        mobile: otherFields.mobile
      };
    } else if (role === 'supporter') {
      // Supporter-specific fields
      userData = {
        ...userData,
        name: otherFields.name
      };
    }

    // Create user
    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.role === 'supporter' ? user.name : user.fullName,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password, role } = req.body;

    // Validate that role is provided
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please select a role (requester or supporter)'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Role-based login validation
    // Requester can login as both requester and supporter
    // Supporter can only login as supporter
    const roleAccessCheck = checkRoleAccess(user.role, role);
    
    if (!roleAccessCheck.canAccess) {
      return res.status(403).json({
        success: false,
        message: roleAccessCheck.message
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
        loginRole: role, // The role they're logging in as
        name: user.role === 'supporter' ? user.name : user.fullName,
        avatar: user.avatar,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { email, bio, avatar, mobile, name, fullName } = req.body;

    // Common fields
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.avatar = avatar || user.avatar;

    // Role-specific fields
    if (user.role === 'requester') {
      user.fullName = fullName || user.fullName;
      user.mobile = mobile || user.mobile;
    } else if (user.role === 'supporter') {
      user.name = name || user.name;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
