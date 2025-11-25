import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json();

  const updates: Record<string, unknown> = {};

  if (payload.email !== undefined) updates.email = payload.email;
  if (payload.fullName !== undefined) updates.full_name = payload.fullName;
  if (payload.companyName !== undefined) updates.company_name = payload.companyName;
  if (payload.role !== undefined) updates.role = payload.role;
  if (payload.avatarUrl !== undefined) updates.avatar_url = payload.avatarUrl;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('clerk_user_id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
