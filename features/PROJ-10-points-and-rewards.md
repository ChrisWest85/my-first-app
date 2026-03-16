# PROJ-10: Punkte & Belohnungen

## Status: Planned
**Created:** 2026-03-16
**Last Updated:** 2026-03-16

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Punktekonten sind an Familienmitglieder gebunden
- Requires: PROJ-9 (Kanban Board) — Hauptquelle für automatische Punktebuchungen

## User Stories
- Als Familienmitglied möchte ich mein aktuelles Punkteguthaben sehen, damit ich weiß, wie viele Punkte ich schon gesammelt habe.
- Als Elternteil möchte ich das Punkteguthaben aller Familienmitglieder auf einen Blick sehen, damit ich den Überblick behalte.
- Als Elternteil möchte ich Belohnungen definieren mit Name und Punktekosten, damit Kinder auf ein Ziel hinarbeiten können.
- Als Kind möchte ich meine gesammelten Punkte gegen eine Belohnung einlösen, damit mein Einsatz belohnt wird.
- Als Familienmitglied möchte ich meine Punktehistorie sehen (welche Karte, wann, wie viele Punkte), damit ich nachvollziehen kann, wie ich meine Punkte verdient oder verloren habe.
- Als Elternteil möchte ich Punkte manuell anpassen (Korrektur oder Bonus), damit ich Ausnahmen flexibel handhaben kann.

## Acceptance Criteria
- [ ] Jedes Familienmitglied hat ein Punktekonto (Anfangswert: 0)
- [ ] Punkte werden automatisch gebucht, wenn eine Kanban-Karte mit Punkten und zugewiesenem Mitglied als erledigt markiert wird (PROJ-9)
- [ ] Punkte werden rückgängig gemacht, wenn eine erledigte Karte wieder auf "offen" gesetzt wird (PROJ-9)
- [ ] Punktehistorie zeigt alle Transaktionen: Datum, Beschreibung (Kartenname oder manuelle Begründung), Punkte (+/-)
- [ ] Aktueller Kontostand ist jederzeit sichtbar (Gesamtsumme aller Transaktionen)
- [ ] Eltern können Belohnungen erstellen mit: Name (Pflicht), Punktekosten (Pflicht, ganzzahlig > 0), Beschreibung (optional)
- [ ] Belohnungen können bearbeitet und gelöscht werden (nur Eltern)
- [ ] Familienmitglied kann eine Belohnung einlösen, wenn Kontostand ≥ Punktekosten
- [ ] Nach dem Einlösen werden die Kosten als negative Transaktion in der Punktehistorie vermerkt
- [ ] Elternteil kann Punkte manuell anpassen (positiv oder negativ) mit Pflicht-Begründung
- [ ] Negativer Kontostand ist möglich (z.B. durch Strafpunkte)
- [ ] Alle Daten werden in localStorage persistiert

## Edge Cases
- Einlösen mit zu wenig Punkten? → Button deaktiviert, visueller Hinweis ("Noch X Punkte fehlen")
- Belohnung löschen, die bereits eingelöst wurde? → Löschen erlaubt, bestehende Transaktionen in der Historie bleiben erhalten
- Karte wird gelöscht nach dem Erledigen (mit Punkten)? → Transaktion bleibt in der Punktehistorie, Beschreibung zeigt "[Gelöschte Karte]"
- Familienmitglied wird gelöscht? → Punktehistorie und Kontostand bleiben für Eltern einsehbar (Archiv), werden nicht dem aktiven System hinzugefügt
- Manuelle Anpassung ohne Begründung? → Validierung: Begründung ist Pflichtfeld
- Kontostand sehr negativ? → Kein Limit nach unten, negativer Kontostand wird deutlich angezeigt (z.B. rote Zahl)

## Technical Requirements
- localStorage-Keys:
  - `points_transactions` — `{ id, memberId, points: number, description: string, source: "card"|"manual"|"redemption", cardId?, rewardId?, createdAt }`
  - `points_rewards` — `{ id, name, description?, cost: number, createdAt }`
- Kontostand wird immer dynamisch aus den Transaktionen berechnet (keine separate Balance-Speicherung)
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
