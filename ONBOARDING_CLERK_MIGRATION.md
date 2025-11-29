# Clerk Onboarding Updates

## Scope
This update aligns onboarding and profile storage with Clerk user IDs rather than legacy Supabase auth UUIDs.

## Key changes
- Onboarding utilities and API routes now read/write `clerk_user_id` in `client_profiles` and `freelancer_profiles`.
- Route handler auth uses Clerk (`auth()`/`currentUser`) and looks up roles via the `profiles` table or Clerk metadata.
- The API client normalizes its base URL so browser calls always target `/api/...` without locale prefixes.
- Profile APIs query `profiles`, `client_profiles`, and `freelancer_profiles` by `clerk_user_id`.

## How to test
1. Set `NEXT_PUBLIC_API_URL` to an absolute URL or `/api` (default normalization will prefix a missing slash).
2. Run the app and sign up via Clerk.
3. Complete freelancer onboarding:
   - Submit the form; the request should hit `POST /api/onboarding/freelancer` (no `/en` prefix) and create a `freelancer_profiles` row with `clerk_user_id` set to the Clerk `userId`.
4. Fetch onboarding/profile data and confirm lookups use `clerk_user_id` without 400/404 errors.
