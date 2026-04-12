# Security Guidelines - Hravinder Donation Platform

## Overview
This document outlines security best practices for development, deployment, and maintenance of the Hravinder platform.

---

## 1. Environment Variables & Secrets Management

### ✅ DO:
- **Store secrets in `.env` files** (never in code)
- **Use `.env.example`** as a template (without values)
- **Generate strong secrets** - Min 32 random characters for JWT_SECRET
- **Use different secrets per environment** - Dev, staging, and production should have different keys
- **Rotate secrets regularly** - Especially if team member leaves
- **Use managed secrets** - Vercel and Render dashboards, not git
- **Document secret names** - But NEVER commit actual values

### ❌ DON'T:
- **Commit `.env` files** to git (should be in `.gitignore`)
- **Share secrets via chat/email** - Use secure vaults (1Password, LastPass)
- **Expose secrets in logs** - Strip them in error messages
- **Use default/weak secrets** - `password123`, `secret`, etc.
- **Reuse secrets across environments** - Each env gets unique keys
- **Hardcode API keys** - Always use environment variables
- **Log sensitive data** - Remove before error reporting

### Environment Variable Files
```
.env              ← Development (locally, never commit)
.env.example      ← Template (commit this, no values)
Vercel Dashboard  ← Production frontend secrets
Render Dashboard  ← Production backend secrets
```

---

## 2. Authentication & Authorization

### Login & Password Security
- **Passwords hashed with bcryptjs** (10+ salt rounds)
- **Passwords NEVER returned in API responses**
- **Failed login attempts rate-limited** (5 tries / 15 min)
- **JWT tokens short-lived** (1 hour access, 7 days refresh)
- **Logout clears tokens** on client and invalidates on server

### JWT Token Handling
```javascript
// ✅ CORRECT: Store in secure HttpOnly cookie
Set-Cookie: accessToken=....; HttpOnly; Secure; SameSite=Strict

// ❌ WRONG: Store in localStorage (vulnerable to XSS)
localStorage.setItem('token', jwt)
```

### Role-Based Access Control (RBAC)
- **User Roles**: `donor`, `needy`, `admin`
- **Protected Routes**: Check role before granting access
- **Protected Endpoints**: Verify role on backend before processing
- **Admin Actions**: Require explicit `role: "admin"` check

### Password Reset Flow
1. User requests reset with email
2. Backend generates time-limited token (24 hours)
3. Email sent with reset link (token in URL)
4. Token verified before allowing password change
5. Never send password in plain text

---

## 3. Data Protection

### Sensitive Fields Not Returned
```javascript
// Never return these in API responses:
- password
- passwordResetToken
- refreshToken
- creditCard numbers
- Social Security numbers
- API keys
- Database credentials
```

### Data Access Control
- **Users can only see their own data** (donations, requests)
- **Admin can see all data** for verification purposes
- **Needy individuals can't see other applicants**
- **Verify permissions on backend**, not just frontend

### Soft Deletes
- Records marked `isActive: false` instead of deletion
- Preserves referential integrity
- Allows auditing and recovery
- Excluded from API results by default

---

## 4. API Security

### Input Validation
```javascript
// ✅ CORRECT: Validate on backend
app.post('/api/donations', validate(donationSchema), controller)

// ❌ WRONG: Trust frontend validation only
// Frontend validation is for UX, not security
```

### Rate Limiting
- **Auth endpoints**: 5 attempts / 15 minutes
- **General API**: 100 requests / 15 minutes per IP
- **File uploads**: 10 uploads / hour per user
- Prevents brute force and DoS attacks

### Error Handling
```javascript
// ✅ CORRECT: Generic error message
res.status(401).json({ message: "Invalid credentials" })

// ❌ WRONG: Specific error (information disclosure)
res.status(401).json({ message: "Email not found in database" })
```

### CORS Configuration
```javascript
// Only allow your frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL, // From env var, not hardcoded
  credentials: true,
  optionsSuccessStatus: 200,
}
```

### API Versioning
```
/api/v1/auth/login   ← Current version
/api/v2/auth/login   ← Future version
```

---

## 5. File Upload Security

