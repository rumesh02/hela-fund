import Found from '../models/Found.model.js';
import { uploadToS3 } from '../utils/s3.js';

// @desc    Report a found item
// @route   POST /api/founds
// @access  Private
export const createFound = async (req, res) => {
  try {
    const {
      title, description, category, location, foundDate,
      contactName, contactPhone, contactEmail
    } = req.body;

    if (!title || !description || !category || !location || !foundDate || !contactName || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const foundData = {
      title,
      description,
      category,
      location,
      foundDate,
      contactName,
      contactPhone,
      contactEmail,
      supporter: req.user._id,
    };

    // Upload any attached images to S3
    if (req.files && req.files.length > 0) {
      foundData.images = await Promise.all(
        req.files.map(async (file) => ({
          name: file.originalname,
          url: await uploadToS3(file, 'found-items'),
        }))
      );
    }

    const found = await Found.create(foundData);
    await found.populate('supporter', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Found item reported successfully',
      data: found
    });
  } catch (error) {
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

// @desc    Get found items reported by the logged in supporter
// @route   GET /api/founds/my-founds
// @access  Private
export const getMyFounds = async (req, res) => {
  try {
    const founds = await Found.find({ supporter: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: founds.length,
      data: founds
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
