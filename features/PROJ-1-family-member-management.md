# PROJ-1: Familienmitglieder-Verwaltung

## Status: In Review
**Created:** 2026-03-15
**Last Updated:** 2026-03-16

## Dependencies
- None

## User Stories
- Als Elternteil möchte ich neue Familienmitglieder hinzufügen (Name, Avatar/Farbe, Rolle), damit die Familie vollständig abgebildet ist.
- Als Elternteil möchte ich Familienmitglieder bearbeiten (Name, Farbe ändern), damit die Daten aktuell bleiben.
- Als Elternteil möchte ich ein Familienmitglied entfernen, damit ausgeschiedene Mitglieder nicht mehr angezeigt werden.
- Als Elternteil möchte ich einer Person die Rolle "Kind" oder "Elternteil" zuweisen, damit die Zugriffsrechte korrekt gesetzt sind.
- Als Nutzer möchte ich alle Familienmitglieder auf einen Blick sehen, damit ich weiß, wer zur Familie gehört.

## Acceptance Criteria
- [ ] Familienmitglied kann mit Name, Rolle (Elternteil/Kind) und Farbe/Avatar erstellt werden
- [ ] Mindestens 1 Mitglied muss die Rolle "Elternteil" haben
- [ ] Familienmitglied kann bearbeitet werden (Name, Farbe, Rolle)
- [ ] Familienmitglied kann gelöscht werden (mit Bestätigungsdialog)
- [ ] Beim Löschen werden alle zugehörigen Aufgaben, Termine und Notizen ebenfalls entfernt
- [ ] Unbegrenzt viele Mitglieder können hinzugefügt werden
- [ ] Alle Mitgliedsdaten werden in localStorage persistiert und überleben einen Seitenreload
- [ ] Jedes Mitglied erhält eine eindeutige ID
- [ ] Mitgliederliste ist in der App-Navigation sichtbar

## Edge Cases
- Was passiert, wenn das letzte Elternteil gelöscht werden soll? → Löschen verhindern, Fehlermeldung anzeigen
- Was passiert, wenn kein Name eingegeben wird? → Validierung: Name ist Pflichtfeld
- Was passiert bei Duplikaten (gleicher Name)? → Erlaubt, aber Warnung anzeigen
- Was passiert, wenn localStorage voll ist? → Fehlermeldung anzeigen
- Was passiert beim ersten App-Start ohne Mitglieder? → Onboarding-Dialog: "Familie einrichten" erzwingen

## Technical Requirements
- Daten: localStorage-Key `family-members` (JSON-Array)
- Schema: `{ id: string, name: string, role: 'parent' | 'child', color: string, avatar?: string, createdAt: string }`
- Browser Support: Chrome, Firefox, Safari (aktuelle Versionen)

---
<!-- Sections below are added by subsequent skills -->

## Tech Design (Solution Architect)

### Komponenten-Struktur

```
Einstellungsseite (/settings)
+-- MemberList (Übersicht aller Mitglieder)
|   +-- MemberCard (pro Mitglied)
|   |   +-- Avatar (Farbe + Initials)
|   |   +-- Name + Rolle (Badge)
|   |   +-- Edit-Button → MemberFormDialog
|   |   +-- Delete-Button → DeleteConfirmDialog
|   +-- AddMemberButton → MemberFormDialog (leer)
+-- MemberFormDialog (hinzufügen / bearbeiten)
|   +-- Namens-Eingabefeld
|   +-- Rollen-Auswahl (Elternteil / Kind)
|   +-- Farbwähler (Auswahl aus 8 Vorschaufarben)
+-- DeleteConfirmDialog (Bestätigung vor dem Löschen)
+-- OnboardingDialog (erzwungen beim ersten Start)
    +-- Erklärungstext
    +-- MemberFormDialog eingebettet

Navigation (global):
+-- Sidebar / Header
    +-- Familienmitglieder-Liste (Avatars + Namen)
        +-- Klick → persönliches Dashboard (PROJ-3)
```

### Datenmodell

Gespeichert in: `localStorage` unter Key `family-members` (JSON-Array)

