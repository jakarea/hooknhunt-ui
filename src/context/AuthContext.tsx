'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (phone: string, password: string, name?: string) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  sendResetOtp: (phone: string) => Promise<{ message?: string; otp_code?: string }>;
  resetPassword: (phone: string, otp: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = api.getToken();

      if (token) {
        // First, try to use cached user data immediately for better UX
        const cachedUser = localStorage.getItem('cached_user');
        if (cachedUser) {
          try {
            const userData = JSON.parse(cachedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem('cached_user');
          }
        }

        try {
          const response = await api.getMe();

          // Check both possible response structures: {data: {user: ...}} or {user: ...}
          const user = (response as { data?: { user?: User } })?.data?.user || (response as { user?: User })?.user || response as User;
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
            // Cache user data for offline scenarios
            localStorage.setItem('cached_user', JSON.stringify(user));
          } else {
            // Token exists but is invalid, clear it
            api.clearAuth();
            localStorage.removeItem('cached_user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error: unknown) {
          const err = error as { status?: number; message?: string };

          // Always clear auth on 401 unauthorized errors
          if (err.status === 401) {
            api.clearAuth();
            localStorage.removeItem('cached_user');
            setUser(null);
            setIsAuthenticated(false);
          } else if (err.status === 0 && !cachedUser) {
            // Network error - only show error if we don't have cached data
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        // Clear any stale cached user data
        localStorage.removeItem('cached_user');
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  
  const login = async (phone: string, password: string, rememberMe: boolean = true) => {
    try {
      // Clear any existing auth data before login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('cached_user');
      setUser(null);
      setIsAuthenticated(false);

      const response = await api.login(phone, password, rememberMe);

      // Check multiple possible user locations in response
      const user =
        (response as { data?: { user?: User } }).data?.user ||
        (response as { user?: User }).user ||
        response as unknown as User;

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // Cache user data for offline scenarios
        localStorage.setItem('cached_user', JSON.stringify(user));
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (phone: string, password: string, name?: string) => {
    await api.register(phone, password, name);
  };

  const sendOtp = async (phone: string) => {
    try {
      await api.sendOtp(phone);
    } catch (error) {
      console.error('Send OTP failed:', error);
      throw error;
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const response = await api.verifyOtp(phone, otp);

      // Check multiple possible user locations in response
      const user =
        (response as { data?: { user?: User } }).data?.user ||
        (response as { user?: User }).user ||
        response as unknown as User;

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        // Cache user data for offline scenarios
        localStorage.setItem('cached_user', JSON.stringify(user));
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      api.clearAuth();
      // Clear cached user data
      localStorage.removeItem('cached_user');
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getMe();
      const user = response.data?.user || (response as { user?: User })?.user;
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error('Refresh user failed:', error);
      throw error;
    }
  };

  const sendResetOtp = async (phone: string) => {
    try {
      const response = await api.sendResetOtp(phone);
      return response;
    } catch (error) {
      console.error('Send reset OTP failed:', error);
      throw error;
    }
  };

  const resetPassword = async (phone: string, otp: string, password: string, passwordConfirmation: string) => {
    try {
      await api.resetPassword(phone, otp, password, passwordConfirmation);
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        sendOtp,
        verifyOtp,
        sendResetOtp,
        resetPassword,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
