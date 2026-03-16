# PROJ-11: Kinder-Design-Theme

## Status: In Review
**Created:** 2026-03-16
**Last Updated:** 2026-03-16

## Implementation Notes (Frontend)
- Created `ActiveMemberContext` for tracking the currently selected member (header avatar click)
- Created `ThemeContext` for reading/writing `familyThemes` in localStorage
- Created `ThemeApplier` component that sets CSS class on `<html>` based on active member's theme
- Added `theme-kids-vivid` and `theme-kids-soft` CSS custom property overrides in `globals.css`
- Updated `AppShell` to wrap with `ThemeProvider` and `ActiveMemberProvider`
- Updated `Header` to make avatars clickable with active state highlighting (desktop + mobile)
- Updated `MemberFormDialog` to include theme selection (3 radio-style options)
- Updated home page with themed greetings and contextual emojis per theme
- Theme cleanup on member deletion integrated into `FamilyMembersContext`

## Dependencies
- Requires: PROJ-1 (Familienmitglieder-Verwaltung) — Theme-Einstellung wird im Mitgliedsprofil gespeichert

## Overview
Eltern können für jedes Familienmitglied ein individuelles Design-Theme auswählen. Für Kinder stehen zwei kindgerechte Themes zur Verfügung: "Bunt & Verspielt" und "Sanft & Freundlich". Das gewählte Theme wird app-weit angewendet — inkl. Header, Navigation, Dashboard und allen Unterseiten.

## User Stories
- Als Elternteil möchte ich für mein Kind ein Kinder-Theme aktivieren, damit die App bunter und einladender wirkt.
- Als Elternteil möchte ich zwischen "Bunt & Verspielt" und "Sanft & Freundlich" wählen können, damit ich das Design an das Alter und den Geschmack meines Kindes anpassen kann.
- Als Kind möchte ich, dass die gesamte App in meinem persönlichen Design erscheint, damit sie sich nach meiner eigenen App anfühlt.
- Als Kind möchte ich Emojis als visuelle Unterstützung auf der App sehen, damit ich Inhalte schneller erfasse.
- Als Elternteil möchte ich das Standard-Design (für Erwachsene) behalten, damit mein eigenes Dashboard ruhig und übersichtlich bleibt.

## Acceptance Criteria

### Theme-Einstellung
- [ ] In der Mitgliedsverwaltung (PROJ-1) gibt es pro Mitglied ein Dropdown/Auswahl für das Theme: "Standard", "Bunt & Verspielt", "Sanft & Freundlich"
- [ ] Die Theme-Einstellung wird in localStorage gespeichert und bleibt nach Seiten-Reload erhalten
- [ ] Änderungen am Theme werden sofort sichtbar (kein Reload nötig)

### App-weite Anwendung
- [ ] Das gewählte Theme wird auf die gesamte App angewendet: Header, Navigation, Hintergrund, Karten, Buttons, Typografie
- [ ] Theme-Wechsel erfolgt, wenn das aktive Familienmitglied gewechselt wird
- [ ] Kein Theme-Override durch andere Komponenten (z.B. shadcn-Defaults)

### Theme: "Bunt & Verspielt"
- [ ] Hintergrundfarbe: helles, buntes Gradient oder Pastellfläche mit kräftigen Akzenten (Lila, Orange, Gelb, Grün)
- [ ] Karten haben größere border-radius (z.B. rounded-2xl oder rounded-3xl)
- [ ] Schriftgröße ist etwas größer als Standard (mind. text-base, Überschriften text-2xl+)
- [ ] Relevante UI-Elemente haben kontextuelle Emojis (z.B. 📋 bei Aufgaben, 📅 bei Terminen, 🏆 bei Punkten)
- [ ] Buttons sind auffällig gefärbt (kein grau), mit Hover-Animation (z.B. leichtes Wackeln oder Scale)
- [ ] Begrüßung auf dem Dashboard zeigt Emoji: z.B. "🌈 Hallo, Emma! 👋"

