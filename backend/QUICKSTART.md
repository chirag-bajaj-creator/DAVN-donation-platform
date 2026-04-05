# Quick Start Guide - Hravinder Backend

## 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd backend
npm install
```

### Step 2: Configure Environment (2 min)
```bash
cp .env.example .env
```

Edit `.env` and add your values:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hravinder
JWT_SECRET=your-secret-key-minimum-32-chars
```

### Step 3: Start Server (1 min)
```bash
npm run dev
```

You should see:
```
✓ Connected to MongoDB
✓ Server running on port 5000
✓ Environment: development
```

### Step 4: Test API (1 min)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User",
    "phone": "9876543210"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user_id": "...",
    "email": "test@example.com",
    "name": "Test User"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

## API Endpoints Overview

### Auth (6)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/refresh-token` - Get new token

### Donations (4)
- `POST /api/donations` - Submit donation
- `GET /api/donations` - List donations
- `GET /api/donations/:id` - Get donation
- `PATCH /api/donations/:id` - Update status (admin)

### Payments (3)
- `POST /api/qr-payments` - Generate QR
- `GET /api/qr-payments/:id` - Check status
- `PATCH /api/qr-payments/:id` - Update status

### Needy (5)
- `POST /api/needy/individuals` - Register individual
- `POST /api/needy/organizations` - Register org
- `GET /api/needy/verified` - Get verified cases
- `GET /api/needy/individuals/:id` - Get individual
- `GET /api/needy/organizations/:id` - Get org

### Verification (4)
- `GET /api/verification/pending` - List pending (admin)
- `POST /api/verification/assign` - Assign volunteer (admin)
- `POST /api/verification/reports` - Submit report
- `PATCH /api/verification/:id` - Approve/reject (admin)

---

## Common Tasks

### Register & Login
```bash
# 1. Register
REGISTER=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "name": "John Doe",
    "phone": "9876543210"
  }')

# Extract token from response
TOKEN=$(echo $REGISTER | jq -r '.tokens.accessToken')
echo "Token: $TOKEN"

# 2. Use token for other requests
curl -X GET http://localhost:5000/api/donations \
  -H "Authorization: Bearer $TOKEN"
```

### Submit a Donation
```bash
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "cash",
    "amount": 1000,
    "details": {
      "currency": "INR",
      "description": "Help for food"
    }
  }'
```

### Register as Needy Individual
```bash
curl -X POST http://localhost:5000/api/needy/individuals \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ram Kumar",
    "phone": "9876543211",
    "address": {
      "city": "Mumbai",
      "state": "Maharashtra"
    },
    "type_of_need": "food",
    "urgency": "high",
    "description": "Need food assistance for family of 4. Currently unemployed and struggling..."
  }'
```

### Get Verified Needy Cases
```bash
curl -X GET "http://localhost:5000/api/needy/verified?type_of_need=food&urgency=high&city=mumbai&limit=20"
```

---

## Files Overview

| File | Purpose |
|------|---------|
| `/models/*` | Database schemas (6 files) |
| `/controllers/*` | Business logic (5 files) |
| `/routes/*` | API endpoints (5 files) |
| `/middleware/*` | Auth, validation, errors (4 files) |
| `/services/*` | Email, QR, upload, payment (4 files) |
| `/schemas/*` | Input validation (4 files) |
| `/config/*` | Database, env vars (2 files) |
| `server.js` | Express app entry point |
| `package.json` | Dependencies |
| `.env.example` | Environment template |

---

## Troubleshooting

### Error: Cannot find module 'mongoose'
```bash
npm install
```

### Error: MongoDB connection failed
- Check MONGODB_URI in .env
- Verify credentials
- Allow your IP in MongoDB Atlas

### Error: Port 5000 already in use
```bash
# Use different port
PORT=5001 npm run dev
```

### Error: Validation failed
- Check request format
- Email must be valid format
- Phone must be 10 digits
- Passwords minimum 8 characters

### Error: 401 Unauthorized
- Check if Authorization header included
- Verify token format: `Bearer <token>`
- Token may have expired

---

## Features Implemented

### Authentication ✓
- Register, login, logout
- Password reset via email
- JWT tokens (access + refresh)
- Admin role support

### Donations ✓
- 5 types: cash, food, shelter, medical, basic_needs
- Submit, list, view, update status
- Email confirmation
- Pagination support

### Payments ✓
- UPI QR code generation
- 24-hour expiry
- Status tracking
- Webhook support

### Needy System ✓
- Individual + organization registration
- Verification workflow
- Verified listing with filters
- Trust/credibility scoring

### Verification ✓
- Pending registration management
- Volunteer assignment
- Report submission
- Approval/rejection workflow

### Security ✓
- JWT authentication
- Role-based authorization
- Input validation (Joi)
- Rate limiting
- CORS protection
- Helmet headers

---

## Production Deployment

### Before Deploying
- [ ] Update all .env values for production
- [ ] Set NODE_ENV=production
- [ ] Use strong JWT_SECRET
- [ ] Configure MongoDB Atlas
- [ ] Setup SendGrid email
- [ ] Configure Cloudinary
- [ ] Setup payment gateway (Razorpay)

### Deploy to Render
1. Push code to GitHub
2. Create new Render service
3. Set environment variables
4. Deploy!

```bash
# Local production test
NODE_ENV=production npm start
```

---

## Next Steps

1. **Setup Database**: Configure MongoDB Atlas cluster
2. **Email Service**: Add SendGrid API key
3. **File Upload**: Configure Cloudinary account
4. **Payments**: Setup Razorpay merchant account
5. **Frontend**: Connect to backend at `http://localhost:5000`
6. **Testing**: Use Postman to test endpoints
7. **Deployment**: Deploy to production server

---

## Support

For detailed documentation, see:
- `API_DOCUMENTATION.md` - Complete API reference
- `IMPLEMENTATION_SUMMARY.md` - Technical details
- `README.md` - Project overview

---

**Ready to build? Start with `npm run dev` now!**
