const mongoose = require('mongoose');
const { logger } = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info({ host: conn.connection.host }, 'MongoDB connected');
    return conn;
  } catch (error) {
    logger.fatal({ err: error }, 'MongoDB connection failed');
    process.exit(1);
  }
};

module.exports = connectDB;
