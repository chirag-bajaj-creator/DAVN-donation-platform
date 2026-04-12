# UX Designer Summary - Pages & Flows

## 8 Pages to Build

### 1. Login Page
**Sections**:
- Logo + "Hravinder Donation Platform"
- Login form: Email, Password, "Forgot Password?" link
- "Login" button
- Tab to switch to Register
- Privacy Policy link

### 2. Register Page
**Sections**:
- "Create Account" heading
- Form: Email, Password, Confirm Password, Full Name, Phone, Address (optional)
- "Create Account" button
- Terms checkbox
- Link back to login

### 3. Dashboard (Main Hub)
**Sections**:
- Header: Logo | User Name Dropdown | Logout
- Welcome banner: "Welcome, [Name]! You have X pending donations"
- 3 Tabs (sticky): **Donation | Needy | Volunteer**
- Quick stats: "Donations made: X"
- Recent activity: Last 3 donations with status
- Footer: Privacy | Terms | Support

**Mobile**: Tabs swipeable, sticky at top

### 4. Donation Selection
**Sections**:
- Header: "Make a Donation" | Back button
- 5 Cards (equal width, clickable):
  - Cash Donation (icon, "Quick & Secure")
  - Food Donation (icon, "Share Meals")
  - Shelter Donation (icon, "Provide Safety")
  - Medical Donation (icon, "Save Lives")
  - Basic Needs Donation (icon, "Daily Essentials")
- "How donations help" section (expandable)

**Mobile**: Stack vertically, large touch targets

### 5-9. Donation Forms (5 Variants)
**Common Structure**:
- Header: Donation type | Progress bar
- Form fields (specific to type)
- Real-time validation
- "Next" or "Submit" button
- "Go back" link

**Cash Form**:
- Name, Phone, Amount, Message (optional)

**Food Form**:
- Name, Phone, Address, Food type (dropdown), Quantity, Description (optional)

**Shelter Form**:
- Name, Phone, Address, Shelter type (dropdown), Duration, Description (optional)

**Medical Form**:
- Name, Phone, Medicine type, Doctor permission (checkbox), Doctor name (conditional)

**Basic Needs Form**:
- Name, Phone, Items (checkboxes), Quantity, Description (optional)

**Mobile**: One field per line, sticky submit button, auto-save draft

### 10. QR Payment Page
**Sections**:
- Header: "Complete Payment" | Progress indicator
- Large amount display (INR)
- Centered QR code
- Copy UPI link button
- Countdown timer: "Expires in: 23:45"
- Status: "Waiting for payment..."
- Manual payment option (collapsed)
- Footer: "Never share this QR"

**After Payment**:
- Success checkmark (animated)
- "Payment received!"
- Transaction ID display
- "Donation Complete" button

**Mobile**: Full-screen QR, large for scanning

### 11. Needy Registration - Individual
**Sections**:
- Header: "Register for Help" | Progress
- Personal info: Name, Phone, Email (optional)
- Address: Street, City, State, Zipcode
- Need details: Type of need, Urgency, Description
- Documents: Upload ID/Aadhar (optional, drag & drop)
- Privacy notice
- "Submit for Verification" button

**Validation**: Name required, 50+ char description, 10-digit phone

**Mobile**: Progressive disclosure for optional fields

### 12. Needy Registration - Organization
**Sections**:
- Header: "Register Your Organization" | Progress
- Org info: Org name, Reg number, Type, Phone
- Contact person: Name, Phone, Email
- Address: Street, City, State, Zipcode
- Need details: Type of need, Urgency, Description
- Documents: Multiple uploads required
- Credibility note: "Verified organizations get a badge"
- "Submit for Verification" button

### 13. Verified Needy Listing ("Check" Section)
**Sections** (Top to Bottom):
- Header: "Verified Cases"
- **Sticky Filter Bar**:
  - Type filter (dropdown): All | Food | Shelter | Medical | Basic Needs
  - Urgency filter (dropdown): All | Low | Medium | High | Critical
  - Location search (searchable): City/State
  - Sort options: By date | By urgency | By need
- Results count: "Showing X verified cases"
- **Case Cards** (grid 1-3 cols):
  - Verified badge ✓
  - Name/Org name
  - Location
  - Type badge
  - Urgency color-coded
  - Description (100 chars + "...")
  - "Donate Now" button
- Empty state: "No cases match filters" + suggestions

**Mobile**: Single column, full-width cards, swipeable filters

---

## 3 Primary User Journeys

### Journey 1: Donor
1. Land on login → Register/Login (2-3 min)
2. See dashboard with 3 tabs
3. Click "Donation" tab
4. Choose donation type (5 cards)
5. Fill form with details
6. Submit → Get confirmation
7. If cash: See QR code → Scan & pay (1-2 min)
8. Done!

**Trust Moments**: Security badge, "Why we ask", Success message, Payment security

### Journey 2: Needy Individual
1. Land on login → Register/Login
2. Click "Needy" tab
3. Select "Individual" registration
4. Fill form: Name, phone, address, type, description
5. Upload documents (optional)
6. Submit → "Pending verification" message
7. Wait 48 hours for verification
8. Get approved → Appear in "Check" section
9. Donors can see their case

**Trust Moments**: Privacy policy visible, Email confirmation, Progress tracking, Verification badge

### Journey 3: Needy Organization
1. Register/Login
2. Click "Needy" tab
3. Select "Organization" registration
4. Fill org details + contact person
5. Upload documents (registration cert, 12A/80G)
6. Submit → "Pending verification"
7. Wait 48-72 hours
8. Get approved + verified badge
9. Public listing showing verified org

---

## Mobile-First Principles

### Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Design Rules
- Touch targets: 44x44px minimum
- One field per line on forms
- Sticky header with current tab
- Full-screen modals (not centered)
- Progressive loading (skeleton screens)
- Vertical scrolling preferred

### Performance Targets
- Page load: < 3 seconds on 4G
- Lazy load images below fold
- Minimize animations on slow devices

---

## Trust-Building Elements

1. **Security**: SSL badge, privacy policy prominent, "Your data is safe"
2. **Verification**: ✓ Verified badge, verification date, government seal
3. **Social Proof**: "X people helped" counter, recent donations
4. **Transparency**: Verification process explained, help icons, "Why do we ask this?"
5. **Responsiveness**: Clear error messages, confirmation dialogs, loading states

---

## Key Friction Points & Solutions

| Friction | Solution |
|----------|----------|
| Complex forms | Single-step forms, auto-fill for logged users |
| Long verification wait | Show expected timeline, send email updates |
| QR payment unclear | Countdown timer, clear instructions, manual option |
| Document upload confusing | Drag & drop support, camera option, file size limits |
| Can't find cases near me | Location search + filter by city |

---

## Accessibility (WCAG AA)

- 4.5:1 color contrast ratio
- Support 200% zoom
- Keyboard navigation (Tab through all elements)
- Screen readers: Semantic HTML + ARIA labels
- Alt text on all images
- Clear, simple button text ("Submit Donation" not "OK")
