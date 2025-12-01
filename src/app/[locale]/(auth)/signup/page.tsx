import { SignUp } from '@clerk/nextjs';

type SignupPageProps = {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export default function SignupPage({ params, searchParams }: SignupPageProps) {
  const { locale } = params;
  const typeParam = searchParams?.type;
  const type = Array.isArray(typeParam) ? typeParam[0] : typeParam;
  const userType = type === 'client' ? 'client' : 'freelancer';
  const afterSignUpUrl = `/${locale}/onboarding/${userType}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignUp
        routing="hash"
        afterSignUpUrl={afterSignUpUrl}
        forceRedirectUrl={afterSignUpUrl}
        signInUrl={`/${locale}/login`}
        unsafeMetadata={{ role: userType }}
      />
    </div>
  );
}
