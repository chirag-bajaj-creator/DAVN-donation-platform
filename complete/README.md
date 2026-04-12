# Hravinder - Donation Platform

## 🎯 Overview

**Hravinder** is a comprehensive donation platform built with **React 18 + Node.js + MongoDB** that connects compassionate donors with individuals and organizations in need. The platform provides a secure, transparent, and user-friendly way to make monetary and in-kind donations while ensuring verified recipients.

### Mission
Simplify the donation process and build trust between donors and recipients through verification, transparency, and community support.

---

## ✨ Key Features

### For Donors
- 📱 **Easy Registration & Login** - Email/password authentication with password recovery
- 💳 **5 Types of Donations** - Cash, Food, Shelter, Medical, Basic Needs
- 💰 **QR Code Payments** - UPI-based donations with payment tracking
- 📊 **Donation History** - Track all donations and impact
- 👤 **User Dashboard** - Overview of giving history and verified recipients

### For Those in Need
- 📝 **Simple Registration** - Individual or organization registration
- ✅ **Verification Process** - Admin-verified listings for trust
- 🔍 **Discovery** - Donors can find verified cases by type and urgency
- 🏷️ **Multiple Categories** - Food, shelter, medical, education, emergency needs
- 📈 **Impact Tracking** - See donations received and their use

### For Admins
- 🔍 **Verification Dashboard** - Review and approve needy cases
- 👤 **User Management** - Manage donors, recipients, volunteers
- 📋 **Reporting** - Analytics on donations, recipients, impact
- 🛡️ **Compliance** - Audit trails and security

---

## 🛠️ Tech Stack

### Frontend
```
- React 18 + Vite (fast builds)
- Tailwind CSS (responsive design)
- React Router v6 (routing)
- React Hook Form (form handling)
- Axios (HTTP client)
- React Toastify (notifications)
- date-fns (date formatting)
```

### Backend
```
- Node.js + Express
- MongoDB + Mongoose (database)
- JWT (authentication)
- Bcryptjs (password hashing)
- Joi (input validation)
- Helmet (security headers)
```

### Services & Integrations
```
- Cloudinary (image uploads)
- SendGrid (email service)
- Razorpay (payment processing)
- MongoDB Atlas (cloud database)
```

### Deployment
```
- Frontend: Vercel (auto-deploy on git push)
- Backend: Render (Node.js hosting)
- Database: MongoDB Atlas (cloud database)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (for database)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

### Local Development Setup

#### 1. Clone the Repository
```bash
cd /path/to/Hravinder_Agent
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file with your credentials
cp .env.example .env

# Edit .env with your values:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# - SENDGRID_API_KEY, CLOUDINARY_* etc.

# Start backend server
npm start
# Server runs at http://localhost:5000
```

#### 3. Setup Frontend
```bash
cd client
npm install

# Create .env.local with your credentials
cp .env.example .env.local

# Edit .env.local with your values:
# - VITE_API_BASE_URL=http://localhost:5000
# - VITE_CLOUDINARY_CLOUD_NAME, etc.

# Start development server
npm run dev
# App runs at http://localhost:5173
```

#### 4. Test the Application
```bash
# Backend health check
curl http://localhost:5000/health

