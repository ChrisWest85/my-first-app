"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Menu, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/components/members/MemberAvatar";
import type { FamilyMember } from "@/hooks/useFamilyMembers";

interface HeaderProps {
  members: FamilyMember[];
  isLoading: boolean;
}

const navItems = [
  { href: "/", label: "Uebersicht", icon: Home },
  { href: "/settings", label: "Einstellungen", icon: Settings },
];

export function Header({ members, isLoading }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        {/* Logo / App Name */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold mr-4 md:mr-6"
        >
          <Users className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">Familiendashboard</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Member Avatars (desktop) */}
        {!isLoading && members.length > 0 && (
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            <TooltipProvider>
              {members.map((member) => (
                <Tooltip key={member.id}>
                  <TooltipTrigger asChild>
                    <button
                      className="rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label={`${member.name} (${member.role === "parent" ? "Elternteil" : "Kind"})`}
                    >
                      <MemberAvatar member={member} size="sm" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {member.name} ({member.role === "parent" ? "Elternteil" : "Kind"})
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        )}

        {/* Mobile Hamburger Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Menue oeffnen"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Sheet Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Familiendashboard
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation und Familienmitglieder
            </SheetDescription>
          </SheetHeader>

          <nav className="flex flex-col gap-1 mt-6" aria-label="Mobile Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Member List */}
          {!isLoading && members.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-3 px-3">
                Familienmitglieder
              </p>
              <div className="flex flex-col gap-1">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-md px-3 py-2"
                  >
                    <MemberAvatar member={member} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.role === "parent" ? "Elternteil" : "Kind"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}
