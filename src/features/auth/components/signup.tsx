'use client';

import { SignUp } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { LanguageSwitcherCompact } from '@/components/language-switcher-compact';

export function Signup() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const afterSignInUrl = `/${locale}/dashboard`;
  const afterSignUpUrl = `/${locale}/dashboard`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-cyan-500/5 flex items-center justify-center px-4 py-8">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcherCompact />
      </div>

      <SignUp
        routing="path"
        path={`/${locale}/signup`}
        signInUrl={`/${locale}/login`}
        afterSignInUrl={afterSignInUrl}
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
