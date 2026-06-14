'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import UserNavigation from '@/components/user/UserNavigation';
import { AccountPageWrapper } from '@/components/account/AccountPageWrapper';
import { ReactNode, isValidElement, cloneElement } from 'react';

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  let fullWidthContent: ReactNode = null;
  let mainContent: ReactNode = children;

  // Check if children is using AccountPageWrapper
  if (isValidElement(children) && children.type === AccountPageWrapper) {
    const props = children.props as { fullWidth?: ReactNode; children: ReactNode };
    fullWidthContent = props.fullWidth;
    mainContent = props.children;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fcf8f6]">
        {/* Full-width content (breadcrumb, banner, etc.) */}
        {fullWidthContent}

        {/* Container with sidebar and main content */}
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation - Persists across routes */}
            <aside className="lg:w-64 flex-shrink-0">
              <UserNavigation />
            </aside>

            {/* Main Content - Changes on navigation */}
            <main className="flex-1">
              {mainContent}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
