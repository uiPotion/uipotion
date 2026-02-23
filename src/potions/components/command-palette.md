---
layout: 'potion'
title: 'Command Palette'
publicationDate: '2026-02-22'
excerpt: 'An accessible command palette component for keyboard-first navigation and action execution, with fuzzy search, grouped results, recent commands, and role-aware command visibility.'
category: 'Components'
tags:
  - components
  - command-palette
  - command-menu
  - omnibox
  - keyboard-shortcuts
  - fuzzy-search
  - productivity
  - a11y
  - aria
agentManifest: 'potions/components/command-palette.json'
path: 'potions/components/command-palette'
---

# Command Palette

An accessible command palette component for keyboard-first navigation and action execution, with fuzzy search, grouped results, recent commands, and role-aware command visibility.

## Overview

Command palettes have become a core interaction pattern in modern web apps because they reduce navigation friction and improve feature discoverability. Instead of hunting through nested menus, users open one searchable layer and execute commands immediately.

Use this component when your application has many destinations or actions, especially in dashboards, admin apps, productivity tools, and AI-driven products. It should feel instant, predictable, and safe for both novice and power users.

## Component Structure

The Command Palette contains:

- Trigger surface (keyboard hint, optional button, optional navbar entry)
- Dialog overlay and panel container
- Search input (always first focus target)
- Results region grouped by command category
- Command item rows with label, optional icon, optional shortcut hint, and optional subtitle
- Optional "recent commands" and "suggested commands" sections
- Close button (visible on mobile only, hidden on desktop where Escape key is available)
- Empty, loading, and error states in the results region
- Footer for keyboard hints (always pinned at the bottom, never scrolls with the list)

## Core Behavior

### Open and Close

- Open with `Cmd+K` on macOS and `Ctrl+K` on Windows/Linux
- Optional additional shortcut: `Cmd+P` or `Ctrl+P` for navigation-heavy apps
- Close with Escape, clicking outside the panel, or after command execution when appropriate
- Preserve last query optionally for a short session window, but clear for security-sensitive contexts

### Search and Ranking

- Start searching after first character, or show recent/suggested commands when query is empty
- Support fuzzy matching and keyword aliases to handle typos and shorthand
- Rank by a weighted mix of:
  - exact prefix match
  - fuzzy score
  - recency
  - command priority
  - current context relevance
- Highlight matching segments in result labels

### Command Execution

- Navigation command: route to destination and close palette
- Action command: execute mutation with loading and success/error feedback
- Dialog command: open another modal or feature panel after palette closes
- Destructive command: require confirmation instead of immediate execution

### Context and Permissions

- Hide commands the current user cannot execute
- Prefer context-aware commands (for example current project/workspace) at top
- Keep global commands discoverable through grouping, not duplication

## States

### Closed
- Palette is not visible
- Shortcut listener remains active unless disabled by focused text editor or custom exclusions

### Open (Idle)
- Input is focused
- Recent/suggested commands visible when query is empty

### Searching
- Debounced or immediate query evaluation
- Loading indicator shown if results depend on async data

### Results Available
- Grouped command list rendered
- First enabled command can be preselected for fast Enter activation

### Empty
- No results for query
- Show helpful fallback actions (for example clear filters, open settings)

### Error
- Data source or execution failure shown inline
- Keep keyboard navigation available for retries and fallback commands

### Executing
- Selected command shows pending state
- Prevent duplicate execution for mutation commands

## Keyboard Navigation

Keyboard behavior should follow a listbox/combobox-like pattern with predictable focus movement.

- `Cmd/Ctrl + K`: Open palette and focus input
- `Escape`: Close palette (or clear query first if configured)
- `ArrowDown`: Move active result to next enabled command
- `ArrowUp`: Move active result to previous enabled command
- `Enter`: Execute active command
- `Tab`: Move focus through interactive elements in panel (if any); keep loop inside dialog
- `Shift+Tab`: Reverse focus order inside dialog
- `Cmd/Ctrl + Enter`: Optional open result in new tab for navigation commands

