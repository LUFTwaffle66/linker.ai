# Clerk Authentication Setup Guide

This application uses Clerk for authentication. Follow these steps to set up Clerk for your development environment.

## Prerequisites

- A Clerk account (sign up at [https://clerk.com](https://clerk.com))
- Node.js and pnpm installed

## Step 1: Create a Clerk Application

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Click "Create Application"
3. Choose a name for your application (e.g., "LinkerAI Dev")
4. Select the authentication methods you want to enable:
   - ✅ Email (required)
   - ✅ Password (required)
   - You can also enable social logins (Google, GitHub, etc.) if desired
5. Click "Create Application"

## Step 2: Get Your API Keys

1. In your Clerk Dashboard, navigate to "API Keys" in the left sidebar
2. Copy your **Publishable Key** (starts with `pk_test_...`)
3. Copy your **Secret Key** (starts with `sk_test_...`)

## Step 3: Configure Environment Variables

1. Open your `.env` file in the project root
2. Replace the placeholder values with your actual Clerk keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_actual_key_here"
CLERK_SECRET_KEY="sk_test_your_actual_key_here"
```

## Step 4: Set Up Clerk Webhook (Required for Profile Sync)

The application uses webhooks to automatically create user profiles in Supabase when users sign up with Clerk.

### 4.1 Get Your Webhook Endpoint URL

For local development, you'll need to expose your localhost to the internet. Use one of these options:

#### Option A: Using ngrok (Recommended for development)
```bash
# Install ngrok (if not already installed)
# Visit https://ngrok.com/download

# Start your Next.js dev server
pnpm dev

# In another terminal, expose your local server
ngrok http 3000

# ngrok will give you a URL like: https://abc123.ngrok.io
```

#### Option B: Using Cloudflare Tunnel
```bash
# Install cloudflared
# Visit https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Expose your local server
cloudflared tunnel --url http://localhost:3000
```

### 4.2 Configure Webhook in Clerk Dashboard

1. In your Clerk Dashboard, go to "Webhooks" in the left sidebar
2. Click "Add Endpoint"
3. Enter your webhook URL:
   - For local dev with ngrok: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - For production: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to these events:
   - ✅ `user.created` (required)
   - ✅ `user.updated` (recommended)
   - ✅ `user.deleted` (optional)
5. Click "Create"
6. Copy the **Signing Secret** (starts with `whsec_...`)

### 4.3 Add Webhook Secret to Environment

Add the webhook secret to your `.env` file:

```env
CLERK_WEBHOOK_SECRET="whsec_your_actual_secret_here"
```

## Step 5: Configure Clerk Settings (Optional but Recommended)

### Email Verification
By default, Clerk may require email verification. To adjust this:

1. Go to "Email, Phone, Username" in your Clerk Dashboard
2. Under "Email address", you can toggle "Verify at sign-up"
3. For development, you might want to disable this for easier testing

### User Metadata
The app stores the user role (client/freelancer) in Clerk's public metadata. This is configured automatically through the signup flow.

### Redirect URLs
The application is already configured with proper redirect URLs:
- After Sign In: `/{locale}/dashboard`
- After Sign Up: `/{locale}/dashboard`
- Sign In URL: `/{locale}/login`
- Sign Up URL: `/{locale}/signup`

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Visit `http://localhost:3000/en/signup`
3. Create a test account
4. Verify that:
   - You can sign up successfully
   - You're redirected to the dashboard
   - A profile is created in your Supabase `profiles` table

## Troubleshooting

### Issue: "Missing Clerk keys" error

**Solution**: Make sure you've added the Clerk keys to your `.env` file and restarted your dev server.

### Issue: User signs up but no profile is created in Supabase

**Possible causes**:
1. Webhook is not configured
2. Webhook secret is incorrect
3. Your local server is not accessible from the internet (if using ngrok/cloudflare)

**Solution**:
- Check webhook logs in Clerk Dashboard -> Webhooks -> Your Endpoint -> Logs
- Verify CLERK_WEBHOOK_SECRET is correct
- Ensure your webhook URL is publicly accessible

### Issue: "Invalid session" or authentication errors

**Solution**:
- Clear your browser cookies
- Sign out and sign in again
- Verify Clerk keys are correct

### Issue: Middleware redirects not working

**Solution**:
- Check that middleware.ts is using the correct Clerk middleware
- Verify protected routes are configured correctly
- Check browser console for errors

## Security Notes

1. **Never commit your `.env` file** - It contains sensitive API keys
2. **Use different Clerk instances for development and production**
3. **Rotate your API keys if they're ever exposed**
4. **Keep your webhook secret secure** - It validates webhook authenticity

## Production Deployment

For production:

1. Create a new Clerk application for production
2. Use production API keys (starts with `pk_live_...` and `sk_live_...`)
3. Update webhook endpoint to your production URL
4. Enable any additional security features in Clerk Dashboard

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Webhooks Guide](https://clerk.com/docs/integrations/webhooks)
- [Next.js 15 App Router with Clerk](https://clerk.com/docs/references/nextjs/overview)
