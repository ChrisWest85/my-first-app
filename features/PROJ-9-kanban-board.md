# PROJ-9: Kanban Board

## Status: In Review
**Created:** 2026-03-16
**Last Updated:** 2026-03-16

### Implementation Notes (Frontend)
- Installed `@hello-pangea/dnd` for drag-and-drop and `calendar` shadcn component for date picker
- Created `useKanban` hook with full CRUD for boards, lists, and cards (localStorage-based)
- Board overview with grid layout, create/rename/delete boards
- Board detail with horizontal scrolling kanban columns, drag-and-drop cards
- Card form dialog with title, description, due date (calendar picker), member assignment, and points (-10 to +10)
- Mobile fallback: "In Liste verschieben" dropdown shown in card edit dialog on mobile
- Completed cards toggle (hide/show per list), overdue date highlighting
- Cascade cleanup: deleting a family member unassigns their kanban cards (keeps cards)
- Navigation: added Kanban link to header and home page overview
- Visibility rules: parents see all boards, children see family boards + own personal boards
- All confirmation dialogs for destructive actions (delete board/list/card)

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Karten werden Mitgliedern zugewiesen
- Integrates with: PROJ-10 (Punkte & Belohnungen) — Erledigen einer Karte bucht Punkte auf das Mitgliederkonto

## Note on Overlap
Dieses Feature ersetzt funktional PROJ-8 (Verhaltensprotokoll): Karten mit negativen Punkten dienen als Verhaltenseinträge. PROJ-8 kann als eigenständiges Feature eingestellt werden.

## User Stories
- Als Elternteil möchte ich ein neues Board erstellen (persönlich oder familienweite), damit ich Aufgaben und Inhalte strukturiert organisieren kann.
- Als Elternteil möchte ich Listen (Spalten) innerhalb eines Boards erstellen, umbenennen und löschen, damit ich den Workflow definieren kann.
- Als Familienmitglied möchte ich eine Karte in einer Liste erstellen mit Titel, Beschreibung, Fälligkeitsdatum, zugewiesenem Mitglied und Punkten, damit Aufgaben klar beschrieben sind.
- Als Familienmitglied möchte ich Karten per Drag & Drop zwischen Listen verschieben, damit der Status einer Aufgabe einfach aktualisiert werden kann.
- Als Familienmitglied möchte ich eine Karte als erledigt markieren, damit die zugewiesenen Punkte automatisch gebucht werden.
- Als Elternteil möchte ich ein Board umbenennen oder löschen, damit die Board-Übersicht aktuell bleibt.
- Als Kind möchte ich alle Familienboards sowie meine eigenen persönlichen Boards sehen, aber nicht die persönlichen Boards anderer Familienmitglieder.
- Als Elternteil möchte ich alle Boards aller Familienmitglieder sehen und verwalten.

## Acceptance Criteria
- [ ] Board kann erstellt werden mit: Name (Pflicht), Typ (persönlich oder Familie)
- [ ] Boards können umbenannt und gelöscht werden (nur Eltern; eigene persönliche Boards können auch Kinder löschen)
- [ ] Board-Übersicht zeigt alle zugänglichen Boards: Familienboards für alle, persönliche Boards nur für Ersteller und Eltern
- [ ] Listen können einem Board hinzugefügt, umbenannt und gelöscht werden (nur Eltern)
- [ ] Karte kann erstellt werden mit: Titel (Pflicht), Beschreibung (optional), Fälligkeitsdatum (optional), zugewiesenes Mitglied (optional), Punkte (-10 bis +10, optional)
- [ ] Karten können bearbeitet werden (alle Felder)
- [ ] Karten können gelöscht werden (mit Bestätigungsdialog)
- [ ] Karten können per Drag & Drop zwischen Listen innerhalb eines Boards verschoben werden
- [ ] Karte kann als erledigt markiert werden; wenn Punkte und ein zugewiesenes Mitglied vorhanden, wird PROJ-10 notifiziert
- [ ] Karte kann wieder auf "offen" gesetzt werden; Punktebuchung wird rückgängig gemacht (via PROJ-10)
- [ ] Alle Daten werden in localStorage persistiert

## Edge Cases
- Board mit bestehenden Karten löschen? → Bestätigungsdialog mit Warnung ("X Karten werden gelöscht"), Löschen erst nach expliziter Bestätigung
- Liste mit Karten löschen? → Bestätigungsdialog mit Warnung, alle Karten der Liste werden mitgelöscht
- Karte ohne zugewiesenes Mitglied erledigen? → Status wechselt auf erledigt, keine Punktebuchung
- Karte ohne Punkte-Feld erledigen? → Status wechselt auf erledigt, keine Punktebuchung
- Familienmitglied wird gelöscht (PROJ-1)? → Zugewiesene Karten bleiben erhalten, Zuweisung wird auf "niemand" gesetzt
- Drag & Drop auf Mobilgeräten nicht verfügbar? → Fallback: Karte öffnen und über Dropdown "In Liste verschieben" auswählen
- Sehr viele Karten in einer Liste? → Liste ist scrollbar; erledigte Karten können ein-/ausgeblendet werden
- Board-Name leer beim Erstellen? → Validierung: Pflichtfeld, Erstellen nicht möglich

