import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { disconnectVolunteerSocket } from '../services/volunteerService';

export const AuthContext = createContext();
const VOLUNTEER_ROLE = 'volunteer';

function normalizeRole(role) {
  return (role || '').toLowerCase();
}

function clearVolunteerSession() {
  disconnectVolunteerSocket();
  authService.logout();
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const clearStoredAuth = () => {
      clearVolunteerSession();
      localStorage.removeItem('user');
    };

    const initializeAuth = () => {
      try {
        clearStoredAuth();
        setUser(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearVolunteerSession();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    window.addEventListener('beforeunload', clearStoredAuth);
    return () => window.removeEventListener('beforeunload', clearStoredAuth);
  }, []);

  const login = useCallback(async (credentials, options = {}) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { accessToken, refreshToken } = response.data.tokens;
      const { user_id, email, role, name } = response.data.data;
      const allowedRoles = options.allowedRoles ?? [VOLUNTEER_ROLE];
      const normalizedRole = normalizeRole(role);

      if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

        if (!normalizedAllowedRoles.includes(normalizedRole)) {
          clearVolunteerSession();
          const roleError = new Error('Volunteer account required to sign in to the volunteer app.');
          roleError.code = 'ROLE_MISMATCH';
          throw roleError;
        }
      }

      // Prepare user data
      const userData = {
        id: user_id,
        email: email,
        role: role,
        name: name || email,
      };

      // Store tokens FIRST
      authService.setAuthToken(accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Persist user to localStorage immediately
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      // Clear any partial state on error
      clearVolunteerSession();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      const { accessToken, refreshToken } = response.data.tokens;
      const { user_id, email, role, name } = response.data.data;

      // Prepare user data
      const user = {
        id: user_id,
        email: email,
        role: role,
        name: name || email,
      };

      // Store tokens FIRST
      authService.setAuthToken(accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Persist user to localStorage immediately
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      setIsAuthenticated(true);

      return user;
    } catch (error) {
      // Clear any partial state on error
      clearVolunteerSession();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      clearVolunteerSession();
      await authService.logout();
      // Clear localStorage explicitly
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force clear even if logout API fails
      clearVolunteerSession();
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
