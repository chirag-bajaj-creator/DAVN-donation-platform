# Software Architect Output - Hravinder Donation Platform
## System Architecture & API Design (Steps 1-7)

---

## System Architecture Overview

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Client Layer (React JS - Vercel Deployment)                     │
│ - Login/Register Pages                                          │
│ - Dashboard (Donation, Needy, Volunteer sections)               │
│ - Forms (All 5 donation types, needy registration)              │
│ - Verified Needy Listing ("Check" section)                      │
│ - QR Payment Display                                            │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS REST API
┌──────────────────────▼──────────────────────────────────────────┐
│ Application Layer (Node.js + Express - Render Deployment)       │
│ - Authentication Service (JWT, bcrypt)                          │
│ - Donation Service (CRUD, validation)                           │
│ - Needy Service (registration, verification)                    │
│ - Payment Service (QR generation, tracking)                     │
│ - Email Service (SendGrid integration)                          │
│ - File Upload Service (Cloudinary integration)                  │
│ - Error Handling & Logging Middleware                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │ MongoDB Driver
┌──────────────────────▼──────────────────────────────────────────┐
│ Data Layer (MongoDB Atlas)                                       │
│ - Users Collection                                              │
│ - Donations Collection                                          │
│ - NeededIndividuals Collection                                  │
│ - NeededOrganizations Collection                                │
│ - QRPayments Collection                                         │
│ - VerificationReports Collection                                │
│ - Audit Logs Collection                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ External Services                                                │
│ - Cloudinary (Image/Document uploads)                           │
│ - SendGrid (Email notifications)                                │
│ - Payment Gateway (QR/UPI tracking)                             │
└─────────────────────────────────────────────────────────────────┘
```

### Microservices Structure

```
Backend (Node.js + Express)
├── Auth Service
│   ├── User registration with validation
│   ├── Secure login with JWT
│   ├── Password reset via email
│   ├── Role-based access control
│   └── Session management
├── Donation Service
│   ├── Submit donation (all 5 types)
│   ├── Retrieve donation history
│   ├── Update donation status
│   └── Validate donation details
├── Needy Service
│   ├── Individual registration
│   ├── Organization registration
│   ├── Pending registrations retrieval
│   ├── Verification workflow management
│   └── Verified needy listing
├── Payment Service
│   ├── QR code generation
│   ├── Payment status tracking
│   ├── QR expiration management
│   └── Payment confirmation
├── Email Service
│   ├── Registration confirmation
│   ├── Password reset emails
│   ├── Donation confirmation
│   ├── Verification status updates
│   └── Notification emails
└── File Upload Service
    ├── Document upload to Cloudinary
    ├── Image optimization
    ├── File validation
    └── CDN delivery
