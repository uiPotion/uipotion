---
layout: 'potion'
title: 'Sidebar Navigation'
publicationDate: '2026-03-03'
excerpt: 'A responsive sidebar navigation component with collapsible icon-only mode, multi-level nested groups, badge support, inline search, and mobile overlay. The primary navigation pattern for SaaS dashboards, admin panels, and application shells.'
category: 'Components'
tags:
  - components
  - sidebar
  - navigation
  - collapsible
  - multi-level
  - responsive
  - overlay
  - a11y
agentManifest: 'potions/components/sidebar-navigation.json'
path: 'potions/components/sidebar-navigation'
---

# Sidebar Navigation

A responsive sidebar navigation component with collapsible icon-only mode, multi-level nested groups, badge support, inline search, and mobile overlay. The primary navigation pattern for SaaS dashboards, admin panels, and application shells.

## Structure Specification

### Component Hierarchy

The sidebar consists of a Root container (aside element) that holds a Header (logo/brand area with collapse toggle), an optional Search input, a ScrollArea containing NavigationGroups (labeled sections with NavigationItems), and a Footer (user avatar/settings). On mobile/tablet, the sidebar renders as an overlay dialog with a Backdrop.

The sidebar structure flows as: Root (aside) → Header (logo + collapse toggle) | Search (optional) | ScrollArea → NavigationGroup[] → GroupLabel + NavigationItem[] (icon + label + badge + group toggle) → NestedGroup[] | Footer (user/settings). Mobile: MobileOverlay (dialog) → Backdrop + Root clone.

## Detailed Component Specifications

### 1. Sidebar Component

**Goal**: Provide a responsive sidebar navigation component that serves as the primary navigation surface for SaaS applications, with collapsible icon-only mode, multi-level groups, badge support, and accessible mobile overlay.

**Anatomy Slots**:
- `root` - Main sidebar container (aside element)
- `header` - Logo/brand area at the top
- `search` - Optional inline search input to filter items
- `scrollArea` - Scrollable container for navigation groups
- `navigationGroup` - Labeled section of navigation items
- `groupLabel` - Section heading for a navigation group
- `navigationItem` - Individual navigation link (icon + label + badge)
- `itemIcon` - Icon for a navigation item
- `itemLabel` - Text label for a navigation item
- `itemBadge` - Optional count, dot, or status badge
- `groupToggle` - Expand/collapse toggle for items with children
- `nestedGroup` - Container for nested child items
- `collapseToggle` - Button to collapse/expand the sidebar (desktop)
- `footer` - User avatar/menu or settings pinned at the bottom
- `mobileOverlay` - Dialog overlay container (mobile/tablet)
- `backdrop` - Semi-transparent backdrop behind mobile overlay
- `tooltip` - Label tooltip shown on collapsed items

**Dimensions**:
- Expanded width: 260px (default variant), 200px (compact variant)
- Collapsed width: 64px (icon-only mode)
- Header height: 64px
- Item height: 40px (default), 36px (compact)
- Icon size: 20px (default), 16px (compact)
- Footer height: 56px
- Nested indent: 16px per level
- Mobile overlay width: min(260px, 85vw)

**States**:
- `collapsed` (boolean, default: false) - Whether sidebar is in icon-only mode (desktop only). Persisted in localStorage.
- `mobileOpen` (boolean, default: false) - Whether mobile overlay is visible
- `activeItemId` (string) - ID of the currently active navigation item (syncs with router/URL)
- `expandedGroupIds` (array, default: []) - IDs of expanded nested groups. Auto-expands group containing active item.
- `variant` (enum: "default" | "compact" | "floating", default: "default") - Visual style variant
- `position` (enum: "left" | "right", default: "left") - Which side of the viewport
- `searchQuery` (string, default: "") - Current inline search filter value
- `hoverExpanded` (boolean, default: false) - Whether sidebar is temporarily expanded due to mouse hover while collapsed

**Elements**:

