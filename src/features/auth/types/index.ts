export type UserType = 'freelancer' | 'client';

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName?: string;
  userType: UserType;
}

export interface SignupResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    userType: UserType;
    companyName?: string;
  };
  token: string;
  isNewUser?: boolean;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    userType: UserType;
    companyName?: string;
  };
  token: string;
  isNewUser?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  companyName?: string;
}
