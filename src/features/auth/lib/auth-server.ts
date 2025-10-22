/**
 * Re-export Supabase Auth server utilities for backwards compatibility
 * This file now uses Supabase Auth instead of NextAuth
 */
export { getServerSession, getServerUser, requireAuth, isAuthenticated, requireRole } from './supabase-auth-server';