| Feld | Beschreibung | Beispiel |
|------|-------------|---------|
| `id` | Eindeutige ID (beim Erstellen generiert) | `"m_1234abcd"` |
| `name` | Name des Mitglieds (Pflichtfeld) | `"Maria"` |
| `role` | Rolle in der Familie | `"parent"` oder `"child"` |
| `color` | Farbe für Avatar (aus vordefinierter Palette) | `"#FF6B6B"` |
| `avatar` | Optionaler Emoji als Avatar | `"👧"` |
| `createdAt` | Zeitstempel der Erstellung | `"2026-03-15T10:00:00Z"` |

Cascading Delete: Beim Löschen eines Mitglieds werden auch `tasks`, `appointments`, `notes` in localStorage bereinigt (Keys filtern nach `memberId`).

### Tech-Entscheidungen

| Entscheidung | Warum |
|---|---|
| localStorage (kein Backend) | Kein Login nötig, funktioniert offline, schnell für MVP |
| `useFamilyMembers` Hook | Zentraler Datenzugriff — alle Komponenten nutzen denselben State |
| shadcn/ui `Dialog` | Bereits installiert, konsistentes Design für Add/Edit-Formulare |
| shadcn/ui `AlertDialog` | Bereits installiert, für Bestätigungsdialog beim Löschen |
| shadcn/ui `Avatar` | Bereits installiert, zeigt Farbe + Initialen |
| shadcn/ui `Badge` | Bereits installiert, für Rollen-Label (Elternteil / Kind) |
| 8 Vorschaufarben statt Freitext | Einfacher für Nutzer, konsistentes UI |

### Neue Dateien

- `src/hooks/useFamilyMembers.ts` — Daten-Hook (lesen, schreiben, löschen aus localStorage)
- `src/components/members/MemberCard.tsx`
- `src/components/members/MemberFormDialog.tsx`
- `src/components/members/DeleteConfirmDialog.tsx`
- `src/components/members/OnboardingDialog.tsx`
- `src/app/settings/page.tsx` — Einstellungsseite

### Sonderfälle

- Letztes Elternteil schützen: Delete-Button deaktiviert + Hinweistext
- Onboarding: Bei leerem localStorage öffnet sich OnboardingDialog automatisch und blockiert die App
- Duplikat-Warnung: Gleicher Name erlaubt, aber gelbe Warnmeldung im Formular

## Implementation Notes (Frontend)

**Implemented:** 2026-03-15

### Files Created
- `src/hooks/useFamilyMembers.ts` — Central data hook with CRUD operations, cascading delete, last-parent protection, duplicate name detection, localStorage persistence with quota error handling
- `src/components/members/MemberCard.tsx` — Card component with avatar (color + initials), name, role badge, edit/delete buttons; delete disabled for last parent with tooltip explanation
- `src/components/members/MemberFormDialog.tsx` — Dialog for add/edit with name input, role toggle (parent/child), 8-color picker; supports forceOpen (onboarding) and forceParentRole modes; real-time duplicate name warning
- `src/components/members/MemberAvatar.tsx` — Reusable avatar component with automatic contrast text color, 3 sizes (sm/md/lg)
- `src/components/members/DeleteConfirmDialog.tsx` — AlertDialog with destructive confirmation for member deletion
- `src/components/members/OnboardingDialog.tsx` — Two-step onboarding: welcome screen then forced parent creation form; blocks app interaction
- `src/components/layout/Header.tsx` — Top header with logo, desktop nav links, member avatars with tooltips, mobile hamburger menu (Sheet)
- `src/components/layout/AppShell.tsx` — Wraps app with Header + OnboardingDialog; reads family members from hook
- `src/app/settings/page.tsx` — Settings page with member list grouped by role (parents/children), add button, loading/empty/error states
- `src/app/page.tsx` — Home page with family overview and feature card grid (future features shown as "coming soon")

### Modified Files
- `src/app/layout.tsx` — Updated metadata (title: Familiendashboard, lang: de), wrapped children with AppShell

