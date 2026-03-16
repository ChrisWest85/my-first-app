"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; type: "family" | "personal" }) => void;
}

export function CreateBoardDialog({ open, onOpenChange, onSave }: CreateBoardDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"family" | "personal">("family");

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, type });
    setName("");
    setType("family");
    onOpenChange(false);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setName("");
      setType("family");
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neues Board erstellen</DialogTitle>
          <DialogDescription>
            Erstelle ein neues Kanban-Board fuer deine Familie oder fuer dich persoenlich.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board-Name</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Haushalt, Schulprojekt..."
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Typ</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "family" | "personal")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="family" id="type-family" />
                <Label htmlFor="type-family" className="font-normal cursor-pointer">
                  Familie
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="type-personal" />
                <Label htmlFor="type-personal" className="font-normal cursor-pointer">
                  Persoenlich
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
