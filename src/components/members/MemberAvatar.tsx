"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface MemberAvatarProps {
  member: FamilyMember;
  size?: "sm" | "md" | "lg";
  className?: string;
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

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function MemberAvatar({ member, size = "md", className }: MemberAvatarProps) {
  const initials = member.avatar || getInitials(member.name);
  const textColor = getContrastColor(member.color);

  return (
    <Avatar
      className={cn(sizeClasses[size], className)}
      aria-label={`Avatar von ${member.name}`}
    >
      <AvatarFallback
        style={{ backgroundColor: member.color, color: textColor }}
        className="font-semibold"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
