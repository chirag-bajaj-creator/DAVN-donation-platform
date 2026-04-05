import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Loading from './Loading';

/**
 * ProtectedRoute Component
 * Ensures only authenticated users can access certain routes
 * Optionally checks for specific roles (donor, needy, admin)
 *
 * @param {React.ReactNode} element - The component to render if authorized
 * @param {string|string[]} allowedRoles - Role(s) allowed to access this route
 * @returns {React.ReactNode} - The protected element or redirect
 */
export default function ProtectedRoute({ element, allowedRoles = null }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Fallback check: verify token exists (in case of state sync issues)
  const hasToken = localStorage.getItem('authToken');
  const storedUser = localStorage.getItem('user');

  // Show loading state while checking authentication
  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  // Check both context AND localStorage to handle race conditions
  const isActuallyAuthenticated = isAuthenticated || (hasToken && storedUser);

  if (!isActuallyAuthenticated) {
    // Clear any orphaned data
    if (!hasToken && storedUser) {
      localStorage.removeItem('user');
    }
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userToCheck = user || (storedUser ? JSON.parse(storedUser) : null);

    if (userToCheck && !rolesArray.includes(userToCheck.role)) {
      // Redirect to 403 Forbidden page or dashboard
      return <Navigate to="/403" replace />;
    }
  }

  // User is authenticated and authorized
  return element;
}
