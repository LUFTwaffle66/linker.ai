/**
 * React Query Hooks for Notifications
 * RLS policies automatically filter data by auth.uid()
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/lib/auth-client';
import {
  fetchNotifications,
  fetchUnreadCount,
  fetchNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  deleteNotification,
  createNotification,
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '../api/notifications';
import type {
  NotificationFilters,
  CreateNotificationRequest,
  NotificationPreferences,
} from '../types';

/**
 * Query keys for notifications
 */
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

/**
 * Hook to fetch notifications with optional filters
 * RLS automatically filters by current user
 */
export function useNotifications(filters?: NotificationFilters) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => fetchNotifications(filters),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch unread notification count
 * RLS automatically filters by current user
 */
export function useUnreadCount() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: fetchUnreadCount,
    enabled: isAuthenticated,
    staleTime: 10 * 1000, // 10 seconds - refresh frequently for badge
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
}

/**
 * Hook to fetch notification statistics
 * RLS automatically filters by current user
 */
export function useNotificationStats() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: fetchNotificationStats,
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      const previousNotifications = queryClient.getQueryData(notificationKeys.lists());

      // Update all notification lists
      queryClient.setQueriesData({ queryKey: notificationKeys.lists() }, (old: any) => {
        if (!old) return old;
        return old.map((notification: any) =>
          notification.id === notificationId
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        );
      });

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.lists(), context.previousNotifications);
      }
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to archive a notification
 */
export function useArchiveNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
    onMutate: async (notificationId) => {
      // Optimistic update - remove from list immediately
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      const previousNotifications = queryClient.getQueryData(notificationKeys.lists());

      queryClient.setQueriesData({ queryKey: notificationKeys.lists() }, (old: any) => {
        if (!old) return old;
        return old.filter((notification: any) => notification.id !== notificationId);
      });

      return { previousNotifications };
    },
    onError: (err, notificationId, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.lists(), context.previousNotifications);
      }
    },
  });
}

/**
 * Hook to create a notification (admin/system use)
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateNotificationRequest) => createNotification(request),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to fetch notification preferences
 * RLS automatically filters by current user
 */
export function useNotificationPreferences() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: fetchNotificationPreferences,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: Partial<NotificationPreferences>) =>
      updateNotificationPreferences(preferences),
    onSuccess: (updatedPreferences) => {
      // Update cache with new preferences
      queryClient.setQueryData(notificationKeys.preferences(), updatedPreferences);
    },
  });
}
