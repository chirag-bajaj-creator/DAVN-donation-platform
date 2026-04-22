import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MyTasksPage from './pages/MyTasksPage';
import SubmitReportPage from './pages/SubmitReportPage';
import LoginPage from './pages/LoginPage';

// Protected Route Component
function ProtectedRoute({ element, allowedRoles = ['volunteer'] }) {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="volunteer-app-shell volunteer-loading-shell">
        <div className="volunteer-loading-card">
          <div className="volunteer-spinner" />
          <p>Loading volunteer portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = (user?.role || '').toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());

  return normalizedAllowedRoles.includes(normalizedRole)
    ? element
    : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-type" element={<Navigate to="/" replace />} />
          <Route path="/register/specialized" element={<Navigate to="/" replace />} />
          <Route path="/register/unspecialized" element={<Navigate to="/" replace />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
          <Route path="/my-tasks" element={<ProtectedRoute element={<MyTasksPage />} />} />
          <Route path="/submit-report" element={<ProtectedRoute element={<SubmitReportPage />} />} />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
