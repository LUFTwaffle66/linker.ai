import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { type SignupResponse, type UserType } from '../types';

export interface LoginDTO {
  email: string;
  password: string;
  userType: UserType;
  rememberMe?: boolean;
}

export const login = (data: LoginDTO): Promise<SignupResponse> => {
  return api.post('/auth/login', data);
};

type UseLoginOptions = {
  onSuccess?: (data: SignupResponse) => void;
  onError?: (error: Error) => void;
};

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store token in localStorage or cookie
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token);
      }
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      onError?.(error);
    },
  });
};
