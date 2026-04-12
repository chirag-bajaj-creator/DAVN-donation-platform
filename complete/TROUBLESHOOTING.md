# Troubleshooting Guide - Hravinder Donation Platform

Common issues and their solutions for development and production.

---

## Development Issues

### Frontend Won't Start

**Problem:** `npm run dev` fails or app crashes

**Solutions:**
```bash
# 1. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Check Node version (should be 18+)
node --version

# 3. Check port 5173 isn't in use
lsof -i :5173
# Kill process if needed: kill -9 [PID]

# 4. Check .env.local exists
ls -la client/.env.local

# 5. Check Vite config
cat client/vite.config.js
```

### Backend Won't Start

**Problem:** `npm start` fails in backend

**Solutions:**
```bash
# 1. Check Node version (should be 18+)
node --version

# 2. Install dependencies
npm install

# 3. Check .env file exists
ls -la backend/.env

# 4. Check MongoDB is running
mongod --version

# 5. Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGODB_URI)"

# 6. Check port 5000 isn't in use
lsof -i :5000
```

### API Calls Fail with 404

**Problem:** Frontend gets 404 from backend endpoints

**Solutions:**
```
1. Check backend is running on :5000
2. Check VITE_API_BASE_URL in .env.local
   Should be: http://localhost:5000
3. Check route exists in backend/routes/
4. Check controller is implemented
5. Check middleware order in server.js
```

---

## Authentication Issues

### Login Failed - "Invalid Credentials"

**Problem:** Login returns 401 even with correct password

**Solutions:**
1. **Verify account exists**: Check MongoDB collection
   ```bash
   db.users.findOne({ email: "your@email.com" })
   ```

2. **Check password hashing**:
   - Password must be hashed with bcryptjs
   - Never compare plaintext passwords

3. **Check JWT_SECRET**:
   ```bash
   # Should be 32+ random characters
   echo $JWT_SECRET
   ```

4. **Clear browser cache**:
   - Chrome DevTools → Application → Clear Site Data

### "Token Expired" Error

**Problem:** Getting "token has expired" on every request

**Solutions:**
```
1. Check JWT_EXPIRE setting
   Should be: "1h" for 1 hour
   
2. Check server time is correct
   date  # Should match your system

3. Test token generation:
   - Login and get accessToken
   - Check token not expired: jwt.io

4. Check refresh token logic
   - Should use refresh token to get new access token
```

### Password Reset Token Not Working

**Problem:** "Invalid or expired token" when resetting password

**Solutions:**
```
1. Check token exists in database
   db.users.findOne({ 
     passwordResetToken: "token_value"
   })

2. Check token hasn't expired (24 hours)
   Token creation time should be recent

3. Check token format
   Should be SHA256 hash, not plain text

4. Test email service:
   - Check SendGrid API key in .env
   - Check email is actually sent
```

---

## Database Issues

### MongoDB Connection Fails

**Problem:** "Cannot connect to MongoDB" or "ENOTFOUND"

**Solutions:**
```
1. Check connection string format:
   mongodb+srv://username:password@cluster.mongodb.net/database

2. Verify credentials:
   - Username correct
   - Password correct
   - No special characters need escaping

3. Check MongoDB Atlas whitelist:
   - Your IP must be whitelisted
   - Or use 0.0.0.0/0 (less secure)

4. Test locally:
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/db"

5. For Render:
   - Add Render's static IP to whitelist
   - Or use 0.0.0.0/0
```

### Queries Are Slow

**Problem:** Donations list takes 5+ seconds to load

**Solutions:**
```
1. Check indexes exist:
   db.donations.getIndexes()

2. Add missing indexes:
   db.donations.createIndex({ createdAt: -1 })
   db.donations.createIndex({ userId: 1 })

3. Check query plan:
   db.donations.find(...).explain("executionStats")

4. Avoid N+1 queries:
   Use .populate() in Mongoose
   ```

### Out of Disk Space

**Problem:** "No space left on device" error

**Solutions:**
```
1. Check MongoDB disk usage:
   MongoDB Atlas → Metrics → Disk Usage

2. Archive old data:
   - Move donations > 1 year old to archive collection
   - Delete soft-deleted records

3. Optimize storage:
   - Remove duplicate indexes
   - Compress logs

4. Upgrade MongoDB plan:
   - Free tier has limited storage
   - Upgrade to paid tier for more space
```

