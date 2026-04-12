# Database Summary - MongoDB Collections

## 6 Collections Needed

### 1. Users
**Fields**: email (unique), password (hashed), name, phone (unique), role (user/admin), address, isActive
**Indexes**: email, phone, role, (role + isActive)
**Security**: Bcrypt hashing, 8+ char passwords

### 2. Donations
**Fields**: donor_id, type (cash/food/shelter/medical/basic_needs), amount, status, details{}, qr_payment_id
**Indexes**: donor_id, type, status, createdAt
**Details**: Each type has specific fields (food: foodType, quantity; shelter: shelterType, duration; etc.)

### 3. NeededIndividuals
**Fields**: name, phone, address, type_of_need, urgency, description, status (pending/verified/rejected), documents[], verified_by, trustScore
**Indexes**: status, urgency, city, trustScore
**Note**: Soft delete (status), archive after 2 years

### 4. NeededOrganizations
**Fields**: org_name, registration_number (unique), org_type, phone, address, type_of_need, urgency, description, status, documents[], verified_by, credibilityScore
**Indexes**: registration_number, status, credibilityScore
**Note**: Keep indefinitely (compliance)

### 5. QRPayments
**Fields**: donation_id, qr_code (unique), amount, transactionId (unique), status (pending/completed/expired), expiryAt (TTL: 24h), completedAt
**Indexes**: donation_id, qr_code, transactionId, expiryAt (TTL)
**TTL**: Auto-delete after 24 hours

### 6. VerificationReports
**Fields**: needy_id, needy_type (Individual/Organization), verified_by, status (approved/rejected/pending), verificationDetails{}, trustScore, recommendation
**Indexes**: needy_id, verified_by, status, trustScore
**Important**: IMMUTABLE - Never delete (audit trail)

---

## Key Decisions
- **Embedded**: User.address, Donation.details, Documents (owned data accessed together)
- **Referenced**: User relationships, Donations (shared, normalized data)
- **Validation**: Enum fields, unique constraints, format validation (email, phone)
- **Scalability**: Designed for 1M → 100M+ documents, sharding on city/date for Donations
- **Retention**: Soft delete with isActive flag, archive old data, keep reports forever
- 
---

## Database Setup Checklist
- [ ] Connect MongoDB Atlas/local MongoDB
- [ ] Create 6 collections with Mongoose schemas
- [ ] Add indexes on all filter fields
- [ ] Set TTL on QRPayments (24-hour expiry)
- [ ] Configure password hashing (bcrypt, 10 rounds)
- [ ] Test all relationships and queries
- [ ] Check SQL/nO sql inJECTION
- [ ] Check XSS 
- [ ] Always Maintain Test and production database differnet 