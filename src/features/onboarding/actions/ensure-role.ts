'use server';

import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import type { UserRole } from '@/features/auth/types/auth';
import { updateProfileByClerkId } from '@/lib/profiles';

export async function ensureUserRole(role: UserRole) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: 'Unauthorized' } as const;
  }

  const user = await currentUser();
  const existingRole = (user?.publicMetadata?.role as UserRole | undefined) ?? null;

  if (existingRole && existingRole !== role) {
    return { success: false, error: 'role_mismatch', role: existingRole } as const;
  }

  if (!existingRole) {
    try {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...(user?.publicMetadata ?? {}),
          role,
        },
      });
    } catch (error) {
      console.error('Failed to update Clerk role metadata', error);
      return { success: false, error: 'Failed to update user role' } as const;
    }
  }

  try {
    await updateProfileByClerkId(userId, { role: existingRole ?? role });
  } catch (error) {
    console.error('Failed to sync profile role to Supabase', error);
  }

  return { success: true, role: existingRole ?? role } as const;
}
