# Notifications Feature

Complete notification system with real-time updates, React Query hooks, and reusable components.

## 📁 Structure

```
src/features/notifications/
├── api/
│   └── notifications.ts          # Supabase API functions
├── hooks/
│   └── use-notifications.ts      # React Query hooks
├── components/
│   ├── notification-bell.tsx     # Bell icon with badge
│   ├── notification-list.tsx     # Dropdown notification list
│   ├── notification-item.tsx     # Single notification item
│   └── notification-toast.tsx    # Toast notifications
├── context/
│   └── notification-provider.tsx # Real-time subscription provider
├── utils/
│   └── notification-helpers.ts   # Helper functions for other features
├── types/
│   └── index.ts                  # TypeScript types
└── README.md
```

## 🚀 Setup

### 1. Run the Migration

```bash
supabase db push
```

This will create:
- `notifications` table
- `notification_preferences` table
- Helper functions (`create_notification`, `mark_notification_read`, etc.)
- Triggers for auto-creating preferences

### 2. Add NotificationProvider to Your App

In your root layout (`src/app/layout.tsx`):

```tsx
import { NotificationProvider } from '@/features/notifications';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 3. Add Notification Bell to Navbar

```tsx
import { NotificationBell } from '@/features/notifications';

export function Navbar() {
  return (
    <nav>
      {/* Other nav items */}
      <NotificationBell />
    </nav>
  );
}
```

## 📖 Usage

### Displaying Notifications

#### Notification Bell (with dropdown)
```tsx
import { NotificationBell } from '@/features/notifications';

// Shows unread count badge and dropdown list
<NotificationBell />
```

#### Standalone Notification List
```tsx
import { NotificationList } from '@/features/notifications';

// Full notification list component
<NotificationList />
```

### Fetching Notifications

#### Get all notifications
```tsx
import { useNotifications } from '@/features/notifications';

function MyComponent() {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div>
      {notifications?.map(n => <div key={n.id}>{n.title}</div>)}
    </div>
  );
}
```

#### Get unread count
```tsx
import { useUnreadCount } from '@/features/notifications';

function NotificationBadge() {
  const { data: count = 0 } = useUnreadCount();

  return <span>{count}</span>;
}
```

#### Filter notifications
```tsx
import { useNotifications } from '@/features/notifications';

function PaymentNotifications() {
  const { data: notifications } = useNotifications({
    category: 'payment',
    is_read: false,
    limit: 10
  });

  return <div>...</div>;
}
```

### Managing Notifications

#### Mark as read
```tsx
import { useMarkAsRead } from '@/features/notifications';

function NotificationItem({ notification }) {
  const { mutate: markAsRead } = useMarkAsRead();

  return (
    <div onClick={() => markAsRead(notification.id)}>
      {notification.title}
    </div>
  );
}
```

#### Mark all as read
```tsx
import { useMarkAllAsRead } from '@/features/notifications';

function MarkAllButton() {
  const { mutate: markAllAsRead } = useMarkAllAsRead();

  return (
    <button onClick={() => markAllAsRead()}>
      Mark all as read
    </button>
  );
}
```

#### Delete notification
```tsx
import { useDeleteNotification } from '@/features/notifications';

function DeleteButton({ notificationId }) {
  const { mutate: deleteNotification } = useDeleteNotification();

  return (
    <button onClick={() => deleteNotification(notificationId)}>
      Delete
    </button>
  );
}
```

## 🔔 Creating Notifications from Other Features

### Using Helper Functions

Import the helper functions in your feature modules:

```tsx
import {
  notifyProposalAccepted,
  notifyUpfrontPaymentSecured,
  notifyNewMessage
} from '@/features/notifications/utils/notification-helpers';

// When a proposal is accepted
await notifyProposalAccepted({
  freelancerId: proposal.freelancer_id,
  clientId: project.client_id,
  clientName: client.full_name,
  projectId: project.id,
  proposalId: proposal.id,
  projectTitle: project.title,
});

// When payment is received
await notifyUpfrontPaymentSecured({
  freelancerId: project.freelancer_id,
  projectId: project.id,
  projectTitle: project.title,
  amount: 6000,
});

// When a message is sent
await notifyNewMessage({
  recipientId: recipientUser.id,
  senderId: currentUser.id,
  senderName: currentUser.full_name,
  conversationId: conversation.id,
  messagePreview: 'Hi, I have a question...',
});
```

### Direct API Call

For custom notifications:

```tsx
import { createNotification } from '@/features/notifications';

await createNotification({
  user_id: 'user-uuid',
  category: 'system',
  type: 'project_posted',
  title: 'Welcome to LinkerAI!',
  message: 'Your account has been created successfully.',
  action_url: '/dashboard',
  metadata: { isWelcome: true }
});
```

### From Backend/API Routes

```tsx
// app/api/proposals/accept/route.ts
import { createNotification } from '@/features/notifications/api/notifications';