### Design Decisions
- Used `style={{ backgroundColor }}` on Avatar for dynamic member colors (Tailwind cannot handle arbitrary runtime colors)
- Contrast color for avatar text calculated via luminance formula
- OnboardingDialog uses two-step flow: welcome screen then MemberFormDialog with forceOpen + forceParentRole
- Header shows member avatars on desktop only (space constraint); mobile Sheet shows full member list with names
- Settings page groups members by role (Eltern / Kinder sections) for clarity

## QA Test Results

**Tested by:** QA / Red-Team Pen-Test
**Date:** 2026-03-16
**Build status:** PASS (production build compiles without errors)
**Previous bugs verified:** BUG-1 (shared state via Context), BUG-5 (membersRef.current), BUG-7 (updateMember blocks last parent role change)

---

### Acceptance Criteria Results

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| AC-1 | Familienmitglied kann mit Name, Rolle (Elternteil/Kind) und Farbe/Avatar erstellt werden | PASS | MemberFormDialog provides name input, role toggle (parent/child), 8-color picker. addMember in context creates member with all fields. |
| AC-2 | Mindestens 1 Mitglied muss die Rolle "Elternteil" haben | PASS | deleteMember blocks deletion of last parent. updateMember blocks changing last parent role to child (BUG-7 fix verified). Delete button is disabled in UI for last parent with tooltip. |
| AC-3 | Familienmitglied kann bearbeitet werden (Name, Farbe, Rolle) | PASS | Edit button on MemberCard opens MemberFormDialog with pre-filled data. updateMember applies partial updates. |
| AC-4 | Familienmitglied kann geloescht werden (mit Bestaetigungsdialog) | PASS | DeleteConfirmDialog (AlertDialog) shows member name, warns about cascading delete, has Cancel and destructive Delete button. |
| AC-5 | Beim Loeschen werden alle zugehoerigen Aufgaben, Termine und Notizen ebenfalls entfernt | PASS | Cascading delete in deleteMember filters localStorage keys "tasks", "appointments", "notes" by memberId. |
| AC-6 | Unbegrenzt viele Mitglieder koennen hinzugefuegt werden | PASS | No artificial limit in code. Only constrained by localStorage quota (5-10MB), which is handled with error message. |
| AC-7 | Alle Mitgliedsdaten werden in localStorage persistiert und ueberleben einen Seitenreload | PASS | writeToStorage called on every mutation. readFromStorage called on mount. Storage key is "family-members". |
| AC-8 | Jedes Mitglied erhaelt eine eindeutige ID | PASS | generateId uses `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}` -- timestamp + random. Practically unique. |
| AC-9 | Mitgliederliste ist in der App-Navigation sichtbar | PASS | Header shows member avatars with tooltips on desktop. Mobile Sheet shows full member list with names and roles. |

**Overall AC result: 9/9 PASS**

---

### Edge Case Results

| # | Edge Case | Status | Notes |
|---|-----------|--------|-------|
| EC-1 | Letztes Elternteil loeschen | PASS | Delete button disabled in UI (isLastParent check). deleteMember returns error. updateMember also blocks role change to child for last parent. |
| EC-2 | Kein Name eingegeben | PASS | handleSubmit validates `trimmedName` is non-empty, shows error "Bitte gib einen Namen ein." Input has maxLength=50 with matching validation. |
| EC-3 | Duplikate (gleicher Name) | PASS | hasDuplicateName checked in real-time via useEffect. Yellow warning with AlertTriangle icon shown. Submission is still allowed (not blocked). |
| EC-4 | localStorage voll | PASS | writeToStorage catches QuotaExceededError by name, returns German error message. Error displayed in settings page via global error banner. |
| EC-5 | Erster App-Start ohne Mitglieder | PASS | AppShell shows OnboardingDialog when `!isLoading && members.length === 0`. Dialog blocks ESC and outside clicks. Forces parent role. |

**Overall edge case result: 5/5 PASS**

---

### Bug Report (New Findings)

