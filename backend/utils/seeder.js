/**
 * Database Seeder for Hela Fund
 * This file creates sample users for testing purposes
 * 
 * Usage: node backend/utils/seeder.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hela-fund';

// Sample users data
const sampleUsers = [
  // Requester 1
  {
    email: 'requester1@university.edu',
    password: 'password123',
    role: 'requester',
    nic: '200012345678',
    fullName: 'Saman Perera',
    university: 'University of Colombo',
    faculty: 'Faculty of Science',
    studentId: 'SC/2022/1234',
    mobile: '0771234567',
    studentIdImage: 'sample_id_1.jpg',
    bio: 'Third-year Computer Science student seeking support for educational expenses.'
  },
  // Requester 2
  {
    email: 'requester2@university.edu',
    password: 'password123',
    role: 'requester',
    nic: '200187654321',
    fullName: 'Nimal Silva',
    university: 'University of Peradeniya',
    faculty: 'Faculty of Engineering',
    studentId: 'EN/2021/5678',
    mobile: '0779876543',
    studentIdImage: 'sample_id_2.jpg',
    bio: 'Engineering student passionate about innovation and technology.'
  },
  // Supporter 1
  {
    email: 'supporter1@email.com',
    password: 'password123',
    role: 'supporter',
    nic: '198512345678',
    name: 'Kamal Fernando',
    bio: 'Software engineer passionate about helping students achieve their educational goals.'
  },
  // Supporter 2
  {
    email: 'supporter2@email.com',
    password: 'password123',
    role: 'supporter',
    nic: '199087654321',
    name: 'Anjali Wijesinghe',
    bio: 'Entrepreneur committed to supporting education in Sri Lanka.'
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    console.log('🗑️  Clearing existing users...');
    await User.deleteMany({});

    // Create sample users
    console.log('📝 Creating sample users...');
    const createdUsers = await User.create(sampleUsers);

    console.log(`✅ ${createdUsers.length} sample users created successfully!`);
    console.log('\n📋 Sample User Credentials:');
    console.log('\n👨‍🎓 Requesters:');
    console.log('   Email: requester1@university.edu | Password: password123');
    console.log('   Email: requester2@university.edu | Password: password123');
    console.log('\n🤝 Supporters:');
    console.log('   Email: supporter1@email.com | Password: password123');
    console.log('   Email: supporter2@email.com | Password: password123');
    console.log('\n💡 Note: Requesters can login as both requester and supporter');
    console.log('   Supporters can only login as supporter\n');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Clear database
const clearDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing all users...');
    await User.deleteMany({});
    console.log('✅ All users cleared successfully!');

  } catch (error) {
    console.error('❌ Clearing failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--clear')) {
  clearDatabase();
} else {
  seedDatabase();
}

export { seedDatabase, clearDatabase };
