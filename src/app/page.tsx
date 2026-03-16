"use client";

import Link from "next/link";
import { Settings, CalendarDays, CheckSquare, Kanban, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useActiveMember } from "@/contexts/ActiveMemberContext";
import { useTheme, type ThemeValue } from "@/contexts/ThemeContext";
import { MemberAvatar } from "@/components/members/MemberAvatar";
import { Skeleton } from "@/components/ui/skeleton";

function getGreeting(name: string, theme: ThemeValue): string {
  switch (theme) {
    case "kids-vivid":
      return `\u{1F308} Hallo, ${name}! \u{1F44B}`;
    case "kids-soft":
      return `\u{1F338} Hallo, ${name}!`;
    default:
      return "Willkommen zurueck!";
  }
}

function getSubtitle(theme: ThemeValue): string {
  switch (theme) {
    case "kids-vivid":
      return "\u{1F3E0} Hier ist dein Familien-Dashboard!";
    case "kids-soft":
      return "\u{1F31F} Hier ist dein Familien-Dashboard!";
    default:
      return "Hier ist die Uebersicht deiner Familie.";
  }
}

function getSectionEmoji(section: string, theme: ThemeValue): string {
  if (theme === "standard") return "";
  const emojis: Record<string, Record<string, string>> = {
    "kids-vivid": {
      family: "\u{1F46A} ",
      settings: "\u{2699}\u{FE0F} ",
      kanban: "\u{1F4CB} ",
      tasks: "\u{2705} ",
      calendar: "\u{1F4C5} ",
      shopping: "\u{1F6D2} ",
      areas: "\u{1F680} ",
    },
    "kids-soft": {
      family: "\u{1F33F} ",
      settings: "\u{1F527} ",
      kanban: "\u{1F4DD} ",
      tasks: "\u{2714}\u{FE0F} ",
      calendar: "\u{1F338} ",
      shopping: "\u{1F33C} ",
      areas: "\u{2728} ",
    },
  };
  return emojis[theme]?.[section] ?? "";
}

export default function HomePage() {
  const { members, parents, children, isLoading } = useFamilyMembers();
  const { activeMember } = useActiveMember();
  const { getTheme } = useTheme();

  const activeTheme: ThemeValue = activeMember
    ? getTheme(activeMember.id)
    : "standard";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {activeMember
            ? getGreeting(activeMember.name, activeTheme)
            : "Willkommen zurueck!"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {getSubtitle(activeTheme)}
        </p>
      </div>

      {/* Family Members Overview */}
      {members.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            {getSectionEmoji("family", activeTheme)}Deine Familie ({members.length})
          </h2>
          <div className="flex flex-wrap gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center gap-1.5"
              >
                <MemberAvatar member={member} size="lg" />
                <span className="text-sm font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {member.role === "parent" ? "Elternteil" : "Kind"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Links / Feature Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{getSectionEmoji("areas", activeTheme)}Bereiche</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/settings">
            <Card className="transition-shadow hover:shadow-md cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base mt-2">{getSectionEmoji("settings", activeTheme)}Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {parents.length} Eltern, {children.length} Kinder
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/kanban">
            <Card className="transition-shadow hover:shadow-md cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Kanban className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base mt-2">{getSectionEmoji("kanban", activeTheme)}Kanban Boards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Aufgaben organisieren</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Card className="opacity-50 h-full">
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CheckSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base mt-2">{getSectionEmoji("tasks", activeTheme)}Aufgaben</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Kommt bald</CardDescription>
            </CardContent>
          </Card>

          <Card className="opacity-50 h-full">
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base mt-2">{getSectionEmoji("calendar", activeTheme)}Termine</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Kommt bald</CardDescription>
            </CardContent>
          </Card>

          <Card className="opacity-50 h-full">
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base mt-2">{getSectionEmoji("shopping", activeTheme)}Einkaufsliste</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Kommt bald</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
