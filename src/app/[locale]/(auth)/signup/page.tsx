"use client";

import { useMemo, useState } from "react";
import { SignUp } from "@clerk/nextjs";
import { useParams } from "next/navigation";

import { RoleSelector, type RoleOption } from "@/components/clerk/role-selector";

export default function SignupPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const [role, setRole] = useState<RoleOption | null>(null);
  const basePath = useMemo(() => `/${locale}`, [locale]);

  const afterSignUpUrl = role
    ? `${basePath}/onboarding/${role === "client" ? "client" : "freelancer"}`
    : `${basePath}/onboarding/client`;

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
        <div className="w-full max-w-5xl rounded-2xl border bg-card/80 p-10 shadow-xl backdrop-blur">
          <RoleSelector onSelect={setRole} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-card/80 p-6 shadow-xl backdrop-blur">
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">You selected {role === "client" ? "Company / Client" : "Freelancer"}</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-foreground">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Finish signing up with Clerk to continue.</p>
        </div>

        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary",
              card: "shadow-none border-0",
            },
          }}
          afterSignUpUrl={afterSignUpUrl}
          routing="path"
          path={`${basePath}/signup`}
          signInUrl={`${basePath}/login`}
          unsafeMetadata={{ role }}
        />
      </div>
    </div>
  );
}
