# Authentication Pages Testing Guide

This document outlines how to test the Login, Register, and Password Reset pages for the Hravinder Donation Platform.

## Pages Implemented

### 1. LoginPage (`/login`)
**Components Used:**
- LoginForm.jsx

**Features:**
- Email/password login
- Remember email checkbox (stored in localStorage)
- Show/hide password toggle
- Password visibility indicator
- Loading spinner during submission
- Error message display
- Redirect to dashboard on success
- Redirect to registration and password reset links
- Responsive design

**To Test:**
1. Navigate to `/login`
2. Test valid login:
   - Enter email: `test@example.com`
   - Enter password: `TestPassword123!`
   - Click "Login"
   - Should redirect to `/dashboard` with success toast
3. Test invalid credentials:
   - Enter wrong email or password
   - Should show error message
   - Should display error toast
4. Test form validation:
   - Try submitting with empty email
   - Try submitting with invalid email format
   - Try submitting with empty password
   - All should show validation errors
5. Test remember email:
   - Check "Remember email" checkbox
   - Login successfully
   - Go back to login page
   - Email should be pre-filled
   - Uncheck and login again
   - Email should be cleared next time
6. Test UI interactions:
   - Click password visibility toggle
   - Verify password shows/hides
   - Test responsive design on mobile

### 2. RegisterPage (`/register`)
**Components Used:**
- RegisterForm.jsx

**Features:**
- Full name input (2+ chars)
- Email validation
- Phone validation (10 digits, India format)
- Password strength indicator
- Password confirmation matching
- Optional address fields (street, city, state, zipcode)
- Terms & Conditions checkbox
- Success message with 3-second countdown to login
- Form reset after successful registration
- Show/hide password toggle
- Show/hide confirm password toggle
- Comprehensive field-level validation
- Responsive design

**To Test:**
1. Navigate to `/register`
2. Test full valid registration:
   - Full Name: "John Doe"
   - Email: "newuser@example.com"
   - Phone: "9876543210"
   - Password: "TestPassword123!"
   - Confirm: "TestPassword123!"
   - Accept Terms & Conditions
   - Click "Create Account"
   - Should show success message with countdown
   - Should redirect to login after 3 seconds
3. Test field-level validation:
   - Empty full name: error "Full name is required"
   - Name less than 2 chars: error "Name must be at least 2 characters"
   - Invalid email format: error "Invalid email format"
   - Phone with letters: error "Invalid phone number"
   - Phone less than 10 digits: error "Invalid phone number"
   - Password less than 8 chars: error "Password must be at least 8 characters"
   - Password without uppercase: error "Password must contain uppercase letter"
   - Password without number: error "Password must contain number"
   - Password without special char: error "Password must contain special character"
   - Mismatched passwords: error "Passwords do not match"
   - No terms agreement: error "You must agree to the Terms & Conditions"
4. Test password strength indicator:
   - Type weak password (less than 8 chars): red indicator
   - Type fair password: yellow indicator
   - Type good password (8+ chars with requirements): blue indicator
   - Type strong password (all requirements): green indicator
5. Test optional address fields:
   - Click "Address (Optional)"
   - Fill some or all address fields
   - Register with address data
   - Should include in registration payload
6. Test error handling:
   - If email already exists, should show specific error
   - Network errors should display in error alert
7. Test UI interactions:
   - Password visibility toggles work
   - Form disables during submission
   - Loading spinner shows
   - Responsive design on mobile

### 3. PasswordResetPage (`/password-reset` or `/password-reset?token=xyz`)
**Components Used:**
- Custom form component in PasswordResetPage.jsx

**Features - Step 1: Request Reset**
- Email input
- Send reset link functionality
- Success message display
- Loading state management
- Error handling
- Link back to login

**Features - Step 2: Reset Password (with token)**
- New password input with show/hide toggle
- Confirm password input with show/hide toggle
- Password validation
- Password matching validation
- Loading state during submission
- Success message with redirect
- Error handling
- Link back to login

**To Test:**
1. **Request Reset Flow:**
   - Navigate to `/password-reset`
   - Enter email: `test@example.com`
   - Click "Send Reset Link"
   - Should show success message
   - Should show confirmation message
   - Check backend/email service for reset link

2. **Reset with Token Flow:**
   - Navigate to `/password-reset?token=some_reset_token`
   - Should skip to reset form
   - New Password: "NewPassword123!"
   - Confirm: "NewPassword123!"
   - Click "Reset Password"
   - Should show success message
   - Should redirect to login after 2 seconds

3. **Reset Token Validation:**
   - Try with invalid token
   - Should show error "Token expired or invalid"
   - Try with missing token
   - Should show error "Reset token is missing"

