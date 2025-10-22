import { getServerUser } from './auth-server';
import type { UserRole } from '../types/auth';

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  return await getServerUser();
}

/**
 * Check if current user is authenticated
 */
export async function requireAuth(): Promise<boolean> {
  const user = await getServerUser();
  return !!user;
}

/**
 * Check if the current user has a specific role
 */
export async function requireRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;

  const allowedRoles = Array.isArray(role) ? role : [role];
  return allowedRoles.includes(user.role);
}

/**
 * Throw error if user is not authenticated
 */
export async function enforceAuth() {
  if (!(await requireAuth())) {
    throw new Error('Unauthorized: Authentication required');
  }
}

/**
 * Throw error if user doesn't have required role
 */
export async function enforceRole(role: UserRole | UserRole[]) {
  if (!(await requireRole(role))) {
    const roles = Array.isArray(role) ? role.join(', ') : role;
    throw new Error(`Unauthorized: Required role(s): ${roles}`);
  }
}
