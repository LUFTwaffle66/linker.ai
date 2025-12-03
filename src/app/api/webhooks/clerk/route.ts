// src/app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const clerkUserId = evt.data.id;
    const userData = evt.data;
    
    // Extract role from unsafeMetadata
    const role = userData.unsafe_metadata?.role as 'freelancer' | 'client' | undefined;

    console.log('Webhook received:', {
      eventType,
      clerkUserId,
      role,
      unsafeMetadata: userData.unsafe_metadata
    });

    try {
      // Check if user exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('clerk_id', clerkUserId)
        .single();

      const email = userData.email_addresses?.[0]?.email_address;
      const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null;
      const avatarUrl = userData.image_url;

      if (existingUser) {
        // Update existing user
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({
            email: email || existingUser.email,
            full_name: fullName || existingUser.full_name,
            avatar_url: avatarUrl || existingUser.avatar_url,
            // Only update role if it's provided and user doesn't have one yet
            ...(role && !existingUser.role ? { role } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_id', clerkUserId);

        if (updateError) {
          throw updateError;
        }

        console.log('User updated:', clerkUserId);
      } else {
        // Create new user
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            clerk_id: clerkUserId,
            email: email,
            full_name: fullName,
            avatar_url: avatarUrl,
            role: role, // Will be set from unsafeMetadata
          });

        if (insertError) {
          throw insertError;
        }

        console.log('User created:', clerkUserId);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error(`Error syncing profile from webhook (${eventType}):`, {
        clerkUserId,
        error: error.message || error,
        code: error.code,
      });

      return new Response(
        JSON.stringify({
          error: 'Failed to sync profile',
          details: error.message || 'Unknown error',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    // Mark user as deleted
    await supabaseAdmin
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('clerk_id', id);

    console.log('User deleted:', id);
  }

  return new Response('', { status: 200 });
}
