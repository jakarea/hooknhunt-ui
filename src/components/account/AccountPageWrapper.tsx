'use client';

import { ReactNode } from 'react';

interface AccountPageWrapperProps {
  fullWidth?: ReactNode;
  children: ReactNode;
}

/**
 * Wrapper for account pages that need full-width elements (breadcrumb, banner, etc.)
 * Full-width content renders BEFORE the container from the layout
 */
export function AccountPageWrapper({ fullWidth, children }: AccountPageWrapperProps) {
  return (
    <>
      {/* Full-width content - renders before layout container */}
      {fullWidth}

      {/* Main content - renders inside layout container */}
      {children}
    </>
  );
}

AccountPageWrapper.displayName = 'AccountPageWrapper';
