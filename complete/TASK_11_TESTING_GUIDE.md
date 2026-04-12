# Task #11 Testing Guide - Quick Start

## Quick Test Steps

### 1. Start Development Server
```bash
cd client
npm run dev
```

### 2. Test Public Routes (No Auth)
| Test | Steps | Expected |
|------|-------|----------|
| Login Page | Visit `http://localhost:5173/login` | LoginPage renders |
| Register Page | Visit `http://localhost:5173/register` | RegisterPage renders |
| Password Reset | Visit `http://localhost:5173/password-reset` | PasswordResetPage renders |
| Root Path | Visit `http://localhost:5173/` | Redirects to /dashboard (then to /login) |

### 3. Test Protected Routes (Without Auth)
| Test | Steps | Expected |
|------|-------|----------|
| Dashboard | Visit `/dashboard` | Redirects to /login |
| Donation | Visit `/donation` | Redirects to /login |
| QR Payment | Visit `/payment/123` | Redirects to /login |

### 4. Test Auth Flow
1. **Register New User**
   - Click "Register" link
   - Fill in form and submit
   - Should redirect to /dashboard
   - Navbar should show username and role

2. **Logout**
   - Click "Logout" button in navbar
   - Should redirect to /login
   - Navbar should show "Login" and "Register" buttons again

3. **Login**
   - Go to /login
   - Enter credentials
   - Should redirect to /dashboard
   - Navbar should update with username

### 5. Test Role-Based Access

#### For Needy User:
- After login as needy user, navbar should show "My Profile" link
- Click "My Profile" → Should navigate to `/needy/individual`
- Try accessing `/admin/verification` → Should redirect to 403 page

#### For Admin User:
- After login as admin user, navbar should show "Admin Panel" link
- Try accessing `/needy/individual` → Should redirect to 403 page
- Access `/admin/verification` → Should work (currently shows dashboard)

### 6. Test Error Pages

| Test | Steps | Expected |
|------|-------|----------|
| 404 Not Found | Visit `/xyz123` (random path) | NotFoundPage renders with link back |
| 403 Forbidden | Access role-restricted route as wrong role | ForbiddenPage renders with help link |

### 7. Test Navigation Bar

#### Unauthenticated State:
- [ ] Shows "Hravinder" logo (clickable to /login)
- [ ] Shows "Login" button
- [ ] Shows "Register" button
- [ ] No user menu visible
- [ ] Mobile hamburger menu works

#### Authenticated State:
- [ ] Shows "Hravinder" logo (clickable to /dashboard)
- [ ] Shows username
- [ ] Shows user role (donor/needy/admin)
- [ ] Shows "Logout" button
- [ ] Shows role-specific nav items (if applicable)
- [ ] Active route is highlighted
- [ ] Mobile hamburger menu works with all options

### 8. Test Mobile Responsiveness

1. Open dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on iPhone SE, iPad, and Mobile view
4. Verify:
   - Navbar hamburger menu appears
   - Menu toggles on click
   - Links are tappable
   - No horizontal scroll
   - Text is readable

### 9. Browser Console Check

Open browser console (F12) and verify:
- [ ] No red errors
- [ ] No warning about missing React.StrictMode
- [ ] Auth context loads correctly
- [ ] All imports resolve

### 10. Network Check

In Network tab:
- [ ] API calls for auth work
- [ ] Token is stored in localStorage
- [ ] No failed requests

## Expected Behaviors

### Redirect Logic:
```
Unauthenticated user:
  /dashboard → /login
  /donation → /login
  /payment/:id → /login
  / → /login

Authenticated user with wrong role:
  /admin/verification (as donor) → /403
  /needy/individual (as admin) → /403

Authenticated user with correct role:
  All protected routes work
  Role-specific routes accessible

Any user:
  /xyz (undefined) → NotFoundPage
  /login → LoginPage
  /register → RegisterPage
```

### Navbar Updates:
```
After Login:
  Shows: Username, Role, Logout, Dashboard, Donate, [Role-specific links]
  Hides: Login, Register buttons

After Logout:
  Shows: Login, Register buttons
  Hides: Username, Role, Logout, role-specific links
  
Mobile:
  Hamburger menu toggles all nav items
```

## Troubleshooting

### Issue: Blank page after login
- [ ] Check console for errors
- [ ] Verify AuthContext is working (check localStorage for tokens)
- [ ] Clear browser cache and try again

### Issue: Redirect loop
- [ ] Check that AuthContext.isAuthenticated is correct
- [ ] Verify user object is populated after login
- [ ] Check that ProtectedRoute component is getting correct props

### Issue: Navbar not updating
- [ ] Check that logout function actually clears auth state
- [ ] Verify AuthContext is re-rendering Navbar
- [ ] Check that useAuth hook is using context correctly

### Issue: 404 page not showing
- [ ] Verify NotFoundPage component exists at correct path
- [ ] Check that /* route is last in Routes list
- [ ] Clear build cache: `rm -rf dist && npm run dev`

## Performance Testing

### Build Size:
```
Current: 362.33 kB (gzip: 111.28 kB)
Should stay similar after testing
```

### Route Transition Performance:
- [ ] No lag when navigating between routes
- [ ] Loading spinner appears and disappears smoothly
- [ ] Page content loads within 1 second

## Success Criteria

All items must pass for Task #11 to be complete:

- [x] Build passes without errors
- [x] All route imports correct
- [x] ProtectedRoute component created and working
- [x] NotFoundPage created
- [x] ForbiddenPage created
- [x] Navbar enhanced with auth-aware links
- [x] App.jsx has complete routing with comments
- [ ] Manual testing confirms all routes work
- [ ] Manual testing confirms protection works
- [ ] Manual testing confirms navigation updates based on auth
- [ ] Mobile menu works correctly
- [ ] No console errors

## Post-Testing Notes

After completing all tests, document:
1. Any edge cases discovered
2. Routes that need additional features
3. Performance improvements needed
4. UX improvements identified

Then create next task (Task #12) based on findings.
