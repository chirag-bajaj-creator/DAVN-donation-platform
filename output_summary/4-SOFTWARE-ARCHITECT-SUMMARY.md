# Software Architect Summary - API & System Design

## System Architecture

```
Frontend (React - Vercel)
        ↓ HTTPS REST API
Backend (Node.js/Express - Render)
        ↓ MongoDB Driver
Database (MongoDB Atlas)
        + Cloudinary (files)
        + SendGrid (email)
        + Payment Gateway (QR)
```

---

## 19 API Endpoints Overview

### AUTH ENDPOINTS (6)
```
POST   /api/auth/register              → Create user account
POST   /api/auth/login                 → Login, return JWT token
POST   /api/auth/logout                → Clear session
POST   /api/auth/forgot-password       → Send reset email
POST   /api/auth/reset-password/:token → Confirm password change
POST   /api/auth/refresh-token         → Get new access token
```

### DONATION ENDPOINTS (4)
```
POST   /api/donations                  → Submit donation (any of 5 types)
GET    /api/donations                  → List user's donations (paginated)
GET    /api/donations/:id              → Get donation details
PATCH  /api/donations/:id              → Update status (admin only)
```

### PAYMENT ENDPOINTS (3)
```
POST   /api/qr-payments                → Generate QR for cash donation
GET    /api/qr-payments/:id            → Check QR status
PATCH  /api/qr-payments/:id            → Update from webhook (payment confirmed)
```

### NEEDY ENDPOINTS (5)
```
POST   /api/needy/individuals          → Register individual for help
POST   /api/needy/organizations        → Register organization for help
GET    /api/needy/verified             → Get verified cases (with filters)
GET    /api/needy/individuals/:id      → Get individual details
GET    /api/needy/organizations/:id    → Get org details
```

### VERIFICATION ENDPOINTS (4)
```
GET    /api/verification/pending       → List pending (admin)
POST   /api/verification/assign        → Assign volunteer to verify (admin)
POST   /api/verification/reports       → Submit verification report (volunteer)
PATCH  /api/verification/:id           → Approve/reject (admin)
```

---

## Database Collections

### Collection 1: Users
```
{
  email (unique, lowercase),
  password (bcrypt hashed),
  name,
  phone (unique, formatted),
  role (enum: user, admin),
  address {street, city, state, zipCode, country},
  isActive,
  isEmailVerified,
  createdAt, updatedAt
}
Indexes: email, phone, role, (role+isActive)
```

### Collection 2: Donations
```
{
  donor_id (ref: Users),
  type (enum: cash, food, shelter, medical, basic_needs),
  amount,
  status (enum: submitted, verified, in_delivery, completed),
  details {
    [type-specific fields like foodType, shelterType, etc]
  },
  qr_payment_id (ref: QRPayments, for cash),
  createdAt, updatedAt
}
Indexes: donor_id, type, status, createdAt
```

### Collection 3: NeededIndividuals
```
{
  name, phone, email,
  address {street, city, state, zipCode},
  type_of_need, urgency, description,
  status (enum: pending, verified, rejected),
  documents [{type, url, uploadedAt}],
  verified_by (ref: Users, admin id),
  trustScore (0-100),
  createdAt, updatedAt
}
Indexes: status, urgency, city, trustScore
TTL: Soft delete (use status), archive after 2 years
```

### Collection 4: NeededOrganizations
```
{
  org_name, registration_number (unique),
  org_type, phone,
  address {street, city, state, zipCode},
  contactPerson {name, phone, email},
  type_of_need, urgency, description,
  status (enum: pending, verified, rejected),
  documents [{type, url, uploadedAt}],
  verified_by (ref: Users),
  credibilityScore (0-100),
  createdAt, updatedAt
}
Indexes: registration_number, status, credibilityScore
TTL: Keep indefinitely (compliance)
```

### Collection 5: QRPayments
```
{
  donation_id (ref: Donations),
  qr_code (unique, base64 UPI link),
  amount,
  currency (default: INR),
  transactionId (unique),
  status (enum: pending, completed, expired),
  paymentGateway (razorpay, paytm, phonepe),
  expiryAt (TTL: auto-delete after 24h),
  completedAt,
  createdAt, updatedAt
}
Indexes: donation_id, qr_code, transactionId, expiryAt (TTL)
```

### Collection 6: VerificationReports
```
{
  needy_id (ObjectId),
  needy_type (enum: NeededIndividual, NeededOrganization),
  verified_by (ref: Users, admin/volunteer),
  status (enum: approved, rejected, pending),
  verificationDetails {
    documentVerified, addressVerified, identityVerified,
    comments, issues []
  },
  trustScore (0-100),
  recommendation (approve, reject, hold),
  priority (1-5),
  createdAt, verifiedAt, updatedAt
}
Indexes: needy_id, verified_by, status, trustScore
IMMUTABLE: Never delete (audit trail)
```

---

## API Request/Response Examples

### Register
```javascript
POST /api/auth/register

Request:
{
  email: "user@example.com",
  password: "Password123!",
  name: "John Doe",
  phone: "9876543210",
  address: {
    city: "Mumbai",
    state: "Maharashtra"
  }
}

Response (201):
{
  success: true,
  message: "Registration successful",
  data: {
    user_id: "xyz123",
    email: "user@example.com",
    name: "John Doe"
  }
}
```

### Submit Cash Donation
```javascript
POST /api/donations

Request:
{
  type: "cash",
  amount: 1000,
  details: {
    currency: "INR",
    description: "Help for food"
  }
}

Response (201):
{
  success: true,
  data: {
    donation_id: "don123",
    type: "cash",
    status: "submitted",
    createdAt: "2026-03-31T10:00:00Z"
  }
}
```

