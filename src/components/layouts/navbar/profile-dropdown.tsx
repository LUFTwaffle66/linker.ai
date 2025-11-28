'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export function ProfileDropdown() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const router = useRouter();
  const loginPath = `/${locale}/login`;

  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              rootBox: 'w-10 h-10',
            },
          }}
          signInUrl={loginPath}
          afterSignOutUrl={loginPath}
        />
      </SignedIn>
      <SignedOut>
        <Button variant="outline" onClick={() => router.push(loginPath)}>
          Sign in
        </Button>
      </SignedOut>
    </div>
  );
}
