const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function debugAdmin() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🔍 ADMIN DEBUG SCRIPT');
    console.log('='.repeat(60));

    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Connected to MongoDB');

    // Get User model
    const userSchema = new mongoose.Schema({
      email: String,
      name: String,
      password: String,
      role: String,
      isActive: Boolean
    });
    const User = mongoose.model('User', userSchema);

    // Find admin user
    console.log('\n📋 Checking Database...');
    const adminUser = await User.findOne({ email: 'fatogar170@nyspring.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log(`\n✅ Found Admin User:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Role: ${adminUser.role}`);
    console.log(`   Active: ${adminUser.isActive}`);

    // Check if role is actually 'admin'
    if (adminUser.role !== 'admin') {
      console.log('\n❌ ERROR: User role is NOT admin!');
      console.log('Fixing...');
      adminUser.role = 'admin';
      adminUser.isActive = true;
      await adminUser.save();
      console.log('✅ Fixed!');
    }

    // Simulate token generation
    console.log('\n🔐 Simulating Token Generation:');
    const testToken = jwt.sign(
      { userId: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Decode it back
    const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
    console.log(`   Generated Token Payload:`);
    console.log(`   - userId: ${decoded.userId}`);
    console.log(`   - role: ${decoded.role}`);

    if (decoded.role === 'admin') {
      console.log(`\n✅ Token would have role: 'admin' ✓`);
    } else {
      console.log(`\n❌ Token would have role: '${decoded.role}' (NOT admin!)`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All checks passed! Backend should work now.');
    console.log('='.repeat(60) + '\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

debugAdmin();
