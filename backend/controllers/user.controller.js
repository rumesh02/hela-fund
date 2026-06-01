import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Request from '../models/Request.model.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is updating their own profile or is admin
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

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

// @desc    Get requester profile stats (request counts, funds received)
// @route   GET /api/users/:id/stats
// @access  Private
export const getProfileStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);

    const [totalRequests, completedRequests, fundsData] = await Promise.all([
      Request.countDocuments({ requester: userId }),
      Request.countDocuments({ requester: userId, status: 'completed' }),
      Request.aggregate([
        { $match: { requester: userId, category: 'Micro-Funding' } },
        { $group: { _id: null, total: { $sum: '$currentAmount' } } }
      ])
    ]);

    const fundsReceived = fundsData.length > 0 ? fundsData[0].total : 0;
    const successRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

    res.json({
      success: true,
      data: { totalRequests, completedRequests, fundsReceived, successRate }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is deleting their own account
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this account'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
