require('dotenv').config();
require('express-async-errors');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const neededRoutes = require('./routes/needy');
const paymentRoutes = require('./routes/payments');
const verificationRoutes = require('./routes/verification');
const uploadRoutes = require('./routes/uploads');
const volunteerRoutes = require('./routes/volunteer');
const adminRoutes = require('./routes/admin');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const authenticate = require('./middleware/authenticate');
const { setSocketServer } = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://davn-donation-platform.vercel.app',
  'https://davn-donation-platform-hadr.vercel.app',
  'https://davn-donation-platform-ac79.vercel.app'
].map((origin) => origin.replace(/\/$/, ''));

// Security middleware
app.use(helmet());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts
  message: 'Too many login attempts, please try again later'
});

// Disable rate limiting for development/testing
// app.use('/api/', limiter);
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.use((socket, next) => {
  try {
    const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    return next();
  } catch (error) {
    return next(new Error('Invalid authentication token'));
  }
});

io.on('connection', (socket) => {
  const { userId, role } = socket.user;

  socket.join(`user:${userId}`);

  if (role === 'admin') {
    socket.join('role:admin');
  }
});

setSocketServer(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', authenticate, donationRoutes);
app.use('/api/needy', neededRoutes);
app.use('/api/qr-payments', authenticate, paymentRoutes);
app.use('/api/verification', authenticate, verificationRoutes);
app.use('/api/uploads', authenticate, uploadRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  errorHandler(err, req, res);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✓ Connected to MongoDB');
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
