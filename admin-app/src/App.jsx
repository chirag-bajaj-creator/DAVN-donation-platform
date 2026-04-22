import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import Toast from './components/Common/Toast';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Home Page
import AdminHomePage from './pages/Home/AdminHomePage';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import DonationsPage from './pages/Admin/DonationsPage';
import VolunteersPage from './pages/Admin/VolunteersPage';
import NeedyPage from './pages/Admin/NeedyPage';
import UsersPage from './pages/Admin/UsersPage';

// Error Pages
import ForbiddenPage from './pages/ForbiddenPage';

import './App.css';
import './styles/admin.css';

/**
 * Admin App Main Router
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Toast />
          <Routes>
            <Route path="/" element={<AdminHomePage />} />
            <Route path="/login" element={<AdminHomePage />} />
            <Route
              path="/panel"
              element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/panel/donations"
              element={<ProtectedRoute allowedRoles={['admin']}><DonationsPage /></ProtectedRoute>}
            />
            <Route
              path="/panel/volunteers"
              element={<ProtectedRoute allowedRoles={['admin']}><VolunteersPage /></ProtectedRoute>}
            />
            <Route
              path="/panel/needy"
              element={<ProtectedRoute allowedRoles={['admin']}><NeedyPage /></ProtectedRoute>}
            />
            <Route
              path="/panel/users"
              element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>}
            />
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
