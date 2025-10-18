import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  getConversation,
  updateConversationSettings,
  deleteConversation,
  searchConversations,
} from '../api/messaging';
import type { ConversationSettings } from '../types';

export const messagingKeys = {
  all: ['messaging'] as const,
  conversations: () => [...messagingKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messagingKeys.conversations(), id] as const,
  messages: (conversationId: string) => [...messagingKeys.all, 'messages', conversationId] as const,
  search: (query: string) => [...messagingKeys.conversations(), 'search', query] as const,
};

/**
 * Hook to fetch all conversations
 */
export function useConversations() {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: getConversations,
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
}

/**
 * Hook to fetch a single conversation
 * @param conversationId - The conversation ID
 */
export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: messagingKeys.conversation(conversationId),
    queryFn: () => getConversation(conversationId),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to update conversation settings (mute, star, block)
 */
export function useUpdateConversationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      settings,
    }: {
      conversationId: string;
      settings: Partial<ConversationSettings>;
    }) => updateConversationSettings(conversationId, settings),
    onSuccess: (updatedConversation) => {
      // Update the specific conversation in cache
      queryClient.setQueryData(
        messagingKeys.conversation(updatedConversation.id),
        updatedConversation
      );

      // Invalidate the conversations list to reflect changes
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });
    },
  });
}

/**
 * Hook to delete a conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => deleteConversation(conversationId),
    onSuccess: (_, conversationId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: messagingKeys.conversation(conversationId),
      });

      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });

      // Remove messages for this conversation
      queryClient.removeQueries({
        queryKey: messagingKeys.messages(conversationId),
      });
    },
  });
}

/**
 * Hook to search conversations
 * @param query - Search query
 */
export function useSearchConversations(query: string) {
  return useQuery({
    queryKey: messagingKeys.search(query),
    queryFn: () => searchConversations(query),
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds
  });
}
