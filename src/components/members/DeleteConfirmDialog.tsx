"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: FamilyMember | null;
  onConfirm: (id: string) => { success: boolean; error?: string };
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  member,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!member) return null;

  function handleConfirm() {
    const result = onConfirm(member!.id);
    if (result.success) {
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mitglied loeschen?</AlertDialogTitle>
          <AlertDialogDescription>
            Moechtest du <span className="font-semibold">{member.name}</span>{" "}
            wirklich aus der Familie entfernen? Alle zugehoerigen Aufgaben,
            Termine und Notizen werden ebenfalls geloescht. Diese Aktion kann
            nicht rueckgaengig gemacht werden.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Loeschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
