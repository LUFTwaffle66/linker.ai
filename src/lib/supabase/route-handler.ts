// src/lib/supabase/route-handler.ts

import { auth, currentUser } from '@clerk/nextjs/server';
import type { UserRole } from '@/features/auth/types/auth';

export async function getRouteHandlerUser(): Promise<{
  id: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: UserRole | null;
  companyName?: string | null;
} | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();

  const role =
    (clerkUser?.publicMetadata?.role as UserRole | undefined) ?? null;

  const companyName =
    (clerkUser?.publicMetadata?.companyName as string | undefined) ?? null;

  return {
    id: userId,
    email: clerkUser?.primaryEmailAddress?.emailAddress ?? null,
    fullName:
      (clerkUser?.firstName || clerkUser?.lastName
        ? `${clerkUser?.firstName ?? ''} ${clerkUser?.lastName ?? ''}`.trim()
        : clerkUser?.username) ?? null,
    avatarUrl: clerkUser?.imageUrl ?? null,
    role,
    companyName,
  };
}
