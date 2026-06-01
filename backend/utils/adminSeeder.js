/**
 * Admin Seeder for Hela Fund
 * Creates test admin users in the admins collection
 *
 * Usage: npm run seed:admin
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hela-fund';

const sampleAdmins = [
  {
    name: 'Super Admin',
    email: 'admin@helafund.com',
    password: 'admin123'
  },
  {
    name: 'Test Admin',
    email: 'testadmin@helafund.com',
    password: 'admin123'
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const seedAdmins = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing admins...');
    await Admin.deleteMany({});

    console.log('📝 Creating sample admins...');
    const createdAdmins = await Admin.create(sampleAdmins);

    console.log(`✅ ${createdAdmins.length} admins created successfully!`);
    console.log('\n📋 Admin Credentials:');
    console.log('   Email: admin@helafund.com     | Password: admin123');
    console.log('   Email: testadmin@helafund.com | Password: admin123\n');
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

seedAdmins();
