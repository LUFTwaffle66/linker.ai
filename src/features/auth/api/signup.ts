import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '../types/auth';

export interface SignupDTO {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  companyName?: string;
}

export const signup = async (data: SignupDTO) => {
  // Create auth user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        role: data.role,
        company_name: data.companyName,
      },
    },
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error('Failed to create user');

  // Create user profile in users table
  const { error: profileError } = await supabase.from('users').insert({
    id: authData.user.id,
    email: data.email,
    full_name: data.fullName,
    role: data.role,
    company_name: data.companyName || null,
    password_hash: '', // Supabase Auth handles passwords
  });

  if (profileError) throw new Error(profileError.message);

  return authData;
};

type UseSignupOptions = {
  onSuccess?: (data: any, variables: SignupDTO) => void | Promise<void>;
  onError?: (error: Error) => void;
};

export const useSignup = ({ onSuccess, onError }: UseSignupOptions = {}) => {
  return useMutation({
    mutationFn: signup,
    onSuccess,
    onError: (error: Error) => {
      console.error('Signup error:', error);
      onError?.(error);
    },
  });
};
