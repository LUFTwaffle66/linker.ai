// src/features/onboarding/actions.ts
'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { UserRole } from '@/features/auth/types/auth';

type EnsureUserRoleResult =
  | { success: true; role: UserRole; error?: never }
  | { success: false; error: string; role?: never };

export async function ensureUserRole(
  expectedRole: 'freelancer' | 'client'
): Promise<EnsureUserRoleResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user from Supabase
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user:', fetchError);
      
      // If user doesn't exist in Supabase, create them
      if (fetchError.code === 'PGRST116') {
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);
        
        // Get role from Clerk's unsafeMetadata
        const roleFromMetadata = clerkUser.unsafeMetadata?.role as UserRole | undefined;
        const roleToSet = roleFromMetadata || expectedRole;

        const { data: newUser, error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            clerk_id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
            avatar_url: clerkUser.imageUrl,
            role: roleToSet,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          return { success: false, error: 'Failed to create user profile' };
        }

        // Also update Clerk's metadata to ensure consistency
        await clerk.users.updateUser(userId, {
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            role: roleToSet,
          },
        });

        return { success: true, role: newUser.role as UserRole };
      }

      return { success: false, error: 'Failed to fetch user' };
    }

    // If user already has a role
    if (user.role) {
      // Check if it matches the expected role
      if (user.role !== expectedRole) {
        return { 
          success: false, 
          error: `User is registered as ${user.role}, not ${expectedRole}` 
        };
      }
      return { success: true, role: user.role as UserRole };
    }

    // User exists but has no role - set it now
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        role: expectedRole,
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', userId);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return { success: false, error: 'Failed to set user role' };
    }

    // Also update Clerk's metadata
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    await clerk.users.updateUser(userId, {
      unsafeMetadata: {
        ...clerkUser.unsafeMetadata,
        role: expectedRole,
      },
    });

    return { success: true, role: expectedRole };
  } catch (error) {
    console.error('Error in ensureUserRole:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