Notes:
- Disabled commands must be skipped in arrow navigation.
- If no active result is set, ArrowDown selects the first enabled result.
- Preserve consistent wrapping behavior (either wrap on ends or stop on boundaries, but do not mix).
- **Navigation order must match visual order.** When results are grouped, arrow keys must walk items in the rendered group-by-group sequence, not the raw score-sorted flat list. Score sorting determines which items appear and their rank within a group, but the navigation list must be rebuilt from the grouped output (iterate groups in render order, concatenate items). Failing to do this causes the active row to jump between groups unpredictably when a search query is active.
- **Suppress hover during keyboard scroll.** When `scrollIntoView` runs to keep the active row visible, the scroll can move list items under a stationary mouse cursor, triggering `mouseenter` events that immediately overwrite the keyboard-set active row. To prevent this, track a pointer-moved flag: set it to `false` on every ArrowUp/ArrowDown press, reset it to `true` on `pointermove` (real physical mouse movement), and only update the active row from `mouseenter` when the flag is `true`. This is the same pattern used by VS Code, Linear, and cmdk.

## Accessibility Requirements

### Semantics

- Trigger is a native button with clear accessible name
- Palette uses dialog semantics (`role='dialog'` or native dialog pattern) with modal behavior
- Search input has explicit label (visible or screen-reader-only)
- Results list uses accessible list semantics (for example listbox/options or list/buttons)
- Active option state is announced to screen readers

### Focus Management

- On open, focus moves to search input
- Focus is trapped within the palette while open
- On close, focus returns to the trigger
- Escape behavior is reliable and does not leave focus orphaned

### Announcements

- Announce result counts after query changes (polite live region)
- Announce execution outcomes (success/failure) where needed
- Do not over-announce every keystroke; prioritize meaningful updates

### WCAG Guidance

- Ensure visible focus indicators for all focusable controls
- Maintain contrast in text, shortcuts, and highlighted match segments
- Provide full keyboard operation for open, search, navigation, and execution

## Responsive Behavior

### Mobile (< 768px)

- Full-screen takeover (`h-dvh`, no margin, no border-radius, no border) — not a floating sheet
- Minimum touch target size 44px for command rows
- **Visible close button in the search input row** — mobile devices have no Escape key, so there must be a touch-accessible way to dismiss the palette. Hide this button on desktop where Escape is available.
- Keep keyboard shortcut hints optional or hidden when space is constrained
- Use short labels, truncation, and optional second-line subtitles

### Tablet (768px to 1023px)

- Centered dialog with moderate width
- Group labels remain visible
- Keep search input fixed at top while results scroll

### Desktop (>= 1024px)

- Centered floating panel with constrained max width and max height (e.g. `max-h-[min(580px,80vh)]`)
- Optional richer command rows (icon, subtitle, shortcut, badges)
- Sticky search input and optional sticky group headers for long result lists

### Panel Layout (all breakpoints)

- Use a **flex-column** layout for the panel container
- Search input row: `shrink-0` (fixed at top)
- Results list: `flex-1 min-h-0 overflow-y-auto` (takes remaining space, only section that scrolls)
- Footer with keyboard hints: `shrink-0` (fixed at bottom, always visible regardless of list length)
- This prevents the footer from scrolling away when the results list is long

## Command Data Contract

Each command should include:

- `id` (stable unique key)
- `label` (human-readable action name)
- `keywords` (aliases for fuzzy search)
- `group` (navigation, creation, settings, workspace, etc.)
- `icon` (optional)
- `shortcut` (optional display hint)
- `disabled` (optional)
- `requiresConfirmation` (optional)
- `priority` (optional ranking weight)
- `permission` (optional role/capability guard)

## Motion and Performance

### Motion

- Open/close panel transition: 140ms to 220ms
- Backdrop fade: 120ms to 180ms
- Active row transition: subtle color/opacity change only
- Respect reduced-motion preferences by minimizing transforms

### Performance

- Keep interaction latency low (target fast key-to-result updates)
- Virtualize long result lists if needed
- Cache frequently used command sets
- Cancel stale async searches when query changes quickly

