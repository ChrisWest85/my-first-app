# PROJ-7: Familien-Notizen

## Status: Planned
**Created:** 2026-03-15
**Last Updated:** 2026-03-15

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Notizen werden Mitgliedern zugeordnet

## User Stories
- Als Familienmitglied möchte ich mir selbst kurze Notizen hinterlassen, die auf meinem persönlichen Dashboard erscheinen.
- Als Elternteil möchte ich einem Kind eine Notiz/Nachricht hinterlassen, die auf dessen Dashboard erscheint.
- Als Familienmitglied möchte ich Notizen bearbeiten und löschen.
- Als Nutzer möchte ich sehen, wer eine Notiz geschrieben hat und wann.

## Acceptance Criteria
- [ ] Notiz kann erstellt werden mit: Text (Pflicht), Empfänger-Mitglied (Pflicht), Verfasser-Mitglied (optional)
- [ ] Notiz erscheint auf dem persönlichen Dashboard des Empfänger-Mitglieds
- [ ] Notiz kann bearbeitet werden
- [ ] Notiz kann gelöscht werden
- [ ] Notizen sind chronologisch sortiert (neueste zuerst)
- [ ] Erstellungsdatum und Verfasser werden angezeigt
- [ ] Alle Notizen in localStorage persistiert

## Edge Cases
- Was passiert, wenn kein Text eingegeben wird? → Validierung: Pflichtfeld
- Was passiert, wenn ein Mitglied gelöscht wird? → Notizen an dieses Mitglied werden mitgelöscht
- Was passiert, wenn der Verfasser gelöscht wird? → Notiz bleibt, Verfasser als "Unbekannt" anzeigen
- Was passiert bei sehr langem Text? → Kein Limit, aber Anzeige ist scrollbar/klappbar

## Technical Requirements
- localStorage-Key: `notes` (JSON-Array)
- Schema: `{ id: string, recipientMemberId: string, authorMemberId?: string, text: string, createdAt: string, updatedAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)
_To be added by /architecture_

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
