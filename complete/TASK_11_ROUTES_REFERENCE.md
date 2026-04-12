# Task #11 - Complete Routes Reference

## Route Map & Authorization Matrix

### All Routes Overview

```
METHOD  PATH                    COMPONENT               AUTH     ROLE      STATUS
────────────────────────────────────────────────────────────────────────────────
GET     /                       Navigate→/dashboard     ANY      ANY       ✓ Complete
GET     /login                  LoginPage               NONE     ANY       ✓ Complete
GET     /register               RegisterPage            NONE     ANY       ✓ Complete
GET     /password-reset         PasswordResetPage       NONE     ANY       ✓ Complete
GET     /dashboard              DashboardPage           REQUIRED ANY       ✓ Complete
GET     /donation               DonationSelectionPage   REQUIRED ANY       ✓ Complete
GET     /payment/:orderId       QRPaymentPage           REQUIRED ANY       ✓ Complete
GET     /needy/individual       NeedyIndividualPage     REQUIRED NEEDY     ✓ Complete
GET     /admin/verification     Dashboard (redirect)    REQUIRED ADMIN     ✓ Complete
GET     /403                    ForbiddenPage           ANY      ANY       ✓ Complete
GET     /404 or /*              NotFoundPage            ANY      ANY       ✓ Complete
```

## Detailed Route Documentation

### 1. Root Route
```javascript
Route: GET /
Redirect To: /dashboard
Component: Navigate
Auth Required: No
Role Required: None
Description: Root path automatically redirects to dashboard
```

### 2. Public Authentication Routes

#### Login
```javascript
Route: GET /login
Component: LoginPage
Auth Required: No
Role Required: None
Description: User login form with email/password
Location: src/pages/Auth/LoginPage.jsx
Features:
  - Login form with validation
  - Link to register page
  - Link to password reset
  - Header and footer included
```

#### Register
```javascript
Route: GET /register
Component: RegisterPage
Auth Required: No
Role Required: None
Description: New user registration form
Location: src/pages/Auth/RegisterPage.jsx
Features:
  - Registration form with role selection
  - Email validation
  - Password strength indicator (recommended)
  - Link to login page
```

#### Password Reset
```javascript
Route: GET /password-reset
Component: PasswordResetPage
Auth Required: No
Role Required: None
Description: Password reset request form
Location: src/pages/Auth/PasswordResetPage.jsx
Features:
  - Email input for reset request
  - Link back to login
```

### 3. Protected Routes - All Authenticated Users

#### Dashboard
```javascript
Route: GET /dashboard
Component: DashboardPage
Auth Required: Yes
Role Required: None (all roles)
Description: Main dashboard after login
Location: src/pages/Dashboard/DashboardPage.jsx
Protected By: ProtectedRoute (allowedRoles=null)
Features:
  - Summary of user data
  - Quick navigation
  - Recent activity
```

#### Donation Selection
```javascript
Route: GET /donation
Component: DonationSelectionPage
Auth Required: Yes
Role Required: None (all roles)
Description: Select donation amount and type
Location: src/pages/Donation/DonationSelectionPage.jsx
Protected By: ProtectedRoute (allowedRoles=null)
Features:
  - Donation categories
  - Amount selection
  - Causes information
```

#### QR Payment
```javascript
Route: GET /payment/:orderId
Component: QRPaymentPage
Auth Required: Yes
Role Required: None (all roles)
Description: QR code payment for donation
Location: src/pages/QR/QRPaymentPage.jsx
Protected By: ProtectedRoute (allowedRoles=null)
Parameters:
  - orderId: ID of the donation order
Features:
  - QR code display
  - Payment instructions
  - Order details
```

### 4. Role-Based Protected Routes

#### Needy Individual Profile
```javascript
Route: GET /needy/individual
Component: NeedyIndividualPage
Auth Required: Yes
Role Required: "needy"
Description: Needy user profile and personal information
Location: src/pages/Needy/NeedyIndividualPage.jsx
Protected By: ProtectedRoute (allowedRoles="needy")
Accessible By: Users with role="needy"
Denied Access Redirects To: /403
Features:
  - Personal information
  - Donation history
  - Account settings
```

#### Admin Verification Panel
```javascript
Route: GET /admin/verification
Component: Dashboard (via Navigate redirect)
Auth Required: Yes
Role Required: "admin"
Description: Admin panel for verifying needy users
Location: Currently redirects to Dashboard
Protected By: ProtectedRoute (allowedRoles="admin")
Accessible By: Users with role="admin"
Denied Access Redirects To: /403
Status: Placeholder - ready for AdminVerificationPage
Future Implementation:
  - User verification workflow
  - Document review
  - Approval/rejection actions
```

### 5. Error Routes

#### 403 Forbidden
```javascript
Route: GET /403
Component: ForbiddenPage
Auth Required: No
Role Required: None
Description: User lacks permission for requested resource
Location: src/pages/ForbiddenPage.jsx
Triggered By: ProtectedRoute when user role doesn't match allowedRoles
Features:
  - Error explanation
  - Support contact link
  - Link to dashboard
  - Professional styling
```

#### 404 Not Found
```javascript
Route: GET /* (catch-all)
Component: NotFoundPage
Auth Required: No
Role Required: None
Description: Route does not exist
Location: src/pages/NotFoundPage.jsx
Triggered By: Any undefined route
Features:
  - Helpful error message
  - Link to dashboard (if authenticated) or login
  - Support contact link
  - Professional styling
```

