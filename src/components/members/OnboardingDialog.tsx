"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberFormDialog } from "./MemberFormDialog";
import { Users } from "lucide-react";
import { useState } from "react";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface OnboardingDialogProps {
  open: boolean;
  onSave: (data: {
    name: string;
    role: "parent" | "child";
    color: string;
    avatar?: string;
  }) => { success: boolean; error?: string; member?: FamilyMember };
  hasDuplicateName: (name: string, excludeId?: string) => boolean;
}

export function OnboardingDialog({
  open,
  onSave,
  hasDuplicateName,
}: OnboardingDialogProps) {
  const [showForm, setShowForm] = useState(false);

  // When onboarding dialog opens, immediately show the form
  // The welcome screen is the dialog itself, form is embedded
  if (!open) return null;

  if (!showForm) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="items-center text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <DialogTitle className="text-xl">
              Willkommen beim Familiendashboard!
            </DialogTitle>
            <DialogDescription className="text-base">
              Richte zuerst deine Familie ein. Beginne damit, dich selbst als
              Elternteil hinzuzufuegen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Los geht&apos;s!
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <MemberFormDialog
      open={open}
      onOpenChange={() => {}}
      onSave={onSave}
      hasDuplicateName={hasDuplicateName}
      forceOpen
      forceParentRole
    />
  );
}
