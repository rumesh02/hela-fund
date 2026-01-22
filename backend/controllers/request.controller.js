import Request from '../models/Request.model.js';

// @desc    Get all requests
// @route   GET /api/requests
// @access  Public
export const getRequests = async (req, res) => {
  try {
    const { category, status, urgency, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (urgency) query.urgency = urgency;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const requests = await Request.find(query)
      .populate('requester', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Request.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Public
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name email avatar bio location')
      .populate('supporters', 'name avatar');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Increment views
    request.views += 1;
    await request.save();

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      urgency, 
      itemLostLocation, 
      amount, 
      proofDocument,
      anonymous 
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !urgency) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, and urgency'
      });
    }

    // Validate conditional fields based on category
    if (category === 'Lost Item' && !itemLostLocation) {
      return res.status(400).json({
        success: false,
        message: 'Item lost location is required for Lost Item category'
      });
    }

    if (category === 'Micro-Funding' && !amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required for Micro-Funding category'
      });
    }

    // Prepare request data
    const requestData = {
      title,
      description,
      category,
      urgency,
      requester: req.user._id,
      anonymous: anonymous || false
    };

    // Add conditional fields only if category matches
    if (category === 'Lost Item') {
      requestData.itemLostLocation = itemLostLocation;
    }

    if (category === 'Micro-Funding') {
      requestData.amount = amount;
    }

    // Add proof document if provided
    if (proofDocument) {
      requestData.proofDocument = proofDocument;
    }

    const request = await Request.create(requestData);

    // Populate requester info before sending response
    await request.populate('requester', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
export const updateRequest = async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the owner
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user is the owner
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await request.deleteOne();

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get logged in user's requests
// @route   GET /api/requests/my-requests
// @access  Private
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ requester: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
