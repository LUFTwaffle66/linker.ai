import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { getDiscussionsQueryOptions } from './get-discussions';

export const deleteDiscussion = ({ discussionId }: { discussionId: string }): Promise<void> => {
  return api.delete(`/discussions/${discussionId}`);
};

type UseDeleteDiscussionOptions = {
  onSuccess?: () => void;
};

export const useDeleteDiscussion = ({ onSuccess }: UseDeleteDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      onSuccess?.();
    },
  });
};
