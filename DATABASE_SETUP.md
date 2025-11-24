# LinkerAI Database Setup - New Supabase Project

This document describes the database setup for the fresh Supabase project.

## Environment Configuration

The application is now connected to a new Supabase project with the following credentials (stored in `.env`):

```
NEXT_PUBLIC_SUPABASE_URL=https://oeyfrqdockjjfyhlcrxr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from .env>
SUPABASE_SERVICE_ROLE_KEY=<service role key from .env>
```

## Database Schema

The database has been set up with 14 tables across 8 migrations:

### Core Tables

1. **users** - User accounts with role-based authentication (admin, client, freelancer)
2. **client_profiles** - Client-specific profile data (company info, project goals)
3. **freelancer_profiles** - Freelancer profiles (skills, portfolio, rates, work experience)

### Project Management

4. **projects** - Project postings with fixed-price budgets
5. **proposals** - Freelancer proposals for projects
6. **project_deliverables** - Work submissions and deliverables

### Messaging System

7. **conversations** - Chat conversations between users
8. **conversation_participants** - Participants in conversations
9. **messages** - Individual chat messages

### Notifications

10. **notifications** - In-app notifications with categorization
11. **notification_preferences** - User notification settings

### Payment System (Stripe)

12. **stripe_accounts** - Connected Stripe accounts for freelancers
13. **payment_intents** - Payment intents for escrow
14. **transfers** - Payouts to freelancers
15. **payment_transactions** - Transaction history

## Applied Migrations

The following migrations were successfully applied:

1. `002_create_profile_tables.sql` - Client and freelancer profiles
2. `003_create_projects_and_proposals.sql` - Projects, proposals, and search functionality
3. `004_create_deliverables.sql` - Project deliverables tracking
4. `005_create_messaging_system.sql` - Conversations and messages
5. `006_create_notifications_system.sql` - Notifications with ENUM types
6. `007_create_stripe_payment_tables.sql` - Stripe payment infrastructure
7. `008_add_notification_functions.sql` - Notification helper functions

## Key Features

### Row Level Security (RLS)

- **Disabled**: users, client_profiles, freelancer_profiles (using custom auth)
- **Enabled with Policies**: projects, proposals, deliverables, conversations, messages, notifications, stripe tables

### Database Functions

- `update_updated_at_column()` - Auto-updates timestamps on row updates
- `user_has_role(user_id, role)` - Checks if user has specific role
- `get_user_role(user_id)` - Returns user's role
- `get_client_profile(user_id)` - Retrieves client profile
- `get_freelancer_profile(user_id)` - Retrieves freelancer profile
- `create_or_get_conversation(user1_id, user2_id)` - Creates or gets conversation
- `update_project_search_vector()` - Updates full-text search on projects
- `create_notification(...)` - Creates notification with preference checks
- `mark_notification_read(notification_id)` - Marks notification as read
- `mark_all_notifications_read()` - Marks all user notifications as read
- `get_unread_notification_count()` - Gets unread count
- `archive_notification(notification_id)` - Archives notification
- `cleanup_old_notifications(days)` - Deletes old archived notifications

### Triggers

- Auto-update timestamps on all tables
- Project published date tracking
- Proposal count management
- Full-text search vector updates
- Default notification preferences creation for new users

### Full-Text Search

Projects table includes a `search_vector` column with tsvector indexing for searching by:
- Title (weight A - highest)
- Description (weight B)
- Skills (weight C)

## TypeScript Type Compatibility

All TypeScript interfaces in the codebase match the database schema:

- `User` interface → users table
- `ClientProfileData` → client_profiles table
- `FreelancerProfileData` → freelancer_profiles table
- Projects, proposals, messages, notifications types all align with their respective tables

## Testing Database Connection

The application successfully builds and connects to the new database. You can verify the connection by:

1. Starting the dev server (already running automatically)
2. Creating a test user via the signup page
3. Checking that profile data is properly saved

## Notes

- The `users` table has RLS disabled because the app uses custom authentication, not Supabase Auth
- All password hashing is handled at the application layer
- Notification preferences are automatically created for new users via trigger
- Full-text search is automatically maintained via trigger on projects table
- All foreign key constraints and cascading deletes are properly configured
