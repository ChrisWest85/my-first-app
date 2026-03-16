# PROJ-2: Familien-Übersichtsdashboard

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Mitglieder müssen existieren

## User Stories
- Als Elternteil möchte ich auf einer Hauptseite alle Familienmitglieder mit ihrem aktuellen Status sehen, damit ich schnell den Überblick habe.
- Als Elternteil möchte ich für jedes Familienmitglied eine Zusammenfassung seiner offenen Aufgaben und heutigen Termine sehen.
- Als Nutzer möchte ich von der Übersicht direkt auf das persönliche Dashboard eines Familienmitglieds navigieren.
- Als Elternteil möchte ich auf der Übersicht sehen, welche Kinder Aufgaben erledigt oder offen haben, um Fortschritte zu verfolgen.
- Als Elternteil möchte ich die Familie bequem verwalten (Mitglied hinzufügen) direkt von der Übersicht aus.

## Acceptance Criteria
- [ ] Hauptseite zeigt alle Familienmitglieder als Karten/Widgets
- [ ] Jede Karte zeigt: Name, Farbe/Avatar, Anzahl offener Aufgaben, nächster Termin heute
- [ ] Klick auf eine Karte navigiert zum persönlichen Dashboard dieses Mitglieds
- [ ] Button "Mitglied hinzufügen" öffnet den Verwaltungsdialog (aus PROJ-1)
- [ ] Beim ersten Start ohne Mitglieder: Leer-Zustand mit Aufforderung, Familie einzurichten
- [ ] Dashboard aktualisiert sich automatisch, wenn Aufgaben/Termine geändert werden
- [ ] Responsive Layout: funktioniert auf Desktop und Tablet
- [ ] Datum und aktuelle Uhrzeit werden oben angezeigt

## Edge Cases
- Was passiert, wenn keine Familienmitglieder vorhanden sind? → Leer-Zustand mit "Familie einrichten"-Button
- Was passiert bei sehr vielen Mitgliedern (10+)? → Scrollbares Grid, kein Überlauf
- Was passiert, wenn ein Mitglied keine Aufgaben hat? → "Keine offenen Aufgaben" anzeigen
- Was passiert, wenn heute keine Termine vorhanden sind? → "Keine Termine heute" anzeigen

## Technical Requirements
- Seite: `/` (Root-Route)
- Liest Daten aus localStorage (Mitglieder, Aufgaben, Termine)
- Keine API-Calls nötig
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
