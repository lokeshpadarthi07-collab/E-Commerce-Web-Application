import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aurashop_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on app launch
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('aurashop_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          setUser(res.data);
        } catch (error) {
          console.warn('Stored token is invalid or expired:', error.message);
          localStorage.removeItem('aurashop_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('aurashop_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await authService.register({ name, email, password });
    const { token: jwtToken, ...userData } = res.data;
    localStorage.setItem('aurashop_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('aurashop_token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async () => {
    return await login('demo@shop.com', 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