### Generate QR for Cash
```javascript
POST /api/qr-payments

Request:
{
  donation_id: "don123"
}

Response (201):
{
  success: true,
  data: {
    qr_id: "qr456",
    qr_code: "base64_encoded_qr_image",
    amount: 1000,
    currency: "INR",
    expiresAt: "2026-03-31T11:00:00Z",
    status: "pending"
  }
}
```

### Register Individual for Help
```javascript
POST /api/needy/individuals

Request:
{
  name: "Ram Kumar",
  phone: "9876543210",
  address: {
    street: "123 Main St",
    city: "Mumbai",
    state: "Maharashtra"
  },
  type_of_need: "food",
  urgency: "high",
  description: "Need food assistance for family of 4"
}

Response (201):
{
  success: true,
  data: {
    needy_id: "need123",
    status: "pending",
    message: "Your registration is pending verification"
  }
}
```

### Get Verified Cases
```javascript
GET /api/needy/verified?type_of_need=food&urgency=high&city=mumbai&limit=20

Response (200):
{
  success: true,
  data: {
    needy: [
      {
        _id: "need123",
        name: "Ram Kumar",
        type_of_need: "food",
        urgency: "high",
        description: "Need food assistance",
        verified_by: "admin456",
        verifiedAt: "2026-03-29T10:00:00Z"
      }
    ],
    total: 45,
    limit: 20,
    skip: 0
  }
}
```

---

## Security Implementation

### Password
- Hashing: bcryptjs with 10 salt rounds
- Minimum: 8 characters
- Reset: Valid for 24 hours only

### JWT Tokens
- Access token: Expires 1 hour
- Refresh token: Expires 7 days (HTTP-only cookie)
- Algorithm: HS256

### Rate Limiting
- Login attempts: Max 5 per 15 minutes
- API calls: 100 per minute per user
- File uploads: 50 per hour per user

### Input Validation
- Email: RFC 5322 format
- Phone: 10 digits (India format)
- Text fields: XSS prevention (DOMPurify)
- Numbers: Type + range validation

### CORS & Headers
```
Content-Security-Policy: "default-src 'self'"
X-Frame-Options: "DENY"
Strict-Transport-Security: "max-age=31536000"
X-Content-Type-Options: "nosniff"
```

---

## Folder Structure

### Backend
```
backend/
├── config/
│   ├── database.js
│   └── env.js
├── models/ (6 files)
├── controllers/ (5 files)
├── routes/ (5 files)
├── middleware/ (4 files: auth, validate, error, rateLimit)
├── services/ (4 files: email, QR, upload, payment)
├── schemas/ (4 files: Joi validation)
├── server.js (entry point)
├── package.json
└── .env.example
```

### Frontend
```
frontend/
├── src/
│   ├── components/ (20+ components)
│   ├── pages/ (8 pages)
│   ├── services/ (5 API services)
│   ├── hooks/ (3 custom hooks)
│   ├── context/ (AuthContext)
│   ├── utils/ (validators, formatters)
│   ├── styles/ (CSS files)
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── .env.example
```

---

## HTTP Status Codes

| Code | Usage | Example |
|------|-------|---------|
| 200 | Success | GET request successful |
| 201 | Created | POST creates new resource |
| 400 | Bad Request | Invalid email format, validation error |
| 401 | Unauthorized | Invalid credentials, expired token |
| 403 | Forbidden | User lacks permission (not admin) |
| 404 | Not Found | Donation ID doesn't exist |
| 422 | Validation Error | Business logic error (email exists) |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Unexpected error |

---

## Third-Party Integrations

### Cloudinary (File Uploads)
- Folders: donations/, needy/, user_profiles/
- Max file: 5MB
- Formats: PDF, JPG, PNG, DOCX
- Auto-delete: After 1 year

### SendGrid (Email)
- Templates: Registration, password reset, donation confirmation, verification status
- Rate: 100 emails/minute
- From: noreply@hravinder.com

### QR Payment Gateway
- Supported: Razorpay, PayTM, PhonePe
- Flow: Generate QR → User pays → Webhook updates → System confirms
- Webhook signature verification required
- QR expires: 24 hours

---

## Implementation Checklist

**Backend** (6-8 hours)
- [ ] Package.json + dependencies
- [ ] MongoDB connection
- [ ] All 6 models with schemas
- [ ] All 19 endpoint implementations
- [ ] Authentication middleware
- [ ] Input validation (Joi schemas)
- [ ] Error handling
- [ ] Rate limiting
- [ ] Environment variables

**Frontend** (6-8 hours)
- [ ] React setup + routing
- [ ] All 8 pages
- [ ] 20+ components
- [ ] API service layer
- [ ] Form validation
- [ ] Mobile-responsive CSS
- [ ] Loading/error states
- [ ] Authentication context

**Testing** (2-3 hours)
- [ ] API endpoint testing (Postman)
- [ ] Form validation testing
- [ ] Mobile responsiveness
- [ ] Security checks
- [ ] Error handling

---

## Tech Stack Summary

**Frontend**:
- React 18, Vite
- React Router 6
- Axios
- CSS3 (mobile-first)

**Backend**:
- Node.js 18+
- Express 4
- Mongoose
- JWT (jsonwebtoken)
- Bcryptjs
- Joi (validation)

**Database**:
- MongoDB Atlas

**Services**:
- Cloudinary (files)
- SendGrid (email)
- Razorpay/PayTM (payments)

**Deployment**:
- Frontend: Vercel
- Backend: Render
