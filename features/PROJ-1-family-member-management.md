# PROJ-1: Familienmitglieder-Verwaltung

## Status: In Progress
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- None

## User Stories
- Als Elternteil möchte ich neue Familienmitglieder hinzufügen (Name, Avatar/Farbe, Rolle), damit die Familie vollständig abgebildet ist.
- Als Elternteil möchte ich Familienmitglieder bearbeiten (Name, Farbe ändern), damit die Daten aktuell bleiben.
- Als Elternteil möchte ich ein Familienmitglied entfernen, damit ausgeschiedene Mitglieder nicht mehr angezeigt werden.
- Als Elternteil möchte ich einer Person die Rolle "Kind" oder "Elternteil" zuweisen, damit die Zugriffsrechte korrekt gesetzt sind.
- Als Nutzer möchte ich alle Familienmitglieder auf einen Blick sehen, damit ich weiß, wer zur Familie gehört.

## Acceptance Criteria
- [ ] Familienmitglied kann mit Name, Rolle (Elternteil/Kind) und Farbe/Avatar erstellt werden
- [ ] Mindestens 1 Mitglied muss die Rolle "Elternteil" haben
- [ ] Familienmitglied kann bearbeitet werden (Name, Farbe, Rolle)
- [ ] Familienmitglied kann gelöscht werden (mit Bestätigungsdialog)
- [ ] Beim Löschen werden alle zugehörigen Aufgaben, Termine und Notizen ebenfalls entfernt
- [ ] Unbegrenzt viele Mitglieder können hinzugefügt werden
- [ ] Alle Mitgliedsdaten werden in localStorage persistiert und überleben einen Seitenreload
- [ ] Jedes Mitglied erhält eine eindeutige ID
- [ ] Mitgliederliste ist in der App-Navigation sichtbar

## Edge Cases
- Was passiert, wenn das letzte Elternteil gelöscht werden soll? → Löschen verhindern, Fehlermeldung anzeigen
- Was passiert, wenn kein Name eingegeben wird? → Validierung: Name ist Pflichtfeld
- Was passiert bei Duplikaten (gleicher Name)? → Erlaubt, aber Warnung anzeigen
- Was passiert, wenn localStorage voll ist? → Fehlermeldung anzeigen
- Was passiert beim ersten App-Start ohne Mitglieder? → Onboarding-Dialog: "Familie einrichten" erzwingen

## Technical Requirements
- Daten: localStorage-Key `family-members` (JSON-Array)
- Schema: `{ id: string, name: string, role: 'parent' | 'child', color: string, avatar?: string, createdAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Komponenten-Struktur

```
Einstellungsseite (/settings)
+-- MemberList (Übersicht aller Mitglieder)
|   +-- MemberCard (pro Mitglied)
|   |   +-- Avatar (Farbe + Initials)
|   |   +-- Name + Rolle (Badge)
|   |   +-- Edit-Button → MemberFormDialog
|   |   +-- Delete-Button → DeleteConfirmDialog
|   +-- AddMemberButton → MemberFormDialog (leer)
+-- MemberFormDialog (hinzufügen / bearbeiten)
|   +-- Namens-Eingabefeld
|   +-- Rollen-Auswahl (Elternteil / Kind)
|   +-- Farbwähler (Auswahl aus 8 Vorschaufarben)
+-- DeleteConfirmDialog (Bestätigung vor dem Löschen)
+-- OnboardingDialog (erzwungen beim ersten Start)
    +-- Erklärungstext
    +-- MemberFormDialog eingebettet

Navigation (global):
+-- Sidebar / Header
    +-- Familienmitglieder-Liste (Avatars + Namen)
        +-- Klick → persönliches Dashboard (PROJ-3)
```

### Datenmodell

Gespeichert in: `localStorage` unter Key `family-members` (JSON-Array)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| `id` | Eindeutige ID (beim Erstellen generiert) | `"m_1234abcd"` |
| `name` | Name des Mitglieds (Pflichtfeld) | `"Maria"` |
| `role` | Rolle in der Familie | `"parent"` oder `"child"` |
| `color` | Farbe für Avatar (aus vordefinierter Palette) | `"#FF6B6B"` |
| `avatar` | Optionaler Emoji als Avatar | `"👧"` |
| `createdAt` | Zeitstempel der Erstellung | `"2026-03-15T10:00:00Z"` |

Cascading Delete: Beim Löschen eines Mitglieds werden auch `tasks`, `appointments`, `notes` in localStorage bereinigt (Keys filtern nach `memberId`).

### Tech-Entscheidungen

| Entscheidung | Warum |
|---|---|
| localStorage (kein Backend) | Kein Login nötig, funktioniert offline, schnell für MVP |
| `useFamilyMembers` Hook | Zentraler Datenzugriff — alle Komponenten nutzen denselben State |
| shadcn/ui `Dialog` | Bereits installiert, konsistentes Design für Add/Edit-Formulare |
| shadcn/ui `AlertDialog` | Bereits installiert, für Bestätigungsdialog beim Löschen |
| shadcn/ui `Avatar` | Bereits installiert, zeigt Farbe + Initialen |
| shadcn/ui `Badge` | Bereits installiert, für Rollen-Label (Elternteil / Kind) |
| 8 Vorschaufarben statt Freitext | Einfacher für Nutzer, konsistentes UI |

### Neue Dateien

- `src/hooks/useFamilyMembers.ts` — Daten-Hook (lesen, schreiben, löschen aus localStorage)
- `src/components/members/MemberCard.tsx`
- `src/components/members/MemberFormDialog.tsx`
- `src/components/members/DeleteConfirmDialog.tsx`
- `src/components/members/OnboardingDialog.tsx`
- `src/app/settings/page.tsx` — Einstellungsseite

### Sonderfälle

- Letztes Elternteil schützen: Delete-Button deaktiviert + Hinweistext
- Onboarding: Bei leerem localStorage öffnet sich OnboardingDialog automatisch und blockiert die App
- Duplikat-Warnung: Gleicher Name erlaubt, aber gelbe Warnmeldung im Formular

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
