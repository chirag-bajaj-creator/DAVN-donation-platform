# Backend Environment Variables Configuration

## Overview
Environment variables for the Hravinder backend are managed through `.env` file for development and configured in Render dashboard for production.

## Required Environment Variables

### Core Server Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NODE_ENV` | String | Yes | Environment: `development`, `staging`, or `production` |
| `PORT` | Number | Yes | Server port (default: 5000) |
| `FRONTEND_URL` | URL | Yes | Frontend domain for CORS (e.g., `http://localhost:3000`) |

### Database Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `MONGODB_URI` | URL | Yes | MongoDB connection string (Atlas or local) |
| `DB_NAME` | String | No | Database name (default: `hravinder`) |

### Authentication & Security
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `JWT_SECRET` | String | Yes | Secret key for JWT signing (min 32 random characters) |
| `JWT_EXPIRE` | String | No | Access token expiry (default: `1h`) |
| `REFRESH_TOKEN_EXPIRE` | String | No | Refresh token expiry (default: `7d`) |
| `BCRYPT_ROUNDS` | Number | No | Password hashing rounds (default: 10) |

### Email Service (SendGrid)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `SENDGRID_API_KEY` | String | Yes | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Email | Yes | From email address (e.g., `noreply@hravinder.com`) |
| `SENDGRID_FROM_NAME` | String | No | From name (e.g., `Hravinder Support`) |

### File Upload Service (Cloudinary)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | String | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | String | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | String | Yes | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | String | No | Default upload folder (e.g., `hravinder`) |

### Payment Gateway (Razorpay)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `RAZORPAY_KEY_ID` | String | Yes | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | String | Yes | Razorpay API Key Secret |

### UPI/Payment Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `UPI_MERCHANT_ID` | String | No | UPI merchant ID for QR payments |
| `PAYMENT_WEBHOOK_SECRET` | String | No | Webhook signature verification key |

### Rate Limiting (Optional)
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `RATE_LIMIT_WINDOW_MS` | Number | No | Rate limit window in ms (default: 900000 = 15min) |
| `RATE_LIMIT_MAX_REQUESTS` | Number | No | Max requests per window (default: 100) |

---

## Development Setup (.env)

Create a `.env` file in the `backend/` directory:

```
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database (Use MongoDB Atlas or local MongoDB)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hravinder?retryWrites=true&w=majority
DB_NAME=hravinder

# Authentication
JWT_SECRET=your_very_long_random_secret_key_at_least_32_characters_long
JWT_EXPIRE=1h
REFRESH_TOKEN_EXPIRE=7d
BCRYPT_ROUNDS=10

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@hravinder.com
SENDGRID_FROM_NAME=Hravinder Support

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=hravinder

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Production Setup (Render Dashboard)

1. Go to **Render Dashboard** → Your Backend Service
2. Click **Environment** tab
3. Add each variable with production values:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `MONGODB_URI`: Your MongoDB Atlas production URI
   - All other keys (SendGrid, Cloudinary, Razorpay)
4. Click **Save**
5. Render auto-deploys with new environment

---

## How to Generate Required Variables

### JWT_SECRET
```bash
# Generate a strong random secret (Linux/Mac)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use OpenSSL
openssl rand -hex 32
```

Copy the output and use as `JWT_SECRET`.

### MONGODB_URI

**Option 1: MongoDB Atlas (Recommended for Production)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Click **Connect** → **Connect Your Application**
4. Copy the connection string
5. Replace `<username>` and `<password>` with your DB credentials
6. Example: `mongodb+srv://hravinder:password123@cluster.mongodb.net/hravinder?retryWrites=true&w=majority`

**Option 2: Local MongoDB (Development Only)**
```
MONGODB_URI=mongodb://localhost:27017/hravinder
```

