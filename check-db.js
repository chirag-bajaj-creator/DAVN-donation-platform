const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const User = require('./backend/models/User');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find();
    console.log('\n📋 All Users in Database:');
    console.log(JSON.stringify(users, null, 2));

    const volunteerUsers = await User.find({ role: 'user' });
    console.log('\n👤 Volunteer Users (role: user):');
    console.log(JSON.stringify(volunteerUsers, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();