#### BUG-8: OnboardingDialog "Los geht's" button uses raw HTML button instead of shadcn/ui Button
- **Severity:** Low
- **Priority:** P3
- **Location:** `src/components/members/OnboardingDialog.tsx`, line 57-62
- **Description:** The "Los geht's!" button in the welcome step of the onboarding dialog is a raw `<button>` element with manually copied Tailwind classes instead of using the shadcn/ui `<Button>` component. This violates the project convention "shadcn/ui first: NEVER create custom versions of installed shadcn components" from CLAUDE.md.
- **Steps to reproduce:** Open OnboardingDialog.tsx and inspect line 57-62.
- **Expected:** Should use `<Button>` from `@/components/ui/button`.
- **Impact:** No functional impact, but maintenance risk if button styling changes globally.

#### BUG-9: MemberFormDialog default role ignores forceParentRole flag (dead code)
- **Severity:** Low
- **Priority:** P3
- **Location:** `src/components/members/MemberFormDialog.tsx`, line 62
- **Description:** The ternary `forceParentRole ? "parent" : "parent"` always evaluates to `"parent"` regardless of the flag. This is dead code / a no-op ternary. While the behavior happens to be correct (new members default to parent role), the conditional serves no purpose and suggests the intended default for non-onboarding should be something else (or the conditional should be removed for clarity).
- **Steps to reproduce:** Read line 62: `setRole(forceParentRole ? "parent" : "parent");`
- **Expected:** Either `setRole("parent")` unconditionally, or `setRole(forceParentRole ? "parent" : "child")` if the intent was to allow child as default for non-onboarding adds.

#### BUG-10: No input validation on data read from localStorage (deserialization)
- **Severity:** Medium
- **Priority:** P2
- **Location:** `src/contexts/FamilyMembersContext.tsx`, lines 43-54 (readFromStorage)
- **Description:** `readFromStorage` only checks that the parsed JSON is an array, but does not validate that each element conforms to the FamilyMember schema. If localStorage is manually tampered with (or corrupted by a browser extension), objects with missing fields (e.g., no `name`, no `role`, invalid `color`) will be loaded into state. This can cause runtime crashes when components try to render `member.name.split(" ")` on an undefined name, or display invalid data.
- **Steps to reproduce:**
  1. Open browser DevTools console
  2. Run: `localStorage.setItem("family-members", '[{"id":"x"}]')`
  3. Reload the page
  4. Observe crash or broken UI in member list and header
- **Expected:** readFromStorage should validate each item against the FamilyMember schema (at minimum: id, name, role, color must be present and of correct type). Invalid entries should be filtered out or trigger an error state.

#### BUG-11: Edit/delete buttons hidden on hover on desktop, inaccessible via keyboard-only navigation on non-touch devices
- **Severity:** Medium
- **Priority:** P2
- **Location:** `src/components/members/MemberCard.tsx`, line 66
- **Description:** The edit and delete buttons have `opacity-0 group-hover:opacity-100` on non-small screens. While `sm:opacity-100` makes them always visible on mobile, the `opacity-0` applies at all screen widths by default (since it is not responsive-prefixed) and `group-hover:opacity-100` only reveals them on hover. Keyboard-only users on desktop who tab to these buttons will not see them unless they happen to be hovering. The buttons do receive focus (they are proper `<Button>` elements), but with `opacity-0` they are invisible while focused. A `focus-within:opacity-100` on the group or `focus-visible:opacity-100` on the button wrapper would fix this.
- **Steps to reproduce:**
  1. On desktop, navigate to /settings with members present
  2. Use Tab key to navigate through the page
  3. When focus reaches edit/delete buttons, they remain invisible (opacity-0) unless hovered
- **Expected:** Buttons should become visible when any button within the card receives keyboard focus.

