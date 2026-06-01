import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6
  }
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