# Frontend
Open http://localhost:5173 in browser
```

---

## 📁 Project Structure

```
Hravinder_Agent/
├── backend/                      # Node.js Express API
│   ├── controllers/              # Request handlers
│   ├── models/                   # MongoDB schemas
│   ├── routes/                   # API endpoints
│   ├── middleware/               # Auth, validation, errors
│   ├── services/                 # Business logic
│   ├── schemas/                  # Joi validation
│   ├── config/                   # Database, environment
│   ├── server.js                 # Server entry point
│   └── API_DOCUMENTATION.md      # All 19 endpoints documented
│
├── client/                       # React Vite frontend
│   ├── src/
│   │   ├── pages/                # Page components (Auth, Dashboard, etc.)
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # API service layer
│   │   ├── context/              # React Context (Auth, Donation)
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # Helpers and validation
│   │   ├── styles/               # CSS files
│   │   ├── App.jsx               # Main app with routing
│   │   └── main.jsx              # React entry point
│   ├── index.html                # HTML template
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── package.json              # Dependencies
│
├── .claude/
│   ├── agents/                   # Agent profiles (frontend-developer, etc.)
│   └── rules/                    # Coding rules (frontend.md, etc.)
│
├── SECURITY.md                   # Security best practices
├── ENV_CONFIG.md                 # Environment variables guide
├── DEPLOYMENT.md                 # Deployment instructions
├── CONTRIBUTING.md               # Development guidelines
├── TROUBLESHOOTING.md            # Common issues & fixes
├── CHANGELOG.md                  # Feature changelog
└── API_INTEGRATION.md            # Frontend-backend integration
```

---

## 📚 API Overview

The backend provides **19 REST API endpoints** organized into 5 categories:

### Authentication (6 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - Logout (client-side)
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token
- `POST /api/auth/refresh-token` - Get new access token

### Donations (4 endpoints)
- `POST /api/donations` - Create donation
- `GET /api/donations` - List user's donations
- `GET /api/donations/:id` - Get donation details
- `PATCH /api/donations/:id` - Update donation (admin only)

### Payments (3 endpoints)
- `POST /api/qr-payments` - Generate QR code for payment
- `GET /api/qr-payments/:id` - Get payment status
- `PATCH /api/qr-payments/:id` - Confirm payment

### Needy Registration (5 endpoints)
- `POST /api/needy/individuals` - Register as individual
- `POST /api/needy/organizations` - Register as organization
- `GET /api/needy/verified` - List verified recipients
- `GET /api/needy/individuals/:id` - Get individual details
- `GET /api/needy/organizations/:id` - Get organization details

### Verification (4 endpoints)
- `GET /api/verification/pending` - List pending verifications (admin)
- `POST /api/verification/assign` - Assign to volunteer (admin)
- `POST /api/verification/reports` - Submit verification report
- `PATCH /api/verification/:id` - Approve/reject (admin)

**Full API documentation**: See `backend/API_DOCUMENTATION.md`

---

## 🔐 Authentication Flow

### User Registration & Login
1. User registers with email, password, name, phone
2. Password hashed with bcryptjs (10 salt rounds)
3. On login, backend returns JWT access token (1 hour) + refresh token (7 days)
4. Frontend stores tokens and includes in API requests
5. Protected routes redirect to login if no token

### Password Reset
1. User requests reset with email
2. Backend sends reset link (with 24-hour token) to email
3. User clicks link and enters new password
4. Backend verifies token and updates password
5. User can login with new password

### Token Refresh
1. When access token expires (1 hour), frontend uses refresh token
2. Call `POST /api/auth/refresh-token` with refresh token
3. Backend returns new access token
4. Continue using API

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# 1. Connect GitHub repo to Vercel
# 2. Vercel automatically detects React project
# 3. Set environment variables in Vercel dashboard:
#    - VITE_API_BASE_URL=your-backend-url
#    - VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
#    - etc.
# 4. Push to main branch → Auto-deploys
```

### Backend (Render)
```bash
# 1. Create new Web Service on Render
# 2. Connect your GitHub repo
# 3. Configure:
#    - Build Command: npm install
#    - Start Command: node server.js
# 4. Add environment variables
# 5. Deploy → Runs at https://your-app.onrender.com
```

**Full deployment guide**: See `DEPLOYMENT.md`

---

