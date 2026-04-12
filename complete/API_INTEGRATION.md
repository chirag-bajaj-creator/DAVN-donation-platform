# API Integration Guide - Frontend ↔ Backend

How the Hravinder frontend connects to and uses the backend API.

---

## Architecture Overview

```
React Components (UI)
        ↓
    Services Layer (API calls)
        ↓
    Axios HTTP Client
        ↓
    Express Backend (REST API)
        ↓
    MongoDB Database
```

---

## Service Layer Architecture

All API calls go through the **services layer** - never directly in components.

### Location
```
client/src/services/
├── api.js                 # Axios setup with base URL, headers, error handling
├── authService.js         # Authentication (login, register, refresh tokens)
├── donationService.js     # Donations (create, list, update)
├── paymentService.js      # QR payments (generate, confirm)
├── needyService.js        # Needy registration (individual, organization)
├── verificationService.js # Admin verification (pending, assign, approve)
├── uploadService.js       # File uploads (Cloudinary)
└── index.js              # Exports all services
```

### Example: authService.js
```javascript
import apiClient from './api';

const authService = {
  // Login with email/password
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    // Response: { accessToken, refreshToken, user_id, role }
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/api/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },
};

export default authService;
```

---

## How Components Use Services

### Example: LoginForm Component
```javascript
// src/components/Auth/LoginForm.jsx
import authService from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

export default function LoginForm() {
  const { login: loginToContext } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);

      // 1. Call service (not API directly)
      const response = await authService.login(email, password);

      // 2. Store tokens in context
      loginToContext(response.accessToken, response.refreshToken, response.user_id);

      // 3. Navigate to dashboard
      navigate('/dashboard');

      // 4. Show success message
      toast.success('Login successful!');
    } catch (error) {
      // 5. Show error message
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
}
```

### ✅ DO: Use Service Layer
```javascript
// Correct approach
const response = await donationService.create(donationData);
```

### ❌ DON'T: Direct API Calls
```javascript
// WRONG - Never do this!
const response = await fetch('/api/donations', {
  method: 'POST',
  body: JSON.stringify(donationData),
});
```

---

## API Client Setup (api.js)

```javascript
// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - refresh and retry
      const refreshToken = localStorage.getItem('refreshToken');
      const newToken = await authService.refreshToken(refreshToken);
      localStorage.setItem('accessToken', newToken.accessToken);

      // Retry original request
      error.config.headers.Authorization = `Bearer ${newToken.accessToken}`;
      return apiClient(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Key Features:**
- Base URL from `.env.local` (VITE_API_BASE_URL)
- Automatically adds JWT token to all requests
- Handles token refresh when expired
- Global error handling
- 30-second timeout

---

## Authentication Flow

### 1. User Registers
```
RegisterForm
  → authService.register()
    → POST /api/auth/register
      → Backend validates & creates user
      → Returns { accessToken, refreshToken, user_id }
  → AuthContext stores tokens
  → Navigate to dashboard
```

### 2. User Logs In
```
LoginForm
  → authService.login(email, password)
    → POST /api/auth/login
      → Backend validates credentials
      → Returns { accessToken, refreshToken, user_id, role }
  → AuthContext stores tokens & role
  → localStorage saves tokens
  → Navigation updated based on role
```

### 3. Token Management
```
Protected Route
  → Checks localStorage for accessToken
  → If missing or expired, redirects to /login
  → If valid, allows access
  
Token Expiry (1 hour)
  → API returns 401
  → Axios interceptor triggers
  → refreshToken used to get new accessToken
  → Request automatically retried
  → User doesn't notice
```

### 4. User Logs Out
```
LogoutButton
  → authService.logout() (optional - API call)
  → AuthContext.logout() (required - clears state)
    → localStorage.removeItem('accessToken')
    → localStorage.removeItem('refreshToken')
    → Redirect to /login
```

---

## Common API Patterns

### Pattern 1: Fetch List with Pagination
```javascript
// Component
const [donations, setDonations] = useState([]);
const [page, setPage] = useState(1);

useEffect(() => {
  const fetchDonations = async () => {
    try {
      const response = await donationService.list({
        limit: 10,
        skip: (page - 1) * 10,
      });
      setDonations(response.donations);
    } catch (error) {
      setError(error.message);
    }
  };
  fetchDonations();
}, [page]);

// Service
const donationService = {
  list: async (params) => {
    const response = await apiClient.get('/api/donations', { params });
    return response.data;
  },
};

// API Response
{
  "donations": [
    { "id": "123", "amount": 1000, "type": "cash" },
    { "id": "124", "amount": 500, "type": "food" }
  ],
  "total": 42,
  "page": 1,
  "pages": 5
}
```

### Pattern 2: Create with File Upload
```javascript
// Component
const handleSubmit = async (formData, file) => {
  try {
    // 1. Upload image
    const uploadResponse = await uploadService.uploadToCloudinary(file);
    
    // 2. Create donation with image URL
    const donationData = {
      ...formData,
      imageUrl: uploadResponse.url,
    };
    
    // 3. Call API
    const response = await donationService.create(donationData);
    
    // 4. Update UI
    toast.success('Donation created!');
  } catch (error) {
    toast.error('Failed: ' + error.message);
  }
};

// Service
const donationService = {
  create: async (data) => {
    const response = await apiClient.post('/api/donations', data);
    return response.data;
  },
};

