import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Discussion } from '@/types/api';
import { getDiscussionsQueryOptions } from './get-discussions';

export type CreateDiscussionDTO = {
  title: string;
  body: string;
};

export const createDiscussion = (data: CreateDiscussionDTO): Promise<Discussion> => {
  return api.post('/discussions', data);
};

type UseCreateDiscussionOptions = {
  onSuccess?: (discussion: Discussion) => void;
};

export const useCreateDiscussion = ({ onSuccess }: UseCreateDiscussionOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDiscussion,
    onSuccess: (discussion) => {
      queryClient.invalidateQueries({
        queryKey: getDiscussionsQueryOptions().queryKey,
      });
      onSuccess?.(discussion);
    },
  });
};
