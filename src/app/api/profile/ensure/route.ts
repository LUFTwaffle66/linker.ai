import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { upsertProfileFromClerk } from '@/lib/profiles';

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { profile, error } = await upsertProfileFromClerk(userId, clerkUser);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
