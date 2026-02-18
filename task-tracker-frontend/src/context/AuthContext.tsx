import { createContext, useContext } from 'react';
import type { AuthResponse, User } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // true while silent refresh is in progress
}

// 1. Create the Context here
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Export the Hook here
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};