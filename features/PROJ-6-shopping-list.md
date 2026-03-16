# PROJ-6: Einkaufsliste

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Einträge können von Mitgliedern hinzugefügt werden

## User Stories
- Als Familienmitglied möchte ich Artikel zur gemeinsamen Einkaufsliste hinzufügen, damit nichts vergessen wird.
- Als Elternteil möchte ich Artikel als gekauft markieren, damit die Liste beim Einkauf aktuell bleibt.
- Als Elternteil möchte ich alle erledigten Artikel auf einmal löschen, um die Liste zurückzusetzen.
- Als Nutzer möchte ich sehen, wer einen Artikel hinzugefügt hat.
- Als Familienmitglied möchte ich einen Artikel mit Menge und optionaler Kategorie hinzufügen.

## Acceptance Criteria
- [ ] Artikel kann hinzugefügt werden mit: Name (Pflicht), Menge (optional), Kategorie (optional), hinzugefügt von (optional, Mitglied auswählen)
- [ ] Artikel kann als gekauft/offen markiert werden (Toggle)
- [ ] Artikel kann bearbeitet und gelöscht werden
- [ ] "Erledigt löschen"-Button entfernt alle als gekauft markierten Artikel (mit Bestätigung)
- [ ] Liste zeigt ungekaufte Artikel oben, gekaufte unten (ausgegraut)
- [ ] Einkaufsliste ist für alle Familienmitglieder sichtbar (gemeinsame Liste)
- [ ] Alle Daten in localStorage persistiert

## Edge Cases
- Was passiert, wenn kein Artikelname eingegeben wird? → Validierung: Pflichtfeld
- Was passiert, wenn die Liste leer ist? → Leerzustand mit "Artikel hinzufügen"-Hinweis
- Was passiert bei Duplikaten (gleicher Artikel)? → Erlaubt, kein Zusammenführen
- Was passiert bei sehr vielen Artikeln (50+)? → Scrollbare Liste, Kategorien helfen zur Gruppierung

## Technical Requirements
- localStorage-Key: `shopping-list` (JSON-Array)
- Schema: `{ id: string, name: string, quantity?: string, category?: string, addedByMemberId?: string, purchased: boolean, createdAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
