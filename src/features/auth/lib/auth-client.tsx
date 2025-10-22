/**
 * Re-export Supabase Auth for backwards compatibility
 * This file now uses Supabase Auth instead of NextAuth
 */
export { AuthProvider, useAuth, useHasRole, type User } from './supabase-auth-client';
