const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users to see what exists
    const allUsers = await User.find({}).select('email name role isActive');
    console.log('\n📋 Current Users:');
    console.log(allUsers);

    // Update the first user to be admin (or find by email if needed)
    if (allUsers.length > 0) {
      const adminUser = await User.findByIdAndUpdate(
        allUsers[0]._id,
        { role: 'admin', isActive: true },
        { new: true }
      );
      console.log('\n✅ Updated Admin User:');
      console.log(adminUser);
    } else {
      console.log('\n❌ No users found. Create a user first via registration.');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAdmin();
