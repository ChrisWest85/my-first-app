"use client";

import Link from "next/link";
import { Settings, CalendarDays, CheckSquare, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { MemberAvatar } from "@/components/members/MemberAvatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { members, parents, children, isLoading } = useFamilyMembers();

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
          Willkommen zurueck!
        </h1>
        <p className="text-muted-foreground mt-1">
          Hier ist die Uebersicht deiner Familie.
        </p>
      </div>

      {/* Family Members Overview */}
      {members.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Deine Familie ({members.length})
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
        <h2 className="text-lg font-semibold mb-3">Bereiche</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/settings">
            <Card className="transition-shadow hover:shadow-md cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base mt-2">Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {parents.length} Eltern, {children.length} Kinder
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Card className="opacity-50 h-full">
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <CheckSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base mt-2">Aufgaben</CardTitle>
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
              <CardTitle className="text-base mt-2">Termine</CardTitle>
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
              <CardTitle className="text-base mt-2">Einkaufsliste</CardTitle>
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
