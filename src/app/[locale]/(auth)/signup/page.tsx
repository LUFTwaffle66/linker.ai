// src/app/[locale]/(auth)/signup/page.tsx
import { SignUp } from '@clerk/nextjs';
import type { UserRole } from '@/features/auth/types/auth';
import { RoleSelection } from '@/features/auth/components/role-selection';

function resolveRole(typeParam: string | string[] | undefined): Extract<UserRole, 'freelancer' | 'client'> {
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;
  return type === 'client' ? 'client' : 'freelancer';
}

type SignupPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ params, searchParams }: SignupPageProps) {
  // Await both params to avoid the sync access error
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  // If no type parameter, show role selection
  if (!resolvedSearchParams?.type) {
    return <RoleSelection locale={locale} />;
  }

  // User has selected a role, show Clerk signup
  const role = resolveRole(resolvedSearchParams.type);
  const afterSignUpUrl = `/${locale}/onboarding/${role}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center text-white">
          <h1 className="text-3xl font-bold">
            {role === 'freelancer' ? 'Freelancer' : 'Client'} Signup
          </h1>
          <p className="text-sm text-slate-300">
            Create your account to get started
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xl">
          <SignUp
            routing="hash"
            afterSignUpUrl={afterSignUpUrl}
            signInUrl={`/${locale}/login`}
            unsafeMetadata={{ role }}
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none',
              },
            }}
          />
        </div>

        <div className="text-center">
          <a
            href={`/${locale}/signup`}
            className="text-sm text-slate-400 hover:text-slate-300"
          >
            ← Choose a different role
          </a>
        </div>
      </div>
    </div>
  );
}
