const jwt = require('jsonwebtoken');
require('dotenv').config();

// Decode a JWT token to see its contents
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token is valid!');
    console.log('Token Contents:');
    console.log(JSON.stringify(decoded, null, 2));
    return decoded;
  } catch (error) {
    console.error('❌ Token is invalid:', error.message);
  }
}

// Get token from command line argument
const token = process.argv[2];
if (!token) {
  console.log('Usage: node verify-token.js <token>');
  console.log('\nExample: node verify-token.js eyJhbGciOiJIUzI1NiIs...');
  process.exit(1);
}

verifyToken(token);
