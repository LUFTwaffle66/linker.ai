'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/lib/auth-client';
import { subscribeToNotifications } from '../api/notifications';
import { showNotificationToast } from '../components/notification-toast';
import { notificationKeys } from '../hooks/use-notifications';
import type { Notification } from '../types';

interface NotificationContextType {
  latestNotification: Notification | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to real-time notification updates
    const unsubscribe = subscribeToNotifications(user.id, (notification) => {
      // Update latest notification
      setLatestNotification(notification);

      // Show toast
      showNotificationToast(notification);

      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id, queryClient]);

  return (
    <NotificationContext.Provider value={{ latestNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}
