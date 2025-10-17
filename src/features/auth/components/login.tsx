'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Briefcase, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin } from '../api/login';
import { type UserType } from '../types';
import { loginSchema, type LoginFormData } from '../lib/validations';
import { toast } from 'sonner';
import { paths } from '@/config/paths';

interface LoginProps {
  onNavigate?: (screen: string) => void;
  onLogin?: (userType: UserType) => void;
}

export function Login({ onNavigate, onLogin }: LoginProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserType>('freelancer');

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useLogin({
    onSuccess: (data) => {
      toast.success('Welcome back!');
      console.log('Login successful:', data);
      onLogin?.(activeTab);
      router.push(paths.app.dashboard.getHref());
    },
    onError: (error) => {
      toast.error('Invalid email or password. Please try again.');
      console.error('Login failed:', error);
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
      userType: activeTab,
      rememberMe: data.rememberMe,
    });
  };

  const handleSignupClick = () => {
    if (onNavigate) {
      onNavigate('signup');
    } else {
      router.push(paths.auth.signup.getHref());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <h1 className="text-3xl mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to LinkerAI to continue</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as UserType)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="freelancer" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>AI Expert</span>
                </TabsTrigger>
                <TabsTrigger value="client" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Client</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...form.register('password')}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={form.watch('rememberMe')}
                  onCheckedChange={(checked) => form.setValue('rememberMe', checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button
                type="button"
                onClick={handleSignupClick}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </div>

            {activeTab === 'freelancer' && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  🚀 Join 10,000+ AI automation experts earning an average of $125/hour
                </p>
              </div>
            )}

            {activeTab === 'client' && (
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  💼 Access vetted AI experts and automate your business processes today
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{' '}
          <Link href={paths.public.terms.getHref()} className="text-primary hover:underline">
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link href={paths.public.privacy.getHref()} className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
