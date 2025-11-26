import { SignUp } from '@clerk/nextjs';

type SignupPageProps = {
  params: { locale: string };
};

export default function SignupPage({ params }: SignupPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignUp redirectUrl={`/${params.locale}/dashboard`} />
    </div>
  );
}