#### Header / Logo Section
- Height: 64px
- Contains: App logo or icon, optional app name text
- Expanded: Full logo + app name
- Collapsed: Icon-only logo or app initial
- Clickable: Links to home/dashboard page
- Collapse toggle button: positioned at the right edge of the header or at the bottom edge of the header area

#### Inline Search (Optional)
- Position: Below header, above navigation groups
- Full-width input with search icon and clear button
- Filters navigation items by label match (case-insensitive)
- Shows "No results" empty state when no items match
- Hidden in collapsed mode (or shows search icon that expands sidebar on click)
- ARIA: role="searchbox", aria-label="Search navigation"

#### Navigation Groups
- Labeled sections that organize navigation items (e.g., "Main", "Settings", "Support")
- Group label: uppercase or small-caps text, 11-12px font size, muted color
- Group label hidden in collapsed mode
- Each group contains an ordered list of NavigationItems
- Visual separator (1px line or spacing) between groups

#### Navigation Items
- Height: 40px (default), 36px (compact)
- Layout: Icon (20px) + Label + optional Badge, horizontally aligned
- Padding: 12px horizontal
- Active state: Background highlight + optional left border indicator (3px)
- Hover state: Subtle background change
- Focus state: Visible focus ring
- Disabled state: Muted colors, aria-disabled="true", non-activatable but focusable
- Collapsed mode: Icon only, label hidden, tooltip on hover/focus
- Badge (expanded mode): Positioned at the right edge of the item
  - Count badge: Rounded pill with number (show "99+" for values > 99)
  - Dot badge: Small circle indicator (e.g., 8px)
  - Status badge: Text label (e.g., "New", "Beta")
- Badge (collapsed mode): All badge types render as a small dot indicator (6-8px) positioned absolutely on the icon's top-right corner. The icon wrapper must have position: relative. Do NOT render full badges as flow siblings in collapsed mode — they overflow the 64px sidebar width.
- Items with children: Show expand/collapse chevron icon at the right edge

#### Nested Groups (Multi-Level)
- Indented by 16px per nesting level from the parent item
- Expand/collapse with animation (200ms height transition)
- Parent item acts as a disclosure toggle: aria-expanded, aria-controls
- Support arbitrary depth but recommend max 2-3 levels for usability
- When a child item becomes active, auto-expand its parent group

#### Collapse Toggle
- Button that toggles between expanded and collapsed sidebar
- Position: In the header area or at the bottom of the sidebar
- Icon: Chevron pointing left (to collapse) or right (to expand)
- ARIA: aria-label="Collapse sidebar" / "Expand sidebar", aria-expanded
- Only visible on desktop (≥1024px)

#### Footer
- Pinned at the bottom of the sidebar
- Height: 56px
- Contains: User avatar (32-36px circle), user name, optional dropdown menu
- Collapsed mode: Avatar only, name hidden
- Optional: Settings shortcut, logout link, or additional action items
- Separator line above footer

#### Mobile Overlay
- Full-height slide-in panel from the left (or right if position="right")
- Width: min(260px, 85vw)
- Z-index: 40 (sidebar), 30 (backdrop)
- Backdrop: Semi-transparent overlay (rgba(0,0,0,0.5))
- Animation: Slide in 300ms, slide out 250ms, backdrop fade 200ms
- Open transition: Mount elements in off-screen state (translateX(-100%), opacity 0), then on the next animation frame transition to on-screen state. This two-phase mount ensures the browser paints the initial state before animating.
- Close transition: Do NOT unmount elements immediately — this kills exit animations. Instead, trigger the CSS transition to the off-screen state while keeping elements mounted. Unmount only after the transition duration elapses. Release scroll lock and focus trap immediately on close (before animation ends) for correct UX.
- Always shows sidebar in expanded mode (not collapsed)
- Uses dialog semantics: role="dialog", aria-modal="true"

