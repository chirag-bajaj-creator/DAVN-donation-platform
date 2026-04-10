const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function getToken() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const userSchema = new mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      email: String,
      role: String
    });
    const User = mongoose.model('User', userSchema);
    const adminUser = await User.findOne({ email: 'fatogar170@nyspring.com' });
    
    if (!adminUser) {
      console.log('Admin not found');
      process.exit(1);
    }

    const token = jwt.sign(
      { userId: adminUser._id.toString(), role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('TOKEN:' + token);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getToken();