// API Response
{
  "id": "donation_123",
  "status": "submitted",
  "amount": 1000,
  "imageUrl": "https://res.cloudinary.com/..."
}
```

### Pattern 3: Update with Optimistic UI
```javascript
// Component
const handleApprove = async (donationId) => {
  // Optimistic update (update UI immediately)
  setDonation({ ...donation, status: 'approved' });

  try {
    // Then make API call
    await donationService.update(donationId, { status: 'approved' });
    toast.success('Approved!');
  } catch (error) {
    // Revert on error
    setDonation(originalDonation);
    toast.error('Failed to approve');
  }
};

// Service
const donationService = {
  update: async (id, data) => {
    const response = await apiClient.patch(`/api/donations/${id}`, data);
    return response.data;
  },
};
```

---

## Error Handling

### Frontend Error Handling
```javascript
try {
  const response = await donationService.create(data);
  // Success
} catch (error) {
  // error.response.status: 400, 401, 403, 404, 500, etc.
  // error.response.data.message: Error message from backend

  if (error.response?.status === 401) {
    // Unauthorized - redirect to login
    navigate('/login');
  } else if (error.response?.status === 422) {
    // Validation error - show field errors
    toast.error(error.response.data.errors[0].message);
  } else if (error.response?.status === 404) {
    // Not found
    toast.error('Resource not found');
  } else {
    // Generic error
    toast.error(error.message || 'Something went wrong');
  }
}
```

### Backend Error Response
```json
{
  "status": 422,
  "message": "Email already registered",
  "errors": [
    {
      "field": "email",
      "message": "Email is already in use"
    }
  ]
}
```

---

## State Management with Context

### AuthContext Usage
```javascript
// Login and store in context
const { login } = useAuth();
await login(accessToken, refreshToken, userId);

// Access in any component
const { user, isAuthenticated, logout } = useAuth();

// Protected route checking
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

### DonationContext Usage
```javascript
// Set current donation
const { setCurrentDonation } = useDonation();
setCurrentDonation(donationData);

// Get donation list
const { donationList } = useDonation();
```

### NeedyContext Usage (Similar Pattern)
```javascript
// Set needy case
const { setCurrentNeedy } = useNeedy();
setCurrentNeedy(needyData);

// Get needy list
const { needyList } = useNeedy();
```

---

## Request/Response Examples

### POST /api/auth/register
```bash
# Request
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "John@123456",
    "name": "John Doe",
    "phone": "9876543210"
  }'

# Response (201 Created)
{
  "user_id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "role": "donor",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

### POST /api/donations
```bash
# Request (with Authorization header)
curl -X POST http://localhost:5000/api/donations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "type": "cash",
    "amount": 1000,
    "description": "For education"
  }'

# Response (201 Created)
{
  "id": "donation_789",
  "user_id": "507f1f77bcf86cd799439011",
  "type": "cash",
  "amount": 1000,
  "status": "submitted",
  "createdAt": "2026-04-03T10:30:00Z"
}
```

### GET /api/donations
```bash
# Request
curl -X GET "http://localhost:5000/api/donations?limit=10&skip=0" \
  -H "Authorization: Bearer eyJhbGc..."

# Response (200 OK)
{
  "success": true,
  "donations": [
    {
      "id": "donation_789",
      "type": "cash",
      "amount": 1000,
      "status": "submitted"
    },
    ...
  ],
  "total": 42,
  "page": 1,
  "pages": 5
}
```

---

## Troubleshooting API Issues

### "Cannot POST /api/donations" (404)
```
Cause: API endpoint doesn't exist or base URL is wrong
Fix: Check VITE_API_BASE_URL in .env.local
    Check backend route exists: backend/routes/donations.js
```

### "Unauthorized" (401)
```
Cause: Token expired or missing
Fix: Check token is in localStorage
    Check Authorization header is set: Authorization: Bearer <token>
    Check token refresh logic is working
```

### "Invalid input" (422)
```
Cause: Frontend sent data that failed backend validation
Fix: Check validation rules in backend schemas/
    Validate form inputs before submission
    Check data types match API expectations
```

### "CORS error" (No 'Access-Control-Allow-Origin')
```
Cause: Backend CORS not configured for frontend URL
Fix: Check backend env: FRONTEND_URL should match
    Check cors() middleware in backend/server.js
    Verify frontend URL has no trailing slash
```

### "Network timeout"
```
Cause: Backend is slow or down
Fix: Check backend is running
    Check database is accessible
    Check network connectivity
    Increase timeout if needed (default 30s)
```

---

## Best Practices

### ✅ DO:
1. Use services for all API calls
2. Show loading state during requests
3. Display user-friendly error messages
4. Validate inputs before submission
5. Handle 401 responses (expired tokens)
6. Use `try-catch` for error handling
7. Store tokens in localStorage
8. Set Authorization header on protected endpoints

### ❌ DON'T:
1. Make direct API calls in components
2. Leave requests without loading state
3. Show technical error messages
4. Skip form validation
5. Commit `.env` files with secrets
6. Hardcode API URLs
7. Store passwords in state
8. Retry indefinitely on failure

---

## Related Documentation

- `README.md` - Project overview
- `DEPLOYMENT.md` - Production setup
- `backend/API_DOCUMENTATION.md` - All 19 endpoints detailed
- `SECURITY.md` - Security practices
- `client/ENV_CONFIG.md` - Frontend environment setup

---

**Last Updated**: April 3, 2026  
**Version**: 1.0
