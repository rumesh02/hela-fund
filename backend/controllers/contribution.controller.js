import Contribution from '../models/Contribution.model.js';
import Request from '../models/Request.model.js';
import User from '../models/User.model.js';

// @desc    Get all contributions
// @route   GET /api/contributions
// @access  Private
export const getContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({})
      .populate('supporter', 'name email avatar')
      .populate('request', 'title category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contributions.length,
      data: contributions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contribution
// @route   GET /api/contributions/:id
// @access  Private
export const getContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id)
      .populate('supporter', 'name email avatar')
      .populate('request', 'title category requester');

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }

    res.json({
      success: true,
      data: contribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new contribution
// @route   POST /api/contributions
// @access  Private
export const createContribution = async (req, res) => {
  try {
    const { amount, message, requestId, paymentMethod, isAnonymous } = req.body;

    // Check if request exists
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if request is active
    if (request.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot contribute to inactive request'
      });
    }

    // Create contribution
    const contribution = await Contribution.create({
      amount,
      message,
      supporter: req.user._id,
      request: requestId,
      paymentMethod,
      isAnonymous: isAnonymous || false,
      paymentStatus: 'completed', // In production, this would be 'pending' until payment is confirmed
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    // Update request
    request.currentAmount += amount;
    request.contributionsCount += 1;
    
    if (!request.supporters.includes(req.user._id)) {
      request.supporters.push(req.user._id);
    }

    // Check if goal reached
    if (request.currentAmount >= request.targetAmount) {
      request.status = 'completed';
    }

    await request.save();

    // Update user's total contributions
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalContributions: 1 }
    });

    const populatedContribution = await Contribution.findById(contribution._id)
      .populate('supporter', 'name email avatar')
      .populate('request', 'title category');

    res.status(201).json({
      success: true,
      data: populatedContribution
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user's contributions
// @route   GET /api/contributions/my-contributions
// @access  Private
export const getMyContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ supporter: req.user._id })
      .populate('request', 'title category currentAmount targetAmount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contributions.length,
      data: contributions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get contributions for a specific request
// @route   GET /api/contributions/request/:requestId
// @access  Public
export const getRequestContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ 
      request: req.params.requestId,
      paymentStatus: 'completed'
    })
      .populate('supporter', 'name avatar')
      .sort({ createdAt: -1 });

    // Hide supporter details for anonymous contributions
    const sanitizedContributions = contributions.map(contribution => {
      if (contribution.isAnonymous) {
        return {
          ...contribution.toObject(),
          supporter: { name: 'Anonymous', avatar: '' }
        };
      }
      return contribution;
    });

    res.json({
      success: true,
      count: sanitizedContributions.length,
      data: sanitizedContributions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
