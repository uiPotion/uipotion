---
layout: 'potion'
title: 'Tabs Component'
publicationDate: '2026-02-14'
excerpt: 'An accessible tabs component for horizontal and vertical layouts with fixed or scrollable tab lists, keyboard navigation, optional manual activation, responsive behavior, and robust overflow handling for many tabs.'
category: 'Components'
tags:
  - components
  - tabs
  - navigation
  - segmented-content
  - a11y
  - aria
  - keyboard-navigation
  - responsive
  - scrollable
agentManifest: 'potions/components/tabs.json'
path: 'potions/components/tabs'
---

# Tabs Component

An accessible tabs component for horizontal and vertical layouts with fixed or scrollable tab lists, keyboard navigation, optional manual activation, responsive behavior, and robust overflow handling for many tabs.

## Overview

Tabs organize related views in the same context and let users switch quickly between sections without leaving the page. This component specification supports two orientations (horizontal and vertical), multiple activation models (automatic and manual), and overflow behavior for many tabs.

Use tabs when content groups are clearly related and users typically need one group at a time. Avoid tabs for primary site navigation or for flows where users must compare multiple sections side by side.

## Component Structure

The Tabs component contains:

- Root container
- Tab list (`tablist`)
- Tab buttons (`tab`)
- Active indicator
- One tab panel (`tabpanel`) visible at a time
- Optional overflow controls for many tabs (scroll buttons or overflow menu)

## Core Behavior

### Selection and Visibility
- Exactly one tab is active by default
- Only the active tab panel is visible
- Selecting a new tab updates active styles and displays its associated panel
- Each tab controls one panel through matching IDs and `aria-controls`

### Activation Models
- **Automatic activation**: focused tab activates immediately (best when panel switching is instant)
- **Manual activation**: focused tab activates only on Enter or Space (better when panel content is expensive or asynchronous)

### Orientation
- **Horizontal tabs**: common for top content segmentation
- **Vertical tabs**: useful in settings pages, dashboards, and dense desktop interfaces

## Variants

### Fixed Tabs
- Used when tab count is small and labels are short
- Tabs share available width in horizontal orientation
- Preserves stable position and quick scanning

### Scrollable Tabs
- Used when there are many tabs or dynamic tab counts
- Tab list can scroll horizontally (or vertically in vertical mode)
- Optional previous/next controls improve discoverability of hidden tabs

### Overflow Menu Tabs
- Used when space is tight and many tabs exist
- Shows a subset of tabs plus a "More" trigger
- Hidden tabs remain keyboard reachable through menu

## States

### Default
- Tab list visible, one tab selected
- Selected tab has clear active indicator and stronger text emphasis

### Focus
- Focus ring visible on focused tab
- Focus and selected states are visually distinguishable

### Hover
- Non-selected tabs show subtle hover feedback

### Active/Pressed
- Brief pressed feedback on pointer or keyboard activation

### Disabled Tab
- Disabled tabs are non-interactive
- Use `aria-disabled='true'` and remove from activation flow

### Loading Panel (Optional)
- If panel content loads asynchronously, show loading state in panel area
- Keep tab switching responsive and predictable

## Keyboard Navigation

Keyboard behavior follows the WAI-ARIA Tabs pattern.

### Horizontal Tab List

| Key | Action |
|-----|--------|
| ArrowRight | Move focus to next tab (wrap from last to first) |
| ArrowLeft | Move focus to previous tab (wrap from first to last) |
| Home | Move focus to first tab |
| End | Move focus to last tab |
| Enter / Space | Activate focused tab in manual activation mode |
| Tab | Move focus out of tab list to active panel or next focusable element |

### Vertical Tab List

| Key | Action |
|-----|--------|
| ArrowDown | Move focus to next tab (wrap from last to first) |
| ArrowUp | Move focus to previous tab (wrap from first to last) |
| Home | Move focus to first tab |
| End | Move focus to last tab |
| Enter / Space | Activate focused tab in manual activation mode |

Notes:
- In automatic mode, arrow navigation also activates the newly focused tab.
- In manual mode, arrow navigation changes focus only.

## Accessibility Requirements

### Required Semantics
- Tab list container uses `role='tablist'`
- Each tab uses `role='tab'`
- Each panel uses `role='tabpanel'`
- Active tab has `aria-selected='true'`, inactive tabs `aria-selected='false'`
- Each tab references its panel via `aria-controls`
- Each panel references its tab via `aria-labelledby`
- Non-active tab panels are hidden from visual flow and assistive technology when appropriate

### Orientation Metadata
- For vertical tabs, set `aria-orientation='vertical'` on the tab list
- Horizontal is default; explicit horizontal orientation is optional

