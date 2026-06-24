import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedUser = authService.getCurrentUser();
    const token = authService.getToken();
    if (cachedUser && token) {
      setUser(cachedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
      });
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUserCache = (updatedUser) => {
    setUser({
      ...user,
      name: updatedUser.name,
      profileImage: updatedUser.profileImage,
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    register,
    logout,
    updateUserCache
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