## Technical Requirements
- localStorage-Keys:
  - `kanban_boards` — `{ id, name, type: "family"|"personal", ownerId, createdAt }`
  - `kanban_lists` — `{ id, boardId, name, position, createdAt }`
  - `kanban_cards` — `{ id, listId, boardId, title, description?, dueDate?, assignedMemberId?, points?: number (-10..10), completed: boolean, completedAt?, createdAt }`
- Drag & Drop: Bibliothek `@hello-pangea/dnd` (react-beautiful-dnd Fork, React 18+ kompatibel)
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Komponentenstruktur

```
/kanban (Seite)
+-- KanbanPage
    +-- BoardOverview (Standard-Ansicht)
    |   +-- BoardGrid
    |   |   +-- BoardCard (pro Board — klickbar)
    |   |       +-- BoardTypeTag (Familie / Persönlich)
    |   |       +-- BoardActions (Umbenennen, Löschen) [nur Eltern / Eigentümer]
    |   +-- CreateBoardButton → CreateBoardDialog
    |       +-- BoardNameInput
    |       +-- BoardTypeSelector (Familie oder Persönlich)
    |
    +-- BoardDetail (wenn Board geöffnet)
        +-- BoardHeader
        |   +-- BoardTitle (inline umbenennable)
        |   +-- BoardActions (Löschen) [nur Eltern]
        |   +-- BackToOverviewButton
        +-- KanbanBoard (horizontales Scroll-Layout)
        |   +-- DragDropContext (@hello-pangea/dnd)
        |       +-- ListColumn (pro Liste, draggable target)
        |       |   +-- ListHeader
        |       |   |   +-- ListTitle (inline umbenennable)
        |       |   |   +-- ListActions (Löschen) [nur Eltern]
        |       |   +-- CardList (scrollbar)
        |       |   |   +-- KanbanCard (pro Karte, draggable)
        |       |   |       +-- CardTitle
        |       |   |       +-- CardMeta (Fälligkeitsdatum, MemberAvatar, Punkte-Badge)
        |       |   |       +-- CompleteToggle (Checkbox)
        |       |   |       +-- CardActions (Bearbeiten, Löschen)
        |       |   +-- AddCardButton → CardFormDialog
        |       +-- AddListButton [nur Eltern]
        +-- CardFormDialog (Erstellen & Bearbeiten)
            +-- TitleInput (Pflicht)
            +-- DescriptionTextarea
            +-- DueDatePicker (Popover + Kalender)
            +-- MemberSelect (aus PROJ-1 Daten)
            +-- PointsInput (-10 bis +10)
            +-- FallbackMoveSelector (Mobile: "In Liste verschieben")
```

### Datenmodell

**localStorage-Key: `kanban_boards`**
Jedes Board hat: ID, Name, Typ (family | personal), Eigentümer-ID (→ PROJ-1), Erstellungsdatum.

**localStorage-Key: `kanban_lists`**
Jede Liste hat: ID, Board-ID, Name, Position (Zahl für Reihenfolge), Erstellungsdatum.

**localStorage-Key: `kanban_cards`**
Jede Karte hat: ID, Listen-ID, Board-ID, Titel (Pflicht), Beschreibung (optional), Fälligkeitsdatum (optional), Mitglied-ID (optional, → PROJ-1), Punkte -10..+10 (optional), erledigt (boolean), Abschlussdatum (optional), Erstellungsdatum.

**Sichtbarkeitsregeln:**
- Eltern: alle Boards sichtbar (Familien + persönliche aller Mitglieder)
- Kinder: alle Familienboards + nur eigene persönliche Boards

### Tech-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| `@hello-pangea/dnd` für Drag & Drop | Aktiv gewarteter Fork von react-beautiful-dnd, React 18 kompatibel |
| localStorage (kein Backend) | Projekt-Constraint: kein Login, kein Server |
| Drei getrennte localStorage-Keys | Boards/Listen/Karten separat — effizienter beim Updaten |
| Position als Zahl bei Listen | Einfaches Umsortieren ohne komplexe Datenstrukturen |
| Mobil-Fallback per Dropdown | Drag & Drop auf Touch unzuverlässig — gleichwertiger Ersatz |
| MemberAvatar wiederverwendet | Bereits aus PROJ-1 vorhanden |
| Inline-Umbenennung von Boards/Listen | Bessere UX als separater Dialog |

### Integrationen

- **PROJ-1:** Mitgliederliste für Kartenzuweisung. Bei Mitglied-Löschung → Zuweisung auf "niemand" setzen.
- **PROJ-10:** Karte erledigt + Punkte + Mitglied → Punktebuchung auslösen. Rücksetzen → Buchung rückgängig machen.

### Neue Abhängigkeiten

| Paket | Zweck |
|---|---|
| `@hello-pangea/dnd` | Drag & Drop für Karten zwischen Listen |

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
