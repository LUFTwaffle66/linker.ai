'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const locale = params?.locale ?? 'en';

  useEffect(() => {
    // Redirect to login page - Clerk handles password reset
    router.push(`/${locale}/login`);
  }, [locale, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Redirecting...</CardTitle>
          <CardDescription>
            Password reset is handled through the login page
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
