"use client";

import { FamilyMembersProvider, useFamilyMembers } from "@/hooks/useFamilyMembers";
import { Header } from "./Header";
import { OnboardingDialog } from "@/components/members/OnboardingDialog";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <FamilyMembersProvider>
      <AppShellContent>{children}</AppShellContent>
    </FamilyMembersProvider>
  );
}

function AppShellContent({ children }: AppShellProps) {
  const { members, isLoading, addMember, hasDuplicateName } = useFamilyMembers();
  const needsOnboarding = !isLoading && members.length === 0;

  return (
    <>
      <Header members={members} isLoading={isLoading} />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>

      {/* Onboarding dialog blocks the app when no members exist */}
      <OnboardingDialog
        open={needsOnboarding}
        onSave={addMember}
        hasDuplicateName={hasDuplicateName}
      />
    </>
  );
}
