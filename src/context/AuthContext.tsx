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

      if (!token) {
        // No token - user not authenticated
        localStorage.removeItem('cached_user');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Try to validate token with API (max 3 seconds)
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), 3000);
        });

        const response = await Promise.race([api.getMe(), timeoutPromise]) as unknown;
        const user = (response as { data?: { user?: User } })?.data?.user || (response as { user?: User })?.user;

        if (user) {
          setUser(user);
          setIsAuthenticated(true);
          localStorage.setItem('cached_user', JSON.stringify(user));
        } else {
          api.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error: unknown) {
        const err = error as { status?: number; message?: string };

        // Clear auth on 401 - token is invalid
        if (err.status === 401) {
          api.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
        } else {
          // Network/timeout error - try to use cached user as fallback
          const cachedUser = localStorage.getItem('cached_user');
          if (cachedUser) {
            try {
              const user = JSON.parse(cachedUser);
              setUser(user);
              setIsAuthenticated(true);
            } catch {
              api.clearAuth();
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            // No cached user either - not authenticated
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for storage changes (when localStorage is cleared in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Check if auth-related items were removed
      if (e.key === 'auth_token' && e.newValue === null) {
        // Token was removed, logout user
        console.warn('Auth token removed from storage - logging out');
        setUser(null);
        setIsAuthenticated(false);
      }

      if (e.key === 'cached_user' && e.newValue === null) {
        // User data was removed, logout user
        console.warn('Cached user data removed from storage - logging out');
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Periodic auth state validation (every 60 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const validateAuthState = async () => {
      try {
        const response = await api.getMe();
        const user = (response as { data?: { user?: User } })?.data?.user || (response as { user?: User })?.user;

        if (user) {
          // Still authenticated and valid
          setUser(user);
        } else {
          // No user data returned - invalid session
          await logout();
        }
      } catch (error: unknown) {
        const err = error as { status?: number };

        // On 401, logout - session expired
        if (err.status === 401) {
          await logout();
        }
        // On other errors, do nothing - let network recover
      }
    };

    // Run validation every 60 seconds
    const interval = setInterval(validateAuthState, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  
  const login = async (phone: string, password: string, rememberMe: boolean = true) => {
    const response = await api.login(phone, password, rememberMe);

    // Extract user from response
    const user =
      (response as { data?: { user?: User } }).data?.user ||
      (response as { user?: User }).user ||
      response as unknown as User;

    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('cached_user', JSON.stringify(user));
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
    const response = await api.verifyOtp(phone, otp);

    const user =
      (response as { data?: { user?: User } }).data?.user ||
      (response as { user?: User }).user ||
      response as unknown as User;

    if (user) {
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('cached_user', JSON.stringify(user));
    }
  };

  const logout = async () => {
    // Clear auth state immediately
    api.clearAuth();
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);

    // Call API logout but don't wait - it's a best-effort
    try {
      await api.logout();
    } catch {
      // Ignore API logout errors - user is already logged out locally
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
