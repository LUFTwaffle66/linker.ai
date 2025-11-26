import { SignIn } from '@clerk/nextjs';

type LoginPageProps = {
  params: { locale: string };
};

export default function LoginPage({ params }: LoginPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <SignIn redirectUrl={`/${params.locale}/dashboard`} />
    </div>
  );
}
