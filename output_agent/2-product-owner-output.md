# Product Owner Output - Hravinder Donation Platform
## Structured Requirements & User Stories (Steps 1-7)

---

## Executive Summary

**Project**: Hravinder Donation Platform - A centralized web-based donation system connecting donors, volunteers, and needy individuals.

**Problem Statement**:
- Lack of centralized donation platform
- Inefficient tracking of donations
- Difficulty connecting donors with genuine needy individuals
- No proper system for managing different types of donations (cash, food, shelter, medical, basic needs)
- No verification mechanism to prevent fraud

**Solution**:
Build a structured web platform with:
- Secure authentication system (User/Admin roles)
- Multi-category donation submission (5 types)
- Needy registration with admin verification
- Real-time coordination between donors and volunteers
- Trust-building through verification workflow

**Scope**: Steps 1-7 (Login, Donations, Needy Registration & Verification)
**Out of Scope**: Steps 8+ (Admin Panel, Volunteer System, Deployment)

---

## Prioritized Features

### MVP Priority (Must Have for Launch)

1. **User Authentication**
   - User registration with email/password
   - Secure login with JWT tokens
   - Admin login (separate flow)
   - Password reset via email
   - Session management

2. **Donor Dashboard**
   - Main dashboard with 3 sections: Donation, Needy, Volunteer
   - Navigation between sections
   - User profile view

3. **Donation Module - All 5 Types**
   - **Cash Donation**: Name, Phone → QR Code generation → Payment tracking
   - **Food Donation**: Name, Phone, Address, Food type, Quantity → Volunteer notification
   - **Shelter Donation**: Personal details, Shelter type → Volunteer assignment
   - **Medical Support**: Medicine type, Doctor permission → Verification & assignment
   - **Basic Needs**: Item list, Quantity → Volunteer coordination

4. **QR Code Payment System**
   - Generate QR code for cash donations
   - Track QR code status (pending/completed/expired)
   - Display payment confirmation

5. **Needy Registration System**
   - Individual registration: Name, Phone, Address, Type of need, Description
   - Organization registration: Org name, Phone, Address, Type of need, Description
   - Document upload support

6. **Needy Verification Workflow**
   - Admin receives registration requests
   - Admin can assign volunteer for verification
   - Volunteer submits verification report
   - Admin approves/rejects registration
   - Verified needy cases displayed in "Check" section
   - Only verified individuals/organizations shown to donors

7. **Verified Needy Listing ("Check" Section)**
   - Display verified individuals with: Name, Location, Type of Need, Situation
   - Display verified organizations with: Org Name, Location, Type of Need, Description
   - Filter by category and urgency
   - Donor can browse and donate to specific cases

### Secondary Priority (Nice to Have)

1. **Donation History** - Donors view their past donations
2. **Needy Profiles** - Detailed profiles with photos and story
3. **In-App Notifications** - Real-time updates on donations
4. **Donation Tracking** - Track donation from submission to completion
5. **Rating System** - Rate donors/needy/volunteers (basic)
6. **Search & Filter** - Advanced search by location, need type, urgency

### Future Priority (Post-MVP)

1. **Analytics Dashboard** - Donation trends, impact metrics
2. **Mobile App** - Native React Native app
3. **Payment Gateway Integration** - Razorpay/PayTM
4. **Volunteer Management System** - Volunteer assignment, tracking
5. **Admin Panel** - Full admin controls
6. **Real-time Chat** - Communication between donors and volunteers

---

## Key User Stories (MVP)

### Authentication
- **US-1**: User can register with email/password/name/phone/address
- **US-2**: User can login securely and receive JWT token
- **US-3**: User can reset password via email link (24-hour validity)
- **US-4**: Admin has separate login with role-based access
- **US-5**: User sessions persist across page refreshes

### Donations
- **US-6**: Donor can submit cash donation → System generates QR code → Payment tracked
- **US-7**: Donor can submit food donation → Details collected → Volunteer notified
- **US-8**: Donor can submit shelter donation → Details collected → Stored in system
- **US-9**: Donor can submit medical donation → Medicine type + doctor permission
- **US-10**: Donor can submit basic needs donation → Items list + quantity

### Needy Registration & Verification
- **US-11**: Needy individual can register with name/phone/address/need type/description
- **US-12**: Needy organization can register with similar details + registration number
- **US-13**: Admin can view pending registrations and assign volunteers
- **US-14**: Volunteer can submit verification report (approved/rejected + comments)
- **US-15**: Admin can approve/reject based on verification report
- **US-16**: Verified cases automatically appear in "Check" section
- **US-17**: Donors can browse and filter verified cases by type/urgency

