import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { UserRole } from '../types/auth';

function extractRole(role: unknown): UserRole {
  if (role === 'admin' || role === 'client' || role === 'freelancer') {
    return role;
  }

  return 'client';
}

/**
 * Get the current session on the server
 * Returns null if not authenticated
 */
export async function getServerSession() {
  const { sessionId } = auth();
  return sessionId ? { sessionId } : null;
}

/**
 * Get the current user on the server
 * Returns null if not authenticated
 */
export async function getServerUser() {
  const user = await currentUser();

  if (!user) return null;

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress ?? '';
  const role = extractRole(user.publicMetadata.role);

  return {
    id: user.id,
    email: primaryEmail,
    fullName: user.fullName || user.username || primaryEmail,
    avatarUrl: user.imageUrl,
    role,
    companyName: user.publicMetadata.companyName as string | undefined,
  };
}

/**
 * Require authentication on the server
 * Redirects to login if not authenticated
 */
export async function requireAuth(redirectTo: string = '/login') {
  const { userId } = auth();
  if (!userId) {
    redirect(redirectTo);
  }
  return userId;
}

/**
 * Check if user is authenticated
 * Returns boolean
 */
export async function isAuthenticated() {
  const { userId } = auth();
  return !!userId;
}

/**
 * Require specific role on the server
 * Redirects if role doesn't match
 */
export async function requireRole(role: UserRole, redirectTo: string = '/unauthorized') {
  const user = await getServerUser();
  if (!user || user.role !== role) {
    redirect(redirectTo);
  }
  return user;
}
