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

### Data Relationships
- Referenced by: Donations (donor_id), VerificationReports (verified_by)
- Embedding: Address (owned by user, accessed together)

### Retention & Cleanup
- Keep indefinitely (required for audit trail)
- Soft delete: Use isActive flag instead of hard delete

---

## 2. Donations Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  donor_id: ObjectId (ref: Users, required),
  type: String (enum: ['cash', 'food', 'shelter', 'medical', 'basic_needs'], required),
  amount: Number (for cash donations, min: 1),
  status: String (enum: ['submitted', 'verified', 'in_delivery', 'completed', 'cancelled'], default: 'submitted'),
  details: {
    // For cash donations:
    currency: String (default: 'INR'),
    paymentMethod: String (enum: ['qr_code', 'bank_transfer']),

    // For food donations:
    foodType: String,
    quantity: Number,
    unit: String (enum: ['kg', 'boxes', 'portions']),

    // For shelter donations:
    shelterType: String (enum: ['room', 'house', 'temporary_stay']),
    capacity: Number,
    duration: String,

    // For medical donations:
    medicineType: String,
    doctorPermission: Boolean,

    // For basic needs:
    items: [String],
    quantity: Number,

    // Common:
    description: String,
    pickupAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  recipientInfo: {
    needy_individual_id: ObjectId (optional ref),
    needy_organization_id: ObjectId (optional ref),
    assignedVolunteer_id: ObjectId (optional)
  },
  qr_payment_id: ObjectId (ref: QRPayments, for cash donations),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ donor_id: 1 }` - Find donations by donor
- `{ type: 1 }` - Filter by donation type
- `{ status: 1 }` - Filter by status (submitted, in_delivery, etc.)
- `{ createdAt: -1 }` - Recent donations first
- `{ location: '2dsphere' }` - Geospatial for nearest needy
- `{ status: 1, type: 1, createdAt: -1 }` - Compound: Dashboard queries
- `{ donor_id: 1, createdAt: -1 }` - Compound: Donor's donation history

### Data Relationships
- Donor: Referenced (Users collection)
- Needy: Polymorphic reference (NeededIndividuals OR NeededOrganizations)
- QR Payment: Referenced (QRPayments collection, for cash donations)
- Details: Embedded (accessed together with donation)

### Aggregation Pipelines

**Monthly Donation Summary**:
```javascript
[
  { $match: { createdAt: { $gte: startOfMonth } } },
  { $group: {
      _id: '$type',
      totalAmount: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  },
  { $sort: { totalAmount: -1 } }
]
```

**Top Donors Ranking**:
```javascript
[
  { $match: { status: 'completed' } },
  { $group: {
      _id: '$donor_id',
      totalDonations: { $sum: 1 },
      totalAmount: { $sum: '$amount' }
    }
  },
  { $sort: { totalAmount: -1 } },
  { $limit: 10 }
]
```

### Data Retention
- Keep all records indefinitely (audit trail required)
- Archive cancelled/rejected donations after 2 years to separate collection

---

## 3. NeededIndividuals Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  name: String (required),
  phone: String (required, format validated),
  email: String (optional),
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String,
    country: String (default: 'India')
  },
  type_of_need: String (enum: ['food', 'shelter', 'medical', 'basic_needs', 'other'], required),
  urgency: String (enum: ['low', 'medium', 'high', 'critical'], default: 'medium'),
  description: String (required, min: 20 chars),
  status: String (enum: ['pending', 'verified', 'rejected', 'fulfilled'], default: 'pending'),
  documents: [
    {
      type: String (enum: ['aadhar', 'ration_card', 'id_proof', 'medical_certificate', 'other']),
      url: String,
      uploadedAt: Date
    }
  ],
  verified_by: ObjectId (ref: Users, only if status='verified'),
  trustScore: Number (0-100, default: 0),
  matchedDonations: [ObjectId] (refs: Donations),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ name: 1 }` - Search by name
- `{ phone: 1 }` - Search by phone
- `{ city: 1, state: 1 }` - Geographic queries
- `{ type_of_need: 1 }` - Filter by need type
- `{ urgency: 1 }` - Filter by urgency
- `{ status: 1 }` - Filter by verification status
- `{ location: '2dsphere' }` - Geospatial for matching donors
- `{ status: 1, urgency: 1, createdAt: -1 }` - Compound: Priority matching
- `{ trustScore: -1 }` - Sort by credibility

### Data Relationships
- Verified by: Referenced (Users collection, admin only)
- Matched Donations: Array of references (Donations collection)
- Address: Embedded (owned by individual)
- Documents: Embedded array (owned by individual)

### Data Retention & Cleanup
- Keep verified cases indefinitely
- Archive rejected cases after 2 years
- Soft delete: Use status='fulfilled' for completed cases
- PII deletion: Aadhar/ID scans deleted after 1 year (keep only date of verification)

---

## 4. NeededOrganizations Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  org_name: String (required),
  registration_number: String (unique, required, e.g., NITI Aayog number),
  org_type: String (enum: ['ngo', 'hospital', 'school', 'orphanage', 'other'], required),
  phone: String (required),
  email: String (optional),
  address: {
    street: String (required),
    city: String (required),
    state: String (required),
    zipCode: String,
    country: String (default: 'India')
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  type_of_need: String (enum: ['food', 'shelter', 'medical', 'basic_needs', 'other'], required),
  urgency: String (enum: ['low', 'medium', 'high', 'critical'], default: 'medium'),
  description: String (required, min: 30 chars),
  status: String (enum: ['pending', 'verified', 'rejected', 'fulfilled'], default: 'pending'),
  documents: [
    {
      type: String (enum: ['registration_cert', 'address_proof', '12a_80g', 'bank_details', 'other']),
      url: String,
      uploadedAt: Date
    }
  ],
  verified_by: ObjectId (ref: Users, only if status='verified'),
  credibilityScore: Number (0-100, default: 0),
  matchedDonations: [ObjectId] (refs: Donations),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ org_name: 1 }` - Search by organization name
- `{ registration_number: 1 }` (Unique) - Search by reg number
- `{ city: 1, state: 1 }` - Geographic queries
- `{ org_type: 1 }` - Filter by organization type
- `{ type_of_need: 1 }` - Filter by need type
- `{ urgency: 1 }` - Filter by urgency
- `{ status: 1 }` - Filter by verification status
- `{ location: '2dsphere' }` - Geospatial for donor matching
- `{ status: 1, credibilityScore: -1 }` - Compound: Verified orgs by credibility
- `{ credibilityScore: -1 }` - Sort by credibility

### Data Relationships
- Verified by: Referenced (Users collection, admin only)
- Matched Donations: Array of references (Donations collection)
- Address: Embedded (owned by org)
- Contact Person: Embedded (owned by org)
- Documents: Embedded array (owned by org)

### Data Retention & Cleanup
- Keep indefinitely (compliance requirement)
- Archive rejected cases after 2 years
- Soft delete: Use status='fulfilled' instead of hard delete

---

## 5. QRPayments Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  donation_id: ObjectId (ref: Donations, required),
  qr_code: String (unique, required, base64 encoded QR data),
  amount: Number (required, min: 1),
  currency: String (default: 'INR'),
  transactionId: String (unique, from payment gateway),
  status: String (enum: ['pending', 'completed', 'expired', 'failed'], default: 'pending'),
  payerDetails: {
    email: String (optional),
    phone: String (optional),
    name: String (optional)
  },
  paymentGateway: String (enum: ['razorpay', 'paytm', 'phonepe', 'manual'], default: 'razorpay'),
  expiryAt: Date (auto: current + 24 hours),
  completedAt: Date (null until payment),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ donation_id: 1 }` - Find QR by donation
- `{ qr_code: 1 }` (Unique) - Find QR by code
- `{ transactionId: 1 }` (Unique) - Find by transaction
- `{ status: 1 }` - Filter by payment status
- `{ expiryAt: 1 }` - TTL index for auto-cleanup
- `{ createdAt: -1 }` - Recent payments first

### TTL (Time-To-Live) Index
- `{ expiryAt: 1 }` with TTL: Auto-delete expired QRs after 24 hours

### Data Relationships
- Donation: Referenced (Donations collection)
- Payer: Embedded (optional, for payment reconciliation)

### Aggregation Pipelines

**Payment Success Rate**:
```javascript
[
  { $match: { createdAt: { $gte: startDate } } },
  { $group: {
      _id: '$paymentGateway',
      successful: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      total: { $sum: 1 }
    }
  },
  { $project: {
      successRate: { $divide: ['$successful', '$total'] }
    }
  }
]
```

---

## 6. VerificationReports Collection

### Schema Definition
```javascript
{
  _id: ObjectId,
  needy_id: {
    type: ObjectId,
    refPath: 'needy_type' // Polymorphic reference
  },
  needy_type: String (enum: ['NeededIndividual', 'NeededOrganization'], required),
  verified_by: ObjectId (ref: Users, admin only, required),
  status: String (enum: ['approved', 'rejected', 'pending_clarification'], default: 'pending_clarification'),
  verificationDetails: {
    documentVerified: Boolean,
    addressVerified: Boolean,
    identityVerified: Boolean,
    needVerified: Boolean,
    comments: String,
    issues: [String]
  },
  trustScore: Number (0-100, calculated),
  recommendation: String (enum: ['approve', 'reject', 'hold_for_review']),
  priority: Number (1-5, for verification queue),
  createdAt: Date (auto),
  verifiedAt: Date (null until approved),
  updatedAt: Date (auto)
}
```

### Indexes
- `{ needy_id: 1 }` - Find reports by needy
- `{ verified_by: 1 }` - Find reports by admin
- `{ status: 1 }` - Filter by verification status
- `{ trustScore: -1 }` - Sort by trust score
- `{ priority: 1 }` - Filter by priority
- `{ status: 1, priority: 1, createdAt: 1 }` - Compound: Verification queue

### Data Relationships
- Needy: Polymorphic reference (NeededIndividuals OR NeededOrganizations)
- Verified By: Referenced (Users collection, admin only)
- Verification Details: Embedded (owned by report)

### Immutability
- **NEVER DELETE** this collection (permanent audit trail)
- Soft updates: Create new report if changes needed
- Use for compliance audits and dispute resolution

---

## Key Design Decisions

### 1. Embedding vs Referencing

**Embedded** (owned data, accessed together):
- User.address - Always accessed with user
- Donation.details - Core donation info
- NeededIndividual.documents - Proof of need
- VerificationReport.verificationDetails - Report metadata

**Referenced** (shared data, normalized):
- User relationships - Users can verify multiple needy
- Donations by multiple users
- Matched donations - Dynamic relationships

### 2. Index Strategy

**Read-Heavy Optimization**:
- All filter fields indexed (status, type, urgency)
- Geospatial indexes for location-based matching
- Compound indexes for common dashboard queries
- Text indexes for search (if added later)

**Write-Cost Consideration**:
- Minimal compound indexes (only frequently queried combinations)
- No redundant indexes
- TTL on QRPayments (auto-cleanup)

### 3. Data Integrity

**Validation**:
- Enum fields: status, role, type, urgency
- Unique constraints: email, phone, registration_number, qr_code, transaction_id
- Format validation: RFC 5322 email, phone format, zipcode
- Range validation: amounts (> 0), scores (0-100)

**Immutability**:
- Verification reports never deleted (audit)
- Timestamps on all records
- createdAt immutable, updatedAt mutable

### 4. Performance Optimization

**Pagination**:
- Default limit: 100 documents
- Use skip/limit for dashboard listings
- Projection to exclude large arrays when not needed

**Connection Pooling**:
- Min: 10 connections
- Max: 100 connections
- Timeout: 30 seconds

**Aggregation Pipelines**:
- Monthly summaries pre-calculated
- Top donors ranking
- Payment success rates
- Donation type distribution

### 5. Security & Compliance

**Password Security**:
- Bcrypt hashing with salt rounds: 10
- Minimum 8 characters
- Never store plain text

**Audit Trail**:
- VerificationReports collection is immutable
- All records have timestamps
- Track who verified what

**PII Data Retention**:
- Aadhar/ID scans: Delete after 1 year (keep only verification date)
- Bank details: Tokenize or encrypt
- Personal addresses: Soft delete on user request

**GDPR/Privacy**:
- Right to be forgotten: Anonymize instead of delete
- Data retention: Follow compliance requirements

### 6. Scalability

**Growth Projections**:
- Designed for 1M → 100M+ documents
- Sharding strategy: Shard on `city` or `createdAt` for Donations

**Backup Strategy**:
- Daily full backup
- Hourly incremental backups
- Point-in-time recovery enabled

**Monitoring**:
- Track slow queries (> 100ms)
- Monitor collection sizes
- Alert on unusual patterns

---

## Implementation Sequence

1. **Phase 1**: Create Users collection with auth
2. **Phase 2**: Create Donations collection
3. **Phase 3**: Create NeededIndividuals & NeededOrganizations
4. **Phase 4**: Create QRPayments collection
5. **Phase 5**: Create VerificationReports collection
6. **Phase 6**: Optimize indexes based on actual query patterns

---

## Recommended Next Agents

- **BACKEND_DEVELOPER** - To implement these schemas with Mongoose
- **SOFTWARE_ARCHITECT** - For API contract alignment
- **TECH_LEAD** - For review and query optimization
