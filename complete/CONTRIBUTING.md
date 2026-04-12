# Contributing Guide - Hravinder Donation Platform

## Welcome!

Thank you for contributing to Hravinder. This guide helps you understand our development process, coding standards, and workflows.

---

## Code of Conduct

- **Be respectful** of all contributors
- **Be helpful** and constructive in feedback
- **Report issues privately** if they're security-related
- **Follow the guidelines** in this document

---

## Getting Started

### 1. Set Up Development Environment

#### Frontend
```bash
cd client
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

#### Backend
```bash
cd backend
npm install
# Create .env file with dev credentials
npm start
# Backend runs at http://localhost:5000
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
git pull origin main
```

### 3. Make Changes
```bash
# Edit files following standards below
# Test locally with npm run dev
```

### 4. Commit & Push
```bash
git add .
git commit -m "feature: description of what you did"
git push origin feature/your-feature-name
```

### 5. Open Pull Request
```
1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Add description of changes
5. Request reviewer
6. Wait for feedback
```

---

## Frontend Development Standards

### File Organization

```
src/
├── pages/         # Page-level components (one per feature)
├── components/    # Reusable UI components
│   ├── Auth/      # Auth-related components
│   ├── Donation/  # Donation-related components
│   ├── Needy/     # Needy-related components
│   ├── QR/        # QR payment components
│   └── Common/    # Shared components (Navbar, Footer, etc.)
├── services/      # API service layer (NO API calls in components!)
├── context/       # React Context (Auth, Donation state)
├── hooks/         # Custom React hooks
├── utils/         # Helper functions, validation, constants
└── styles/        # CSS files (no inline styles!)
```

### React Component Rules

#### 1. One Component Per File
**✅ DO:**
```javascript
// Button.jsx
export default function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>
}
```

**❌ DON'T:**
```javascript
// Page.jsx - Don't put multiple components in one file
function Button() {}
function Input() {}
export default function Page() {}
```

#### 2. Keep Components Small (< 150 lines)
**✅ DO:**
```javascript
// LoginForm.jsx - Small, focused component
export default function LoginForm({ onSubmit }) {
  const { register, handleSubmit } = useForm()
  // ~50 lines
}
```

**❌ DON'T:**
```javascript
// LoginPage.jsx - Too much logic, should be split
export default function LoginPage() {
  // ~300 lines of validation, API calls, state management
}
```

#### 3. Use Services Layer for API Calls
**✅ DO:**
```javascript
// LoginForm.jsx
import authService from '../../services/authService'

