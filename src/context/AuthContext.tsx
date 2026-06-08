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
      console.log('=== AUTH CONTEXT: INITIALIZING ===');
      const token = api.getToken();

      console.log('Auth init: Token found in localStorage:', !!token);

      if (token) {
        // Check if user data exists in localStorage
        const cachedUser = localStorage.getItem('cached_user');

        console.log('Auth init: Cached user found:', !!cachedUser);

        // If token exists but no cached user, clear everything (security measure)
        if (!cachedUser) {
          console.warn('Auth validation failed: Token exists but no cached user data');
          api.clearAuth();
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        try {
          // Parse cached user to validate format
          let parsedCachedUser: User | null = null;
          try {
            parsedCachedUser = JSON.parse(cachedUser);
          } catch {
            console.warn('Auth validation failed: Invalid cached user data format');
            api.clearAuth();
            localStorage.removeItem('cached_user');
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }

          console.log('Auth init: Calling API to validate token...');

          // Add 10-second timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 10000);
          });

          // Race between API call and timeout
          const response = await Promise.race([api.getMe(), timeoutPromise]) as unknown;

          // Check both possible response structures: {data: {user: ...}} or {user: ...}
          const user = (response as { data?: { user?: User } })?.data?.user || (response as { user?: User })?.user;

          if (user) {
            // API validation successful - set auth state
            console.log('Auth init: ✅ API validation successful, user authenticated');
            setUser(user);
            setIsAuthenticated(true);
            // Update cached user data
            localStorage.setItem('cached_user', JSON.stringify(user));
          } else {
            // Token exists but is invalid, clear it
            console.warn('Auth init: ❌ API returned no user data, token invalid');
            api.clearAuth();
            localStorage.removeItem('cached_user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (error: unknown) {
          const err = error as { status?: number; message?: string };

          console.error('Auth init: ❌ API validation failed:', err.message || err);

          // Always clear auth on 401 unauthorized errors
          if (err.status === 401) {
            console.warn('Auth init: Token expired (401), clearing auth');
            api.clearAuth();
            localStorage.removeItem('cached_user');
            setUser(null);
            setIsAuthenticated(false);
          } else {
            // Network error or timeout - keep cached user if available, otherwise clear
            console.warn('Auth init: Network error or timeout, keeping current state');
            if (!cachedUser) {
              api.clearAuth();
              localStorage.removeItem('cached_user');
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } else {
        // No token found
        console.log('Auth init: No token found in localStorage');
        // Clear any stale cached user data for security
        localStorage.removeItem('cached_user');
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }

      // Always set loading to false, regardless of outcome
      setIsLoading(false);
      console.log('=== AUTH CONTEXT: INITIALIZATION COMPLETE ===');
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

  // Periodic auth state validation (every 30 seconds)
  useEffect(() => {
    if (!isAuthenticated) return;

    const validateAuthState = () => {
      const token = api.getToken();
      const cachedUser = localStorage.getItem('cached_user');

      // If authenticated but token or user data missing, logout
      if (isAuthenticated && (!token || !cachedUser)) {
        console.warn('Auth state validation failed: Missing token or user data');
        logout();
      }
    };

    // Run validation every 30 seconds
    const interval = setInterval(validateAuthState, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  
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
    console.log('=== AUTH CONTEXT: LOGOUT CALLED ===');

    try {
      // Clear auth using API client (clears BOTH localStorage AND cookie)
      api.clearAuth();
      sessionStorage.clear();
      console.log('Step 1: Cleared all storage synchronously');

      setUser(null);
      setIsAuthenticated(false);
      console.log('Step 2: Cleared auth state');

      // Call API logout (best effort, don't wait for it)
      api.logout().catch(err => console.log('API logout completed (errors ignored):', err.message));
      console.log('Step 3: API logout called');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Final cleanup - ensure everything is cleared
      api.clearAuth();
      sessionStorage.clear();
      console.log('Step 4: Final storage cleanup complete');
      console.log('========================================');
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