#### BUG-12: Duplicate getInitials and getContrastColor functions
- **Severity:** Low
- **Priority:** P3
- **Location:** `src/components/members/MemberCard.tsx` (lines 23-38) and `src/components/members/MemberAvatar.tsx` (lines 13-28)
- **Description:** Both `getInitials` and `getContrastColor` are duplicated identically across MemberCard.tsx and MemberAvatar.tsx. MemberCard renders its own Avatar inline instead of using the `MemberAvatar` component. This is a maintenance risk -- if the contrast formula or initials logic changes, it must be updated in two places.
- **Steps to reproduce:** Compare lines 23-38 of MemberCard.tsx with lines 13-28 of MemberAvatar.tsx.
- **Expected:** MemberCard should use `MemberAvatar` component, or the utility functions should be extracted to a shared module.

---

### Security Audit (Red-Team Perspective)

Since this is a client-only localStorage app with no backend, no authentication, and no network requests, the attack surface is limited. The following findings are noted:

| # | Finding | Severity | Notes |
|---|---------|----------|-------|
| SEC-1 | No input sanitization on member names | Low | Names are rendered via React JSX (`{member.name}`) which auto-escapes HTML/XSS. No `dangerouslySetInnerHTML` usage found anywhere. **No XSS risk.** |
| SEC-2 | localStorage data is not encrypted | Info | All family data is stored in plaintext in localStorage. Any browser extension, DevTools user, or shared-computer user can read/modify it. This is acceptable per PRD constraints ("kein Backend / kein Login") but should be documented as a known limitation. |
| SEC-3 | No Content Security Policy headers configured | Low | `next.config.*` does not set CSP headers. For a local-only app this is low risk, but adding `next.config.ts` security headers (X-Frame-Options, CSP) would harden against clickjacking. |
| SEC-4 | localStorage deserialization trusts data blindly | Medium | Same as BUG-10. Tampered localStorage can inject arbitrary data shapes. While no remote code execution is possible (React escapes output), it can cause crashes and corrupt app state. |
| SEC-5 | No rate limiting on member creation | Info | A script could rapidly fill localStorage by calling addMember in a loop. This is inherent to client-side apps and not practically exploitable beyond self-denial-of-service. |
| SEC-6 | ID generation is not cryptographically secure | Info | `generateId` uses `Math.random()` which is not cryptographically secure. For a local-only app with no auth, this is acceptable. IDs are not used for security purposes. |

**Overall security assessment: ACCEPTABLE for MVP scope (no backend, no auth, no sensitive data).** The main actionable item is BUG-10/SEC-4 (input validation on deserialized data).

---

### Cross-Browser Compatibility (Code Review)

| Browser | Assessment | Notes |
|---------|------------|-------|
| Chrome (latest) | PASS | All APIs used (localStorage, JSON.parse, DOMException) are well-supported. |
| Firefox (latest) | PASS | Same APIs, no Chrome-specific features used. |
| Safari (latest) | PASS | No WebKit-specific issues identified. `backdrop-blur` in Header uses `supports-[backdrop-filter]` progressive enhancement. |

---

### Responsive Design (Code Review)

| Viewport | Assessment | Notes |
|----------|------------|-------|
| 375px (mobile) | PASS | Header uses hamburger menu (Sheet). Settings page stacks vertically. Member cards use single column. |
| 768px (tablet) | PASS | Grid switches to `sm:grid-cols-2`. Navigation still visible. |
| 1440px (desktop) | PASS | Grid uses `lg:grid-cols-3` for member cards, `lg:grid-cols-4` for feature cards. Desktop nav with member avatars visible. |

**Note:** BUG-11 (keyboard accessibility of hover-only buttons) affects desktop viewports specifically.

---

### Summary

| Category | Pass | Fail | Bugs Found |
|----------|------|------|------------|
| Acceptance Criteria | 9 | 0 | -- |
| Edge Cases | 5 | 0 | -- |
| New Bugs | -- | -- | 5 (BUG-8 through BUG-12) |
| Security Findings | -- | -- | 6 (SEC-1 through SEC-6) |

**Recommended priority for fixes before deployment:**
1. **P2 - BUG-10/SEC-4:** Add schema validation on localStorage deserialization
2. **P2 - BUG-11:** Add focus-visible/focus-within styles for keyboard accessibility
3. **P3 - BUG-8, BUG-9, BUG-12:** Code quality / convention compliance (non-blocking)

## Deployment
_To be added by /deploy_