## Authentication Flow Diagram

```
User visits route
    ↓
Is route public? (login, register, password-reset)
    ├─ YES → Render component directly
    └─ NO → Is user authenticated?
            ├─ NO → Redirect to /login
            └─ YES → Does route require specific role?
                    ├─ NO → Render component
                    └─ YES → Does user have required role?
                            ├─ YES → Render component
                            └─ NO → Redirect to /403
```

## Component File Structure

```
client/src/
├── App.jsx (Main routing file - 150 lines)
├── components/
│   └── Common/
│       ├── Navbar.jsx (Navigation - 250 lines)
│       ├── ProtectedRoute.jsx (Route protection - 40 lines)
│       ├── ErrorBoundary.jsx
│       ├── Toast.jsx
│       ├── Loading.jsx
│       ├── Footer.jsx
│       └── Header.jsx
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── PasswordResetPage.jsx
│   ├── Dashboard/
│   │   └── DashboardPage.jsx
│   ├── Donation/
│   │   └── DonationSelectionPage.jsx
│   ├── Needy/
│   │   └── NeedyIndividualPage.jsx
│   ├── QR/
│   │   └── QRPaymentPage.jsx
│   ├── Admin/
│   │   └── (To be created: AdminVerificationPage.jsx)
│   ├── NotFoundPage.jsx (404)
│   └── ForbiddenPage.jsx (403)
└── context/
    └── AuthContext.jsx
```

## Protected Route Usage Examples

### All Users (No Role Check)
```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute
      element={<DashboardPage />}
      allowedRoles={null}  // All authenticated users
    />
  }
/>
```

### Single Role
```jsx
<Route
  path="/needy/individual"
  element={
    <ProtectedRoute
      element={<NeedyIndividualPage />}
      allowedRoles="needy"  // Only needy users
    />
  }
/>
```

### Multiple Roles
```jsx
<Route
  path="/verified-content"
  element={
    <ProtectedRoute
      element={<VerifiedContentPage />}
      allowedRoles={["donor", "admin"]}  // Donor or Admin
    />
  }
/>
```

## AuthContext Requirements

The routing system depends on AuthContext providing:

```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    role: "donor" | "needy" | "admin",
    ...otherFields
  },
  loading: boolean,
  isAuthenticated: boolean,
  login: (credentials) => Promise<user>,
  register: (userData) => Promise<user>,
  logout: () => Promise<void>,
  updateProfile: (userData) => Promise<user>
}
```

## Navbar Features

### Unauthenticated View
- Hravinder logo (clickable to /login)
- Login button
- Register button
- Mobile hamburger menu

### Authenticated View
- Hravinder logo (clickable to /dashboard)
- Dashboard link
- Donate link
- Role-specific links:
  - Needy: "My Profile" → /needy/individual
  - Admin: "Admin Panel" → /admin/verification
- User name display
- User role display
- Logout button
- Mobile hamburger menu

### Active Route Highlighting
- Current page link is highlighted with darker background
- Implemented using useLocation hook
- isActive() function determines if link matches current path

## Redirect Chain Prevention

Routes are organized to prevent infinite redirects:

```
/login → (if authenticated) → Can navigate to /dashboard
/register → (if authenticated) → Can navigate to /dashboard
/ → Always redirects to /dashboard → Then ProtectedRoute handles it

ProtectedRoute with no role checks:
  /dashboard → (if not auth) → /login (one redirect)

ProtectedRoute with role checks:
  /needy/individual → (if not auth) → /login (one redirect)
  /needy/individual → (if auth but wrong role) → /403 (one redirect)
```

## Best Practices Implemented

1. **Clear Route Organization**: Routes grouped by type with comments
2. **Centralized Auth**: Uses AuthContext, not scattered auth checks
3. **Proper Error Handling**: 404 and 403 pages created
4. **Loading States**: Loading component shown during auth check
5. **No Inline Styles**: All Tailwind CSS classes
6. **Mobile Responsive**: Navbar has mobile menu
7. **Active Route Highlighting**: Visual indication of current page
8. **Proper Cleanup**: Logout properly clears all state
9. **Documentation**: Code well-commented
10. **Single Component Per File**: Each component in its own file

## Testing Routes

### Unit Testing
- Test ProtectedRoute component with different auth states
- Test ProtectedRoute with different roles
- Test Navbar render based on auth state

### Integration Testing
- Test full auth flow through all routes
- Test role-based access control
- Test redirect chains
- Test error page rendering

### E2E Testing
- Login and navigate through all protected routes
- Logout and verify access denied
- Test mobile navigation
- Test error pages with different scenarios

## Migration Notes (if needed)

If you need to add new routes:

1. Create component in appropriate pages/ folder
2. Import in App.jsx
3. Add route definition:
   ```jsx
   <Route
     path="/new-route"
     element={<ProtectedRoute element={<Component />} />}
   />
   ```
4. Add navigation link in Navbar if needed
5. Test redirect behavior

## Performance Considerations

- Routes use lazy loading through React Router
- ProtectedRoute shows loading spinner during auth check
- Navbar memoization recommended for large menus
- Mobile menu toggle doesn't cause page reload
- All styling done at build time (Tailwind)

---

Last Updated: 2026-04-03
Status: Complete and Ready for Testing
