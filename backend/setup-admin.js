/**
 * Script to promote a user to admin role
 * Simply run: node setup-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

const main = async () => {
  try {
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB\n');

    // Show all users
    const allUsers = await User.find({}, 'email name role createdAt').sort({ createdAt: -1 });

    if (allUsers.length === 0) {
      console.log('❌ No users found in database. Please register first!');
      rl.close();
      process.exit(1);
    }

    console.log('📋 All Users in Database:\n');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role} | Created: ${new Date(user.createdAt).toLocaleDateString()}\n`);
    });

    // Ask which user to promote
    const choice = await askQuestion('Enter the number of user to make admin (1-' + allUsers.length + '): ');
    const userIndex = parseInt(choice) - 1;

    if (userIndex < 0 || userIndex >= allUsers.length) {
      console.log('❌ Invalid selection!');
      rl.close();
      process.exit(1);
    }

    const selectedUser = allUsers[userIndex];
    console.log(`\n🔍 Selected: ${selectedUser.name} (${selectedUser.email})`);

    if (selectedUser.role === 'admin') {
      console.log('⚠️  This user is already an admin!');
      rl.close();
      process.exit(0);
    }

    // Update user role
    const user = await User.findById(selectedUser._id);
    user.role = 'admin';
    await user.save();

    console.log(`✅ Role updated to: admin`);
    console.log(`✅ User is now ready to access the admin panel!\n`);
    console.log('📝 Next steps:');
    console.log('   1. Refresh your browser');
    console.log('   2. Log out from the admin app');
    console.log('   3. Log back in\n');

    rl.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
};

main();
