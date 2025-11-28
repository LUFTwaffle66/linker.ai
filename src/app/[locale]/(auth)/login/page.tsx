"use client";

import { SignIn } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const basePath = `/${locale}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold leading-tight text-foreground">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary",
              card: "shadow-none border-0",
            },
          }}
          afterSignInUrl={`${basePath}/dashboard`}
          routing="path"
          path={`${basePath}/login`}
          signUpUrl={`${basePath}/signup`}
        />
      </div>
    </div>
  );
}
