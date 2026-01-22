import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 2000
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Lost Item', 'Micro-Funding', 'Community Help']
  },
  urgency: {
    type: String,
    required: [true, 'Please add urgency level'],
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  // Conditional field: only for Lost Item category
  itemLostLocation: {
    type: String,
    trim: true,
    maxlength: 500,
    required: function() {
      return this.category === 'Lost Item';
    }
  },
  // Conditional field: only for Micro-Funding category
  amount: {
    type: Number,
    min: 0,
    required: function() {
      return this.category === 'Micro-Funding';
    }
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'Rupees',
    enum: ['Rupees', 'USD', 'EUR', 'GBP', 'INR', 'NGN']
  },
  // Proof document (placeholder for now)
  proofDocument: {
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supporters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  contributionsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate progress percentage (only for Micro-Funding)
requestSchema.virtual('progress').get(function() {
  if (this.category === 'Micro-Funding' && this.amount) {
    return Math.round((this.currentAmount / this.amount) * 100);
  }
  return 0;
});

// Ensure virtuals are included in JSON
requestSchema.set('toJSON', { virtuals: true });
requestSchema.set('toObject', { virtuals: true });

const Request = mongoose.model('Request', requestSchema);

export default Request;
