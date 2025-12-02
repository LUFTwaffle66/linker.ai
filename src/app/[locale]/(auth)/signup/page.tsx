import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

import type { UserRole } from '@/features/auth/types/auth';

function resolveRole(typeParam: string | string[] | undefined): Extract<UserRole, 'freelancer' | 'client'> {
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;
  return type === 'client' ? 'client' : 'freelancer';
}

type SignupPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ params, searchParams }: SignupPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const role = resolveRole(resolvedSearchParams?.type);
  const afterSignUpUrl = `/${locale}/onboarding/${role}`;
  const loginUrl = `/${locale}/login?redirectTo=${encodeURIComponent(afterSignUpUrl)}`;

  const roleHref = (targetRole: Extract<UserRole, 'freelancer' | 'client'>) => {
    const query = new URLSearchParams({ type: targetRole });
    return `/${locale}/signup?${query.toString()}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-xl space-y-6 rounded-2xl bg-slate-900/70 p-6 shadow-xl ring-1 ring-white/10">
        <div className="space-y-3 text-center text-white">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-sm text-slate-200/80">
            Choose the account type that best matches how you plan to use Linker.
          </p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-slate-800/70 p-4 ring-1 ring-white/5">
          <p className="text-sm font-medium text-white">Select your account type</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {([
              { label: 'Freelancer', value: 'freelancer', description: 'Find and manage client projects.' },
              { label: 'Client', value: 'client', description: 'Hire freelancers and track work.' },
            ] as const).map((option) => {
              const isActive = role === option.value;
              return (
                <Link
                  key={option.value}
                  href={roleHref(option.value)}
                  className={`flex flex-col gap-1 rounded-lg border p-3 text-left transition hover:border-indigo-400/80 hover:bg-indigo-500/10 ${
                    isActive
                      ? 'border-indigo-400 bg-indigo-500/10 text-white'
                      : 'border-white/10 text-slate-100'
                  }`}
                >
                  <span className="text-base font-semibold">{option.label}</span>
                  <span className="text-xs text-slate-200/80">{option.description}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-inner">
          <SignUp
            routing="hash"
            forceRedirectUrl={afterSignUpUrl}
            signInUrl={loginUrl}
            unsafeMetadata={{ role }}
          />
        </div>
      </div>
    </div>
  );
}
