"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ListColumn } from "./ListColumn";
import { CardFormDialog } from "./CardFormDialog";
import type { KanbanBoard, KanbanList, KanbanCard } from "@/hooks/useKanban";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface BoardDetailProps {
  board: KanbanBoard;
  lists: KanbanList[];
  cards: KanbanCard[];
  members: FamilyMember[];
  isLoading: boolean;
  canManage: boolean;
  onBack: () => void;
  onRenameBoard: (id: string, name: string) => void;
  onDeleteBoard: (id: string) => void;
  onCreateList: (data: { boardId: string; name: string }) => void;
  onRenameList: (id: string, name: string) => void;
  onDeleteList: (id: string) => void;
  onCreateCard: (data: {
    listId: string;
    boardId: string;
    title: string;
    description?: string;
    dueDate?: string;
    assignedMemberId?: string;
    points?: number;
  }) => void;
  onUpdateCard: (id: string, data: Partial<Omit<KanbanCard, "id" | "createdAt">>) => void;
  onDeleteCard: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onMoveCard: (cardId: string, targetListId: string) => void;
}

export function BoardDetail({
  board,
  lists,
  cards,
  members,
  isLoading,
  canManage,
  onBack,
  onRenameBoard,
  onDeleteBoard,
  onCreateList,
  onRenameList,
  onDeleteList,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onToggleComplete,
  onMoveCard,
}: BoardDetailProps) {
  const [showDeleteBoardDialog, setShowDeleteBoardDialog] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(board.name);
  const [newListName, setNewListName] = useState("");
  const [showAddList, setShowAddList] = useState(false);

  // Card form state
  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [activeListId, setActiveListId] = useState<string>("");

  function handleTitleSave() {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== board.name) {
      onRenameBoard(board.id, trimmed);
    }
    setIsEditingTitle(false);
  }

  function handleAddList() {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    onCreateList({ boardId: board.id, name: trimmed });
    setNewListName("");
    setShowAddList(false);
  }

  function handleAddCard(listId: string) {
    setActiveListId(listId);
    setEditingCard(null);
    setCardFormOpen(true);
  }

  function handleEditCard(card: KanbanCard) {
    setActiveListId(card.listId);
    setEditingCard(card);
    setCardFormOpen(true);
  }

  function handleSaveCard(data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedMemberId?: string;
    points?: number;
    listId?: string;
  }) {
    if (editingCard) {
      const updateData: Partial<Omit<KanbanCard, "id" | "createdAt">> = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        assignedMemberId: data.assignedMemberId,
        points: data.points,
      };
      onUpdateCard(editingCard.id, updateData);
      // If list changed (mobile fallback move)
      if (data.listId && data.listId !== editingCard.listId) {
        onMoveCard(editingCard.id, data.listId);
      }
    } else {
      onCreateCard({
        listId: activeListId,
        boardId: board.id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        assignedMemberId: data.assignedMemberId,
        points: data.points,
      });
    }
  }

  function handleDragEnd(result: DropResult) {
    const { draggableId, destination } = result;
    if (!destination) return;

    const card = cards.find((c) => c.id === draggableId);
    if (!card) return;

    // Only move if destination list is different
    if (card.listId !== destination.droppableId) {
      onMoveCard(draggableId, destination.droppableId);
    }
  }

  const totalCards = cards.length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-72 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Zurueck zur Uebersicht">
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {isEditingTitle && canManage ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTitleSave();
              if (e.key === "Escape") {
                setEditTitle(board.name);
                setIsEditingTitle(false);
              }
            }}
            className="text-xl font-bold h-auto py-1 w-auto max-w-sm"
            autoFocus
          />
        ) : (
          <h1
            className={`text-xl font-bold ${canManage ? "cursor-pointer hover:text-primary transition-colors" : ""}`}
            onClick={() => {
              if (canManage) {
                setEditTitle(board.name);
                setIsEditingTitle(true);
              }
            }}
            role={canManage ? "button" : undefined}
            tabIndex={canManage ? 0 : undefined}
            onKeyDown={(e) => {
              if (canManage && (e.key === "Enter" || e.key === " ")) {
                setEditTitle(board.name);
                setIsEditingTitle(true);
              }
            }}
            aria-label={canManage ? "Board-Titel bearbeiten" : undefined}
          >
            {board.name}
          </h1>
        )}

        <div className="flex-1" />

        {canManage && (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDeleteBoardDialog(true)}
            aria-label="Board loeschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
          {lists.map((list) => {
            const listCards = cards.filter((c) => c.listId === list.id);
            return (
              <ListColumn
                key={list.id}
                list={list}
                cards={listCards}
                members={members}
                canManage={canManage}
                onRenameList={onRenameList}
                onDeleteList={onDeleteList}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={onDeleteCard}
                onToggleComplete={onToggleComplete}
              />
            );
          })}

          {/* Add List Button */}
          {canManage && (
            <div className="w-72 shrink-0">
              {showAddList ? (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Listenname..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddList();
                      if (e.key === "Escape") {
                        setShowAddList(false);
                        setNewListName("");
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddList} disabled={!newListName.trim()}>
                      Hinzufuegen
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowAddList(false);
                        setNewListName("");
                      }}
                    >
                      Abbrechen
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-10 border-dashed"
                  onClick={() => setShowAddList(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Liste hinzufuegen
                </Button>
              )}
            </div>
          )}
        </div>
      </DragDropContext>

      {/* Card Form Dialog */}
      <CardFormDialog
        open={cardFormOpen}
        onOpenChange={setCardFormOpen}
        card={editingCard}
        listId={activeListId}
        boardId={board.id}
        lists={lists}
        members={members}
        onSave={handleSaveCard}
      />

      {/* Delete Board Confirmation */}
      <AlertDialog open={showDeleteBoardDialog} onOpenChange={setShowDeleteBoardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Board loeschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Moechtest du das Board <span className="font-semibold">{board.name}</span> wirklich
              loeschen?{" "}
              {totalCards > 0 &&
                `${totalCards} ${totalCards === 1 ? "Karte wird" : "Karten werden"} ebenfalls geloescht.`}{" "}
              Diese Aktion kann nicht rueckgaengig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteBoard(board.id);
                onBack();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Loeschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