### Focus Management
- Focus entering tablist lands on active tab
- Keyboard navigation must support wrap behavior
- Focus indicators must meet contrast requirements and remain visible

### Screen Reader Behavior
- Tab announcements include label, selected state, and position context
- Switching tabs announces updated selected state and active panel content context

## Responsive Behavior

### Mobile (< 768px)
- Default to horizontal scrollable tabs when labels do not fit
- Minimum touch target size: 44px height
- Optional compact labels and truncation with tooltip/title support
- Consider converting dense vertical tabs to horizontal scrollable tabs

### Tablet (768px to 1023px)
- Fixed tabs for small counts; scrollable tabs for medium-to-large counts
- Keep selected tab visible when users switch

### Desktop (>= 1024px)
- Horizontal fixed or scrollable both valid
- Vertical tabs recommended for settings-style pages and side navigation contexts
- Show optional scroll buttons for large tab sets

## Many Tabs Strategy

When tab count grows, use one of these approaches:

1. **Scrollable tab strip** with optional scroll controls
2. **Overflow menu** for lower-priority tabs
3. **Grouping** tabs into higher-level categories before rendering tabs
4. **Progressive disclosure** if all tabs are not needed immediately

Guidance:
- Keep labels short and distinct
- Preserve tab order stability
- Ensure active tab always remains visible

## Transitions and Motion

### Tab Indicator
- Animate indicator movement between tabs
- Recommended duration: 150ms to 220ms
- Recommended easing: `cubic-bezier(0.4, 0, 0.2, 1)`

### Panel Transition
- Prefer subtle fade or fade + slight translate
- Recommended duration: 180ms to 240ms
- Avoid heavy or distracting motion for frequent tab switching

### Reduced Motion
- Respect `prefers-reduced-motion: reduce`
- Minimize or disable indicator/panel animations

## Design Tokens

### Layout
- Tab min height: 44px
- Horizontal padding: 12px to 16px per tab
- Indicator thickness: 2px to 3px
- Panel top spacing: 12px to 20px

### Typography
- Tab label size: 14px to 16px
- Selected tab label weight stronger than inactive state

### Color
- Clear contrast between selected and inactive tabs
- Indicator and focus ring must be visible on all theme modes

## Implementation Checklist

### Visual
- [ ] One active tab is always obvious
- [ ] Active indicator aligns correctly with active tab
- [ ] Disabled tabs are visually distinct
- [ ] Long labels truncate gracefully without layout breakage
- [ ] Scroll controls/overflow affordances are visible when needed

### Functionality
- [ ] Clicking a tab switches to its panel
- [ ] Automatic and manual activation modes both supported
- [ ] Active tab remains visible in scrollable mode
- [ ] Overflow behavior works for many tabs
- [ ] Dynamic tab add/remove keeps valid active state

### Keyboard
- [ ] Arrow key navigation works with wrapping
- [ ] Home and End shortcuts work
- [ ] Enter and Space activate tab in manual mode
- [ ] Tab key exits tab list predictably
- [ ] Focus starts on active tab when entering tab list

### Accessibility
- [ ] Correct `tablist`, `tab`, and `tabpanel` roles
- [ ] `aria-controls` and `aria-labelledby` mappings are valid
- [ ] `aria-selected` updates correctly on switch
- [ ] `aria-orientation='vertical'` present for vertical mode
- [ ] Hidden panels are not announced as active content

## Framework Patterns

Tabs can be implemented in React, Vue, Angular, or Svelte with the same behavioral contract:

- Controlled pattern: active tab driven by parent state
- Uncontrolled pattern: default active tab managed internally
- Shared logic for orientation, activation mode, overflow handling, and keyboard interactions

## See Also

The Tabs component works well with these potions:

- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)** - Segment dense admin views into focused tab panels
- **[Data Table](/potions/components/data-table)** - Use tabs to switch between table views (for example: All, Open, Archived)
- **[Button](/potions/components/button)** - Reuse button semantics and state styles for tab triggers

These are suggestions to enhance your implementation. Tabs work independently and can be used in any context.

---

## Summary for AI Agents

**Goal**: Build an accessible Tabs component supporting horizontal and vertical orientation, automatic or manual activation, responsive overflow handling for many tabs, and subtle motion with reduced-motion support.

**Critical Requirements**:
1. Detect framework and styling system first
2. Implement full ARIA tabs semantics (`tablist`, `tab`, `tabpanel`)
3. Provide robust keyboard navigation with wrap behavior
4. Support both automatic and manual activation
5. Handle many tabs using scrollable or overflow strategies
6. Ensure active tab remains visible in scrollable lists
7. Implement responsive behavior across mobile, tablet, and desktop
8. Respect reduced-motion preferences
9. Use project tokens and classes, not inline styles
