import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface LoginDTO {
  email: string;
  password: string;
}

export const login = async (data: LoginDTO) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
};

type UseLoginOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError: (error: Error) => {
      console.error('Login error:', error);
      onError?.(error);
    },
  });
};
