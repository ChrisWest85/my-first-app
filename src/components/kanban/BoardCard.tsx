"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, Users, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { KanbanBoard } from "@/hooks/useKanban";

interface BoardCardProps {
  board: KanbanBoard;
  cardCount: number;
  canManage: boolean;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

export function BoardCard({
  board,
  cardCount,
  canManage,
  onOpen,
  onRename,
  onDelete,
}: BoardCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState(board.name);

  function handleRename() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onRename(board.id, trimmed);
    setShowRenameDialog(false);
  }

  return (
    <>
      <Card
        className="transition-shadow hover:shadow-md cursor-pointer group relative"
        onClick={() => onOpen(board.id)}
        role="button"
        tabIndex={0}
        aria-label={`Board ${board.name} oeffnen`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(board.id);
          }
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base line-clamp-1 pr-8">{board.name}</CardTitle>
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Board-Aktionen"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem
                    onClick={() => {
                      setNewName(board.name);
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
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={board.type === "family" ? "default" : "secondary"} className="text-xs">
              {board.type === "family" ? (
                <><Users className="h-3 w-3 mr-1" /> Familie</>
              ) : (
                <><User className="h-3 w-3 mr-1" /> Persoenlich</>
              )}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {cardCount} {cardCount === 1 ? "Karte" : "Karten"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Board loeschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Moechtest du das Board <span className="font-semibold">{board.name}</span> wirklich
              loeschen? {cardCount > 0 && `${cardCount} Karten werden ebenfalls geloescht.`} Diese
              Aktion kann nicht rueckgaengig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(board.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Loeschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Board umbenennen</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rename-board">Neuer Name</Label>
            <Input
              id="rename-board"
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
