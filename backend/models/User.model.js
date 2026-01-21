import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Common fields for both roles
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  nic: {
    type: String,
    required: [true, 'Please add NIC number'],
    trim: true,
    match: [
      /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/,
      'Please add a valid NIC number'
    ]
  },
  role: {
    type: String,
    enum: ['requester', 'supporter'],
    required: [true, 'Please specify a role']
  },
  
  // Requester-specific fields
  fullName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'requester';
    }
  },
  university: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'requester';
    }
  },
  faculty: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'requester';
    }
  },
  studentId: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'requester';
    }
  },
  studentIdImage: {
    type: String, // Store the file path or URL
    required: function() {
      return this.role === 'requester';
    }
  },
  mobile: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'requester';
    },
    match: [
      /^0[0-9]{9}$/,
      'Please add a valid mobile number'
    ]
  },
  
  // Supporter-specific fields
  name: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'supporter';
    }
  },
  
  // Optional fields
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  totalContributions: {
    type: Number,
    default: 0
  },
  totalRequests: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
