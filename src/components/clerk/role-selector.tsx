"use client";

import type { ReactNode } from "react";
import { Bot, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoleOption = "freelancer" | "client";

interface RoleSelectorProps {
  onSelect: (role: RoleOption) => void;
}

const roles: Array<{
  role: RoleOption;
  title: string;
  description: string;
  icon: ReactNode;
  perks: string[];
}> = [
  {
    role: "freelancer",
    title: "Freelancer",
    description: "Find projects that match your skills and get hired faster.",
    icon: <Bot className="h-6 w-6" />,
    perks: ["Browse curated projects", "Secure contracts and payouts", "Message clients directly"],
  },
  {
    role: "client",
    title: "Company / Client",
    description: "Post projects and hire vetted talent for your next build.",
    icon: <Briefcase className="h-6 w-6" />,
    perks: ["Post projects in minutes", "Manage proposals in one place", "Track deliverables with ease"],
  },
];

export function RoleSelector({ onSelect }: RoleSelectorProps) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Step 1 of 2</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Choose how you want to use Linkerai
        </h1>
        <p className="mt-2 text-muted-foreground">
          We will tailor your experience based on your selection. You can update this later in settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((item) => (
          <button
            key={item.role}
            type="button"
            onClick={() => onSelect(item.role)}
            className={cn(
              "group flex h-full flex-col rounded-2xl border bg-card p-6 text-left shadow-sm transition",
              "hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline-none",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground">
                <span className="text-primary">{item.icon}</span>
                {item.title}
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {item.role === "freelancer" ? "Work" : "Hire"}
              </span>
            </div>

            <p className="mt-4 text-base text-muted-foreground">{item.description}</p>

            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {item.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                  {perk}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <div className="w-full rounded-lg border border-primary bg-primary/10 px-4 py-3 text-center font-medium text-primary">
                {item.role === "freelancer" ? "I want to freelance" : "I want to hire"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
