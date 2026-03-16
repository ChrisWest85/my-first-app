"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFamilyMembers, type FamilyMember } from "@/hooks/useFamilyMembers";
import { MemberCard } from "@/components/members/MemberCard";
import { MemberFormDialog } from "@/components/members/MemberFormDialog";
import { DeleteConfirmDialog } from "@/components/members/DeleteConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const {
    members,
    parents,
    children,
    isLoading,
    error,
    setError,
    addMember,
    updateMember,
    deleteMember,
    hasDuplicateName,
    isLastParent,
  } = useFamilyMembers();

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<FamilyMember | null>(
    null
  );

  function handleEdit(member: FamilyMember) {
    setEditingMember(member);
    setFormOpen(true);
  }

  function handleAddNew() {
    setEditingMember(null);
    setFormOpen(true);
  }

  function handleSave(data: {
    name: string;
    role: "parent" | "child";
    color: string;
    avatar?: string;
  }) {
    if (editingMember) {
      return updateMember(editingMember.id, data);
    }
    return addMember(data);
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Familienmitglieder
          </h1>
          <p className="text-muted-foreground">
            Verwalte die Mitglieder deiner Familie.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Mitglied hinzufuegen
        </Button>
      </div>

      {/* Global error */}
      {error && (
        <div
          className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Schliessen
          </button>
        </div>
      )}

      {/* Empty state */}
      {members.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">Keine Mitglieder</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Fuege dein erstes Familienmitglied hinzu, um loszulegen.
          </p>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Erstes Mitglied hinzufuegen
          </Button>
        </div>
      )}

      {/* Parents section */}
      {parents.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Eltern ({parents.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {parents.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isLastParent={isLastParent(member.id)}
                onEdit={handleEdit}
                onDelete={setDeletingMember}
              />
            ))}
          </div>
        </section>
      )}

      {/* Children section */}
      {children.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Kinder ({children.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                isLastParent={false}
                onEdit={handleEdit}
                onDelete={setDeletingMember}
              />
            ))}
          </div>
        </section>
      )}

      {/* Add/Edit dialog */}
      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        member={editingMember}
        onSave={handleSave}
        hasDuplicateName={hasDuplicateName}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={!!deletingMember}
        onOpenChange={(open) => {
          if (!open) setDeletingMember(null);
        }}
        member={deletingMember}
        onConfirm={deleteMember}
      />
    </div>
  );
}