## 📖 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[SECURITY.md](./SECURITY.md)** - Security best practices and incident response
- **[ENV_CONFIG.md](./client/ENV_CONFIG.md)** - Frontend environment variables
- **[ENV_CONFIG.md](./backend/ENV_CONFIG.md)** - Backend environment variables
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Development guidelines
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[CHANGELOG.md](./CHANGELOG.md)** - Feature changelog
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Frontend-backend integration
- **[backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - All 19 API endpoints

---

## 🧪 Testing

### Frontend Testing
```bash
cd client

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Testing
```bash
cd backend

# Run development server
npm start

# API testing tools:
# - Postman: Import requests from API_DOCUMENTATION.md
# - cURL: Examples in API_DOCUMENTATION.md
# - Thunder Client: VS Code extension
```

### End-to-End Testing
1. Register as a donor
2. Create a donation
3. View donation history
4. Register as needy individual
5. View in verified listings
6. Admin approves registration
7. Donor sees and donates to case

---

## 🤝 Contributing

We follow strict coding standards for quality and maintainability.

### Frontend Conventions
- **No inline styles** - Use Tailwind CSS
- **Services layer** - All API calls in `src/services/`
- **Component size** - Keep components under 150 lines
- **Form validation** - Validate before submission
- **Loading states** - Always show during API calls
- **Error handling** - Display user-friendly messages
- **useEffect cleanup** - Return cleanup function

### Backend Conventions
- **Input validation** - Use Joi schemas
- **Error handling** - Standardized responses
- **Database indexes** - On filter fields
- **Rate limiting** - Prevent brute force
- **Soft deletes** - Use `isActive` flag
- **Audit trails** - Log important actions

**Full guidelines**: See `CONTRIBUTING.md`

---

## 🐛 Troubleshooting

Common issues and solutions:

### Frontend Issues
- **API calls fail** → Check backend URL in `.env.local`
- **Cloudinary upload fails** → Verify cloud name and upload preset
- **Styles not working** → Check Tailwind CSS is installed
- **Routes not working** → Verify routing in `App.jsx`

### Backend Issues
- **MongoDB connection fails** → Check connection string and whitelist IP
- **JWT errors** → Verify JWT_SECRET is set correctly
- **Email not sending** → Check SendGrid credentials
- **CORS errors** → Verify FRONTEND_URL matches your frontend

**Full troubleshooting guide**: See `TROUBLESHOOTING.md`

---

## 📊 Architecture

### Three-Tier Architecture
```
Frontend (React)           →  Backend (Express)        →  Database (MongoDB)
├─ User Interface              ├─ API Routes              ├─ User data
├─ Form Validation             ├─ Controllers             ├─ Donations
├─ State Management            ├─ Business Logic          ├─ Payments
├─ API Calls (Services)        ├─ Input Validation        ├─ Needy cases
└─ Routing                      ├─ Authentication          └─ Verifications
                                └─ Error Handling
```

### Data Flow
1. **User interacts** with React component
2. **Component validates** input locally
3. **Calls API service** with data
4. **Service sends HTTP** request to backend
5. **Backend validates** input with Joi
6. **Controller processes** request
7. **Models interact** with MongoDB
8. **Response returned** to frontend
9. **Component updates** UI with results
10. **User sees** success/error message

---

## 📝 Feature Checklist

### Phase 1: Setup ✅
- [x] React Vite project structure
- [x] Tailwind CSS configuration
- [x] All dependencies installed

### Phase 2: Core Pages ✅
- [x] Authentication (Login, Register, Password Reset)
- [x] Dashboard (3-tab overview)

### Phase 3: Donations ✅
- [x] Donation selection page
- [x] 5 donation forms (Cash, Food, Shelter, Medical, Basic Needs)
- [x] QR code payment page

### Phase 4: Needy & Verification ✅
- [x] Needy registration (Individual & Organization)
- [x] Verified listings
- [x] Admin verification workflow

### Phase 5: Features ✅
- [x] Protected routing
- [x] Image uploads (Cloudinary)
- [x] Form validation
- [x] Error handling
- [x] Loading states
- [x] Responsive design

### Phase 6: Deployment 🔄
- [x] Environment configuration
- [x] Deployment files (Vercel, Render)
- [x] Security documentation
- [ ] Deploy to production
- [ ] Post-deployment testing

---

## 🎓 Learning Resources

### Frontend
- [React 18 Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router v6](https://reactrouter.com)

### Backend
- [Express.js](https://expressjs.com)
- [MongoDB](https://docs.mongodb.com)
- [Mongoose](https://mongoosejs.com)
- [JWT Guide](https://jwt.io)

### Integrations
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [SendGrid API](https://sendgrid.com/docs)
- [Razorpay Integration](https://razorpay.com/docs)

---

## 📞 Support & Issues

### Report a Bug
1. Check `TROUBLESHOOTING.md` for common issues
2. Check GitHub Issues for similar reports
3. Create new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Ask a Question
1. Check documentation first
2. Check existing issues/discussions
3. Create a discussion post with details

---

## 📜 License

This project is built as part of the Hravinder initiative. 

---

## 🙏 Acknowledgments

Built with modern web technologies to help bridge the gap between donors and those in need.

---

**Last Updated**: April 3, 2026  
**Version**: 1.0.0  
**Status**: Production Ready

For detailed setup and deployment instructions, see the documentation files listed above.
