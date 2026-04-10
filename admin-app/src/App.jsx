import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonationProvider } from './context/DonationContext';
import { NeedyProvider } from './context/NeedyContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Toast from './components/Common/Toast';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth Pages
import PasswordResetPage from './pages/Auth/PasswordResetPage';

// Home Page
import HomePage from './pages/Home/HomePage';

// Dashboard Pages
import DashboardPage from './pages/Dashboard/DashboardPage';

// Donation Pages
import DonationSelectionPage from './pages/Donation/DonationSelectionPage';
import DonationFormPage from './pages/Donation/DonationFormPage';

// Needy Pages
import NeedySelectionPage from './pages/Needy/NeedySelectionPage';
import NeedyIndividualPage from './pages/Needy/NeedyIndividualPage';
import NeedyOrganisationPage from './pages/Needy/NeedyOrganisationPage';

// Payment Pages
import QRPaymentPage from './pages/QR/QRPaymentPage';

// Error Pages
import NotFoundPage from './pages/NotFoundPage';
import ForbiddenPage from './pages/ForbiddenPage';

import './App.css';

/**
 * Main App Component with Complete Routing Setup
 *
 * Route Organization:
 * - Public Routes: Login, Register, Password Reset
 * - Protected Routes: Dashboard, Donation, QR Payment
 * - Role-based Routes: Needy pages (needy role), Admin pages (admin role)
 * - Error Routes: 404 Not Found, 403 Forbidden
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <DonationProvider>
            <NeedyProvider>
              {/* Toast Notifications */}
              <Toast />

            {/* Route Definitions */}
            <Routes>
              {/* ============================================ */}
              {/* PUBLIC ROUTES - Accessible without auth     */}
              {/* ============================================ */}
              <Route path="/" element={<HomePage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              <Route path="/reset-password/:token" element={<PasswordResetPage />} />

              {/* ============================================ */}
              {/* PROTECTED ROUTES - Require authentication   */}
              {/* ============================================ */}

              {/* Dashboard - Accessible to all authenticated users */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<DashboardPage />}
                    allowedRoles={null} // All authenticated users can access
                  />
                }
              />

              {/* Donation - Accessible to all authenticated users */}
              <Route
                path="/donation"
                element={
                  <ProtectedRoute
                    element={<DonationSelectionPage />}
                    allowedRoles={null}
                  />
                }
              />

              {/* Donation Type Routes - All donation forms */}
              <Route
                path="/donation/:type"
                element={
                  <ProtectedRoute
                    element={<DonationFormPage />}
                    allowedRoles={null}
                  />
                }
              />

              {/* QR Payment - Accessible to all authenticated users */}
              <Route
                path="/payment/:orderId"
                element={
                  <ProtectedRoute
                    element={<QRPaymentPage />}
                    allowedRoles={null} // All authenticated users can access
                  />
                }
              />

              {/* ============================================ */}
              {/* ROLE-BASED PROTECTED ROUTES                 */}
              {/* ============================================ */}

              {/* Needy Registration - Selection Page */}
              <Route
                path="/needy"
                element={
                  <ProtectedRoute
                    element={<NeedySelectionPage />}
                    allowedRoles={null}
                  />
                }
              />

              {/* Needy Individual Registration */}
              <Route
                path="/needy/individual"
                element={
                  <ProtectedRoute
                    element={<NeedyIndividualPage />}
                    allowedRoles={null}
                  />
                }
              />

              {/* Needy Organisation Registration */}
              <Route
                path="/needy/organisation"
                element={
                  <ProtectedRoute
                    element={<NeedyOrganisationPage />}
                    allowedRoles={null}
                  />
                }
              />

              {/* Admin Verification Panel - Only admin users */}
              {/*
                Route: /admin/verification
                Component: AdminVerificationPage (will be created)
                Note: Currently no admin pages exist. Redirect to dashboard for now.
              */}
              <Route
                path="/admin/verification"
                element={
                  <ProtectedRoute
                    element={<Navigate to="/dashboard" replace />}
                    allowedRoles="admin"
                  />
                }
              />

              {/* ============================================ */}
              {/* ERROR ROUTES                                */}
              {/* ============================================ */}

              {/* 403 Forbidden - User lacks required permissions */}
              <Route path="/403" element={<ForbiddenPage />} />

              {/* 404 Not Found - Route doesn't exist */}
              <Route path="/*" element={<NotFoundPage />} />
            </Routes>
            </NeedyProvider>
          </DonationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
