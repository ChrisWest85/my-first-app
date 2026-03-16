"use client";

import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BoardCard } from "./BoardCard";
import { CreateBoardDialog } from "./CreateBoardDialog";
import type { KanbanBoard } from "@/hooks/useKanban";

interface BoardOverviewProps {
  boards: KanbanBoard[];
  isLoading: boolean;
  currentMemberId: string;
  currentMemberRole: "parent" | "child";
  getCardCount: (boardId: string) => number;
  onOpenBoard: (id: string) => void;
  onCreateBoard: (data: { name: string; type: "family" | "personal" }) => void;
  onRenameBoard: (id: string, name: string) => void;
  onDeleteBoard: (id: string) => void;
}

export function BoardOverview({
  boards,
  isLoading,
  currentMemberId,
  currentMemberRole,
  getCardCount,
  onOpenBoard,
  onCreateBoard,
  onRenameBoard,
  onDeleteBoard,
}: BoardOverviewProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const canManageBoard = (board: KanbanBoard) =>
    currentMemberRole === "parent" || board.ownerId === currentMemberId;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Boards</h2>
          <span className="text-sm text-muted-foreground">({boards.length})</span>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Neues Board
        </Button>
      </div>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <LayoutGrid className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-medium mb-1">Noch keine Boards</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Erstelle dein erstes Kanban-Board, um Aufgaben zu organisieren.
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Board erstellen
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              cardCount={getCardCount(board.id)}
              canManage={canManageBoard(board)}
              onOpen={onOpenBoard}
              onRename={onRenameBoard}
              onDelete={onDeleteBoard}
            />
          ))}
        </div>
      )}

      <CreateBoardDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={onCreateBoard}
      />
    </div>
  );
}