**Behavior**:
- Collapse/Expand: Toggle button switches between expanded (260px) and collapsed (64px) modes on desktop
- Collapsed mode: Icons only, labels hidden, tooltips appear on hover/focus
- Hover expand (optional): Mouse hover over collapsed sidebar temporarily expands it; mouse leave collapses it
- Persistence: Collapsed state saved to localStorage, restored on mount (SSR-safe: default expanded, update after hydration)
- Navigation: Item click navigates to route, updates active item, closes mobile overlay if open
- Group expand/collapse: Toggle button expands/collapses nested children with animation
- Auto-expand: Group containing active item auto-expands on initial render and route change
- Inline search: Filters visible items by label, expands groups containing matches, shows empty state for no results
- Mobile overlay: Opens via external trigger (hamburger button), closes on Escape/backdrop/item click
- Focus trap: Focus trapped within mobile overlay while open
- Focus restoration: Returns focus to trigger element when mobile overlay closes
- Body scroll lock: Body scroll locked when mobile overlay is open
- Content area adjustment: Main content area adjusts margin/padding to accommodate sidebar width changes

## Responsive Breakpoints

### Mobile (< 768px)
- **Layout**: Sidebar hidden by default
- **Navigation**: Accessible via mobile overlay (triggered by external button)
- **Overlay**: Full-height slide-in panel with backdrop and focus trap
- **Width**: min(260px, 85vw)
- **Collapse toggle**: Hidden (overlay always shows expanded mode)

### Tablet (768px - 1023px)
- **Layout**: Same as mobile — sidebar hidden, overlay pattern
- **Navigation**: Accessible via mobile overlay
- **Overlay**: Full-height slide-in panel with backdrop and focus trap
- **Width**: 260px
- **Collapse toggle**: Hidden

### Desktop (≥ 1024px)
- **Layout**: Fixed sidebar on the left (or right)
- **Navigation**: Always visible, either expanded or collapsed
- **Width**: 260px expanded, 64px collapsed
- **Collapse toggle**: Visible, allows switching between modes
- **Hover expand**: Optionally available in collapsed mode
- **Mobile overlay**: Hidden

## Interaction Patterns

### Collapse Toggle (Desktop)
1. User clicks the collapse toggle button
2. Sidebar width animates from 260px to 64px (or vice versa)
3. Labels fade out/in during the transition
4. Content area adjusts its margin/padding
5. Collapsed preference is saved to localStorage
6. aria-expanded and aria-label update on the toggle button

### Navigation Item Click
1. User clicks a navigation item
2. Browser navigates to the item's route
3. Active item highlight updates (background + optional left border)
4. aria-current="page" moves to the new active item
5. If in mobile overlay, overlay closes with animation
6. Focus restores to the trigger element (mobile only)

### Group Expand/Collapse
1. User clicks a group toggle (chevron) on an item with children
2. Nested group panel expands/collapses with height animation (200ms)
3. Chevron icon rotates to indicate state
4. aria-expanded updates on the toggle button
5. Focus remains on the toggle button (does not jump into children)

### Mobile Overlay Open
1. User clicks the external trigger button (hamburger/sidebar icon)
2. Sidebar overlay slides in from the left (300ms)
3. Backdrop fades in (200ms)
4. Focus moves to the first focusable element (search input or first nav item)
5. Focus trap activates within the overlay
6. Body scroll is locked
7. Background content becomes inert/aria-hidden

### Mobile Overlay Close
1. User clicks close button, backdrop, Escape key, or a navigation item
2. Sidebar overlay slides out (250ms)
3. Backdrop fades out (150ms)
4. Focus returns to the trigger element
5. Focus trap deactivates
6. Body scroll is unlocked
7. Background content restored from inert

### Inline Search
1. User types in the search input
2. Navigation items are filtered by label match (case-insensitive)
3. Groups containing matching items auto-expand
4. Groups with no matching items are hidden
5. "No results" empty state shown when no items match
6. Clear button resets search and shows all items
7. Focus remains on the search input during filtering

### Hover Expand (Optional)
1. User hovers over the collapsed sidebar
2. Sidebar temporarily expands to full width
3. Labels become visible (no tooltip needed)
4. User moves mouse away from sidebar
5. Sidebar collapses back to icon-only mode
6. This is a progressive enhancement — keyboard users use tooltips instead

