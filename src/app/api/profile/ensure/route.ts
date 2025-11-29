import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? null;
  const fullName = clerkUser.fullName ?? clerkUser.username ?? email ?? null;
  const avatarUrl = clerkUser.imageUrl ?? null;
  const role = (clerkUser.publicMetadata.role as string | null) ?? null;
  const companyName = (clerkUser.publicMetadata.companyName as string | null) ?? null;

  const { data: existingProfile, error: fetchError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('clerk_user_id', userId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (existingProfile) {
    const { error: updateError, data: updatedProfile } = await supabaseAdmin
      .from('profiles')
      .update({ email, full_name: fullName, avatar_url: avatarUrl, role, company_name: companyName })
      .eq('clerk_user_id', userId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ profile: updatedProfile });
  }

  const { data: profile, error: insertError } = await supabaseAdmin
    .from('profiles')
    .insert({
      clerk_user_id: userId,
      email,
      full_name: fullName,
      avatar_url: avatarUrl,
      role,
      company_name: companyName,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}
