# Hravinder Backend API Documentation

## Overview
This is the production-ready Node.js/Express backend for the Hravinder Donation Platform. It implements 19 REST API endpoints with full authentication, validation, error handling, and integration with multiple third-party services.

## Tech Stack
- **Runtime**: Node.js 18+
- **Framework**: Express 4.18
- **Database**: MongoDB 7.0+ (via Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, CORS
- **Validation**: Joi
- **Rate Limiting**: express-rate-limit
- **QR Codes**: qrcode
- **File Upload**: Cloudinary
- **Email**: Nodemailer + SendGrid
- **Payments**: Razorpay/PayTM/PhonePe

## Project Structure
```
backend/
├── config/
│   ├── database.js       # MongoDB connection setup
│   └── env.js            # Environment variable validation
├── models/               # Mongoose schemas (6 files)
│   ├── User.js
│   ├── Donation.js
│   ├── NeededIndividual.js
│   ├── NeededOrganization.js
│   ├── QRPayment.js
│   └── VerificationReport.js
├── controllers/          # Business logic (5 files)
│   ├── authController.js
│   ├── donationController.js
│   ├── paymentController.js
│   ├── neededController.js
│   └── verificationController.js
├── routes/               # API endpoints (5 files)
│   ├── auth.js
│   ├── donations.js
│   ├── payments.js
│   ├── needy.js
│   └── verification.js
├── middleware/           # Custom middleware (4 files)
│   ├── authenticate.js   # JWT verification
│   ├── authorize.js      # Role-based access control
│   ├── validate.js       # Input validation
│   └── errorHandler.js   # Error standardization
├── services/             # External service integrations (4 files)
│   ├── emailService.js   # SendGrid/Nodemailer
│   ├── qrService.js      # UPI QR code generation
│   ├── uploadService.js  # Cloudinary integration
│   └── paymentService.js # Payment gateway
├── schemas/              # Joi validation schemas (4 files)
│   ├── userSchema.js
│   ├── donationSchema.js
│   ├── neededSchema.js
│   └── paymentSchema.js
├── server.js             # Express app entry point
├── package.json          # Dependencies
├── .env.example          # Environment variables template
└── API_DOCUMENTATION.md  # This file
```

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Update all values in `.env`:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/hravinder
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=1h
REFRESH_TOKEN_EXPIRE=7d
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@hravinder.com
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
UPI_MERCHANT_ID=your-merchant-id
EMAIL_PASSWORD=your-gmail-app-password
```

### 3. Start Server
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints (19 Total)

### Authentication (6 endpoints)
All auth endpoints use rate limiting: 5 attempts per 15 minutes

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe",
  "phone": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Validation Rules:**
- Email: Valid RFC 5322 format, must be unique
- Password: Minimum 8 characters
- Phone: Exactly 10 digits, must be unique
- Name: 2-100 characters
- Address: Optional, but city recommended

---

#### POST /api/auth/login
Authenticate user and receive JWT tokens.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Errors:**
- 401: Invalid email or password
- 403: User account is inactive

---

#### POST /api/auth/logout
Logout user session.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful",
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### POST /api/auth/forgot-password
Request password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "If an account exists with this email, you will receive a password reset link",
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### POST /api/auth/reset-password/:token
Reset password using reset token from email.

**Request:**
```json
{
  "password": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful",
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Errors:**
- 400: Invalid or expired reset token (expires after 24h)

---

#### POST /api/auth/refresh-token
Get new access token using refresh token.

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

### Donations (4 endpoints)
All donation endpoints require authentication.

#### POST /api/donations
Submit a new donation.

**Request:**
```json
{
  "type": "cash",
  "amount": 1000,
  "details": {
    "currency": "INR",
    "description": "Help for food assistance"
  }
}
```

**Supported Types:**
- `cash`: Currency, description
- `food`: foodType, quantity
- `shelter`: shelterType, duration
- `medical`: medicineType, doctorPermission
- `basic_needs`: items (array), quantity

**Response (201):**
```json
{
  "success": true,
  "message": "Donation submitted successfully",
  "data": {
    "donation_id": "507f1f77bcf86cd799439011",
    "type": "cash",
    "amount": 1000,
    "status": "submitted",
    "createdAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### GET /api/donations
Get user's donation history with pagination.

**Query Parameters:**
- `limit`: Max 100 per page (default: 20)
- `skip`: Pagination offset (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "donations": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "type": "cash",
        "amount": 1000,
        "status": "submitted",
        "createdAt": "2026-03-31T10:00:00Z",
        "updatedAt": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 20,
      "skip": 0,
      "pages": 3
    }
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### GET /api/donations/:id
Get specific donation details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "cash",
    "amount": 1000,
    "status": "submitted",
    "details": {
      "currency": "INR",
      "description": "Help for food"
    },
    "qr_payment": null,
    "donor": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210"
    },
    "createdAt": "2026-03-31T10:00:00Z",
    "updatedAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Errors:**
- 403: Only donation owner or admin can view
- 404: Donation not found

---

#### PATCH /api/donations/:id
Update donation status (admin only).

**Request:**
```json
{
  "status": "verified"
}
```

**Valid Statuses:** `submitted`, `verified`, `in_delivery`, `completed`

**Response (200):**
```json
{
  "success": true,
  "message": "Donation status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "type": "cash",
    "status": "verified",
    "updatedAt": "2026-03-31T10:05:00Z"
  },
  "timestamp": "2026-03-31T10:05:00Z"
}
```

---

### QR Payments (3 endpoints)

#### POST /api/qr-payments
Generate QR code for cash donation.

**Request:**
```json
{
  "donation_id": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "QR code generated successfully",
  "data": {
    "qr_id": "507f1f77bcf86cd799439013",
    "qr_code": "data:image/png;base64,...",
    "amount": 1000,
    "currency": "INR",
    "transactionId": "TXN-1711850400000-abc123",
    "status": "pending",
    "expiresAt": "2026-04-01T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Errors:**
- 400: QR code can only be for cash donations
- 404: Donation not found

---

#### GET /api/qr-payments/:id
Get QR payment status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "qr_id": "507f1f77bcf86cd799439013",
    "status": "completed",
    "amount": 1000,
    "currency": "INR",
    "transactionId": "TXN-1711850400000-abc123",
    "expiresAt": "2026-04-01T10:00:00Z",
    "completedAt": "2026-03-31T10:15:00Z",
    "createdAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### PATCH /api/qr-payments/:id
Update payment status (from webhook or manual).

**Request:**
```json
{
  "status": "completed",
  "transactionId": "TXN-1711850400000-abc123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "qr_id": "507f1f77bcf86cd799439013",
    "status": "completed",
    "amount": 1000,
    "transactionId": "TXN-1711850400000-abc123",
    "completedAt": "2026-03-31T10:15:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

### Needy Registration (5 endpoints)

#### POST /api/needy/individuals
Register individual for help.

**Request:**
```json
{
  "name": "Ram Kumar",
  "phone": "9876543210",
  "email": "ram@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "type_of_need": "food",
  "urgency": "high",
  "description": "Need food assistance for family of 4. Currently unemployed and struggling to feed..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration submitted. Your application is pending verification",
  "data": {
    "needy_id": "507f1f77bcf86cd799439014",
    "status": "pending",
    "createdAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Errors:**
- 422: Phone number already registered

---

#### POST /api/needy/organizations
Register organization for help.

**Request:**
```json
{
  "org_name": "Help India Foundation",
  "registration_number": "REG-12345",
  "org_type": "ngo",
  "phone": "9876543210",
  "address": {
    "city": "Mumbai",
    "state": "Maharashtra"
  },
  "contactPerson": {
    "name": "Ramesh Singh",
    "phone": "9876543211",
    "email": "ramesh@help.org"
  },
  "type_of_need": "shelter",
  "urgency": "high",
  "description": "We need shelter assistance for 50 homeless individuals..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Organization registration submitted. Your application is pending verification",
  "data": {
    "needy_id": "507f1f77bcf86cd799439015",
    "status": "pending",
    "createdAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### GET /api/needy/verified
Get verified needy cases with filters.

**Query Parameters:**
- `type_of_need`: Filter by type
- `urgency`: Filter by urgency
- `city`: Filter by city (case-insensitive)
- `limit`: Max results (default: 20, max: 100)
- `skip`: Pagination offset (default: 0)

**Example:**
```
GET /api/needy/verified?type_of_need=food&urgency=high&city=mumbai&limit=20
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "needy": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "type": "individual",
        "name": "Ram Kumar",
        "phone": "9876543210",
        "city": "Mumbai",
        "type_of_need": "food",
        "urgency": "high",
        "description": "Need food assistance for family of 4...",
        "score": 85,
        "createdAt": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 145,
      "limit": 20,
      "skip": 0,
      "pages": 8
    }
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### GET /api/needy/individuals/:id
Get individual details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Ram Kumar",
    "phone": "9876543210",
    "email": "ram@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai"
    },
    "type_of_need": "food",
    "urgency": "high",
    "description": "Need food assistance for family of 4...",
    "status": "verified",
    "trustScore": 85,
    "verified_by": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Admin User"
    },
    "createdAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

**Errors:**
- 403: Only verified records are publicly visible
- 404: Individual not found

---

#### GET /api/needy/organizations/:id
Get organization details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "org_name": "Help India Foundation",
    "registration_number": "REG-12345",
    "org_type": "ngo",
    "phone": "9876543210",
    "address": {
      "city": "Mumbai"
    },
    "contactPerson": {
      "name": "Ramesh Singh",
      "phone": "9876543211",
      "email": "ramesh@help.org"
    },
    "type_of_need": "shelter",
    "urgency": "high",
    "description": "We need shelter assistance...",
    "status": "verified",
    "credibilityScore": 90,
    "verified_by": {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Admin User"
    },
    "createdAt": "2026-03-31T10:00:00Z"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

### Verification (4 endpoints)

#### GET /api/verification/pending
Get pending verifications (admin only).

**Query Parameters:**
- `limit`: Default 20, max 100
- `skip`: Pagination offset

**Response (200):**
```json
{
  "success": true,
  "data": {
    "pending": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "type": "NeededIndividual",
        "name": "Ram Kumar",
        "phone": "9876543210",
        "city": "Mumbai",
        "type_of_need": "food",
        "urgency": "high",
        "createdAt": "2026-03-31T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 20,
      "skip": 0,
      "pages": 1
    }
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### POST /api/verification/assign
Assign volunteer to verify (admin only).

**Request:**
```json
{
  "needy_id": "507f1f77bcf86cd799439014",
  "needy_type": "NeededIndividual",
  "volunteer_id": "507f1f77bcf86cd799439017"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Volunteer assigned successfully",
  "data": {
    "report_id": "507f1f77bcf86cd799439018",
    "volunteer_id": "507f1f77bcf86cd799439017",
    "needy_id": "507f1f77bcf86cd799439014",
    "needy_type": "NeededIndividual",
    "status": "pending"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### POST /api/verification/reports
Submit verification report (volunteer).

**Request:**
```json
{
  "needy_id": "507f1f77bcf86cd799439014",
  "needy_type": "NeededIndividual",
  "status": "pending",
  "trustScore": 85,
  "recommendation": "approve",
  "verificationDetails": {
    "documentVerified": true,
    "addressVerified": true,
    "identityVerified": true,
    "comments": "All documents verified successfully",
    "issues": []
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Verification report submitted successfully",
  "data": {
    "report_id": "507f1f77bcf86cd799439018",
    "needy_id": "507f1f77bcf86cd799439014",
    "needy_type": "NeededIndividual",
    "status": "pending",
    "trustScore": 85,
    "recommendation": "approve"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

#### PATCH /api/verification/:id
Approve or reject registration (admin only).

**Request:**
```json
{
  "needy_id": "507f1f77bcf86cd799439014",
  "needy_type": "NeededIndividual",
  "status": "approved",
  "comment": "All verification completed successfully"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Registration approved successfully",
  "data": {
    "needy_id": "507f1f77bcf86cd799439014",
    "needy_type": "NeededIndividual",
    "status": "approved",
    "comment": "All verification completed successfully"
  },
  "timestamp": "2026-03-31T10:00:00Z"
}
```

---

## Authentication

### JWT Token Structure
All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

### Token Details
- **Access Token**: Expires in 1 hour
- **Refresh Token**: Expires in 7 days, should be stored securely (HTTP-only cookie)
- **Algorithm**: HS256

### Token Payload
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "user",
  "iat": 1711850400,
  "exp": 1711854000
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-03-31T10:00:00Z"
}
```

### HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | GET request successful |
| 201 | Created | New resource created |
| 400 | Bad Request | Invalid input format |
| 401 | Unauthorized | Invalid/expired token |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Business logic error |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Unexpected error |

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `DUPLICATE_ENTRY`: Unique constraint violated
- `UNAUTHORIZED`: No/invalid token
- `INVALID_TOKEN`: Token verification failed
- `TOKEN_EXPIRED`: Token has expired
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_SERVER_ERROR`: Unexpected error

---

## Security Features

### Password Security
- Hashed with bcryptjs (10 salt rounds)
- Minimum 8 characters
- Reset tokens valid for 24 hours only

### Rate Limiting
- Auth endpoints: 5 attempts per 15 minutes
- General API: 100 requests per 15 minutes per IP
- File uploads: 50 per hour per user

### CORS
- Restricted to frontend URL
- Credentials enabled
- Headers: Content-Type, Authorization

### Security Headers
- Content-Security-Policy: default-src 'self'
- X-Frame-Options: DENY
- Strict-Transport-Security: max-age=31536000
- X-Content-Type-Options: nosniff

### Data Protection
- Passwords never returned in responses
- Sensitive data excluded from API responses
- Email addresses hashed for reset tokens
- SQL/NoSQL injection prevention via Mongoose

---

## Database Specifications

### Collections (6)
1. **Users**: Authentication, profiles, roles
2. **Donations**: All donation submissions
3. **NeededIndividuals**: Individual help requests
4. **NeededOrganizations**: Organization help requests
5. **QRPayments**: Payment tracking with 24h TTL
6. **VerificationReports**: Immutable audit trail

### Indexes
All filter fields are indexed for performance:
- Email, phone, role (Users)
- donor_id, type, status, createdAt (Donations)
- status, urgency, city, trustScore (NeededIndividual)
- registration_number, status, credibilityScore (NeededOrganization)
- donation_id, transactionId, expiryAt (QRPayment)
- needy_id, verified_by, status (VerificationReport)

---

## Testing the API

### Using cURL
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User",
    "phone": "9876543210"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# Submit donation (with token)
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "type": "cash",
    "amount": 1000,
    "details": {
      "description": "Help for food"
    }
  }'
```

### Using Postman
1. Import the API endpoints into Postman
2. Set base URL: `http://localhost:5000`
3. Create auth environment variables for tokens
4. Test each endpoint with provided examples

---

## Deployment

### Production Checklist
- [ ] Update JWT_SECRET with strong random key
- [ ] Use MongoDB Atlas or managed database service
- [ ] Configure SendGrid API key
- [ ] Set up Cloudinary account
- [ ] Configure Razorpay/PayTM credentials
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS/SSL
- [ ] Set FRONTEND_URL to production domain
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Enable database backups
- [ ] Test all integrations
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables on hosting

### Hosting Options
- **Backend**: Render, Railway, Heroku, AWS, GCP
- **Database**: MongoDB Atlas, AWS DocumentDB
- **File Storage**: Cloudinary, AWS S3
- **Email**: SendGrid, AWS SES
- **Payments**: Razorpay, PayTM, PhonePe

---

## Performance Optimization

### Current Optimizations
- Database indexing on filter fields
- Pagination limits (max 100 per page)
- Query optimization with projections
- Error handling prevents crashes
- Rate limiting prevents abuse
- Gzip compression

### Future Enhancements
- Caching (Redis) for frequently accessed data
- Pagination cursor-based instead of offset
- Async job queue for email/notifications
- Database query optimization
- API response compression
- Connection pooling

---

## Support & Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check MONGODB_URI format
- Verify credentials and cluster access
- Ensure IP whitelist includes server

**JWT Errors**
- Verify JWT_SECRET matches between login and protected routes
- Check token expiry time
- Ensure Authorization header format: `Bearer <token>`

**Rate Limiting**
- Wait 15 minutes before retrying
- Distribute requests across time
- Contact admin for whitelist if needed

**QR Payment Issues**
- Check UPI_MERCHANT_ID is valid
- Verify Razorpay credentials
- Ensure amount is positive number

---

## Version History
- v1.0.0 - Initial release with 19 endpoints
- All 6 models, 5 controllers, 5 routes implemented
- Full authentication and authorization
- Production-ready error handling

---

**Last Updated**: March 31, 2026
**Maintainer**: Hravinder Development Team