## Design Tokens

### Layout

- Panel max width: 640px to 760px (desktop)
- Input height: 44px minimum
- Row height: 40px to 48px
- Row horizontal padding: 12px to 16px
- Group header spacing: 8px to 12px above section

### Typography

- Input and row label: 14px to 16px
- Secondary text and shortcut hints: 12px to 13px
- Group labels: uppercase optional, clear contrast

### Color

- High contrast for selected row and focus ring
- Distinct visual treatment for disabled rows
- Match highlights should be clear in both light and dark themes

## Implementation Checklist

### Visual
- [ ] Panel layout is stable on all breakpoints
- [ ] Mobile panel is full-screen (h-dvh, no margin/rounding/border)
- [ ] Mobile close button is visible and functional
- [ ] Search input remains visible and usable while scrolling results
- [ ] Footer stays fixed at the bottom and does not scroll with results
- [ ] Active row is clearly distinguishable
- [ ] Group labels and row hierarchy are easy to scan
- [ ] Empty/loading/error states are visually clear

### Functionality
- [ ] Cmd/Ctrl+K opens palette globally
- [ ] Query updates results with fuzzy search
- [ ] Enter executes active command correctly
- [ ] Permission-restricted commands are hidden or disabled correctly
- [ ] Destructive commands require confirmation
- [ ] Async searches cancel stale requests

### Keyboard
- [ ] Arrow navigation works and skips disabled rows
- [ ] Arrow navigation follows visual (grouped) render order, not raw score order
- [ ] Arrow keys with scrollIntoView do not cause hover flicker when mouse is stationary
- [ ] Escape closes palette reliably
- [ ] Focus trap works with Tab and Shift+Tab
- [ ] Focus returns to trigger when closing

### Accessibility
- [ ] Trigger, input, and results have correct accessible names/roles
- [ ] Result count changes are announced politely
- [ ] Execution feedback is screen-reader accessible
- [ ] Focus indicators meet contrast requirements

### Styling
- [ ] Uses project styling system only (Tailwind, SCSS, CSS Modules, styled-components, etc.)
- [ ] Uses existing design tokens and class conventions
- [ ] Avoids inline styles when class-based styling is used

## Framework Patterns

The component remains framework-agnostic:

- Controlled mode: parent owns `open`, `query`, and selected command
- Uncontrolled mode: component handles internal state with callbacks
- Shared execution contract for navigation, actions, and confirmation flows
- Shared keyboard model across React, Vue, Angular, and Svelte

## See Also

The Command Palette works well with these potions:

- **[Navigation Bar](/potions/components/navbar)** - Place a visible trigger and shortcut hint in global navigation
- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)** - Add a fast access layer for dense admin navigation
- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)** - Surface prompts, tools, and context-switch commands quickly

These are suggestions. Command Palette works independently and can be used in any context.

---

## Summary for AI Agents

**Goal**: Build an accessible command palette component with keyboard-first opening, fuzzy search, grouped results, context-aware ranking, and safe command execution behavior.

**Critical Requirements**:

1. Detect framework and styling system before implementation.
2. Support `Cmd/Ctrl+K` open shortcut and reliable Escape close behavior.
3. Move focus to search input on open and restore focus to trigger on close.
4. Provide full keyboard navigation over result items with Enter execution.
5. Arrow key navigation order must match the visual (grouped) render order, not raw score-sorted order.
6. Suppress mouseenter-based active-row updates during keyboard-triggered scrollIntoView by tracking a pointer-moved flag.
7. Include role/permission filtering and context-aware command prioritization.
8. Handle loading, empty, error, and executing states clearly.
9. Announce meaningful result and execution updates for assistive technology.
10. Use flex-column panel layout: search input and footer are shrink-0, results list is flex-1 min-h-0 overflow-y-auto — footer must always stay at the bottom.
11. On mobile, render full-screen (h-dvh, no margin/rounding/border) and show a visible close button in the search row since touch devices have no Escape key.
12. Respect reduced-motion preferences.
13. Use project tokens and conventions; avoid introducing new styling systems.
