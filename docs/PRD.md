# Product Requirements Document

## Vision
Das Familiendashboard ist eine zentrale Webanwendung für Familien, die einen gemeinsamen Überblick über Aufgaben, Termine, Einkäufe, Notizen und Verhalten aller Familienmitglieder bietet. Eltern verwalten die Familie, Kinder haben personalisierte Unterseiten mit ihren eigenen Inhalten — alles lokal im Browser ohne Anmeldung.

## Target Users

**Eltern (Admin-Rolle)**
- Möchten den Familienalltag koordinieren und behalten den Überblick über alle Familienmitglieder
- Verwalten Aufgaben, Termine und das Verhaltensprotokoll für Kinder
- Fügen Familienmitglieder hinzu und pflegen deren Daten

**Kinder**
- Sehen ihr eigenes persönliches Dashboard mit ihren Aufgaben, Terminen und Notizen
- Können eigene To-Dos abhaken und Termine einsehen
- Haben keinen Zugriff auf Dashboards anderer Familienmitglieder

## Core Features (Roadmap)

| Priority | Feature | Status |
|----------|---------|--------|
| P0 (MVP) | Familienmitglieder-Verwaltung | Planned |
| P0 (MVP) | Familien-Übersichtsdashboard | Planned |
| P0 (MVP) | Persönliches Mitglieder-Dashboard | Planned |
| P0 (MVP) | Aufgaben-Verwaltung | Planned |
| P0 (MVP) | Termin-Verwaltung | Planned |
| P1 | Einkaufsliste | Planned |
| P1 | Familien-Notizen | Planned |
| P1 | Verhaltensprotokoll | Planned |

## Success Metrics
- Alle Familienmitglieder nutzen die App täglich zur Koordination
- Aufgaben werden zuverlässig abgehakt (Completion Rate > 70%)
- Eltern können innerhalb von 30 Sekunden den Status aller Kinder überblicken
- Keine Datenverluste durch robuste localStorage-Persistenz

## Constraints
- **Kein Backend / kein Login:** Alle Daten werden im Browser (localStorage) gespeichert
- **Gerätegebunden:** Daten sind nicht geräteübergreifend synchronisiert (kein Cloud-Sync im MVP)
- **Solo-Entwickler:** Ein Entwickler, iteratives Vorgehen
- **Tech Stack:** Next.js 16, Tailwind CSS, shadcn/ui, TypeScript

## Non-Goals
- Keine Cloud-Synchronisation zwischen Geräten (kein Backend im MVP)
- Kein Benachrichtigungssystem (Push-Notifications, E-Mail)
- Kein Punkte-/Belohnungssystem (kann später kommen)
- Keine Chat-Funktion in Echtzeit
- Keine Kalender-Integration mit externen Diensten (Google Calendar etc.)

---

Use `/requirements` to create detailed feature specifications for each item in the roadmap above.
