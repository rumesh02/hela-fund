import mongoose from 'mongoose';

const foundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an item title'],
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
    enum: [
      'Bags & Accessories', 'Electronics', 'Documents & Cards',
      'Personal Items', 'Jewellery', 'Keys', 'Clothing', 'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please add where the item was found'],
    trim: true,
    maxlength: 500
  },
  foundDate: {
    type: Date,
    required: [true, 'Please add the date the item was found']
  },
  images: [{
    name: String,
    url: String
  }],
  contactName: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add a contact phone number'],
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  // The supporter who reported the found item
  supporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'returned', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const Found = mongoose.model('Found', foundSchema);

export default Found;
