"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon, GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MemberAvatar } from "@/components/members/MemberAvatar";
import { cn } from "@/lib/utils";
import type { KanbanCard } from "@/hooks/useKanban";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface KanbanCardItemProps {
  card: KanbanCard;
  index: number;
  assignedMember?: FamilyMember;
  onToggleComplete: (id: string) => void;
  onEdit: (card: KanbanCard) => void;
  onDelete: (id: string) => void;
}

export function KanbanCardItem({
  card,
  index,
  assignedMember,
  onToggleComplete,
  onEdit,
  onDelete,
}: KanbanCardItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isOverdue =
    card.dueDate && !card.completed && new Date(card.dueDate) < new Date();

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn(
              "p-3 transition-shadow group",
              snapshot.isDragging && "shadow-lg ring-2 ring-primary/20",
              card.completed && "opacity-60"
            )}
          >
            <div className="flex items-start gap-2">
              {/* Drag handle */}
              <div
                {...provided.dragHandleProps}
                className="hidden md:flex mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground"
                aria-label="Karte verschieben"
              >
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Checkbox */}
              <Checkbox
                checked={card.completed}
                onCheckedChange={() => onToggleComplete(card.id)}
                aria-label={card.completed ? "Als offen markieren" : "Als erledigt markieren"}
                className="mt-0.5"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium leading-snug",
                    card.completed && "line-through text-muted-foreground"
                  )}
                >
                  {card.title}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  {card.dueDate && (
                    <Badge
                      variant={isOverdue ? "destructive" : "outline"}
                      className="text-[10px] px-1.5 py-0 h-5 gap-1"
                    >
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(card.dueDate), "dd. MMM", { locale: de })}
                    </Badge>
                  )}
                  {card.points !== undefined && card.points !== 0 && (
                    <Badge
                      variant={card.points > 0 ? "default" : "destructive"}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {card.points > 0 ? `+${card.points}` : card.points} Pkt
                    </Badge>
                  )}
                  {assignedMember && (
                    <MemberAvatar member={assignedMember} size="sm" className="h-5 w-5 text-[8px]" />
                  )}
                </div>
              </div>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Karten-Aktionen"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(card)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Bearbeiten
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
            </div>
          </Card>
        )}
      </Draggable>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Karte loeschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Moechtest du die Karte <span className="font-semibold">{card.title}</span> wirklich
              loeschen? Diese Aktion kann nicht rueckgaengig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(card.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Loeschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