4. **Password Validation During Reset:**
   - Password without uppercase: error "Password must contain uppercase letter"
   - Password without number: error "Password must contain number"
   - Password without special char: error "Password must contain special character"
   - Mismatched passwords: error "Passwords do not match"

5. **Error Handling:**
   - Wrong email during request: should show error
   - Invalid token during reset: should show error
   - Network errors: should display in UI

## API Endpoints Used

### Login
- **POST** `/api/auth/login`
- **Request:** `{ email, password }`
- **Response:** `{ access_token, refresh_token, user: { id, email, name, ... } }`

### Register
- **POST** `/api/auth/register`
- **Request:** `{ name, email, password, phone, address: { street, city, state, zipcode } }`
- **Response:** `{ access_token, refresh_token, user: { id, email, name, ... } }`

### Request Password Reset
- **POST** `/api/auth/forgot-password`
- **Request:** `{ email }`
- **Response:** `{ message: "Reset email sent" }`

### Reset Password
- **POST** `/api/auth/reset-password`
- **Request:** `{ token, password }`
- **Response:** `{ message: "Password reset successfully" }`

## Validation Rules Implemented

### Email
- Required
- Must match email format (xxx@xxx.xxx)

### Phone
- Required (for register only)
- Must be 10 digits
- Only numeric characters allowed

### Password
- Required
- Minimum 8 characters
- Must contain uppercase letter (A-Z)
- Must contain number (0-9)
- Must contain special character (!@#$%^&*)

### Full Name
- Required (for register only)
- Minimum 2 characters
- Maximum 50 characters

### Confirm Password
- Required
- Must match password field

### Terms & Conditions
- Required (for register only)
- Must be checked

## LocalStorage Keys Used

- `authToken`: JWT access token
- `refreshToken`: JWT refresh token
- `rememberEmail`: Email for login remember feature

## Error Messages

| Condition | Message |
|-----------|---------|
| Email required | Email is required |
| Invalid email format | Invalid email format |
| Password required | Password is required |
| Password too short | Password must be at least 8 characters |
| Missing uppercase | Password must contain uppercase letter |
| Missing number | Password must contain number |
| Missing special char | Password must contain special character (!@#$%^&*) |
| Phone required | Phone number is required |
| Invalid phone | Invalid phone number |
| Full name required | Full name is required |
| Name too short | Name must be at least 2 characters |
| Name too long | Name must not exceed 50 characters |
| Passwords don't match | Passwords do not match |
| Terms not agreed | You must agree to the Terms & Conditions |
| Email already registered | This email is already registered |
| Invalid credentials | Invalid email or password |
| Network error | Please check your internet connection |
| Server error | Something went wrong. Please try again |

## Browser Compatibility

Tested and should work on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design Breakpoints

- **Mobile:** < 768px - Single column, full width inputs
- **Tablet:** 768px - 1024px - Centered card layout
- **Desktop:** > 1024px - Centered card layout with max-width

## Performance Notes

- Forms use react-hook-form for optimized re-renders
- Debounced validation on field changes
- Loading states prevent double submissions
- Token stored in localStorage for persistent sessions
- Auto-redirect on 401 responses

## Known Limitations

1. **Email Verification:** Not implemented - users can register with any email
2. **CAPTCHA:** No bot protection on forms
3. **Rate Limiting:** Client-side only, backend should implement
4. **Social Auth:** Not implemented
5. **Two-Factor Auth:** Not implemented
6. **Session Timeout:** No auto-logout after inactivity

## Accessibility

- Form labels properly associated with inputs
- Error messages announced to screen readers
- Keyboard navigation supported
- Color not sole means of conveying information
- Sufficient contrast ratios (WCAG AA)
- Focus indicators visible

## Security Considerations

1. Passwords sent over HTTPS (ensure backend enforces this)
2. Sensitive tokens stored in localStorage (consider httpOnly cookies for production)
3. XSS protection via React (auto-escapes values)
4. CSRF protection via backend (ensure tokens are validated)
5. No hardcoded credentials in code

## Troubleshooting

### Issue: Form not submitting
- **Solution:** Check form validation errors, ensure all required fields are filled

### Issue: Tokens not stored
- **Solution:** Check localStorage, ensure browser allows storage

### Issue: Redirect not working
- **Solution:** Check React Router setup, verify routes are configured

### Issue: Password validation too strict
- **Solution:** Adjust regex patterns in validation.js

### Issue: Remember email not working
- **Solution:** Check localStorage settings in browser, clear cache

## Future Enhancements

1. Add email verification on registration
2. Implement CAPTCHA for bot protection
3. Add social login options (Google, GitHub)
4. Implement two-factor authentication
5. Add password strength requirements visualization
6. Add username as login alternative
7. Implement account recovery options
8. Add login activity tracking
9. Implement session management
10. Add biometric login for mobile
