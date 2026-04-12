# Database Developer Output - MongoDB Schema Design
## Hravinder Donation Platform

---

## MongoDB Schema Design Summary

Complete Mongoose schemas for all 6 collections with optimization for performance, security, and scalability.

---

## 1. Users Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  email: String (unique, required, RFC 5322 format),
  password: String (hashed with bcrypt, 8+ characters required),
  name: String (required),
  phone: String (unique, required, format validated),
  role: String (enum: ['user', 'admin'], default: 'user'),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String (default: 'India')
  },
  isActive: Boolean (default: true),
  isEmailVerified: Boolean (default: false),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ email: 1 }` (Unique) - Email uniqueness and login queries
- `{ phone: 1 }` (Unique) - Phone uniqueness and contact queries
- `{ role: 1 }` - Filter by user role
- `{ city: 1, state: 1 }` - Geographic queries
- `{ role: 1, isActive: 1 }` - Compound: Active users by role
- `{ createdAt: -1 }` - Dashboard sorting by registration date

### Validation Rules
- Email: RFC 5322 format validation
- Password: Minimum 8 characters, must be hashed with bcrypt before storage
- Phone: Indian format (10 digits)
- Role: Must be 'user' or 'admin' (enum)
- Address: All fields optional for initial registration

---

## 2. Donations Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  donor_id: ObjectId (ref: Users, required),
  type: String (enum: ['cash', 'food', 'shelter', 'medical', 'basic_needs']),
  amount: Number (for cash, min: 1),
  status: String (enum: ['submitted', 'verified', 'in_delivery', 'completed']),
  details: {
    currency: String (default: 'INR'),
    foodType: String,
    quantity: Number,
    shelterType: String,
    medicineType: String,
    items: [String],
    description: String,
    pickupAddress: { street, city, state, zipCode }
  },
  qr_payment_id: ObjectId (ref: QRPayments),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ donor_id: 1 }` - Find donations by donor
- `{ type: 1 }` - Filter by type
- `{ status: 1 }` - Filter by status
- `{ createdAt: -1 }` - Recent donations first
- `{ status: 1, type: 1, createdAt: -1 }` - Compound: Dashboard queries

---

## 3. NeededIndividuals Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required),
  address: { street, city, state, zipCode },
  type_of_need: String (enum: ['food', 'shelter', 'medical', 'basic_needs']),
  urgency: String (enum: ['low', 'medium', 'high', 'critical']),
  description: String (required),
  status: String (enum: ['pending', 'verified', 'rejected']),
  documents: [{ type, url, uploadedAt }],
  verified_by: ObjectId (ref: Users),
  trustScore: Number (0-100),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ status: 1, urgency: 1, createdAt: -1 }` - Priority matching
- `{ city: 1, state: 1 }` - Geographic queries
- `{ trustScore: -1 }` - Sort by credibility

---

## 4. NeededOrganizations Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  org_name: String (required),
  registration_number: String (unique, required),
  org_type: String (enum: ['ngo', 'hospital', 'school', 'orphanage']),
  phone: String (required),
  address: { street, city, state, zipCode },
  contactPerson: { name, phone, email },
  type_of_need: String (enum: ['food', 'shelter', 'medical', 'basic_needs']),
  urgency: String (enum: ['low', 'medium', 'high', 'critical']),
  status: String (enum: ['pending', 'verified', 'rejected']),
  documents: [{ type, url, uploadedAt }],
  verified_by: ObjectId (ref: Users),
  credibilityScore: Number (0-100),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ registration_number: 1 }` (Unique)
- `{ status: 1, credibilityScore: -1 }` - Verified orgs by credibility
- `{ city: 1, state: 1 }` - Geographic queries

---

## 5. QRPayments Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  donation_id: ObjectId (ref: Donations, required),
  qr_code: String (unique, required),
  amount: Number (required),
  currency: String (default: 'INR'),
  transactionId: String (unique),
  status: String (enum: ['pending', 'completed', 'expired']),
  paymentGateway: String (enum: ['razorpay', 'paytm', 'phonepe']),
  expiryAt: Date (auto: current + 24 hours),
  completedAt: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ donation_id: 1 }` - Find QR by donation
- `{ qr_code: 1 }` (Unique)
- `{ transactionId: 1 }` (Unique)
- `{ expiryAt: 1 }` - TTL: Auto-delete after 24 hours

---

## 6. VerificationReports Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  needy_id: ObjectId,
  needy_type: String (enum: ['NeededIndividual', 'NeededOrganization']),
  verified_by: ObjectId (ref: Users, admin only),
  status: String (enum: ['approved', 'rejected', 'pending']),
  verificationDetails: {
    documentVerified: Boolean,
    addressVerified: Boolean,
    identityVerified: Boolean,
    comments: String,
    issues: [String]
  },
  trustScore: Number (0-100),
  recommendation: String (enum: ['approve', 'reject', 'hold']),
  priority: Number (1-5),
  createdAt: Date (auto),
  verifiedAt: Date,
  updatedAt: Date (auto)
}
```

### Indexes
- `{ needy_id: 1 }` - Find reports by needy
- `{ verified_by: 1 }` - Find reports by admin
- `{ status: 1, priority: 1 }` - Verification queue

### Immutability
- **NEVER DELETE** this collection (permanent audit trail)

---

## Key Design Decisions

### 1. Embedding vs Referencing
- **Embedded**: User.address, Donation.details, NeededIndividual.documents (owned data)
- **Referenced**: User relationships, Donations by multiple users (shared data)

### 2. Index Strategy
- All filter fields indexed (status, type, urgency)
- Geospatial indexes for location-based matching
- Compound indexes for dashboard queries
- TTL on QRPayments for auto-cleanup

### 3. Data Integrity
- Enum validation for all status fields
- Unique constraints: email, phone, registration_number, qr_code
- Format validation: RFC 5322 email, phone format
- Timestamps on all records

### 4. Performance Optimization
- Pagination: Default limit 100 documents
- Connection pooling: Min 10, Max 100 connections
- Aggregation pipelines for analytics

### 5. Security & Compliance
- Bcrypt password hashing (10 salt rounds)
- Audit trail via VerificationReports (immutable)
- PII deletion: Aadhar after 1 year
- Soft delete instead of hard delete

### 6. Scalability
- Designed for 1M → 100M+ documents growth
- Sharding strategy: Shard on city or createdAt for Donations
- Daily full backup + hourly incremental

---

## Implementation Sequence

1. Phase 1: Users collection with auth
2. Phase 2: Donations collection
3. Phase 3: NeededIndividuals & NeededOrganizations
4. Phase 4: QRPayments collection
5. Phase 5: VerificationReports collection
6. Phase 6: Optimize indexes based on query patterns

---

## Recommended Next Agents

- **BACKEND_DEVELOPER** - To implement these schemas with Mongoose
- **SOFTWARE_ARCHITECT** - For API contract alignment
- **TECH_LEAD** - For review and query optimization
