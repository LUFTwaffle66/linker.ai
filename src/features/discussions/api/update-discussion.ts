import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Discussion } from '@/types/api';
import { getDiscussionQueryOptions } from './get-discussion';

export type UpdateDiscussionDTO = {
  discussionId: string;
  data: {
    title?: string;
    body?: string;
  };
};

export const updateDiscussion = ({ discussionId, data }: UpdateDiscussionDTO): Promise<Discussion> => {
  return api.patch(`/discussions/${discussionId}`, data);
};

type UseUpdateDiscussionOptions = {
  onSuccess?: (discussion: Discussion) => void;
};

export const useUpdateDiscussion = ({ onSuccess }: UseUpdateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDiscussion,
    onSuccess: (discussion) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionQueryOptions(discussion.id).queryKey,
      });
      onSuccess?.(discussion);
    },
  });
};
