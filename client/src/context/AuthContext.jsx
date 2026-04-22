import { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

const CLIENT_ROLE = 'user';

function normalizeRole(role) {
  return (role || '').toLowerCase();
}

function clearClientSession() {
  authService.logout();
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const clearStoredAuth = () => {
      clearClientSession();
      localStorage.removeItem('user');
    };

    const initializeAuth = () => {
      try {
        clearStoredAuth();
        setUser(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearClientSession();
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

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      const { accessToken, refreshToken } = response.data.tokens;
      const { user_id, email, role } = response.data.data;

      if (normalizeRole(role) !== CLIENT_ROLE) {
        clearClientSession();
        const roleError = new Error('Client account required to sign in to this app.');
        roleError.code = 'ROLE_MISMATCH';
        throw roleError;
      }

      const userData = {
        id: user_id,
        email,
        role,
      };

      authService.setAuthToken(accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      clearClientSession();
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
      const { user_id, email, role } = response.data.data;

      if (normalizeRole(role) !== CLIENT_ROLE) {
        clearClientSession();
        const roleError = new Error('Client account required to access this app.');
        roleError.code = 'ROLE_MISMATCH';
        throw roleError;
      }

      const user = {
        id: user_id,
        email,
        role,
      };

      authService.setAuthToken(accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);

      return user;
    } catch (error) {
      clearClientSession();
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
      await authService.logout();
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
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
