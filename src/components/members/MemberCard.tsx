"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface MemberCardProps {
  member: FamilyMember;
  isLastParent: boolean;
  onEdit: (member: FamilyMember) => void;
  onDelete: (member: FamilyMember) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#1a1a2e" : "#ffffff";
}

export function MemberCard({ member, isLastParent, onEdit, onDelete }: MemberCardProps) {
  const initials = member.avatar || getInitials(member.name);
  const textColor = getContrastColor(member.color);

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12" aria-label={`Avatar von ${member.name}`}>
          <AvatarFallback
            style={{ backgroundColor: member.color, color: textColor }}
            className="text-base font-semibold"
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-base font-medium truncate">{member.name}</p>
          <Badge
            variant={member.role === "parent" ? "default" : "secondary"}
            className="mt-1"
          >
            {member.role === "parent" ? "Elternteil" : "Kind"}
          </Badge>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(member)}
            aria-label={`${member.name} bearbeiten`}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(member)}
                    disabled={isLastParent}
                    aria-label={`${member.name} loeschen`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>
              {isLastParent && (
                <TooltipContent>
                  <p>Das letzte Elternteil kann nicht geloescht werden.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
