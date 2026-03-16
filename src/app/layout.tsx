import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Familiendashboard",
  description: "Dein zentrales Familiendashboard fuer Aufgaben, Termine und mehr.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased min-h-screen bg-background">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
