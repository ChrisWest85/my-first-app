"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { KanbanCardItem } from "./KanbanCardItem";
import type { KanbanList, KanbanCard } from "@/hooks/useKanban";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface ListColumnProps {
  list: KanbanList;
  cards: KanbanCard[];
  members: FamilyMember[];
  canManage: boolean;
  onRenameList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
  onAddCard: (listId: string) => void;
  onEditCard: (card: KanbanCard) => void;
  onDeleteCard: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function ListColumn({
  list,
  cards,
  members,
  canManage,
  onRenameList,
  onDeleteList,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onToggleComplete,
}: ListColumnProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState(list.name);
  const [hideCompleted, setHideCompleted] = useState(false);

  const visibleCards = hideCompleted ? cards.filter((c) => !c.completed) : cards;
  const completedCount = cards.filter((c) => c.completed).length;

  function handleRename() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onRenameList(list.id, trimmed);
    setShowRenameDialog(false);
  }

  function getMember(id?: string) {
    if (!id) return undefined;
    return members.find((m) => m.id === id);
  }

  return (
    <>
      <div className="flex flex-col w-72 shrink-0 bg-muted/50 rounded-lg">
        {/* List Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm font-semibold truncate">{list.name}</h3>
            <span className="text-xs text-muted-foreground shrink-0">
              {cards.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onAddCard(list.id)}
              aria-label="Karte hinzufuegen"
            >
              <Plus className="h-4 w-4" />
            </Button>
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="Listen-Aktionen"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setNewName(list.name);
                      setShowRenameDialog(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Umbenennen
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Loeschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Toggle completed */}
        {completedCount > 0 && (
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground">
            <span>{completedCount} erledigt</span>
            <div className="flex items-center gap-1.5">
              <span>Ausblenden</span>
              <Switch
                checked={hideCompleted}
                onCheckedChange={setHideCompleted}
                className="scale-75"
                aria-label="Erledigte Karten ausblenden"
              />
            </div>
          </div>
        )}

        {/* Cards */}
        <Droppable droppableId={list.id}>
          {(provided, snapshot) => (
            <ScrollArea className="flex-1">
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-col gap-2 p-2 min-h-[60px] transition-colors ${
                  snapshot.isDraggingOver ? "bg-primary/5" : ""
                }`}
              >
                {visibleCards.map((card, index) => (
                  <KanbanCardItem
                    key={card.id}
                    card={card}
                    index={index}
                    assignedMember={getMember(card.assignedMemberId)}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEditCard}
                    onDelete={onDeleteCard}
                  />
                ))}
                {provided.placeholder}
                {visibleCards.length === 0 && !snapshot.isDraggingOver && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Keine Karten
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
        </Droppable>
      </div>

      {/* Delete List Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Liste loeschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Moechtest du die Liste <span className="font-semibold">{list.name}</span> wirklich
              loeschen?{" "}
              {cards.length > 0 &&
                `${cards.length} ${cards.length === 1 ? "Karte wird" : "Karten werden"} ebenfalls geloescht.`}{" "}
              Diese Aktion kann nicht rueckgaengig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteList(list.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Loeschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Liste umbenennen</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rename-list">Neuer Name</Label>
            <Input
              id="rename-list"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleRename} disabled={!newName.trim()}>
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