---

## API Issues

### CORS Error: "Blocked by CORS"

**Problem:** Frontend gets "No 'Access-Control-Allow-Origin' header"

**Solutions:**
```javascript
// Check backend/server.js has CORS configured
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
}
app.use(cors(corsOptions))

// Make sure:
1. FRONTEND_URL is correct in .env
2. Matches frontend URL exactly (http vs https)
3. No trailing slash in URL
4. Is not localhost in production
```

### Rate Limiting Blocks Requests

**Problem:** Getting 429 "Too Many Requests"

**Solutions:**
```
1. Wait for rate limit window to expire
   Rate limits: 5 per 15 min for auth
              100 per 15 min for general API

2. Check if something is spamming requests
   - Multiple failed login attempts
   - Rapid API calls in loop

3. For testing, disable rate limiting locally:
   RATE_LIMIT_ENABLED=false in .env

4. In production, whitelist admin IP if needed
```

### Validation Error: "Invalid Input"

**Problem:** API returns "validation failed" error

**Solutions:**
```
1. Check required fields are present:
   POST /api/auth/register needs:
   - email (valid email format)
   - password (min 8 chars)
   - name (2-100 chars)
   - phone (10 digits)

2. Check field formats:
   - Email: must match regex
   - Phone: must be 10 digits (India)
   - Password: min 8 chars, uppercase, lowercase, number

3. Check Joi schema in schemas/ folder
   Compare your input with schema requirements

4. Test with curl:
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"Test123!","name":"Test User","phone":"9876543210"}'
```

---

## File Upload Issues

### Cloudinary Upload Fails

**Problem:** Image upload returns "Upload failed"

**Solutions:**
```
1. Check Cloudinary credentials in .env:
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

2. Verify upload preset exists:
   - Go to Cloudinary dashboard
   - Settings → Upload
   - Check preset name is correct

3. Check preset is unsigned:
   - Must be unsigned (no API secret)
   - Never expose API secret in frontend code

4. Check file size:
   - Max 5MB
   - Check file.size in browser

5. Check MIME type:
   - Only jpeg, png, webp allowed
   - Check file.type in browser

6. Test with curl:
   curl -F "file=@image.jpg" \
        -F "upload_preset=your_preset" \
        https://api.cloudinary.com/v1_1/your_cloud/image/upload
```

### Image Not Displaying

**Problem:** Upload succeeds but image shows broken

**Solutions:**
```
1. Check URL is correct:
   - Should start with https://res.cloudinary.com
   - Check console for full URL

2. Check image actually uploaded:
   - Go to Cloudinary dashboard
   - Browse media library

3. Check file path is saved:
   - Should be in donations or needy-documents folder
   - Verify in MongoDB: image_url field

4. Check CORS headers:
   - Cloudinary handles CORS automatically
   - Should work from any domain

5. Clear browser cache:
   - May be showing old broken URL
```

---

## Email Issues

### Email Not Sending

**Problem:** Password reset email doesn't arrive

**Solutions:**
```
1. Check SendGrid API key:
   echo $SENDGRID_API_KEY
   Should start with SG.

2. Check from email is verified:
   - SendGrid dashboard
   - Sender Authentication
   - Verify domain or email

3. Check email address is correct:
   - Look in logs or database
   - Should be valid email format

4. Check email ended up in spam:
   - Check spam/junk folder
   - Check spam score in SendGrid

5. Test sending directly:
   curl --request POST \
     --url https://api.sendgrid.com/v3/mail/send \
     --header "Authorization: Bearer $SENDGRID_API_KEY" \
     --header "Content-Type: application/json" \
     --data '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@example.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'

6. Check logs in SendGrid dashboard:
   - Activity → Email Events
   - See if email was processed
```

---

## Payment Issues

### Razorpay Payment Fails

**Problem:** "Payment failed" when trying to donate with QR