export async function POST(req: Request) {
  // ... accept proposal logic

  // Notify freelancer
  await createNotification({
    user_id: proposal.freelancer_id,
    category: 'proposal',
    type: 'proposal_accepted',
    title: 'Proposal Accepted!',
    message: `Your proposal for "${project.title}" was accepted.`,
    project_id: project.id,
    proposal_id: proposal.id,
    actor_id: client.id,
    action_url: `/projects/${project.id}`,
  });

  return Response.json({ success: true });
}
```

## 🔄 Real-Time Updates

The `NotificationProvider` automatically subscribes to real-time notification updates using Supabase subscriptions.

When a new notification arrives:
1. ✅ Toast notification is shown
2. ✅ Notification bell badge updates
3. ✅ React Query cache is invalidated
4. ✅ Notification list refreshes

No additional setup needed!

## 🎨 Notification Categories & Icons

| Category | Icon | Color |
|----------|------|-------|
| `project_opportunity` | Briefcase | Blue |
| `proposal` | FileText | Purple |
| `contract` | Briefcase | Green |
| `payment` | DollarSign | Emerald |
| `message` | MessageSquare | Cyan |
| `review` | Star | Yellow |
| `system` | AlertCircle | Gray |

## 📊 Notification Preferences

Users can control which categories they want to receive:

```tsx
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences
} from '@/features/notifications';

function NotificationSettings() {
  const { data: preferences } = useNotificationPreferences();
  const { mutate: updatePreferences } = useUpdateNotificationPreferences();

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preferences?.inapp_payments}
          onChange={(e) => updatePreferences({
            user_id: userId,
            inapp_payments: e.target.checked
          })}
        />
        Payment notifications
      </label>
      {/* More preferences... */}
    </div>
  );
}
```

## 🛠️ Available Helper Functions

### Project Notifications
- `notifyProjectPosted()` - Client posted a new project
- `notifyProjectMatchSkills()` - Project matches freelancer skills

### Proposal Notifications
- `notifyProposalSubmitted()` - Freelancer submitted proposal
- `notifyNewProposal()` - Client received new proposal
- `notifyProposalAccepted()` - Proposal was accepted
- `notifyProposalDeclined()` - Proposal was declined

### Payment Notifications
- `notifyUpfrontPaymentSecured()` - 50% upfront paid
- `notifyFinalPaymentReleased()` - 50% final payment released
- `notifyUpfrontPaymentSuccessful()` - Client payment confirmed

### Contract Notifications
- `notifyContractStarted()` - Project started
- `notifyContractEnded()` - Project completed

### Message Notifications
- `notifyNewMessage()` - New message received

### Review Notifications
- `notifyReviewReceived()` - New review posted

## 🔧 Advanced Usage

### Custom Filters
```tsx
const { data: notifications } = useNotifications({
  category: 'proposal',
  is_read: false,
  limit: 20,
  offset: 0
});
```

### Get Statistics
```tsx
import { useNotificationStats } from '@/features/notifications';

const { data: stats } = useNotificationStats();
// stats.total, stats.unread, stats.by_category
```

### Archive Old Notifications (Admin)
```sql
SELECT cleanup_old_notifications(30); -- Delete archived notifications older than 30 days
```

## 📝 Database Functions

Available Supabase functions:

- `create_notification()` - Create new notification
- `mark_notification_read(notification_id)` - Mark as read
- `mark_all_notifications_read()` - Bulk mark as read
- `get_unread_notification_count()` - Get unread count
- `archive_notification(notification_id)` - Archive notification
- `cleanup_old_notifications(days)` - Delete old notifications

## 🎯 Examples from Other Features

### In Proposals Feature
```tsx
// src/features/proposals/api/proposals.ts
import { notifyNewProposal, notifyProposalSubmitted } from '@/features/notifications/utils/notification-helpers';

export async function submitProposal(data: ProposalData) {
  const { data: proposal } = await supabase
    .from('proposals')
    .insert(data)
    .select()
    .single();

  // Notify freelancer
  await notifyProposalSubmitted({
    freelancerId: data.freelancer_id,
    projectId: data.project_id,
    proposalId: proposal.id,
    projectTitle: project.title,
  });

  // Notify client
  await notifyNewProposal({
    clientId: project.client_id,
    freelancerId: data.freelancer_id,
    freelancerName: freelancer.full_name,
    projectId: data.project_id,
    proposalId: proposal.id,
    projectTitle: project.title,
  });

  return proposal;
}
```

### In Projects Feature
```tsx
// src/features/projects/api/projects.ts
import { notifyProjectPosted } from '@/features/notifications/utils/notification-helpers';

export async function publishProject(projectId: string) {
  await supabase
    .from('projects')
    .update({ is_published: true })
    .eq('id', projectId);

  await notifyProjectPosted({
    clientId: project.client_id,
    projectId: project.id,
    projectTitle: project.title,
  });
}
```

## 🚀 Best Practices

1. **Always use helper functions** instead of calling `createNotification` directly
2. **Include action URLs** so users can navigate to relevant pages
3. **Add metadata** for additional context
4. **Keep messages concise** - under 100 characters
5. **Use actor_id** when someone triggers the notification
6. **Test real-time updates** in development mode

## 🐛 Troubleshooting

### Notifications not appearing?
- Check if NotificationProvider is in your app layout
- Verify user is authenticated
- Check notification_preferences table

### Real-time not working?
- Ensure Supabase realtime is enabled
- Check browser console for subscription errors
- Verify RLS policies allow reading notifications

### Unread count not updating?
- The hook polls every 30 seconds by default
- Real-time subscriptions will update immediately
- Check if notifications are being marked as read correctly

## 📚 Related Documentation

- [Notifications.md](../../../../notifications.md) - Original specification
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [React Query](https://tanstack.com/query/latest)
