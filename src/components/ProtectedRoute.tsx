'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    console.log('=== PROTECTED ROUTE: AUTH CHECK ===');

    // Prevent multiple validations on the same mount
    if (hasValidated) {
      console.log('ProtectedRoute: Already validated, skipping...');
      return;
    }

    // Wait for auth loading to complete
    if (isLoading) {
      console.log('ProtectedRoute: Still loading auth, waiting...');
      return;
    }

    console.log('ProtectedRoute: Auth loading complete, isAuthenticated =', isAuthenticated);
    setHasValidated(true); // Mark as validated

    // If not authenticated, redirect to login
    if (!isAuthenticated && !isRedirecting) {
      console.log('ProtectedRoute: Not authenticated, redirecting to /login');
      setIsRedirecting(true);
      // Clear auth using API client to clear BOTH localStorage AND cookie
      api.clearAuth();
      sessionStorage.clear();
      // Hard redirect to ensure it happens
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
      return;
    }

    // Additional validation: Check if auth state matches localStorage
    if (isAuthenticated) {
      console.log('ProtectedRoute: User authenticated, validating localStorage...');

      const token = api.getToken();
      const cachedUser = localStorage.getItem('cached_user');

      console.log('ProtectedRoute: localStorage check:', {
        hasToken: !!token,
        hasCachedUser: !!cachedUser
      });

      // If authenticated but missing token or user data, logout and redirect
      if (!token || !cachedUser) {
        console.warn('⚠️  ProtectedRoute: AUTH STATE MISMATCH!');
        console.warn('Action: Clearing all storage and redirecting to /login');

        // Clear auth using API client to clear BOTH localStorage AND cookie
        api.clearAuth();
        sessionStorage.clear();

        // Use hard redirect to break any loop
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
        return;
      }

      console.log('✅ ProtectedRoute: Auth state valid, allowing access');
    }

    console.log('========================================');
  }, [isAuthenticated, isLoading, hasValidated]);

  // Show loading spinner while checking authentication or redirecting
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#2a2a2a] dark:bg-[#1f1515]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-200">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
