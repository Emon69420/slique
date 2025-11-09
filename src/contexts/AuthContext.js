import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser && storedUser !== 'undefined') {
      try {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiLogin(credentials);
      
      if (response.data.success) {
        const { data } = response.data;
        
        // Backend returns: { user_id, email, session_token, profile }
        const token = data.session_token || data.token || data.access_token;
        const userProfile = data.profile || data.user;
        
        // Validate we have required data
        if (!token) {
          throw new Error('Invalid response: token missing');
        }
        
        // Store token
        localStorage.setItem('token', token);
        
        // Create user object from profile
        const user = {
          id: data.user_id || userProfile?.id,
          email: data.email || userProfile?.email,
          name: userProfile?.username || userProfile?.display_name || data.email,
          ...userProfile
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        setLoading(false);
        
        return { success: true };
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await apiRegister(userData);
      
      if (response.data.success) {
        // Automatically log in after registration
        const loginResult = await login({
          email: userData.email,
          password: userData.password
        });
        
        setLoading(false);
        return loginResult;
      }
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};