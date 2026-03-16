"use client";

import { useState } from "react";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useKanban } from "@/hooks/useKanban";
import { BoardOverview } from "@/components/kanban/BoardOverview";
import { BoardDetail } from "@/components/kanban/BoardDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function KanbanPage() {
  const { members, parents, isLoading: membersLoading } = useFamilyMembers();
  const kanban = useKanban();

  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

  // Use first parent as the "current user" (since there's no login)
  const currentMember = parents[0];
  const currentMemberId = currentMember?.id ?? "";
  const currentMemberRole = currentMember?.role ?? "parent";

  const isLoading = membersLoading || kanban.isLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h2 className="text-lg font-medium mb-1">Keine Familienmitglieder</h2>
        <p className="text-sm text-muted-foreground">
          Bitte fuege zuerst Familienmitglieder hinzu, bevor du Boards erstellen kannst.
        </p>
      </div>
    );
  }

  const visibleBoards = kanban.getVisibleBoards(currentMemberId, currentMemberRole);
  const activeBoard = activeBoardId
    ? kanban.boards.find((b) => b.id === activeBoardId)
    : null;

  // Board Detail View
  if (activeBoard) {
    const boardLists = kanban.getBoardLists(activeBoard.id);
    const boardCards = kanban.getBoardCards(activeBoard.id);
    const canManage = currentMemberRole === "parent" || activeBoard.ownerId === currentMemberId;

    return (
      <div className="h-[calc(100vh-8rem)]">
        {kanban.error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{kanban.error}</AlertDescription>
          </Alert>
        )}
        <BoardDetail
          board={activeBoard}
          lists={boardLists}
          cards={boardCards}
          members={members}
          isLoading={false}
          canManage={canManage}
          onBack={() => setActiveBoardId(null)}
          onRenameBoard={(id, name) => kanban.updateBoard(id, { name })}
          onDeleteBoard={(id) => {
            kanban.deleteBoard(id);
            setActiveBoardId(null);
          }}
          onCreateList={(data) => kanban.createList(data)}
          onRenameList={(id, name) => kanban.updateList(id, { name })}
          onDeleteList={(id) => kanban.deleteList(id)}
          onCreateCard={(data) => kanban.createCard(data)}
          onUpdateCard={(id, data) => kanban.updateCard(id, data)}
          onDeleteCard={(id) => kanban.deleteCard(id)}
          onToggleComplete={(id) => kanban.toggleCardComplete(id)}
          onMoveCard={(cardId, listId) => kanban.moveCard(cardId, listId)}
        />
      </div>
    );
  }

  // Board Overview
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Kanban Boards</h1>
        <p className="text-muted-foreground mt-1">
          Organisiere Aufgaben und Projekte mit Kanban-Boards.
        </p>
      </div>

      {kanban.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{kanban.error}</AlertDescription>
        </Alert>
      )}

      <BoardOverview
        boards={visibleBoards}
        isLoading={false}
        currentMemberId={currentMemberId}
        currentMemberRole={currentMemberRole}
        getCardCount={kanban.getCardCountForBoard}
        onOpenBoard={setActiveBoardId}
        onCreateBoard={(data) => {
          const result = kanban.createBoard({
            ...data,
            ownerId: currentMemberId,
          });
          if (result.success && result.board) {
            // Optionally open the new board right away
          }
        }}
        onRenameBoard={(id, name) => kanban.updateBoard(id, { name })}
        onDeleteBoard={(id) => kanban.deleteBoard(id)}
      />
    </div>
  );
}
