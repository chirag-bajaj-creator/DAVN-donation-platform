# Deployment Guide - Hravinder Donation Platform

## Overview

This guide covers deploying Hravinder to production using **Vercel** (frontend) and **Render** (backend).

---

## Part 1: Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository with code pushed
- Vercel account (free at vercel.com)
- Environment variables ready

### Step-by-Step Setup

#### 1. Create Vercel Project
```
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select "Hravinder_Agent" repo
5. Framework: React (auto-detected)
6. Root Directory: client/
7. Click Deploy
```

#### 2. Configure Environment Variables
```
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add the following:

VITE_API_BASE_URL=https://your-backend-url.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_RAZORPAY_KEY=your_razorpay_key
VITE_APP_NAME=Hravinder
VITE_APP_VERSION=1.0.0

3. Save changes
4. Redeploy
```

#### 3. Configure Build Settings
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

#### 4. Domain Setup (Optional)
```
1. Go to Settings → Domains
2. Add your custom domain (e.g., hravinder.com)
3. Follow DNS configuration steps
4. SSL automatically configured by Vercel
```

#### 5. Test Deployment
```
1. Vercel provides URL: https://your-project.vercel.app
2. Visit the URL in browser
3. Test: Login, Create donation, Upload image
4. Check: Network requests go to backend
```

### Troubleshooting

**Build Fails:**
```
- Check Node version (18+)
- Run: npm install in client/
- Check: .env.example matches VITE_ vars
```

**API Calls Fail:**
```
- Verify VITE_API_BASE_URL in Vercel dashboard
- Check backend is running
- Verify CORS enabled on backend
- Check network tab in DevTools
```

**Images Not Uploading:**
```
- Verify VITE_CLOUDINARY_CLOUD_NAME
- Check upload preset exists in Cloudinary
- Verify it's unsigned (no API secret)
```

---

## Part 2: Backend Deployment (Render)

### Prerequisites
- GitHub repository with code pushed
- Render account (free at render.com)
- MongoDB Atlas cluster created
- Environment variables ready

### Step-by-Step Setup

#### 1. Create MongoDB Atlas Database
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/login
3. Create new project (e.g., "Hravinder")
4. Create cluster:
   - Provider: AWS
   - Region: ap-south-1 (India)
   - Plan: Free tier
5. Create database user
6. Copy connection string:
   mongodb+srv://username:password@cluster.mongodb.net/hravinder
7. Add current IP to whitelist + Render IP (later)
```

#### 2. Create Render Web Service
```
1. Go to https://render.com
2. Click "New +" → Web Service
3. Connect GitHub repository
4. Select "Hravinder_Agent" repo
5. Configure:
   - Name: hravinder-backend
   - Region: Singapore or closest
   - Branch: main
   - Root Directory: backend/
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
6. Click Create Web Service
```

#### 3. Configure Environment Variables
```
In Render Dashboard → Environment:
1. Add the following:

NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.vercel.app

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hravinder
DB_NAME=hravinder

