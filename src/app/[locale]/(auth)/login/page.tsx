// src/app/[locale]/(auth)/login/page.tsx
import { SignIn } from '@clerk/nextjs';

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignIn routing="hash" afterSignInUrl={`/${locale}/dashboard`} />
    </div>
  );
}