---

## Acceptance Criteria (Feature-Level)

### Authentication Feature
- [ ] User can register with email, password, name, phone, address
- [ ] User can login with email and password
- [ ] JWT tokens issued and stored securely
- [ ] Password reset works via email link
- [ ] Admin has separate login (role-based)
- [ ] Sessions persist across page refresh
- [ ] Logout clears session

### Donation Feature (All Types)
- [ ] Cash donation: Generate QR, track payment status, expire after 24h
- [ ] Food donation: Collect details, forward to volunteer
- [ ] Shelter donation: Collect details, submit to system
- [ ] Medical donation: Collect details, doctor permission optional
- [ ] Basic needs: Collect items, submit to system
- [ ] All donations: Form validation, error messages, success notification
- [ ] All donations: Stored in database with donor_id and status

### Needy Registration Feature
- [ ] Individual form: Collect name, phone, address, type, description
- [ ] Organization form: Collect org name, reg number, phone, address, type, description
- [ ] Document uploads supported (optional)
- [ ] Form validation and error messages
- [ ] Submissions go to database with status='pending'
- [ ] Confirmation message displayed

### Verification Workflow Feature
- [ ] Admin can view pending registrations
- [ ] Admin can assign volunteer (API exists)
- [ ] Volunteer can submit report (API exists)
- [ ] Admin can approve/reject with comments
- [ ] Approved cases appear in "Check" section
- [ ] Only verified cases shown to donors
- [ ] Audit trail recorded

### "Check" Section Feature
- [ ] Displays all verified individuals
- [ ] Displays all verified organizations
- [ ] Filter by type of need
- [ ] Filter by urgency
- [ ] Search by location
- [ ] Responsive on mobile and desktop

---

## API Endpoints for Backend Developer

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password/:token` - Password reset

### Donation Endpoints
- `POST /api/donations` - Submit donation (all types)
- `GET /api/donations/:id` - Get donation details
- `GET /api/donations` - List user's donations
- `PATCH /api/donations/:id` - Update donation status

### QR Payment Endpoints
- `POST /api/qr-payments` - Generate QR code
- `GET /api/qr-payments/:id` - Get QR details
- `PATCH /api/qr-payments/:id` - Update payment status

### Needy Registration Endpoints
- `POST /api/needy/individuals` - Register individual
- `POST /api/needy/organizations` - Register organization
- `GET /api/needy/individuals/:id` - Get individual details
- `GET /api/needy/organizations/:id` - Get organization details
- `GET /api/needy/verified` - Get verified list (for donors)

### Verification Endpoints
- `GET /api/verification/pending` - Admin: List pending verifications
- `POST /api/verification/assign` - Admin: Assign volunteer
- `POST /api/verification/reports` - Volunteer: Submit report
- `PATCH /api/verification/:id` - Admin: Approve/reject

---

## Critical Gaps & Risks

### Gaps Needing Clarification
1. Volunteer system details (assignment, notification, report submission)
2. Payment gateway full integration (QR generation sufficient for MVP)
3. Email service configuration (SendGrid templates)
4. Geospatial matching logic (simple filter vs. advanced)
5. Verification checklist (what exactly volunteers should verify)
6. Privacy & data retention (rejected registrations, document deletion timeline)

### Technical Risks
1. **QR Expiration** → Use MongoDB TTL index
2. **Database Scalability** → Index key fields, plan for sharding
3. **Security** → Bcrypt passwords, input validation, rate limiting
4. **File Uploads** → Validate size (5MB max) and format
5. **Rate Limiting** → Implement on auth, registration, donation endpoints

### Operational Risks
1. **Volunteer Bottleneck** → Priority system for urgent cases
2. **Fraud Prevention** → Document verification + trust scoring
3. **Donor Drop-off** → Single-page forms, clear progress
4. **Verification Accuracy** → Admin review + spot checks
5. **Scalability** → Auto-approve low-risk cases

---

## Build Order Recommendation

**Week 1**: Foundation (Auth + Database)
**Week 2**: Donation Module (All 5 types + QR)
**Week 3**: Needy Registration & Verification
**Week 4**: Polish, Testing, Documentation

---

## Recommended Next Agents

1. **UX_DESIGNER** - Design user flows and page layouts
2. **SOFTWARE_ARCHITECT** - Define API contracts and system design
3. **DATABASE_DEVELOPER** - Optimize MongoDB schemas
4. **BACKEND_DEVELOPER** - Implement all APIs
5. **FRONTEND_DEVELOPER** - Build React components
