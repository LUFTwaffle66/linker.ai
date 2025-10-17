import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { type SignupFormData, type SignupResponse } from '../types';

export type SignupDTO = Omit<SignupFormData, 'confirmPassword'>;

export const signup = (data: SignupDTO): Promise<SignupResponse> => {
  return api.post('/auth/signup', data);
};

type UseSignupOptions = {
  onSuccess?: (data: SignupResponse) => void;
  onError?: (error: Error) => void;
};

export const useSignup = ({ onSuccess, onError }: UseSignupOptions = {}) => {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // Store token in localStorage or cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
      }
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('Signup error:', error);
      onError?.(error);
    },
  });
};
