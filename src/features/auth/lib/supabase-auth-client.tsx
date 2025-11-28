'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk, useSession, useUser } from '@clerk/nextjs';
import type { UserRole } from '../types/auth';

type SessionValue = ReturnType<typeof useSession>['session'];

export interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  image?: string;
  avatarUrl?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  session: SessionValue;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractRole(metadataRole: unknown): UserRole {
  if (metadataRole === 'admin' || metadataRole === 'client' || metadataRole === 'freelancer') {
    return metadataRole;
  }

  return 'client';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { signOut } = useClerk();

  const user = useMemo<User | null>(() => {
    if (!clerkUser) return null;

    const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress ?? '';
    const role = extractRole(clerkUser.publicMetadata.role);

    return {
      id: clerkUser.id,
      email: primaryEmail,
      name: clerkUser.firstName || clerkUser.username || primaryEmail,
      fullName: clerkUser.fullName || clerkUser.username || primaryEmail,
      image: clerkUser.imageUrl,
      avatarUrl: clerkUser.imageUrl,
      role,
    };
  }, [clerkUser]);

  const login = async () => {
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
    router.push(`/${locale}/login`);
    return { error: null };
  };

  const signUp = async (_email: string, _password: string, _fullName: string, _role: UserRole) => {
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
    router.push(`/${locale}/signup`);
    return { error: null };
  };

  const logout = async () => {
    await signOut();
    const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
    router.push(`/${locale}/login`);
  };

  const isLoading = !isUserLoaded || !isSessionLoaded;

  return (
    <AuthContext.Provider
      value={{
        user,
        session: session || null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signUp,
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

/**
 * Hook to check if user has a specific role
 */
export function useHasRole(role: UserRole): boolean {
  const { user } = useAuth();
  return user?.role === role;
}
