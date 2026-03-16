# PROJ-5: Termin-Verwaltung

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Termine werden Mitgliedern zugewiesen

## User Stories
- Als Elternteil möchte ich einem Familienmitglied einen Termin eintragen (Titel, Datum, Uhrzeit, Ort), damit niemand einen wichtigen Termin vergisst.
- Als Familienmitglied möchte ich meine bevorstehenden Termine chronologisch sehen.
- Als Elternteil möchte ich einen Termin bearbeiten oder löschen.
- Als Nutzer möchte ich im Familien-Übersichtsdashboard die heutigen Termine aller Mitglieder sehen.
- Als Elternteil möchte ich einen Termin mehreren Familienmitgliedern gleichzeitig zuweisen können (z.B. Familienausflug).

## Acceptance Criteria
- [ ] Termin kann erstellt werden mit: Titel (Pflicht), Datum (Pflicht), Uhrzeit (optional), Ort (optional), zugewiesene Mitglieder (Pflicht, Mehrfachauswahl)
- [ ] Termin kann bearbeitet werden (alle Felder)
- [ ] Termin kann gelöscht werden (mit Bestätigungsdialog)
- [ ] Termine werden pro Mitglied chronologisch (aufsteigend) angezeigt
- [ ] Vergangene Termine werden visuell anders dargestellt (ausgegraut)
- [ ] Heutige Termine werden im Familien-Übersichtsdashboard hervorgehoben
- [ ] Alle Termine in localStorage persistiert
- [ ] Termine können einem oder mehreren Mitgliedern zugewiesen werden

## Edge Cases
- Was passiert, wenn Datum in der Vergangenheit liegt? → Erlaubt (für Protokoll), aber visuell als "vergangen" markiert
- Was passiert, wenn kein Mitglied ausgewählt wird? → Validierung: Mindestens 1 Mitglied Pflicht
- Was passiert, wenn ein Mitglied gelöscht wird? → Termin bleibt für andere zugewiesene Mitglieder bestehen; bei letztem Mitglied → Termin löschen
- Was passiert bei gleichzeitigen Terminen zur gleichen Zeit? → Beide anzeigen, kein Konflikt-Check
- Was passiert, wenn ein Termin kein Ende-Datum hat? → Kein Enddatum notwendig (Einzeltermine)

## Technical Requirements
- localStorage-Key: `appointments` (JSON-Array)
- Schema: `{ id: string, memberIds: string[], title: string, date: string, time?: string, location?: string, createdAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