### SENDGRID_API_KEY
1. Create account at [SendGrid](https://sendgrid.com)
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Choose **Restricted Access** and enable Mail Send
5. Copy the key (save it securely!)

### CLOUDINARY Credentials
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy **Cloud Name** (CLOUDINARY_CLOUD_NAME)
3. Go to **Settings** → **API Keys**
4. Copy **API Key** and **API Secret**

### RAZORPAY Keys
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Copy **Key ID** (RAZORPAY_KEY_ID)
4. Copy **Key Secret** (RAZORPAY_KEY_SECRET)
5. **Switch to Test Mode** for development, **Live Mode** for production

---

## Validation

### Before Starting Server
```bash
# Check if .env exists
ls -la .env

# Start server (it will error if required vars are missing)
npm start
```

**Error Examples:**
```
Error: MONGODB_URI environment variable is not set
Error: JWT_SECRET must be at least 32 characters
Error: SENDGRID_API_KEY is missing
```

### Health Check After Deployment
```bash
# Test if backend is running
curl https://your-backend-url.onrender.com/health

# Should return 200 with status: "ok"
```

---

## Environment-Specific Configurations

### Development
- `NODE_ENV`: `development`
- Database: Local MongoDB or small Atlas cluster
- Email: Sandbox SendGrid (won't actually send)
- Payment: Razorpay Test Mode
- All services use test/demo accounts

### Production
- `NODE_ENV`: `production`
- Database: MongoDB Atlas production cluster
- Email: Live SendGrid (sends real emails)
- Payment: Razorpay Live Mode
- All services use production accounts
- Use strong secrets (randomized keys)

---

## Security Best Practices

⚠️ **CRITICAL:**
1. **Never commit `.env`** - It's in `.gitignore`
2. **Rotate JWT_SECRET regularly** - If compromised, regenerate and redeploy
3. **Use strong random secrets** - Min 32 random characters
4. **Keep API keys safe** - Don't share with teammates
5. **Use different keys per environment** - Never reuse dev keys in production
6. **Whitelist IP addresses** - On MongoDB Atlas, Cloudinary, etc.
7. **Monitor API usage** - Watch SendGrid, Razorpay, Cloudinary quotas

### Render Whitelist Setup
If your MongoDB Atlas is in a private network:
1. Go to **Render Dashboard** → Deployment → **Environment**
2. Note the **Render Static IP** (if on paid plan)
3. Add it to MongoDB Atlas whitelist:
   - Atlas → **Network Access** → **Add IP Address**
   - Enter Render's IP or use `0.0.0.0/0` (less secure but works)

---

## Common Issues & Solutions

### "MONGODB_URI is not set"
- ✅ Verify `.env` file exists in backend/
- ✅ Check the exact variable name: `MONGODB_URI`
- ✅ Connection string should start with `mongodb://` or `mongodb+srv://`

### "JWT_SECRET must be at least 32 characters"
- ✅ Generate new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- ✅ Update `.env` with new secret
- ✅ Restart server

### "Cannot connect to MongoDB"
- ✅ Check connection string is correct
- ✅ Verify username/password in URI
- ✅ For Atlas: Add your IP to whitelist
- ✅ For local: Ensure MongoDB server is running (`mongod`)

### "Emails not sending"
- ✅ Verify SendGrid API key is correct
- ✅ Check from email is verified in SendGrid
- ✅ Look at SendGrid logs for bounce/block reasons

### "Razorpay payments failing"
- ✅ Check you're in Test Mode for development
- ✅ Use Razorpay test payment details
- ✅ Verify Key ID and Secret are for correct environment

---

## Migration Guide (Dev to Production)

1. **Generate production secrets**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Get production service credentials**
   - MongoDB Atlas production cluster URI
   - SendGrid live API key
   - Cloudinary production keys
   - Razorpay live keys

3. **Add to Render dashboard**
   - Go to Environment tab
   - Add all variables with production values
   - Save (auto-deploys)

4. **Verify deployment**
   - Check Render logs: `npm start` succeeded
   - Test health endpoint: `/health`
   - Test login endpoint: `POST /api/auth/login`

5. **Monitor production**
   - Watch Render logs for errors
   - Monitor SendGrid delivery
   - Track Razorpay transactions

---

## Related Documentation

- See `client/ENV_CONFIG.md` for frontend environment variables
- See `SECURITY.md` for security best practices
- See `DEPLOYMENT.md` for deployment instructions
- See `API_DOCUMENTATION.md` for API endpoint details

---

**Last Updated**: April 3, 2026  
**Version**: 1.0