### Image Uploads (Cloudinary)
- **Use Unsigned Upload** (no API secret exposed)
- **Set file size limits** (max 5MB per file)
- **Whitelist file types** (jpg, png, webp only)
- **Virus scan** (Cloudinary auto-scans)
- **Store URLs in database** (not files)
- **Delete unused images** (cleanup old files)

### Upload Validation
```javascript
// ✅ CORRECT: Validate type and size
if (!['image/jpeg', 'image/png'].includes(file.type)) throw Error()
if (file.size > 5 * 1024 * 1024) throw Error() // 5MB

// ❌ WRONG: Trust filename extension
if (file.name.endsWith('.jpg')) {} // Can be renamed to .exe
```

---

## 6. Database Security

### MongoDB Atlas Setup
1. **Create strong credentials** (30+ character password)
2. **Use IP whitelist** - Only allow Render, local dev IPs
3. **Enable encryption** - In-transit (TLS) and at-rest (encryption key)
4. **Regular backups** - Daily automated backups (Atlas does this)
5. **Monitor access logs** - Set up alerts for suspicious activity

### Connection Security
```javascript
// ✅ CORRECT: Use connection string with auth
mongodb+srv://username:password@cluster.mongodb.net/database

// ❌ WRONG: No credentials
mongodb://localhost:27017/database (exposed in logs)
```

### Database Access Levels
- **Development**: Full read/write access (local developer)
- **Production**: Limited read/write (app service only)
- **Backups**: Encrypted, separate credentials
- **Reporting**: Read-only access for analytics

---

## 7. Payment Security

### Razorpay Integration
- **Never expose Secret Key** in frontend
- **Use Razorpay's secure forms** (not custom credit card inputs)
- **Verify payment signatures** on backend
- **Test mode for development** (use test payment details)
- **PCI-DSS compliant** (Razorpay handles compliance)

### Payment Verification
```javascript
// ✅ CORRECT: Verify signature on backend
const hmac = crypto
  .createHmac('sha256', razorpaySecret)
  .update(orderId + '|' + paymentId)
  .digest('hex')
if (hmac === signature) { /* Payment valid */ }

// ❌ WRONG: Trust frontend payment status
// Frontend can be manipulated by user
```

---

## 8. Email Security

### SendGrid Configuration
- **Use API key** (not plain text credentials)
- **Enable 2FA** on SendGrid account
- **Monitor bounce/complaint rates** (>5% = problem)
- **Use templates** (not plain text emails)
- **Include unsubscribe link** (legal requirement)

### Email Content
```javascript
// ✅ CORRECT: Don't send sensitive info
Subject: Your password reset link
Link: https://yoursite.com/reset?token=abc123

// ❌ WRONG: Exposing sensitive data
Subject: Reset password to "MyPassword123!"
```

---

## 9. Frontend Security

### XSS (Cross-Site Scripting) Prevention
```javascript
// ✅ CORRECT: React auto-escapes
<div>{userInput}</div>

// ❌ WRONG: Raw HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### CSRF (Cross-Site Request Forgery) Protection
```javascript
// ✅ CORRECT: Use SameSite cookies
Set-Cookie: token=...; SameSite=Strict

// ❌ WRONG: No CSRF protection
```

### LocalStorage Security
```javascript
// ⚠️ VULNERABLE: XSS can steal localStorage
localStorage.setItem('token', jwt)

// ✅ BETTER: Use HttpOnly cookies
Set-Cookie: token=...; HttpOnly; Secure
```

---

## 10. Deployment Security

### Vercel Frontend Deployment
- **Enable preview deployments** only from PRs (not direct)
- **Require approval** before production deployments
- **Set environment variables** in dashboard (not code)
- **Enable HTTPS/SSL** (automatic on Vercel)
- **Set security headers** (already configured in Vite)

### Render Backend Deployment
- **Enable private deployments** (requires auth)
- **Set deployment webhooks** (if using CI/CD)
- **Limit database IP whitelist** to Render only
- **Enable HTTPS/SSL** (automatic on Render)
- **Monitor error logs** for security issues
- **Set up email alerts** for deployment failures

### CI/CD Security
```yaml
# .github/workflows/deploy.yml (example)
- name: Deploy
  env:
    PROD_SECRET: ${{ secrets.PROD_SECRET }}  # ✅ CORRECT
  run: npm run deploy