### Active Item on Route Change
1. Route changes (programmatic or browser navigation)
2. Active item detection runs (compares current URL to item hrefs)
3. Previous active item loses highlight and aria-current
4. New active item receives highlight and aria-current="page"
5. If the new active item is inside a collapsed group, the group auto-expands
6. Active item scrolls into view if outside visible scroll area

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This sidebar component should meet WCAG 2.1 Level AA standards. Key requirements:

- **1.3.1 Info and Relationships**: Navigation uses semantic markup: `<nav>` landmark, `<ul>`/`<li>` for item lists, headings or visible labels for groups.
- **1.4.3 Contrast**: Text and icons meet 4.5:1 contrast against sidebar background. Active indicator meets 3:1 contrast.
- **2.1.1 Keyboard**: All sidebar controls operable via keyboard; focus trapped within mobile overlay while open.
- **2.1.2 No Keyboard Trap**: Escape closes mobile overlay; no keyboard trap beyond intended modal focus trap.
- **2.4.3 Focus Order**: Logical focus order following visual layout; focus returns to trigger when mobile overlay closes.
- **2.4.7 Focus Visible**: Visible focus indicators for all interactive elements.
- **4.1.2 Name, Role, Value**: Correct ARIA roles, names, and relationships.

### Keyboard Navigation

**Tab Order**:
- Search input (if present) → Navigation items (top to bottom) → Group toggles → Collapse toggle → Footer items
- Within mobile overlay: Focus trapped, Tab cycles through all focusable elements
- Home key: Move focus to first visible navigation item
- End key: Move focus to last visible navigation item

**Implementation**:
- **Tab**: Move between interactive elements in DOM order
- **Enter/Space**: Activate navigation link (navigate) or toggle group expand/collapse
- **Escape**: Close mobile overlay when open; restore focus to trigger
- **Home**: Move focus to first visible navigation item
- **End**: Move focus to last visible navigation item

### Semantic HTML & ARIA

**Required ARIA Attributes**:

- **Sidebar root**: `<nav aria-label="Sidebar navigation">` or `<aside role="navigation" aria-label="Sidebar navigation">`
- **Collapse toggle**: `<button aria-label="Collapse sidebar" aria-expanded="true/false">`
- **Group toggle**: `<button aria-expanded="true/false" aria-controls="nested-group-{groupId}">`
- **Nested group panel**: `<div id="nested-group-{groupId}" role="group" aria-labelledby="group-toggle-{groupId}">`
- **Active nav item**: `aria-current="page"`
- **Disabled item**: `aria-disabled="true"` (remains focusable, not activatable)
- **Badge**: Badge info included in parent item's accessible name (e.g., "Messages (3 unread)")
- **Search input**: `role="searchbox" aria-label="Search navigation"`
- **Mobile overlay**: `role="dialog" aria-modal="true" aria-label="Navigation menu"`
- **Tooltip**: `role="tooltip" id="tooltip-{itemId}"`, referenced by `aria-describedby` on the item

### Focus Management

- Mobile overlay: Focus trap active while open; focus restores to trigger on close
- Desktop collapsed: Tooltips appear on focus (not just hover) so keyboard users get labels
- Group toggle: Focus stays on toggle after expand/collapse; does not jump into children
- Auto-expand: When navigating to a route inside a collapsed group, expand the group and scroll item into view
- Search: Focus remains on search input when filtering and when clearing

## Navigation Data Contract

### Navigation Items Shape

```
navigationGroups: [
  {
    id: string,              // Unique group identifier
    label: string,           // Section label (e.g., "Main", "Settings")
    items: [
      {
        id: string,          // Unique item identifier
        label: string,       // Display text
        href: string,        // Route/URL (optional if has children only)
        icon: Component,     // Icon component or identifier
        badge: {             // Optional
          type: "count" | "dot" | "status",
          value: number | boolean | string
        },
        disabled: boolean,   // Optional, default false
        external: boolean,   // Optional, opens in new tab
        children: [...]      // Optional nested items (same shape)
      }
    ]
  }
]
```

### Header Configuration

