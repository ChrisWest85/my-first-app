"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MEMBER_COLORS, type FamilyMember } from "@/hooks/useFamilyMembers";
import { AlertTriangle } from "lucide-react";

interface MemberFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: FamilyMember | null;
  onSave: (data: {
    name: string;
    role: "parent" | "child";
    color: string;
    avatar?: string;
  }) => { success: boolean; error?: string };
  hasDuplicateName: (name: string, excludeId?: string) => boolean;
  /** If true, the dialog cannot be dismissed (used during onboarding) */
  forceOpen?: boolean;
  /** If true, only parent role is allowed (used during onboarding) */
  forceParentRole?: boolean;
}

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
  onSave,
  hasDuplicateName,
  forceOpen = false,
  forceParentRole = false,
}: MemberFormDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"parent" | "child">("parent");
  const [color, setColor] = useState<string>(MEMBER_COLORS[0]);
  const [formError, setFormError] = useState<string | null>(null);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  const isEditing = !!member;

  // Reset form when dialog opens or member changes
  useEffect(() => {
    if (open) {
      if (member) {
        setName(member.name);
        setRole(member.role);
        setColor(member.color);
      } else {
        setName("");
        setRole(forceParentRole ? "parent" : "parent");
        setColor(MEMBER_COLORS[0]);
      }
      setFormError(null);
      setShowDuplicateWarning(false);
    }
  }, [open, member, forceParentRole]);

  // Check for duplicate names in real-time
  useEffect(() => {
    if (name.trim().length > 0) {
      setShowDuplicateWarning(hasDuplicateName(name, member?.id));
    } else {
      setShowDuplicateWarning(false);
    }
  }, [name, member?.id, hasDuplicateName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Bitte gib einen Namen ein.");
      return;
    }

    if (trimmedName.length > 50) {
      setFormError("Der Name darf maximal 50 Zeichen lang sein.");
      return;
    }

    const result = onSave({ name: trimmedName, role, color });
    if (result.success) {
      onOpenChange(false);
    } else {
      setFormError(result.error ?? "Unbekannter Fehler.");
    }
  }

  function handleOpenChange(value: boolean) {
    if (forceOpen && !value) return; // Prevent closing during onboarding
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={forceOpen ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={forceOpen ? (e) => e.preventDefault() : undefined}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Mitglied bearbeiten" : "Neues Familienmitglied"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Aendere die Daten dieses Familienmitglieds."
                : "Fuege ein neues Familienmitglied hinzu."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name field */}
            <div className="grid gap-2">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormError(null);
                }}
                placeholder="z.B. Maria"
                autoFocus
                autoComplete="off"
                maxLength={50}
                aria-describedby={
                  showDuplicateWarning ? "duplicate-warning" : undefined
                }
              />
              {showDuplicateWarning && (
                <p
                  id="duplicate-warning"
                  className="flex items-center gap-1.5 text-sm text-yellow-600"
                  role="alert"
                >
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  Ein Mitglied mit diesem Namen existiert bereits.
                </p>
              )}
            </div>

            {/* Role selection */}
            <div className="grid gap-2">
              <Label>Rolle</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={role === "parent" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setRole("parent")}
                  disabled={forceParentRole}
                >
                  Elternteil
                </Button>
                <Button
                  type="button"
                  variant={role === "child" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setRole("child")}
                  disabled={forceParentRole}
                >
                  Kind
                </Button>
              </div>
            </div>

            {/* Color picker */}
            <div className="grid gap-2">
              <Label>Farbe</Label>
              <div className="flex flex-wrap gap-2">
                {MEMBER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      color === c
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Farbe ${c}`}
                    aria-pressed={color === c}
                  />
                ))}
              </div>
            </div>

            {/* Error display */}
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
          </div>

          <DialogFooter>
            {!forceOpen && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Abbrechen
              </Button>
            )}
            <Button type="submit">
              {isEditing ? "Speichern" : "Hinzufuegen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
