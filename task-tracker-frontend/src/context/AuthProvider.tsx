import { useState, useEffect, useCallback } from 'react';
import type { AuthResponse, User } from '../types';
import { AuthContext } from './AuthContext';
import { setAccessToken } from '../api/axiosConfig';
import axios from 'axios';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // User info is stored in localStorage (non-sensitive), but access token is memory-only
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // starts true for silent refresh attempt

  // ─── Login: store access token in memory, user info in localStorage ───
  const login = useCallback((authData: AuthResponse) => {
    const newToken = authData.token;
    const newUser = { id: authData.userId, email: authData.email };

    setToken(newToken);
    setAccessToken(newToken);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  // ─── Logout: clear everything + call backend to revoke refresh token cookie ───
  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Best-effort server logout — continue even if it fails
    }
    setToken(null);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  // ─── Silent Refresh: attempt to restore session on page load ───
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.token;
        const newUser = { id: data.data.userId, email: data.data.email };

        setToken(newToken);
        setAccessToken(newToken);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } catch {
        // No valid refresh token — user needs to log in
        setToken(null);
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    silentRefresh();
  }, []);

  // ─── Listen for token refresh events from axios interceptor ───
  useEffect(() => {
    const handleRefreshed = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const newToken = detail.token;
      const newUser = { id: detail.userId, email: detail.email };

      setToken(newToken);
      setAccessToken(newToken);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    };

    const handleSessionExpired = () => {
      setToken(null);
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:refreshed', handleRefreshed);
    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:refreshed', handleRefreshed);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};