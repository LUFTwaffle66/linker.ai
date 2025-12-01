import { SignUp } from '@clerk/nextjs';

type SignupPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignUp routing="hash" afterSignUpUrl={`/${locale}/dashboard`} />
    </div>
  );
}
