import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../config/api';

export const AuthContext = createContext();

const API_URL = '/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crackit_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on start
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('crackit_token');
      if (storedToken) {
        try {
          const res = await api.get(`${API_URL}/profile`);
          if (res.data.success) {
            setUser(res.data.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`${API_URL}/login`, { email, password });
      
      if (res.data.success) {
        const { token: userToken, user: userData } = res.data;
        
        localStorage.setItem('crackit_token', userToken);
        setToken(userToken);
        setUser(userData);
        
        setLoading(false);
        return userData;
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Register handler
  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`${API_URL}/register`, { 
        name, 
        email, 
        password, 
        confirmPassword 
      });
      
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Update user progress handler
  const updateProgress = async (progressData) => {
    try {
      const res = await api.put(`${API_URL}/progress`, progressData);
      if (res.data.success) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update progress.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('crackit_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        updateProgress,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
