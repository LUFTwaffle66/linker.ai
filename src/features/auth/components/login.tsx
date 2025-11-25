'use client';

import { SignIn } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { LanguageSwitcherCompact } from '@/components/language-switcher-compact';

export function Login() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const afterSignInUrl = `/${locale}/dashboard`;
  const afterSignUpUrl = `/${locale}/signup`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 flex items-center justify-center px-4 py-8">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcherCompact />
      </div>

      <SignIn
        routing="path"
        path={`/${locale}/login`}
        afterSignInUrl={afterSignInUrl}
        signUpUrl={`/${locale}/signup`}
        afterSignUpUrl={afterSignUpUrl}
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
          },
        }}
      />
    </div>
  );
}