### Theme: "Sanft & Freundlich"
- [ ] Hintergrundfarbe: weiche Pastelltöne (Mintgrün, Hellblau, Hellrosa, Hellgelb)
- [ ] Karten haben größere border-radius (gleich wie "Bunt")
- [ ] Schriftgröße identisch wie "Bunt & Verspielt"
- [ ] Emojis als dezente Begleitung (nicht überladen), z.B. 🌸 🌟 🌿
- [ ] Buttons in ruhigeren Pastellfarben, mit sanften Hover-Übergängen
- [ ] Begrüßung auf dem Dashboard: z.B. "🌸 Hallo, Emma!"

### Standard-Theme
- [ ] Das Standard-Theme (für Erwachsene) bleibt unverändert — keine Emojis oder auffälligen Farben
- [ ] Standard ist der Default für alle neuen Familienmitglieder

## Edge Cases
- **Unbekanntes Theme in localStorage:** Fallback auf "Standard"-Theme
- **Mitglied ohne Theme-Setting:** Default ist immer "Standard"
- **Theme-Wechsel während aktiver Seite:** Änderung wird sofort sichtbar ohne Datenverlust
- **Sehr langer Kindername:** Begrüßungstext bricht korrekt um, kein Overflow
- **Theme auf Mobilgeräten:** Kinder-Design ist auch auf kleinen Bildschirmen lesbar und nicht überladen
- **Zwei Kinder mit verschiedenen Themes:** Jedes Kind hat sein eigenes Theme, kein gegenseitiger Override

## Technical Requirements
- Theme-Implementierung via CSS-Klasse am `<html>` oder `<body>` Tag (z.B. `theme-kids-vivid`, `theme-kids-soft`)
- Theme-Werte in Tailwind-CSS oder CSS-Custom-Properties definieren
- localStorage-Key: `familyThemes` (Objekt: `{ memberId: "standard" | "kids-vivid" | "kids-soft" }`)
- Keine externen Abhängigkeiten nötig (kein Theme-Framework)
- Performance: Theme-Wechsel < 100ms

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Ausgangslage
Die App hat einen `FamilyMembersContext` (PROJ-1) und einen `AppShell` als zentralen Wrapper. `globals.css` verwendet bereits CSS Custom Properties für alle shadcn/ui-Farben. Der Header zeigt alle Member-Avatare an, hat aber noch kein Konzept eines "aktiven Mitglieds".

---

### Neues Konzept: Aktives Mitglied

Der Header wird um eine **Mitglieder-Auswahl** erweitert: Klickt man einen Avatar an, wird dieses Mitglied als "aktiv" markiert (visuell hervorgehoben). Das aktive Mitglied bestimmt das app-weit geltende Theme. Der Zustand wird in einem neuen `ActiveMemberContext` gehalten.

---

### Komponentenstruktur

```
layout.tsx
+-- <html> (erhält dynamisch Theme-Klasse, z.B. "theme-kids-vivid")
    +-- AppShell
        +-- FamilyMembersProvider (bestehend)
            +-- ActiveMemberProvider (NEU)
                +-- ThemeApplier (NEU, setzt Klasse auf <html>)
                +-- Header (angepasst)
                |   +-- Member-Avatare (klickbar, aktives Mitglied hervorgehoben)
                +-- main > {children}

Settings / Mitgliedsverwaltung (PROJ-1)
+-- MemberFormDialog (angepasst)
    +-- Theme-Auswahl (NEU: 3 Optionen)
```

---

### Datenmodell

**Neuer localStorage-Key: `"familyThemes"`**

```
Inhalt: {
  "m_abc123": "standard",
  "m_def456": "kids-vivid",
  "m_ghi789": "kids-soft"
}
```

- Jedes Mitglied hat einen Eintrag, keyed by Member-ID
- Default für neue Mitglieder: `"standard"`
- Werte: `"standard"` | `"kids-vivid"` | `"kids-soft"`

**Aktives Mitglied:**
- Wird in `ActiveMemberContext` als React-State gehalten (kein localStorage — Reset bei Seitenladung ist OK)
- Initialer Wert: erstes Mitglied in der Liste (oder keines, bis geklickt)

