import React, { useState } from 'react';
import type { AuthResponse, User } from '../types';
import { AuthContext } from './AuthContext'; // Import the context we just created

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy initialization (Fixes the cascading render issue)
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const login = (authData: AuthResponse) => {
    setToken(authData.token);
    setUser({ id: authData.userId, email: authData.email });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify({ id: authData.userId, email: authData.email }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};