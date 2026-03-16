# PROJ-3: Persönliches Mitglieder-Dashboard

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung)
- Requires: PROJ-2 (Familien-Übersichtsdashboard) — Navigation dorthin

## User Stories
- Als Familienmitglied möchte ich mein eigenes Dashboard sehen, das meine Aufgaben, Termine und Notizen bündelt.
- Als Kind möchte ich nur mein eigenes Dashboard sehen und nicht auf die Daten anderer Familienmitglieder zugreifen.
- Als Elternteil möchte ich das Dashboard jedes Familienmitglieds einsehen können, um zu helfen oder zu verwalten.
- Als Nutzer möchte ich vom persönlichen Dashboard zurück zur Familienübersicht navigieren.
- Als Elternteil möchte ich auf dem persönlichen Dashboard eines Kindes schnell eine neue Aufgabe oder einen Termin hinzufügen.

## Acceptance Criteria
- [ ] Jedes Familienmitglied hat eine eigene Seite unter `/member/[id]`
- [ ] Die Seite zeigt Name, Farbe/Avatar des Mitglieds prominent oben
- [ ] Aufgaben-Widget: Liste der offenen und erledigten Aufgaben des Mitglieds
- [ ] Termine-Widget: Bevorstehende Termine in chronologischer Reihenfolge
- [ ] Notizen-Widget: Kurznotizen des Mitglieds
- [ ] Verhaltensprotokoll-Widget (nur für Kinder): Letzte Einträge von Eltern
- [ ] "Zurück zur Übersicht"-Navigation ist immer sichtbar
- [ ] Quick-Action-Buttons: "Aufgabe hinzufügen", "Termin hinzufügen"
- [ ] Responsive Layout: funktioniert auf Desktop und Tablet

## Edge Cases
- Was passiert, wenn die ID in der URL ungültig/nicht vorhanden ist? → 404-Seite oder Redirect zur Hauptseite
- Was passiert, wenn ein Mitglied keine Daten hat? → Leerzustände pro Widget mit Hinweis
- Was passiert, wenn ein Kind das Dashboard eines anderen Kindes direkt per URL aufruft? → In MVP kein harter Schutz (kein Login), aber Elternrolle deutlich kennzeichnen

## Technical Requirements
- Route: `/member/[id]` (Next.js Dynamic Route)
- Liest Daten aus localStorage nach Mitglieds-ID gefiltert
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