---

### Theme-Anwendung via CSS Custom Properties

**Prinzip:** Der `ThemeApplier` setzt eine CSS-Klasse auf `<html>`. In `globals.css` werden für diese Klassen die CSS-Variablen überschrieben. Da shadcn/ui ausschließlich diese Variablen verwendet, erbt jede Komponente das Theme automatisch — ohne Änderungen an einzelnen Komponenten.

```
globals.css:

:root { ... }                       ← Standard (unverändert)

.theme-kids-vivid {
  --background: ...                 ← buntes Gradient / Pastell
  --primary: ...                    ← kräftiger Akzent (Lila/Orange)
  --radius: 1rem                    ← größere Rundungen
  font-size: 106.25%                ← leicht größere Schrift
}

.theme-kids-soft {
  --background: ...                 ← weiche Pastelltöne
  --primary: ...                    ← ruhiger Akzent
  --radius: 1rem
  font-size: 106.25%
}
```

**Theme-Wechsel:** `ThemeApplier` liest das aktive Mitglied + sein Theme und setzt `document.documentElement.className`. Wechsel < 100ms garantiert (reine DOM-Operation).

---

### Neue Kontexte & Hooks

| Name | Verantwortung |
|---|---|
| `ActiveMemberContext` (NEU) | Hält das aktuell aktive Mitglied; stellt `activeMember` + `setActiveMember` bereit |
| `ThemeContext` (NEU) | Liest/schreibt `familyThemes` in localStorage; stellt `getTheme(memberId)` + `setTheme(memberId, theme)` bereit |
| `ThemeApplier` (NEU, Client Component) | Kombiniert `activeMember` + `getTheme` → setzt CSS-Klasse auf `<html>` via `useEffect` |

---

### Theme-Auswahl in der Mitgliedsverwaltung

In `MemberFormDialog` (PROJ-1) wird ein neues Feld hinzugefügt:

```
Theme-Auswahl (Radio-Gruppe oder Select):
  ○ Standard          — Ruhig & übersichtlich (für Erwachsene)
  ○ Bunt & Verspielt  — Kräftige Farben, Emojis, größere Schrift
  ○ Sanft & Freundlich — Pastelltöne, dezente Emojis, größere Schrift
```

Änderung wird sofort in `ThemeContext` geschrieben → bei aktivem Mitglied sofortige Vorschau.

---

### Emoji-Unterstützung

Die Kinder-Themes fügen kontextuelle Emojis über CSS-`::before`-Pseudo-Elemente oder bedingte Rendering-Logik hinzu. Da Emojis nur bei Kinder-Themes erscheinen sollen:
- **Ansatz:** Komponenten prüfen `activeTheme !== "standard"` und rendern Emojis bedingt
- Alternativ: CSS `.theme-kids-vivid .task-icon::before { content: "📋 " }` — kein JS nötig

---

### Tech-Entscheidungen

| Entscheidung | Warum |
|---|---|
| CSS Custom Properties | shadcn/ui nutzt sie bereits — Theme-Wechsel ist "gratis", keine Komponenten müssen geändert werden |
| Eigener `ActiveMemberContext` | Trennt Member-CRUD (PROJ-1) von der Auswahl-Logik; verhindert unnötige Re-Renders |
| Eigener `ThemeContext` | Theme-Persistenz ist unabhängig von Member-Verwaltung |
| Klasse auf `<html>` | Next.js rendert `<html>` in `layout.tsx`, wo `AppShell` sitzt — direkt zugänglich via `document.documentElement` |
| Kein externes Theme-Framework | `next-themes` ist für Dark/Light Mode ausgelegt; unser Multi-Member-Ansatz ist spezifischer und braucht nur ~80 Zeilen eigenen Code |

---

### Abhängigkeiten

Keine neuen npm-Pakete nötig.

## QA Test Results
_To be added by /qa_

## Deployment
_To be added by /deploy_
