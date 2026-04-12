# Product Owner Summary - Requirements & Features

## MVP Features (Must Have)

### 1. Authentication
- User registration (email, password, name, phone, address)
- User login with JWT
- Password reset via email
- Admin separate login
- Session persistence

### 2. Donor Dashboard
- 3 main tabs: Donation, Needy, Volunteer
- User profile dropdown
- Logout button

### 3. Donations (5 Types)
**All require**: Form submission → DB storage → Confirmation

- **Cash**: Name + Phone → Generate QR → Track payment → Expires 24h
- **Food**: Name, Phone, Address, Food type, Quantity
- **Shelter**: Name, Phone, Address, Shelter type, Duration
- **Medical**: Name, Phone, Medicine type, Doctor permission (optional)
- **Basic Needs**: Name, Phone, Items (clothes/blankets/etc), Quantity

### 4. QR Payment System
- Generate UPI QR code for cash donations
- Display QR with amount and expiry timer
- Track payment status (pending/completed/expired)
- Auto-delete expired QRs after 24 hours

### 5. Needy Registration
- **Individual**: Name, Phone, Address, Type of need, Description, Documents (optional)
- **Organization**: Org name, Registration number, Contact person, Type of need, Description, Documents (required)
- Both: Status = "pending" after submission

### 6. Verification Workflow
- Admin views pending registrations
- Admin assigns volunteer (or selects from dropdown)
- Volunteer submits verification report
- Admin approves/rejects
- Approved cases show in "Check" section

### 7. Verified Needy Listing ("Check" Section)
- Filter by: Type of need, Urgency, Location
- Display: Individual name/org name, location, need type, description
- "Donate Now" button on each case
- Only show status='verified' cases

---

## User Stories (Key 17)

### Auth (5 stories)
1. User registers with email/password/name/phone/address
2. User logs in with email/password, receives JWT
3. User resets forgotten password via email link
4. Admin has separate login with role check
5. Sessions persist after page refresh

### Donations (6 stories)
6. Donor submits cash → QR generated → Payment tracked
7. Donor submits food → Details stored → Volunteer notified
8. Donor submits shelter → Details stored
9. Donor submits medical → Medicine type + doctor permission
10. Donor submits basic needs → Items + quantity
11. Donor views donation history

### Needy (6 stories)
12. Needy individual registers with details
13. Needy organization registers with org details
14. Admin views pending registrations
15. Volunteer submits verification report
16. Admin approves/rejects based on report
17. Verified cases appear in "Check" section

---

## API Endpoints (19 Total)

### Auth (6)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/forgot-password
- POST /api/auth/reset-password/:token
- POST /api/auth/refresh-token

### Donations (4)
- POST /api/donations (all 5 types)
- GET /api/donations
- GET /api/donations/:id
- PATCH /api/donations/:id (update status)

### QR Payments (3)
- POST /api/qr-payments (generate)
- GET /api/qr-payments/:id
- PATCH /api/qr-payments/:id (update status)

### Needy (5)
- POST /api/needy/individuals
- POST /api/needy/organizations
- GET /api/needy/verified (with filters)
- GET /api/needy/individuals/:id
- GET /api/needy/organizations/:id

### Verification (4)
- GET /api/verification/pending (admin)
- POST /api/verification/assign (admin)
- POST /api/verification/reports (volunteer)
- PATCH /api/verification/:id (admin approve/reject)

---

## Build Order (4 Weeks)

**Week 1**: Auth + DB setup
**Week 2**: Donation module (all 5 types + QR)
**Week 3**: Needy registration + verification
**Week 4**: Testing, polish, documentation

---

## Critical Gaps to Resolve
- [ ] Volunteer system details (Step 8+ scope)
- [ ] Full payment gateway (QR + status tracking = MVP)
- [ ] Email templates (SendGrid setup)
- [ ] Geospatial matching (simple filter = MVP)
- [ ] Verification checklist (what to verify?)
- [ ] Data retention for rejected registrations (delete after 1 year)
