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

  if (!user) {
    return { success: false, error: 'Unauthorized' } as const;
  }

  const existingRole =
    (user.publicMetadata?.role as UserRole | undefined) ??
    (user.unsafeMetadata?.role as UserRole | undefined) ??
    null;

  if (existingRole !== role) {
    try {
      await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...(user.publicMetadata ?? {}),
          role,
        },
        unsafeMetadata: {
          ...(user.unsafeMetadata ?? {}),
          role,
        },
      });
    } catch (error) {
      console.error('Failed to update Clerk role metadata', error);
      return { success: false, error: 'Failed to update user role' } as const;
    }
  }

  try {
    const { data, error } = await updateProfileByClerkId(userId, { role });

    if (error || !data) {
      console.error('Failed to sync profile role to Supabase', error);
      return { success: false, error: 'Failed to sync profile role' } as const;
    }
  } catch (error) {
    console.error('Failed to sync profile role to Supabase', error);
    return { success: false, error: 'Failed to sync profile role' } as const;
  }

  return { success: true, role } as const;
}
