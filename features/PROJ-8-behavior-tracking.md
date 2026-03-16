# PROJ-8: Verhaltensprotokoll

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Einträge betreffen Kind-Mitglieder
- Requires: PROJ-3 (Persönliches Mitglieder-Dashboard) — Widget auf dem Kinder-Dashboard

## User Stories
- Als Elternteil möchte ich für ein Kind einen Verhaltenseintrag erstellen (positiv/negativ, Beschreibung), damit ich Verhaltensmuster nachverfolgen kann.
- Als Elternteil möchte ich vergangene Verhaltenseinträge eines Kindes einsehen.
- Als Elternteil möchte ich einen Verhaltenseintrag bearbeiten oder löschen.
- Als Elternteil möchte ich auf dem persönlichen Dashboard eines Kindes eine Übersicht der letzten Verhaltenseinträge sehen.
- Als Elternteil möchte ich Verhaltenseinträge nach Datum filtern, um Entwicklungen über Zeit zu beobachten.

## Acceptance Criteria
- [ ] Verhaltenseintrag kann nur für Mitglieder mit Rolle "Kind" erstellt werden
- [ ] Eintrag hat: Typ (Positiv / Negativ), Beschreibung (Pflicht), Datum (Standard: heute), eingetragen von (Elternteil)
- [ ] Einträge sind nur auf dem persönlichen Dashboard des betreffenden Kindes sichtbar
- [ ] Einträge werden chronologisch angezeigt (neueste zuerst)
- [ ] Positive und negative Einträge sind visuell unterschieden (Farbe/Icon)
- [ ] Eintrag kann bearbeitet und gelöscht werden
- [ ] Alle Einträge in localStorage persistiert
- [ ] Kurzübersicht (letzte 5 Einträge) auf dem persönlichen Dashboard; vollständige Liste auf Unterseite

## Edge Cases
- Was passiert, wenn ein Verhaltenseintrag für ein Elternteil erstellt werden soll? → Nicht möglich — Eltern werden nicht in der Auswahl angezeigt
- Was passiert, wenn keine Kinder in der Familie existieren? → Widget wird nicht angezeigt
- Was passiert, wenn ein Kind gelöscht wird? → Alle Verhaltenseinträge dieses Kindes werden mitgelöscht
- Was passiert bei sehr langen Beschreibungen? → Text wird auf 500 Zeichen begrenzt
- Was passiert, wenn es 100+ Einträge gibt? → Pagination oder "Mehr laden"-Button

## Technical Requirements
- localStorage-Key: `behavior-logs` (JSON-Array)
- Schema: `{ id: string, childMemberId: string, parentMemberId?: string, type: 'positive' | 'negative', description: string, date: string, createdAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
