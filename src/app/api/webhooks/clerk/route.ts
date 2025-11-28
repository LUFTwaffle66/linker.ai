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

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;

    // Create profile in Supabase
    const { error } = await supabaseAdmin.from('profiles').insert({
      clerk_user_id: id,
      email: email_addresses[0]?.email_address,
      full_name: first_name && last_name ? `${first_name} ${last_name}` : null,
      avatar_url: image_url,
      role: (public_metadata?.role as string) || null,
    });

    if (error) {
      console.error('Error creating profile:', error);
      return new Response('Error: Failed to create profile', {
        status: 500,
      });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, public_metadata } = evt.data;

    // Update profile in Supabase
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        email: email_addresses[0]?.email_address,
        full_name: first_name && last_name ? `${first_name} ${last_name}` : null,
        avatar_url: image_url,
        role: (public_metadata?.role as string) || null,
      })
      .eq('clerk_user_id', id);

    if (error) {
      console.error('Error updating profile:', error);
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    // Soft delete or handle cleanup
    // For now, we'll just log it
    console.log('User deleted:', id);
    // You may want to mark the profile as deleted instead of removing it
  }

  return new Response('', { status: 200 });
}
