import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage, markAsRead } from '../api/messaging';
import type { SendMessageFormData } from '../types';
import { messagingKeys } from './use-conversations';

/**
 * Hook to fetch messages for a conversation
 * @param conversationId - The conversation ID
 */
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: messagingKeys.messages(conversationId || ''),
    queryFn: () => getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendMessageFormData) => sendMessage(data),
    onSuccess: (newMessage) => {
      // Add the new message to the messages cache
      queryClient.setQueryData(
        messagingKeys.messages(newMessage.conversationId),
        (old: any) => {
          if (!old) return [newMessage];
          return [...old, newMessage];
        }
      );

      // Invalidate conversations to update last message and timestamp
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });

      // Invalidate the specific conversation
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversation(newMessage.conversationId),
      });
    },
  });
}

/**
 * Hook to mark messages as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => markAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      // Update messages cache
      queryClient.invalidateQueries({
        queryKey: messagingKeys.messages(conversationId),
      });

      // Update conversations cache to reset unread count
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });

      // Update specific conversation
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversation(conversationId),
      });
    },
  });
}
