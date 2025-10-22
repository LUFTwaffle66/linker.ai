'use client';

import { useEffect } from 'react';
import { useAuth } from '@/features/auth/lib/auth-client';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/features/auth/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireRole?: UserRole | UserRole[];
  fallbackUrl?: string;
}

export function AuthGuard({ children, requireRole, fallbackUrl = '/login' }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    // Check role if required
    if (requireRole && user) {
      const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
      if (!allowedRoles.includes(user.role)) {
        router.push('/403'); // Forbidden page
      }
    }
  }, [user, isLoading, isAuthenticated, requireRole, fallbackUrl, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check role
  if (requireRole && user) {
    const allowedRoles = Array.isArray(requireRole) ? requireRole : [requireRole];
    if (!allowedRoles.includes(user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}
