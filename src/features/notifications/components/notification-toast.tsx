'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { Notification } from '../types';

interface NotificationToastProps {
  notification: Notification;
}

/**
 * Display a toast notification
 * Use this for real-time notifications that come in via Supabase subscriptions
 */
export function showNotificationToast(notification: Notification) {
  toast(notification.title, {
    description: notification.message,
    action: notification.action_url
      ? {
          label: 'View',
          onClick: () => {
            window.location.href = notification.action_url!;
          },
        }
      : undefined,
    duration: 5000,
  });
}

/**
 * Component to handle showing toasts for new notifications
 */
export function NotificationToastHandler() {
  // This will be used by the NotificationProvider
  // to show toasts when new notifications arrive
  return null;
}