JWT_SECRET=[Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_EXPIRE=1h
REFRESH_TOKEN_EXPIRE=7d
BCRYPT_ROUNDS=10

SENDGRID_API_KEY=[Get from SendGrid dashboard]
SENDGRID_FROM_EMAIL=noreply@hravinder.com
SENDGRID_FROM_NAME=Hravinder Support

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=hravinder

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

2. Click "Save"
3. Render auto-deploys with new vars
```

#### 4. MongoDB Whitelist
```
1. In MongoDB Atlas dashboard
2. Network Access → Add IP Address
3. Add Render's IP:
   - Go to Render dashboard, get Static IP
   - Or use 0.0.0.0/0 (less secure but works)
4. Click Confirm
```

#### 5. Test Deployment
```
1. Render provides URL: https://your-backend-url.onrender.com
2. Test health endpoint:
   curl https://your-backend-url.onrender.com/health
   Should return: {"status":"ok"}
3. Test login endpoint:
   curl -X POST https://your-backend-url.onrender.com/api/auth/login
   Should return proper error (not 500)
```

### Troubleshooting

**Build Fails:**
```
- Check Node version (18+)
- Run: npm install in backend/
- Check: package.json has start script
- Look at Render logs for errors
```

**MongoDB Connection Fails:**
```
- Verify MONGODB_URI format
- Check username/password in URI
- Verify MongoDB Atlas whitelist (add Render IP)
- Test locally first: npm start
```

**API Endpoints Return 500:**
```
- Check Render logs
- Verify all environment variables set
- Test endpoint locally first
- Check database is accessible
```

**CORS Errors on Frontend:**
```
- Verify FRONTEND_URL in Render env
- Add to backend CORS whitelist
- Check Content-Type headers
- Test with curl first
```

---

## Part 3: Post-Deployment Verification

### Frontend Tests
```
1. Load homepage: https://your-frontend.vercel.app
2. Register new user account
3. Login with credentials
4. Navigate to donation page
5. Submit donation form
6. Check donation appears in history
7. Test logout and redirect to login
```

### Backend Tests
```
1. Health check:
   curl https://your-backend.onrender.com/health
   
2. Register user:
   curl -X POST https://your-backend.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!","name":"Test User","phone":"9876543210"}'
   
3. Login:
   curl -X POST https://your-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   
4. Create donation (with token):
   curl -X POST https://your-backend.onrender.com/api/donations \
     -H "Authorization: Bearer [access_token]" \
     -H "Content-Type: application/json" \
     -d '{"type":"cash","amount":1000}'
```

### Email Tests
```
1. Register with test email
2. Check inbox for verification email
3. Test password reset:
   - Click "Forgot Password"
   - Enter email
   - Check inbox for reset link
   - Click link and set new password
```

### Payment Tests
```
1. Create cash donation
2. Generate QR code
3. Verify QR code displays
4. Verify QR code is valid (test with UPI app)
5. Confirm payment (backend updates status)
```

---

## Part 4: Monitoring & Maintenance

### Vercel Monitoring
```
1. Dashboard → Deployments
2. View recent deployments
3. Check Analytics:
   - Page views
   - Edge function calls
   - Error rates

4. Set up error monitoring:
   - Integrations → Sentry
   - Errors auto-tracked
```

### Render Monitoring
```
1. Dashboard → Logs
2. View real-time logs
3. Check metrics:
   - CPU usage
   - Memory usage
   - Build times

4. Set up notifications:
   - Email on deployment failure
   - Alert on high error rate
```

### MongoDB Monitoring
```
1. Atlas → Monitoring
2. View:
   - Query performance
   - Connection count
   - Disk usage

3. Set up alerts:
   - Disk usage > 80%
   - Connection errors
   - Long-running queries
```

---

## Part 5: Rollback Procedure

### If Frontend Deployment Fails
```
1. Vercel Dashboard → Deployments
2. Find last successful deployment
3. Click "Redeploy" button
4. Verify site works
```

### If Backend Deployment Fails
```
1. Render Dashboard → Logs
2. Find error in logs
3. Fix in code and push to GitHub
4. Render auto-redeploys
5. Or click "Manual Deploy" → "Deploy Latest"
```

### If Database Issue
```
1. MongoDB Atlas → Backups
2. Find automatic backup
3. Restore to point-in-time
4. Verify data integrity
5. Test frontend/backend
```

---

## Part 6: Scaling & Optimization

### When Frontend Gets Slow
```
1. Check Vercel Analytics
2. Identify slow pages
3. Optimize:
   - Code split components
   - Lazy load images
   - Cache static assets
   - Use Vercel CDN (auto)
```

### When Backend Gets Slow
```
1. Check Render metrics
2. Monitor database queries
3. Optimize:
   - Add MongoDB indexes
   - Reduce N+1 queries
   - Implement caching
   - Scale to paid plan if needed
```

### When Database Gets Large
```
1. Monitor MongoDB disk usage
2. Archive old records:
   - Donations > 1 year
   - Soft-deleted records
3. Upgrade MongoDB tier if needed
4. Monitor growth rate
```

---

## Part 7: Security Checklist

### Before Production
- [ ] All environment variables set (not in code)
- [ ] HTTPS/SSL enabled (automatic on Vercel/Render)
- [ ] CORS configured for your frontend URL
- [ ] Rate limiting enabled
- [ ] Password hashing working (bcryptjs)
- [ ] JWT secrets strong (32+ random chars)
- [ ] Database backups enabled
- [ ] Error monitoring configured (Sentry)
- [ ] HTTPS enforced (redirect http → https)
- [ ] Security headers set (Helmet.js)

### Ongoing
- [ ] Monitor error logs daily
- [ ] Update dependencies monthly
- [ ] Rotate API keys quarterly
- [ ] Review access logs for anomalies
- [ ] Test disaster recovery quarterly
- [ ] Keep security.md up to date

---

## Useful Links

### Frontend (Vercel)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

### Backend (Render)
- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Render Environment Variables](https://render.com/docs/environment-variables)

### Database (MongoDB)
- [MongoDB Atlas Dashboard](https://cloud.mongodb.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security/)

### Services
- [Cloudinary Dashboard](https://cloudinary.com/console)
- [SendGrid Dashboard](https://app.sendgrid.com)
- [Razorpay Dashboard](https://dashboard.razorpay.com)

---

## Support

For deployment issues:
1. Check `TROUBLESHOOTING.md`
2. Check service provider documentation
3. Review error logs in Vercel/Render
4. Test locally first before deploying

---

**Last Updated**: April 3, 2026  
**Version**: 1.0