```

---

## 11. Logging & Monitoring

### What to Log
```javascript
// ✅ SAFE to log
- User ID (hashed)
- Endpoint and method
- Response status code
- Timestamp and duration
- Error message (generic)
- IP address (for rate limiting)

// ❌ NEVER log
- Passwords
- API keys / tokens
- Credit card numbers
- Personal identification info
- Email addresses
- Phone numbers
```

### Log Retention
- Keep logs for 30 days
- Archive older logs securely
- Delete logs after 90 days
- Encrypt logs in storage

### Monitoring & Alerts
- **Set up error tracking** (Sentry, LogRocket)
- **Monitor API response times** (>1s = alert)
- **Monitor failed logins** (>5 in 15 min = alert)
- **Monitor database connections** (>90% = alert)
- **Daily security audit logs**

---

## 12. Incident Response

### Security Incident Checklist
If you suspect a security breach:

1. **Immediately disable affected accounts** or reset tokens
2. **Stop further data exposure** (if possible)
3. **Identify root cause** (compromised secret? Code flaw?)
4. **Notify affected users** (if data was exposed)
5. **Rotate all secrets** (API keys, JWT secrets, etc.)
6. **Review access logs** for suspicious activity
7. **Deploy a fix** to prevent future incidents
8. **Update security documentation**

### Common Incidents
- **Compromised API Key**
  - Rotate immediately
  - Check usage logs in that service (SendGrid, Cloudinary)
  - Revert any unauthorized changes

- **Exposed `.env` file**
  - Rotate all secrets in that file
  - Check git history to see what was exposed
  - Enable branch protection and PR reviews

- **Unauthorized database access**
  - Change MongoDB password
  - Review access logs
  - Whitelist only known IPs
  - Consider encryption key rotation

---

## 13. Third-Party Security

### Dependencies Updates
```bash
# Check for security vulnerabilities
npm audit

# Fix critical vulnerabilities
npm audit fix
```

### Third-Party Services
- **Cloudinary**: Upload only images (no executables)
- **SendGrid**: Email deliverability is their responsibility
- **Razorpay**: PCI-DSS certified, handles payment compliance
- **MongoDB Atlas**: SOC2 certified, encrypted backups
- **Vercel/Render**: Automatically patch OS and runtime

---

## 14. Security Checklist

### Before Each Deployment
- [ ] Run `npm audit` (no critical vulnerabilities)
- [ ] Review code changes for secrets
- [ ] Update `.env.example` (no values)
- [ ] Verify all environment variables are set
- [ ] Check CORS origin is correct
- [ ] Verify API rate limiting is active
- [ ] Review error messages (no info disclosure)
- [ ] Test with real payment in test mode

### Before Production Release
- [ ] Security audit complete
- [ ] Penetration test passed (if applicable)
- [ ] All dependencies updated
- [ ] Secrets rotated
- [ ] Backups tested and working
- [ ] Monitoring and alerts configured
- [ ] Incident response plan documented
- [ ] Team trained on security practices

---

## 15. Resources & References

### Documentation
- [OWASP Top 10](https://owasp.org/Top10/) - Common security flaws
- [Node.js Security](https://nodejs.org/en/docs/guides/security/) - Node.js best practices
- [MongoDB Security](https://docs.mongodb.com/manual/security/) - Database security
- [Razorpay Security](https://razorpay.com/docs/#security) - Payment security

### Tools
- [npm audit](https://docs.npmjs.com/cli/v9/commands/npm-audit) - Vulnerability scanning
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing tool
- [Snyk](https://snyk.io/) - Dependency vulnerability monitoring

### Contacts
- **Report a vulnerability**: security@hravinder.com (if applicable)
- **For questions**: Contact the development team

---

## Summary

🔒 **Security is everyone's responsibility.**

Remember:
1. **Secrets stay secret** (never commit `.env` files)
2. **Validate everything** (frontend validation is for UX, backend for security)
3. **Default to secure** (assume user input is malicious)
4. **Monitor continuously** (logs, alerts, audits)
5. **Stay updated** (patch dependencies regularly)
6. **Rotate often** (API keys, JWT secrets)
7. **Ask questions** (when in doubt, ask the team)

---

**Last Updated**: April 3, 2026  
**Version**: 1.0
