"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/hooks/useFamilyMembers";
import type { KanbanCard, KanbanList } from "@/hooks/useKanban";

const NONE_VALUE = "__none__";

interface CardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: KanbanCard | null;
  listId: string;
  boardId: string;
  lists: KanbanList[];
  members: FamilyMember[];
  onSave: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedMemberId?: string;
    points?: number;
    listId?: string;
  }) => void;
}

export function CardFormDialog({
  open,
  onOpenChange,
  card,
  listId,
  boardId,
  lists,
  members,
  onSave,
}: CardFormDialogProps) {
  const isEditing = !!card;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [assignedMemberId, setAssignedMemberId] = useState<string>(NONE_VALUE);
  const [points, setPoints] = useState<string>("");
  const [moveToListId, setMoveToListId] = useState<string>(listId);

  useEffect(() => {
    if (open) {
      if (card) {
        setTitle(card.title);
        setDescription(card.description || "");
        setDueDate(card.dueDate ? new Date(card.dueDate) : undefined);
        setAssignedMemberId(card.assignedMemberId || NONE_VALUE);
        setPoints(card.points !== undefined ? String(card.points) : "");
        setMoveToListId(card.listId);
      } else {
        setTitle("");
        setDescription("");
        setDueDate(undefined);
        setAssignedMemberId(NONE_VALUE);
        setPoints("");
        setMoveToListId(listId);
      }
    }
  }, [open, card, listId]);

  function handleSave() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const parsedPoints = points !== "" ? Number(points) : undefined;
    if (parsedPoints !== undefined && (isNaN(parsedPoints) || parsedPoints < -10 || parsedPoints > 10)) return;

    onSave({
      title: trimmedTitle,
      description: description.trim() || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      assignedMemberId: assignedMemberId === NONE_VALUE ? undefined : assignedMemberId,
      points: parsedPoints,
      listId: moveToListId !== listId ? moveToListId : undefined,
    });
    onOpenChange(false);
  }

  // Suppress unused variable warning - boardId used for context but not in current logic
  void boardId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Karte bearbeiten" : "Neue Karte"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Bearbeite die Details dieser Karte."
              : "Erstelle eine neue Karte in dieser Liste."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="card-title">
              Titel <span className="text-destructive">*</span>
            </Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Was ist zu tun?"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="card-description">Beschreibung</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Weitere Details..."
              rows={3}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Faelligkeitsdatum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: de }) : "Datum waehlen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => setDueDate(undefined)}
              >
                Datum entfernen
              </Button>
            )}
          </div>

          {/* Assigned Member */}
          <div className="space-y-2">
            <Label>Zugewiesen an</Label>
            <Select value={assignedMemberId} onValueChange={setAssignedMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Niemand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE}>Niemand</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.role === "parent" ? "Elternteil" : "Kind"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Points */}
          <div className="space-y-2">
            <Label htmlFor="card-points">Punkte (-10 bis +10)</Label>
            <Input
              id="card-points"
              type="number"
              min={-10}
              max={10}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Mobile: Move to list (only when editing) */}
          {isEditing && lists.length > 1 && (
            <div className="space-y-2 md:hidden">
              <Label>In Liste verschieben</Label>
              <Select value={moveToListId} onValueChange={setMoveToListId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lists.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {isEditing ? "Speichern" : "Erstellen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