**Solutions:**
```
1. Check Razorpay credentials:
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret

2. Check you're in test mode for development:
   - Razorpay dashboard
   - Test mode should be active
   - Use test payment details

3. Check payment mode switch:
   - Development: Test Mode
   - Production: Live Mode (real money!)

4. Check QR code is valid:
   - Can scan with any UPI app
   - Should show merchant details

5. Check payment webhook:
   - Razorpay → Webhooks
   - Should point to your backend
   - Verify signature before processing

6. Test payment manually:
   - Use Razorpay test card: 4111111111111111
   - Expiry: Any future date
   - CVV: Any 3 digits
```

---

## Performance Issues

### App Is Slow

**Problem:** Page load time > 3 seconds

**Solutions:**

**Frontend:**
```
1. Check Network tab:
   - DevTools → Network
   - Look for slow requests
   - Check bundle size: should be < 500KB gzipped

2. Optimize images:
   - Use WebP format
   - Resize before upload
   - Use Cloudinary transformations

3. Enable caching:
   - Vercel cache headers auto-configured
   - Check DevTools → Cache-Control

4. Code split:
   - Use React.lazy() for page components
   - Routes auto-code-split in Vite
```

**Backend:**
```
1. Check database queries:
   - MongoDB Atlas → Metrics
   - Look for slow queries
   - Add indexes if missing

2. Check API response time:
   - DevTools → Network
   - Should be < 200ms

3. Check server resources:
   - Render → Metrics
   - CPU should be < 50%
   - Memory should be < 60%

4. Optimize database queries:
   - Use .select() to limit fields
   - Use .lean() for read-only
   - Use .populate() efficiently
```

---

## Deployment Issues

### Vercel Build Fails

**Problem:** `npm run build` fails on Vercel

**Solutions:**
```
1. Check build command:
   Vercel settings → Build & Output
   Should be: npm run build

2. Check Node version:
   Vercel settings → Runtime
   Should be: 18.x or later

3. Check environment variables:
   Vercel → Settings → Environment Variables
   Must have all VITE_ variables

4. Check .env.example:
   All vars in .env.example should be in Vercel

5. View build logs:
   Vercel dashboard → Deployments → Logs
   Look for specific error

6. Test locally:
   npm run build
   npm run preview
```

### Render Deployment Fails

**Problem:** Backend deployment fails on Render

**Solutions:**
```
1. Check build logs:
   Render dashboard → Logs
   Look for specific error

2. Check Node version:
   Render → Environment
   Node: 18.x or latest

3. Check start command:
   Render → settings
   Start Command: node server.js

4. Check environment variables:
   Render → Environment
   All vars from .env must be set

5. Check MongoDB connection:
   MongoDB Atlas → Network Access
   Add Render's IP or 0.0.0.0/0

6. Test package.json:
   - Check "start" script exists
   - Check no missing dependencies
   - Verify main file is server.js
```

---

## Security Issues

### Login Credentials Exposed

**Problem:** API key or password visible in logs

**Solutions:**
```
1. Check error logs:
   - Never log passwords
   - Never log API keys
   - Strip sensitive data

2. Check environment variables:
   - Should be in .env (never in code)
   - Should be in Vercel/Render dashboards
   - Never commit .env file

3. Regenerate exposed keys:
   - Change JWT_SECRET
   - Change API keys in SendGrid, Cloudinary
   - Change MongoDB password

4. Search git history:
   - git log -S "password" (search for password in commits)
   - If found, use git reset --hard to remove
   - Never force push to main!
```

### HTTPS/SSL Not Working

**Problem:** Site shows "Not Secure" warning

**Solutions:**
```
1. Check Vercel SSL:
   - Vercel auto-provides SSL
   - Check dashboard for certificate status

2. Check Render SSL:
   - Render auto-provides SSL
   - Check logs for SSL errors

3. Force HTTPS:
   Backend: app.use(require('helmet')())
   Frontend: Vercel does this automatically

4. Check certificates:
   - Chrome → Inspect → Security
   - Should show valid certificate
```

---

## Getting Help

1. **Check documentation first**:
   - README.md
   - CONTRIBUTING.md
   - SECURITY.md

2. **Search existing issues**:
   - GitHub Issues
   - Stack Overflow

3. **Check service provider docs**:
   - MongoDB documentation
   - Vercel documentation
   - Render documentation

4. **Create detailed issue**:
   - Clear title
   - Steps to reproduce
   - Screenshots if applicable
   - Error messages and logs

---

**Last Updated**: April 3, 2026  
**Version**: 1.0
