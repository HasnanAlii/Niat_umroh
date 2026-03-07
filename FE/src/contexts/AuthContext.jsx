import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jamaah, setJamaah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      const storedJamaah = localStorage.getItem('jamaah');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setJamaah(storedJamaah ? JSON.parse(storedJamaah) : null);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password);
      
      // Store auth data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (response.jamaah) {
        localStorage.setItem('jamaah', JSON.stringify(response.jamaah));
        setJamaah(response.jamaah);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await apiClient.register(data);
      
      // Store auth data
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (response.jamaah) {
        localStorage.setItem('jamaah', JSON.stringify(response.jamaah));
        setJamaah(response.jamaah);
      }
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('jamaah');
      
      // Clear state
      setUser(null);
      setJamaah(null);
      setIsAuthenticated(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateJamaah = (jamaahData) => {
    setJamaah(jamaahData);
    localStorage.setItem('jamaah', JSON.stringify(jamaahData));
  };

  const value = {
    user,
    jamaah,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    updateJamaah,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
