const axios = require('axios');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function testEndpoint() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 TESTING ADMIN ENDPOINTS');
    console.log('='.repeat(60));

    // Connect to DB and get admin user
    await mongoose.connect(process.env.MONGODB_URI);
    const userSchema = new mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      role: String
    });
    const User = mongoose.model('User', userSchema);
    const adminUser = await User.findOne({ email: 'fatogar170@nyspring.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log(`\n✅ Found Admin User: ${adminUser.email}`);
    console.log(`   Role in DB: ${adminUser.role}`);

    // Generate a fresh token
    console.log(`\n🔑 Generating Fresh Token...`);
    const freshToken = jwt.sign(
      { userId: adminUser._id.toString(), role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`   Token generated: ${freshToken.substring(0, 50)}...`);

    // Verify the token
    const decoded = jwt.verify(freshToken, process.env.JWT_SECRET);
    console.log(`   Token contains - role: '${decoded.role}'`);

    // Test the endpoint
    console.log(`\n🚀 Testing GET /api/admin/volunteers...`);
    const response = await axios.get('http://localhost:5000/api/admin/volunteers', {
      headers: {
        'Authorization': `Bearer ${freshToken}`
      },
      params: { page: 1, limit: 10 }
    });

    console.log(`\n✅ SUCCESS! Response:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Volunteers found: ${response.data.data.volunteers.length}`);
    
  } catch (error) {
    console.error(`\n❌ ERROR:`);
    console.error(`   Status: ${error.response?.status || 'No response'}`);
    console.error(`   Message: ${error.response?.data?.error || error.message}`);
    console.error(`   Full Response:`, error.response?.data);
  } finally {
    await mongoose.connection.close();
    console.log('\n' + '='.repeat(60));
  }
}

testEndpoint();
