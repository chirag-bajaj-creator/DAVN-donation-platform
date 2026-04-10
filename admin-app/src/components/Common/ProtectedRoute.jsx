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
export default function ProtectedRoute({ element, children, allowedRoles = null }) {
  console.log('🔒 ProtectedRoute CHECKING - allowedRoles:', allowedRoles);
  const { user, loading, isAuthenticated } = useAuth();
  console.log('🔒 ProtectedRoute state - loading:', loading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  // Use children if element not provided
  const component = element || children;

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
    return <Navigate to="/" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const userToCheck = user || (storedUser ? JSON.parse(storedUser) : null);

    // Debug logging with exact values
    const userRole = userToCheck?.role || 'NO_ROLE';
    const allowedRolesLower = rolesArray.map(r => r.toLowerCase());
    const userRoleLower = userRole.toLowerCase();
    const hasAccess = allowedRolesLower.includes(userRoleLower);

    console.log('🔐 PROTECTED ROUTE CHECK:');
    console.log('  - User role from localStorage:', userRole);
    console.log('  - User role (lowercase):', userRoleLower);
    console.log('  - Allowed roles:', rolesArray);
    console.log('  - Allowed roles (lowercase):', allowedRolesLower);
    console.log('  - Has access?:', hasAccess);
    console.log('  - Full user object:', userToCheck);

    if (userToCheck && !hasAccess) {
      console.error('❌ ACCESS DENIED - Role mismatch');
      console.error('  Expected one of:', allowedRolesLower);
      console.error('  But got:', userRoleLower);
      return <Navigate to="/403" replace />;
    }
  }

  // User is authenticated and authorized
  return component;
}