export default function LoginForm() {
  const handleSubmit = async (data) => {
    const result = await authService.login(data)
  }
}
```

**❌ DON'T:**
```javascript
// LoginForm.jsx
export default function LoginForm() {
  const handleSubmit = async (data) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
```

#### 4. No Inline Styles - Use Tailwind CSS
**✅ DO:**
```javascript
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Button
</div>
```

**❌ DON'T:**
```javascript
<div style={{ backgroundColor: 'blue', color: 'white', padding: '1rem' }}>
  Button
</div>
```

#### 5. Always Handle Loading, Error, Empty States
**✅ DO:**
```javascript
export default function DonationList() {
  const [donations, setDonations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setIsLoading(true)
        const data = await donationService.list()
        setDonations(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDonations()
  }, [])

  if (isLoading) return <Loading />
  if (error) return <Error message={error} />
  if (donations.length === 0) return <Empty />

  return <ul>{donations.map(d => <li key={d.id}>{d.name}</li>)}</ul>
}
```

**❌ DON'T:**
```javascript
export default function DonationList() {
  const donations = useFetch('/api/donations')
  return <ul>{donations.map(d => <li>{d.name}</li>)}</ul>
}
```

#### 6. Clean Up useEffect Hooks
**✅ DO:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Timer fired')
  }, 1000)

  return () => clearTimeout(timer) // Cleanup
}, [])
```

**❌ DON'T:**
```javascript
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Timer fired')
  }, 1000)
  // No cleanup - causes memory leak
}, [])
```

#### 7. Validate Forms Before Submission
**✅ DO:**
```javascript
const { register, handleSubmit, formState: { errors } } = useForm()

<input {...register('email', { required: 'Email is required' })} />
{errors.email && <span>{errors.email.message}</span>}
```

**❌ DON'T:**
```javascript
const [email, setEmail] = useState('')
const handleSubmit = (e) => {
  e.preventDefault()
  // Submit without validation
}
```

#### 8. Show Loading State During API Calls
**✅ DO:**
```javascript
<button disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</button>
```

**❌ DON'T:**
```javascript
<button onClick={handleSave}>Save</button>
// No indication that save is in progress
```

### CSS Rules

#### Use Tailwind CSS Classes
```css
/* ✅ DO: Use Tailwind classes */
<div className="flex justify-center items-center bg-primary-600 text-white p-4 rounded-lg">
  </div>

/* ❌ DON'T: Write custom CSS */
.my-button {
  display: flex;
  justify-content: center;
  background-color: #3b82f6;
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
}
```

#### Responsive Design with Tailwind
```html
<!-- Mobile-first responsive design -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>Column</div>
  <div>Column</div>
  <div>Column</div>
</div>

<!-- Breakpoints: sm (640), md (768), lg (1024), xl (1280) -->
```

---

## Backend Development Standards

### File Organization

```
backend/
├── controllers/   # Request handlers
├── models/        # MongoDB schemas
├── routes/        # API endpoints
├── middleware/    # Auth, validation, error handling
├── services/      # Business logic
├── schemas/       # Joi validation schemas
├── config/        # Configuration files
└── server.js      # Entry point
```

### Express Route Rules

#### 1. Use Route Handlers for Organization
**✅ DO:**
```javascript
// routes/donations.js
router.post('/', validate(donationSchema), controller.create)
router.get('/', controller.list)
router.get('/:id', controller.get)
```

**❌ DON'T:**
```javascript
// server.js - All routes in one file
app.post('/donations', (req, res) => {})
app.get('/donations', (req, res) => {})
```

#### 2. Validate All Inputs with Joi
**✅ DO:**
```javascript
// schemas/donation.js
const donationSchema = Joi.object({
  amount: Joi.number().positive().required(),
  type: Joi.string().enum(['cash', 'food']).required(),
})

// routes/donations.js
router.post('/', validate(donationSchema), controller.create)
```

**❌ DON'T:**
```javascript
// controller
const create = (req, res) => {
  if (!req.body.amount) return res.status(400).json()
  // Manual validation
}
```

#### 3. Use Middleware for Cross-Cutting Concerns
**✅ DO:**
```javascript
// middleware/errorHandler.js
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

// server.js
app.use(errorHandler)
```

**❌ DON'T:**
```javascript
// Every route has try-catch
router.post('/', async (req, res) => {
  try {
    // Logic
  } catch (err) {
    res.status(500).json()
  }
})
```

#### 4. Use Controllers for Business Logic
**✅ DO:**
```javascript
// controllers/donation.js
exports.create = async (req, res, next) => {
  try {
    const donation = await donationService.create(req.body)
    res.status(201).json(donation)
  } catch (err) {
    next(err)
  }
}
```

**❌ DON'T:**
```javascript
// routes/donations.js
router.post('/', async (req, res) => {
  const donation = new Donation(req.body)
  await donation.save()
  // All logic in route
})
```

#### 5. Error Handling
**✅ DO:**
```javascript
// Generic error messages
res.status(401).json({ message: 'Invalid credentials' })

// Log full error
console.error('Database error:', err)
```

**❌ DON'T:**
```javascript
// Information disclosure
res.status(401).json({ message: 'Email not found in database' })
res.status(500).json({ stack: err.stack }) // Don't expose stack trace
```

#### 6. Rate Limiting
**✅ DO:**
```javascript
// middleware/rateLimit.js
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
})

router.post('/login', authLimiter, controller.login)
```

**❌ DON'T:**
```javascript
// No rate limiting - vulnerable to brute force
router.post('/login', controller.login)
```

### Database Rules

#### Use Mongoose Models with Validation
**✅ DO:**
```javascript
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
})
```

**❌ DON'T:**
```javascript
// No validation at schema level
const userSchema = new Schema({
  email: String,
  password: String,
})
```

#### Use Indexes for Performance
**✅ DO:**
```javascript
userSchema.index({ email: 1 }) // Single field
userSchema.index({ type_of_need: 1, urgency: 1 }) // Compound
```

**❌ DON'T:**
```javascript
// No indexes - slow queries
// Queries on unindexed fields are slow
```

#### Use Soft Deletes
**✅ DO:**
```javascript
const donationSchema = new Schema({
  isActive: { type: Boolean, default: true },
})

// When deleting:
donation.isActive = false
await donation.save()

// When querying:
const donations = await Donation.find({ isActive: true })
```

**❌ DON'T:**
```javascript
// Hard delete loses data
await Donation.deleteOne({ _id: id })
```

---

## Testing

### Frontend Testing
```bash
# Test locally
npm run dev

# Test production build
npm run build
npm run preview

# Visual testing
# - Check all pages render
# - Test responsive layout
# - Check forms validate
# - Test navigation
```

### Backend Testing
```bash
# Test locally
npm start

# Test API endpoints
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/auth/register ...

# Test database connection
# - Verify MongoDB is running
# - Check queries work
```

---

## Pull Request Process

### Before Submitting PR
1. **Run tests locally** - Ensure no errors
2. **Check code style** - Follow standards above
3. **Update documentation** - If adding features
4. **Test manually** - Try your changes in browser
5. **Check for secrets** - Never commit `.env` files

### PR Title Format
```
type(scope): brief description

type: feat, fix, refactor, docs, style, test
scope: auth, donation, needy, payment, admin
description: what changed and why
```

Examples:
```
feat(auth): add password reset functionality
fix(donation): prevent duplicate submission
refactor(forms): extract validation logic
docs(deployment): add Vercel setup guide
```

### PR Description Template
```markdown
## Description
Brief explanation of what this PR does.

## Changes
- Change 1
- Change 2
- Change 3

## Testing
- [x] Tested locally
- [x] Validated all forms
- [x] Checked responsive layout

## Screenshots
(If UI changes)

## Breaking Changes
(If applicable)
```

### Review Process
1. Reviewer checks code quality
2. Reviewer tests changes locally
3. Reviewer requests changes or approves
4. Author makes requested changes
5. Reviewer approves and merges

---

## Commit Message Guidelines

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **refactor**: Code restructuring
- **docs**: Documentation
- **style**: Code style (formatting, missing semicolons)
- **test**: Adding tests
- **chore**: Build, dependencies, tooling

### Examples
```
feat(auth): add email verification for registration

Users can now verify their email address during signup.
A verification link is sent to their email with 24h expiry.

Closes #123

fix(donations): prevent negative amount submission

Validate amount > 0 before form submission.

refactor(api): simplify error handling middleware

Extract common error logic into reusable middleware.
Reduces code duplication across routes.

docs(readme): add deployment section
```

---

## Code Review Checklist

### For Reviewers
- [ ] Code follows standards in CONTRIBUTING.md
- [ ] No secrets in code (API keys, passwords)
- [ ] No console.log or debug code left
- [ ] Error handling is appropriate
- [ ] Tests exist (if applicable)
- [ ] No unnecessary dependencies added
- [ ] Database queries are optimized
- [ ] UI is responsive
- [ ] No breaking changes to API
- [ ] Documentation updated

### For Authors
- [ ] All requested changes made
- [ ] Tests pass locally
- [ ] No console errors or warnings
- [ ] Code is readable and maintainable
- [ ] Commit messages are clear
- [ ] No merge conflicts with main

---

## Branch Protection Rules

- `main` branch is protected
- All PRs require:
  - Passing tests
  - Code review approval
  - No conflicts with main
- Force push disabled
- Deletion disabled

---

## Development Workflow

```
1. Create branch from main
   git checkout -b feature/my-feature

2. Make commits with clear messages
   git commit -m "feat(auth): add login"

3. Push branch
   git push origin feature/my-feature

4. Create Pull Request
   - Title: feat(auth): add login
   - Description: What, Why, How

5. Code Review
   - Fix any issues raised

6. Merge to main
   - Vercel auto-deploys frontend
   - Render auto-deploys backend

7. Delete branch
   git push origin -d feature/my-feature
```

---

## Resources

- [React Best Practices](https://react.dev)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Git Guide](https://git-scm.com/doc)

---

## Getting Help

- **Questions?** Check existing documentation
- **Found a bug?** Create an issue with details
- **Want to discuss?** Start a discussion post
- **Need support?** Reach out to maintainers

---

**Last Updated**: April 3, 2026  
**Version**: 1.0

Thank you for contributing to Hravinder! 🙏
