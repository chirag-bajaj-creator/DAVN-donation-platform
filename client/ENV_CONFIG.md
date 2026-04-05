# Frontend Environment Variables Configuration

## Overview
Environment variables for the Hravinder frontend are managed through `.env.local` for development and configured directly in Vercel dashboard for production.

## Required Environment Variables

### API Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_API_BASE_URL` | URL | Yes | Backend API endpoint (e.g., `http://localhost:5000` for dev, production URL for prod) |
| `VITE_API_TIMEOUT` | Number | No | API request timeout in milliseconds (default: 30000) |

### Cloudinary Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_CLOUDINARY_CLOUD_NAME` | String | Yes | Your Cloudinary cloud name (found in Cloudinary dashboard) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | String | Yes | Unsigned upload preset name (create in Cloudinary Settings → Upload) |
| `VITE_CLOUDINARY_FOLDER` | String | No | Default folder for uploads (e.g., `hravinder`) |

### Payment Gateway Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_RAZORPAY_KEY` | String | Yes | Razorpay publishable key (NOT secret key) |

### Application Configuration
| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `VITE_APP_NAME` | String | No | Application name (default: `Hravinder`) |
| `VITE_APP_VERSION` | String | No | Application version |
| `VITE_ENV` | String | No | Environment (development/staging/production) |

---

## Development Setup (.env.local)

Create a `.env.local` file in the `client/` directory with these values:

```
VITE_API_BASE_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_RAZORPAY_KEY=your_razorpay_publishable_key
VITE_APP_NAME=Hravinder
VITE_APP_VERSION=1.0.0
VITE_ENV=development
```

---

## Production Setup (Vercel Dashboard)

1. Go to **Vercel Project Settings** → **Environment Variables**
2. Add each variable with the same name as above
3. Set different values for production:
   - `VITE_API_BASE_URL`: Your production backend URL
   - `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary upload preset
   - `VITE_RAZORPAY_KEY`: Your production Razorpay key
4. Deploy the application

---

## How to Obtain Each Variable

### VITE_API_BASE_URL
- **Development**: `http://localhost:5000` (when running backend locally)
- **Production**: Your Render backend URL (e.g., `https://hravinder-backend.onrender.com`)

### VITE_CLOUDINARY_CLOUD_NAME
1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your "Cloud Name" from the top of the dashboard
3. Use this value

### VITE_CLOUDINARY_UPLOAD_PRESET
1. Go to **Settings** → **Upload** in Cloudinary
2. Scroll to "Upload presets"
3. Create a new unsigned preset (or use existing)
4. Copy the preset name
5. **Important**: Keep it unsigned to avoid exposing API secret

### VITE_RAZORPAY_KEY
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Copy the **Key ID** (publishable key)
4. **Never use the Secret key in frontend code**

---

## Validation

Before running the application, verify all required variables are set:

```bash
# Check if .env.local exists
ls -la client/.env.local

# Run this to validate (optional - if validation script exists)
cd client
npm run validate-env
```

**Missing Variable? Error:**
If any required variable is missing, you'll see an error like:
```
Error: Missing environment variable: VITE_API_BASE_URL
```

---

## Common Issues & Solutions

### "Cannot find Cloudinary"
- ✅ Solution: Verify `VITE_CLOUDINARY_CLOUD_NAME` is set correctly
- ✅ Check your Cloudinary dashboard for the exact cloud name

### "Upload fails with 401"
- ✅ Solution: Verify upload preset exists and is unsigned
- ✅ Check preset name matches exactly

### "API calls fail to backend"
- ✅ Solution: Verify `VITE_API_BASE_URL` is correct
- ✅ Check backend is running on that URL
- ✅ Verify CORS is enabled on backend

### "Razorpay button doesn't appear"
- ✅ Solution: Verify `VITE_RAZORPAY_KEY` is set
- ✅ Check it's the **Key ID**, not Secret Key
- ✅ Verify it's for the correct Razorpay account

---

## Security Best Practices

⚠️ **IMPORTANT:**
1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Never expose API secrets** - Only use publishable keys in frontend
3. **Rotate keys periodically** - Especially if compromised
4. **Use different keys for dev/staging/prod** - Never reuse
5. **Keep .env.example updated** - But without actual values

---

## Migration from Development to Production

When moving to production:

1. **Get production values** from your service providers
   - Cloudinary: Same cloud name (already in production)
   - Razorpay: Switch to production account
   - Backend: Use your Render URL

2. **Add to Vercel dashboard** (not in git)
   - Never commit production `.env` files

3. **Redeploy** on Vercel
   - Vercel automatically uses the new environment variables

4. **Test thoroughly**
   - Login and create a test donation
   - Try uploading an image
   - Test payment flow (with test mode if available)

---

## Related Documentation

- See `backend/ENV_CONFIG.md` for backend environment variables
- See `SECURITY.md` for security guidelines
- See `DEPLOYMENT.md` for deployment instructions
- See `API_INTEGRATION.md` for API connection setup

---

**Last Updated**: April 3, 2026  
**Version**: 1.0
