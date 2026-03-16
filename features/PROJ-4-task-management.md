# PROJ-4: Aufgaben-Verwaltung

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Aufgaben werden Mitgliedern zugewiesen

## User Stories
- Als Elternteil möchte ich einem Familienmitglied eine neue Aufgabe zuweisen (Titel, Beschreibung, Fälligkeit), damit Verantwortlichkeiten klar sind.
- Als Familienmitglied möchte ich meine Aufgaben als erledigt markieren, damit mein Fortschritt sichtbar ist.
- Als Elternteil möchte ich eine Aufgabe bearbeiten oder löschen, damit die Aufgabenliste aktuell bleibt.
- Als Familienmitglied möchte ich meine offenen Aufgaben sortiert nach Fälligkeit sehen, damit ich weiß, was zuerst dran ist.
- Als Elternteil möchte ich im Familien-Übersichtsdashboard die Anzahl offener Aufgaben pro Mitglied sehen.

## Acceptance Criteria
- [ ] Aufgabe kann erstellt werden mit: Titel (Pflicht), Beschreibung (optional), Fälligkeitsdatum (optional), zugewiesenes Mitglied (Pflicht)
- [ ] Aufgabe kann als erledigt/offen markiert werden (Toggle)
- [ ] Aufgabe kann bearbeitet werden (alle Felder)
- [ ] Aufgabe kann gelöscht werden (mit Bestätigungsdialog)
- [ ] Aufgaben werden pro Mitglied gefiltert angezeigt
- [ ] Offene Aufgaben erscheinen vor erledigten; sortiert nach Fälligkeit
- [ ] Überfällige Aufgaben (Fälligkeit in der Vergangenheit) werden visuell hervorgehoben
- [ ] Alle Aufgaben in localStorage persistiert
- [ ] Zähler offener Aufgaben ist im Familien-Übersichtsdashboard sichtbar

## Edge Cases
- Was passiert, wenn kein Titel eingegeben wird? → Validierung: Pflichtfeld
- Was passiert, wenn ein Mitglied gelöscht wird? → Alle Aufgaben dieses Mitglieds werden mitgelöscht (PROJ-1)
- Was passiert bei sehr langen Titeln? → Text abschneiden mit Tooltip für vollen Text
- Was passiert, wenn eine Aufgabe kein Fälligkeitsdatum hat? → Wird am Ende der Liste angezeigt
- Was passiert, wenn es 100+ Aufgaben gibt? → Liste ist scrollbar, erledigte Aufgaben können ein-/ausgeblendet werden

## Technical Requirements
- localStorage-Key: `tasks` (JSON-Array)
- Schema: `{ id: string, memberId: string, title: string, description?: string, dueDate?: string, completed: boolean, createdAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