```
header: {
  logo: Component,           // Logo image or component
  logoCollapsed: Component,  // Optional smaller logo for collapsed mode
  title: string              // Optional app name (shown when expanded)
}
```

### Footer Configuration

```
footer: {
  userAvatar: string,        // Optional avatar URL
  userName: string,          // Optional display name
  userEmail: string,         // Optional email
  items: [                   // Optional footer action items
    { id, label, href | onSelect, icon }
  ]
}
```

## Variants

### Default
Solid background sidebar flush with the viewport edge. Full height from below the top navbar (or full viewport height if no navbar). Standard spacing (260px wide, 40px item height, 20px icons).

### Compact
Narrower expanded width (200px), tighter item height (36px), smaller icons (16px). Suitable for applications with dense navigation trees or when screen real estate is limited.

### Floating
Detached from viewport edge with border-radius (8px) and shadow. Inset by 8-12px from the edge and top. Creates a card-like appearance. Often used with transparent or gradient page backgrounds.

## Edge Cases

- **SSR hydration mismatch**: Default to expanded during SSR. Read localStorage on mount and update collapsed state. Use a brief opacity transition to mask layout shift if needed.
- **Deep nesting (3+ levels)**: Support arbitrary depth via recursive rendering but recommend max 2-3 levels. Increase indent per level. Beyond 3 levels, consider flattening the hierarchy.
- **Long labels**: Truncate with text-overflow: ellipsis. Show full label in tooltip on hover/focus.
- **Badge overflow**: For count > 99, display "99+". Use aria-label for the actual count.
- **Badges in collapsed mode**: Full badges (count pills, status text) as flow elements break the 64px layout. Render all badge types as a small absolute-positioned dot on the icon's top-right corner. Use a white ring to separate from the icon. Full badge info goes in the tooltip/accessible label.
- **No search results**: Show empty state inside scroll area with a clear button. Do not hide the search input.
- **Sidebar + fixed navbar**: Sidebar starts below navbar (top offset = navbar height). On mobile, overlay is full-height above navbar (higher z-index).
- **Route to collapsed group item**: Auto-expand the parent group and scroll the item into view.
- **Mobile overlay exit animation**: Conditionally rendering the overlay (e.g., {open && <Overlay/>}) unmounts it instantly on close, making exit animations impossible. Use separate "visible" (mount) and "animating" (CSS classes) states. On close, keep mounted while transitioning, then unmount after the duration elapses.
- **Horizontal scrollbar flash on transition**: During collapse/expand, content momentarily overflows causing a scrollbar flash. Apply overflow-x: hidden on both the sidebar root and the inner scroll area (overflow-y: auto implicitly sets overflow-x to auto, so it must be explicitly hidden).

## Testing Checklist

- Sidebar renders correctly in expanded mode with all groups and items
- Collapse toggle switches to icon-only mode; labels hidden, tooltips on hover/focus
- Collapsed state persists in localStorage and restores on reload
- Navigation item click navigates and updates active indicator
- Active item has aria-current="page" and visual highlight
- Group expand/collapse works with animation and correct aria-expanded
- Multiple groups can be expanded simultaneously
- Auto-expand works for active item inside collapsed group
- Inline search filters items; "No results" state for no matches
- Badges render correctly (count, dot, status) with accessible labels
- Mobile overlay opens with slide animation and backdrop
- Mobile overlay has focus trap
- Focus restores to trigger when mobile overlay closes
- Mobile overlay closes on Escape, backdrop click, and item click
- Body scroll locked during mobile overlay, restored on close
- Window resize closes mobile overlay at desktop breakpoint
- Hover expand works when enabled
- All elements have visible focus indicators
- Tab order follows top-to-bottom visual layout
- Home/End keys navigate to first/last item
- Disabled items are focusable but not activatable
- Reduced motion respects prefers-reduced-motion
- Screen reader announces landmark, group states, active item, badges
- SSR-safe: no DOM access before mount
- Right-positioned sidebar mirrors behavior correctly
- Floating variant renders with border-radius and shadow