```

---

## MongoDB Collections (Complete Design)

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  name: String,
  phone: String (unique, formatted),
  role: String (enum: ['user', 'admin']),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: Boolean,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Donations Collection
```javascript
{
  _id: ObjectId,
  donor_id: ObjectId (ref: Users),
  type: String (enum: ['cash', 'food', 'shelter', 'medical', 'basic_needs']),
  amount: Number,
  status: String (enum: ['submitted', 'verified', 'in_delivery', 'completed']),
  details: {
    currency: String,
    foodType: String,
    quantity: Number,
    shelterType: String,
    medicineType: String,
    items: [String],
    description: String,
    pickupAddress: Object
  },
  qr_payment_id: ObjectId (ref: QRPayments),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. NeededIndividuals Collection
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  email: String,
  address: Object,
  type_of_need: String,
  urgency: String,
  description: String,
  status: String (enum: ['pending', 'verified', 'rejected']),
  documents: Array,
  verified_by: ObjectId (ref: Users),
  trustScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. NeededOrganizations Collection
```javascript
{
  _id: ObjectId,
  org_name: String,
  registration_number: String (unique),
  org_type: String,
  phone: String,
  address: Object,
  contactPerson: Object,
  type_of_need: String,
  urgency: String,
  description: String,
  status: String,
  documents: Array,
  verified_by: ObjectId (ref: Users),
  credibilityScore: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. QRPayments Collection
```javascript
{
  _id: ObjectId,
  donation_id: ObjectId (ref: Donations),
  qr_code: String (unique),
  amount: Number,
  currency: String,
  transactionId: String (unique),
  status: String (enum: ['pending', 'completed', 'expired']),
  paymentGateway: String,
  expiryAt: Date (TTL: 24 hours),
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. VerificationReports Collection
```javascript
{
  _id: ObjectId,
  needy_id: ObjectId,
  needy_type: String (enum: ['NeededIndividual', 'NeededOrganization']),
  verified_by: ObjectId (ref: Users),
  status: String (enum: ['approved', 'rejected', 'pending']),
  verificationDetails: Object,
  trustScore: Number,
  recommendation: String,
  priority: Number,
  createdAt: Date,
  verifiedAt: Date,
  updatedAt: Date
}
```

---

## API Contracts

### Authentication Endpoints

**POST /api/auth/register**
```
Request:
{
  email: String (required, valid email format),
  password: String (required, min 8 chars),
  name: String (required),
  phone: String (required, 10 digits),
  address: {
    street: String (optional),
    city: String (optional),
    state: String (optional),
    zipCode: String (optional)
  }
}

Response (201 Created):
{
  success: true,
  message: "Registration successful",
  data: {
    user_id: String,
    email: String,
    name: String
  }
}

Error (400/422):
{
  success: false,
  error: "Email already exists" | "Invalid email format" | "Password too weak"
}
```

**POST /api/auth/login**
```
Request:
{
  email: String (required),
  password: String (required)
}

Response (200 OK):
{
  success: true,
  message: "Login successful",
  data: {
    access_token: String (JWT, expires 1 hour),
    refresh_token: String (expires 7 days),
    user: {
      _id: String,
      email: String,
      name: String,
      role: String
    }
  }
}

Error (401):
{
  success: false,
  error: "Invalid email or password"
}
```

**POST /api/auth/forgot-password**
```
Request:
{
  email: String (required, valid email)
}

Response (200 OK):
{
  success: true,
  message: "Password reset link sent to email"
}

Error (404):
{
  success: false,
  error: "User not found"
}
```

**POST /api/auth/reset-password/:token**
```
Request:
{
  password: String (required, min 8 chars),
  confirmPassword: String (required)
}

Response (200 OK):
{
  success: true,
  message: "Password reset successful"
}

Error (400/401):
{
  success: false,
  error: "Token expired" | "Passwords do not match"
}
```

**POST /api/auth/logout**
```
Request: (Authenticated)
Headers: Authorization: Bearer {access_token}

Response (200 OK):
{
  success: true,
  message: "Logout successful"
}
```

---

### Donation Endpoints

**POST /api/donations**
```
Request: (Authenticated)
{
  type: String (enum: cash/food/shelter/medical/basic_needs),
  amount: Number (required for cash),
  details: {
    [type-specific fields]
  }
}

Response (201 Created):
{
  success: true,
  data: {
    donation_id: String,
    type: String,
    status: "submitted",
    createdAt: Date
  }
}
```

**GET /api/donations**
```
Request: (Authenticated)
Query: ?limit=10&skip=0&type=cash&status=submitted

Response (200 OK):
{
  success: true,
  data: {
    donations: [Array of donations],
    total: Number,
    limit: Number,
    skip: Number
  }
}
```

**GET /api/donations/:id**
```
Response (200 OK):
{
  success: true,
  data: {
    _id: String,
    donor_id: String,
    type: String,
    details: Object,
    status: String,
    createdAt: Date
  }
}
```

**PATCH /api/donations/:id**
```
Request: (Admin/Authenticated)
{
  status: String (enum: verified/in_delivery/completed)
}

Response (200 OK):
{
  success: true,
  data: { updated donation object }
}
```

---

### QR Payment Endpoints

**POST /api/qr-payments**
```
Request: (Authenticated)
{
  donation_id: String (required, ref to cash donation)
}

Response (201 Created):
{
  success: true,
  data: {
    qr_id: String,
    qr_code: String (base64 encoded),
    amount: Number,
    currency: String,
    expiresAt: Date,
    status: "pending"
  }
}
```

**GET /api/qr-payments/:id**
```
Response (200 OK):
{
  success: true,
  data: {
    qr_id: String,
    amount: Number,
    status: String (pending/completed/expired),
    transactionId: String (if completed),
    completedAt: Date
  }
}
```

**PATCH /api/qr-payments/:id**
```
Request: (Webhook or Authenticated)
{
  status: String (completed/failed),
  transactionId: String,
  paymentGateway: String
}

Response (200 OK):
{
  success: true,
  data: { updated QR payment object }
}
```

---

### Needy Registration Endpoints

**POST /api/needy/individuals**
```
Request:
{
  name: String (required),
  phone: String (required),
  email: String (optional),
  address: Object (required),
  type_of_need: String (required),
  urgency: String (optional),
  description: String (required),
  documents: [File IDs from Cloudinary] (optional)
}

Response (201 Created):
{
  success: true,
  data: {
    needy_id: String,
    status: "pending",
    message: "Your registration is pending verification",
    createdAt: Date
  }
}
```

**POST /api/needy/organizations**
```
Request:
{
  org_name: String (required),
  registration_number: String (required),
  org_type: String (required),
  phone: String (required),
  address: Object (required),
  contactPerson: Object (required),
  type_of_need: String (required),
  urgency: String (optional),
  description: String (required),
  documents: [File IDs] (required)
}

Response (201 Created):
{
  success: true,
  data: {
    needy_id: String,
    status: "pending",
    message: "Your organization is pending verification",
    createdAt: Date
  }
}
```

**GET /api/needy/verified**
```
Query: ?type=individual|organization&need_type=food&urgency=high&city=mumbai&limit=20&skip=0

Response (200 OK):
{
  success: true,
  data: {
    needy: [Array of verified cases],
    total: Number,
    filters: {
      type: String,
      need_type: String,
      urgency: String,
      city: String
    }
  }
}
```

**GET /api/needy/individuals/:id**
```
Response (200 OK):
{
  success: true,
  data: {
    _id: String,
    name: String,
    address: Object,
    type_of_need: String,
    description: String,
    status: String,
    verified_by: String,
    verifiedAt: Date
  }
}
```

---

### Verification Endpoints

**GET /api/verification/pending**
```
Request: (Admin authenticated)
Query: ?limit=10&skip=0&urgency=high

Response (200 OK):
{
  success: true,
  data: {
    pending: [Array of pending needy registrations],
    total: Number
  }
}
```

**POST /api/verification/assign**
```
Request: (Admin)
{
  needy_id: String (required),
  needy_type: String (required),
  assigned_to_volunteer: String (volunteer ID, if available)
}

Response (200 OK):
{
  success: true,
  data: {
    message: "Verification assigned",
    status: "verification_in_progress"
  }
}
```

**POST /api/verification/reports**
```
Request: (Volunteer/Admin)
{
  needy_id: String (required),
  needy_type: String (required),
  status: String (enum: approved/rejected),
  documentVerified: Boolean,
  addressVerified: Boolean,
  identityVerified: Boolean,
  comments: String (required if rejected),
  issues: [String] (optional)
}

Response (201 Created):
{
  success: true,
  data: {
    report_id: String,
    status: "pending_admin_review",
    createdAt: Date
  }
}
```

**PATCH /api/verification/:id**
```
Request: (Admin)
{
  status: String (enum: approved/rejected),
  comment: String (optional)
}

Response (200 OK):
{
  success: true,
  data: {
    message: "Registration approved/rejected",
    needy_status: String (verified/rejected)
  }
}
```

---

## Authentication & Security Architecture

### JWT Strategy
- **Access Token**: Issued at login, expires 1 hour
- **Refresh Token**: Issued at login, expires 7 days, stored in HTTP-only cookie
- **Token Storage**: Access token in memory/localStorage, refresh token in secure HTTP-only cookie

### Password Security
- **Hashing**: Bcrypt with 10 salt rounds
- **Minimum**: 8 characters
- **Reset Link**: Valid for 24 hours only
- **Rate Limiting**: Max 5 login attempts per 15 minutes

### Role-Based Access Control (RBAC)

| Action | User | Admin | Volunteer |
|--------|------|-------|-----------|
| Register | ✓ | ✗ | ✗ |
| Submit Donation | ✓ | ✗ | ✗ |
| Register Needy | ✓ | ✗ | ✗ |
| View Pending | ✗ | ✓ | ✗ |
| Assign Volunteer | ✗ | ✓ | ✗ |
| Submit Report | ✗ | ✗ | ✓ (Step 8+) |
| Approve/Reject | ✗ | ✓ | ✗ |

### Input Validation & Sanitization
- **Email**: RFC 5322 format validation
- **Phone**: 10-digit Indian format (with country code optional)
- **Password**: Min 8 chars, at least 1 uppercase, 1 number, 1 special char
- **Text Fields**: Max length enforced, XSS prevention via DOMPurify
- **Numbers**: Type and range validation (amount > 0, scores 0-100)

### Security Headers
```javascript
// Implemented via Helmet.js
Content-Security-Policy: "default-src 'self'"
X-Frame-Options: "DENY"
X-Content-Type-Options: "nosniff"
Strict-Transport-Security: "max-age=31536000"
X-XSS-Protection: "1; mode=block"
```

### Rate Limiting
- **Login/Register**: 5 attempts per 15 minutes per IP
- **API Calls**: 100 requests per minute per user
- **File Uploads**: 50 uploads per hour per user
- **Password Reset**: 3 attempts per 24 hours per email

---

## Folder Structure

### Backend (Node.js/Express)
```
backend/
├── config/
│   ├── database.js (MongoDB connection)
│   ├── env.js (environment variables)
│   └── constants.js (app constants)
├── models/
│   ├── User.js
│   ├── Donation.js
│   ├── NeededIndividual.js
│   ├── NeededOrganization.js
│   ├── QRPayment.js
│   └── VerificationReport.js
├── controllers/
│   ├── authController.js
│   ├── donationController.js
│   ├── neededController.js
│   ├── paymentController.js
│   └── verificationController.js
├── routes/
│   ├── auth.js
│   ├── donations.js
│   ├── needy.js
│   ├── payments.js
│   └── verification.js
├── middleware/
│   ├── authenticate.js (JWT verification)
│   ├── authorize.js (role-based access)
│   ├── validate.js (input validation with Joi)
│   ├── errorHandler.js (error handling)
│   ├── rateLimiter.js (rate limiting)
│   └── corsHandler.js (CORS configuration)
├── services/
│   ├── emailService.js (SendGrid integration)
│   ├── cloudinaryService.js (file uploads)
│   ├── qrCodeService.js (QR generation)
│   └── paymentService.js (payment tracking)
├── utils/
│   ├── validators.js (reusable validators)
│   ├── helpers.js (utility functions)
│   ├── logger.js (logging)
│   └── errorCodes.js (standard error codes)
├── schemas/
│   ├── userSchema.js (Joi validation)
│   ├── donationSchema.js
│   ├── neededSchema.js
│   └── paymentSchema.js
├── .env.example (environment variables template)
├── .gitignore
├── package.json
├── package-lock.json
├── server.js (entry point)
└── README.md
```

### Frontend (React)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DonationTab.jsx
│   │   │   ├── NeedyTab.jsx
│   │   │   └── VolunteerTab.jsx
│   │   ├── Donations/
│   │   │   ├── DonationSelection.jsx
│   │   │   ├── CashDonationForm.jsx
│   │   │   ├── FoodDonationForm.jsx
│   │   │   ├── ShelterDonationForm.jsx
│   │   │   ├── MedicalDonationForm.jsx
│   │   │   ├── BasicNeedsDonationForm.jsx
│   │   │   └── QRPayment.jsx
│   │   ├── Needy/
│   │   │   ├── NeededRegistration.jsx
│   │   │   ├── IndividualForm.jsx
│   │   │   ├── OrganizationForm.jsx
│   │   │   └── VerifiedNeedy.jsx
│   │   ├── Common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorAlert.jsx
│   │   │   └── ConfirmationModal.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── DonationPage.jsx
│   │   ├── NeedyPage.jsx
│   │   ├── VerifiedNeedyPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── hooks/
│   │   ├── useAuth.js (authentication logic)
│   │   ├── useFetch.js (API fetching)
│   │   └── useForm.js (form handling)
│   ├── context/
│   │   ├── AuthContext.js (auth state)
│   │   └── NotificationContext.js (notifications)
│   ├── services/
│   │   ├── api.js (Axios instance)
│   │   ├── authService.js (auth API calls)
│   │   ├── donationService.js (donation APIs)
│   │   ├── neededService.js (needy APIs)
│   │   └── paymentService.js (payment APIs)
│   ├── utils/
│   │   ├── validators.js (form validation)
│   │   ├── formatters.js (date, currency formatting)
│   │   └── constants.js (app constants)
│   ├── styles/
│   │   ├── main.css (global styles)
│   │   ├── components.css (component styles)
│   │   └── responsive.css (mobile styles)
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.jsx (main app component)
│   ├── index.jsx (entry point)
│   └── config.js (app configuration)
├── public/
│   ├── index.html
│   └── favicon.ico
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js (or webpack.config.js)
└── README.md
```

---

## Third-Party Integrations

### Cloudinary (File Uploads)
```
Folders:
├── donations/
│   ├── cash/
│   ├── food/
│   ├── shelter/
│   └── medical/
├── needy/
│   ├── individuals/
│   │   ├── aadhar/
│   │   ├── id_proof/
│   │   └── documents/
│   └── organizations/
│       ├── registration_cert/
│       ├── 12a_80g/
│       └── documents/
└── user_profiles/

Usage:
- Max file size: 5MB per file
- Allowed formats: PDF, JPG, PNG, DOCX
- Auto-delete: After 1 year (scheduled cleanup)
```

### SendGrid (Email Service)
```
Templates:
1. Registration Confirmation
2. Password Reset
3. Donation Confirmation
4. Needy Registration Submitted
5. Verification Status Update
6. Payment Receipt

Configuration:
- API Key: Stored in .env
- From Email: noreply@hravinder.com
- Rate Limit: 100 emails/minute
```

### QR Payment Gateway
```
Supported: Razorpay, PayTM, PhonePe

Flow:
1. Generate UPI QR link
2. User scans with UPI app
3. Payment gateway webhooks update status
4. System confirms payment
5. Donation marked as "completed"

Error Handling:
- QR expires after 24 hours
- Retry mechanism for failed payments
- Webhook signature verification
```

---

## Error Handling Strategy

### Standard Error Response Format
```javascript
{
  success: false,
  error: String,
  code: String,
  details: Object (optional),
  timestamp: Date
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `422`: Unprocessable Entity (business logic error)
- `429`: Too Many Requests (rate limit)
- `500`: Server Error
- `503`: Service Unavailable

### Error Codes
- `AUTH_001`: Invalid email format
- `AUTH_002`: Password too weak
- `AUTH_003`: User already exists
- `AUTH_004`: Invalid credentials
- `AUTH_005`: Token expired
- `DON_001`: Invalid donation type
- `DON_002`: Duplicate donation
- `NEED_001`: Invalid needy type
- `NEED_002`: Registration number already exists
- `PAY_001`: QR code expired
- `PAY_002`: Payment failed
- `VAL_001`: Validation failed
- `SRV_001`: Server error

---

## Implementation Sequence

### Phase 1: Foundation (Week 1)
- [ ] Database schema creation
- [ ] User authentication (register, login, password reset)
- [ ] JWT implementation
- [ ] Basic error handling

### Phase 2: Core Features (Week 2)
- [ ] Donation submission endpoints (all 5 types)
- [ ] QR code generation
- [ ] Payment status tracking
- [ ] Email notifications

### Phase 3: Needy Management (Week 3)
- [ ] Needy individual registration
- [ ] Needy organization registration
- [ ] Verification workflow
- [ ] Admin endpoints

### Phase 4: Integration & Polish (Week 4)
- [ ] Cloudinary file upload integration
- [ ] SendGrid email integration
- [ ] Rate limiting & security hardening
- [ ] API documentation & testing

---

## Recommended Next Agents

- **BACKEND_DEVELOPER** - Implement all APIs using this architecture
- **FRONTEND_DEVELOPER** - Build React components with API integration
- **QA_ENGINEER** - Test all endpoints and user flows
- **TECH_LEAD** - Review implementation for best practices
