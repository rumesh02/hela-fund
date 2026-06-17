import Found from '../models/Found.model.js';
import Request from '../models/Request.model.js';
import { uploadToS3 } from '../utils/s3.js';
import { embed, cosineSimilarity, buildFoundText, buildLostText } from '../utils/embeddings.js';

// Found items scoring at least this cosine similarity to the lost item are
// considered plausible matches. all-MiniLM gives even unrelated item
// descriptions a baseline similarity (~0.3), while genuinely related items
// score noticeably higher, so we draw the line at 0.4 to cut false positives.
const MATCH_THRESHOLD = 0.4;
const MAX_MATCHES = 10;

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

    // Compute the semantic embedding so this item is searchable by AI matching.
    // If embedding fails for any reason, fall back gracefully — the match
    // endpoint will lazily backfill it later rather than blocking creation.
    try {
      foundData.embedding = await embed(buildFoundText(foundData));
    } catch (embedErr) {
      console.error('Found item embedding failed, will backfill on demand:', embedErr.message);
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

// @desc    Match a requester's lost-item request against reported found items
// @route   POST /api/founds/match
// @access  Private
export const matchLostItem = async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: 'requestId is required'
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Lost item request not found'
      });
    }

    // Only the owner of the lost item request may search for matches.
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to search this request'
      });
    }

    if (request.category !== 'Lost Item') {
      return res.status(400).json({
        success: false,
        message: 'This request is not a lost item'
      });
    }

    // Embed the lost item description (the search query).
    const queryVector = await embed(buildLostText(request));
    if (!queryVector.length) {
      return res.status(400).json({
        success: false,
        message: 'Lost item has no searchable description'
      });
    }

    // Pull active found items, including their stored embedding for scoring.
    const founds = await Found.find({ status: 'active' })
      .select('+embedding')
      .populate('supporter', 'name email avatar');

    const scored = [];
    for (const found of founds) {
      let vector = found.embedding;

      // Self-heal: older found items created before this feature won't have an
      // embedding yet. Compute and persist it once, then reuse it next time.
      if (!vector || vector.length === 0) {
        try {
          vector = await embed(buildFoundText(found));
          found.embedding = vector;
          await found.save();
        } catch (embedErr) {
          console.error(`Could not embed found item ${found._id}:`, embedErr.message);
          continue;
        }
      }

      const score = cosineSimilarity(queryVector, vector);
      if (score >= MATCH_THRESHOLD) {
        // Strip the embedding before sending to the client.
        const obj = found.toObject();
        delete obj.embedding;
        scored.push({
          ...obj,
          matchScore: score,
          matchPercent: Math.round(score * 100)
        });
      }
    }

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: Math.min(scored.length, MAX_MATCHES),
      data: scored.slice(0, MAX_MATCHES)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
