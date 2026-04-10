import { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = authService.getAuthToken();
        const storedUser = localStorage.getItem('user');

        console.log('🔐 INITIALIZING AUTH:', { token: !!token, storedUser: !!storedUser });

        if (token && storedUser) {
          // Both token and user exist - restore auth state
          const userData = JSON.parse(storedUser);
          console.log('✅ Auth restored:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else if (token || storedUser) {
          // One exists but not the other - clear both (corrupted state)
          console.warn('⚠️ Corrupted auth state - clearing');
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Neither exists - user not logged in
          console.log('⭕ No auth found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      // Debug log full response
      console.log('📡 FULL LOGIN RESPONSE:', JSON.stringify(response.data, null, 2));

      const { accessToken, refreshToken } = response.data.tokens;
      const { user_id, email, role } = response.data.data;

      console.log('✅ EXTRACTED AUTH DATA:');
      console.log('  - user_id:', user_id);
      console.log('  - email:', email);
      console.log('  - role: "' + role + '" (type: ' + typeof role + ')');
      console.log('  - role lowercase: "' + (role || '').toLowerCase() + '"');
      console.log('  - accessToken exists:', !!accessToken);
      console.log('  - refreshToken exists:', !!refreshToken);

      // Prepare user data
      const userData = {
        id: user_id,
        email: email,
        role: role,
      };

      console.log('💾 Storing user data:', userData);

      // Store tokens FIRST
      authService.setAuthToken(accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Persist user to localStorage immediately
      localStorage.setItem('user', JSON.stringify(userData));

      // Verify what was stored
      console.log('✓ Verified storage:', {
        storedUser: JSON.parse(localStorage.getItem('user')),
        hasToken: !!localStorage.getItem('authToken'),
      });

      // Update state
      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      console.error('❌ Login failed:', {
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      // Clear any partial state on error
      authService.logout();
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

      // Prepare user data
      const user = {
        id: user_id,
        email: email,
        role: role,
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
      authService.logout();
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
      // Clear localStorage explicitly
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Force clear even if logout API fails
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
