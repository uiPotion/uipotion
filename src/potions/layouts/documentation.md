---
layout: 'potion'
title: 'Documentation Website Layout'
publicationDate: '2026-02-25'
excerpt: 'A three-column documentation website layout with hierarchical sidebar navigation, prose content area, and scroll-spy table of contents. Inspired by Next.js docs, Nextra, Docusaurus, and Mintlify. Designed for developer documentation, knowledge bases, and technical reference pages.'
category: 'Layouts'
tags:
  - layouts
  - documentation
  - sidebar
  - table-of-contents
  - responsive
  - search
  - scroll-spy
  - a11y
agentManifest: 'potions/layouts/documentation.json'
path: 'potions/layouts/documentation'
---

# Documentation Website Layout

A three-column documentation reading layout with hierarchical sidebar navigation, a focused prose content area, and a scroll-spy table of contents. Designed for developer documentation sites, knowledge bases, and technical reference pages. Inspired by Next.js docs, Nextra, Docusaurus, and Mintlify.

## Structure Specification

### Layout Hierarchy

The layout consists of a DocsContainer that holds five regions. A sticky Header spans the full viewport width and contains a Logo, primary Navigation Links (Docs, Blog, API), a Search Trigger (Cmd+K), a Theme Toggle, and an external GitHub Link. Below the header, a three-column body contains a Left Sidebar for hierarchical page navigation, a Main Content Area for prose documentation, and a Right Sidebar (Table of Contents) for on-page anchor navigation. A Footer sits below the content area.

On mobile the sidebar becomes an off-canvas drawer, the TOC collapses into an inline "On this page" disclosure above the content, and the header shows a hamburger menu toggle.

## Detailed Component Specifications

### 1. Header

**Dimensions:**
- Height: 60px
- Width: 100% viewport
- Position: Sticky at top (z-index above sidebar)

**Elements:**

#### Logo
- Height: 24-32px
- Position: Left-most
- Behavior: Links to homepage

#### Navigation Links
- Font size: 14-16px, medium weight (500)
- Gap: 24-32px between links
- Typical links: Docs, Blog, API Reference
- Active link: Highlighted with underline or color change
- Visibility: Hidden on mobile, moved into hamburger menu

#### Search Trigger
- Appearance: Pill-shaped button or input placeholder showing "Search docs..." with Cmd+K / Ctrl+K badge
- Min width: 200px on desktop, icon-only on mobile
- Behavior: Opens Command Palette overlay on click or Cmd+K / Ctrl+K keyboard shortcut
- **IMPORTANT**: The search overlay MUST be implemented as a full Command Palette following the [Command Palette component potion](/potions/components/command-palette). Read and follow that potion's complete specification — do not implement a simple filter input. The palette must include fuzzy matching, grouped results, keyboard navigation, active row tracking, and all accessibility features defined in the Command Palette potion.

#### Theme Toggle
- Size: 36-40px button
- Icons: Sun/Moon or system icons
- Behavior: Toggles between light, dark, and system theme (see Dark/Light Mode pattern potion)

#### GitHub Link
- Size: 36-40px icon button
- Icon: GitHub logo
- Behavior: Opens project repository in new tab

#### Mobile Menu Toggle
- Size: 40px x 40px
- Icon: Hamburger / close
- Visibility: Hidden on desktop (>=1280px), visible below
- Behavior: Opens left sidebar as off-canvas drawer

**Behavior:**
- Sticky positioning, remains visible on scroll
- Subtle bottom border or shadow for separation
- On mobile: collapses nav links into hamburger menu, search becomes icon-only

### 2. Left Sidebar (Navigation)

**Dimensions:**
- Width: 260px
- Height: Full viewport minus header height
- Position: Fixed (desktop), off-canvas drawer (mobile)
- Top offset: Header height (60px)

**Elements:**

#### Navigation Tree
- Hierarchical structure with collapsible sections
- Section headers: 12-13px uppercase, medium weight (500-600), muted color
- Page links: 14px, regular weight (400)
- Nested depth indicator: 12-16px left padding per level, max 3 levels recommended
- Vertical gap: 2-4px between items, 16-24px between sections

#### Active Page Indicator
- Visual treatment: Background highlight (primary color at 8-12% opacity) plus left border (2-3px, primary color) or text color change to primary
- Must be clearly distinguishable from hover state

#### Section Expand/Collapse
- Chevron icon (12-16px) rotates on toggle
- Animation: 180ms rotation
- Expanded state persisted per session (sessionStorage or component state)

#### Scroll Behavior
- Independent scroll within sidebar (overflow-y: auto)
- Custom thin scrollbar (6px width, subtle color)
- Active page should be scrolled into view on initial load

**Behavior:**
- Desktop: Always visible, fixed position alongside content
- Mobile: Off-canvas drawer sliding in from left with backdrop
- Backdrop: Semi-transparent overlay, click dismisses sidebar
- Focus trap when drawer is open on mobile
- Body scroll lock when drawer is open on mobile
- Close on navigation (when user clicks a page link on mobile)
- Close on Escape key

### 3. Main Content Area

**Dimensions:**
- Max width: 768px for prose content
- Padding: 32-48px horizontal, 32px vertical
- Position: Centered between sidebar and TOC
- Min height: Fill available viewport

**Elements:**

#### Breadcrumbs
- Font size: 13-14px
- Color: Muted text
- Separator: Chevron or slash
- Pattern: Section > Subsection > Current Page
- Last item (current page): Not a link, slightly bolder or different color
- Position: Above page title

#### Page Title (H1)
- Font size: 30-36px, bold (700)
- Margin bottom: 16-24px
- Only one H1 per page

#### Prose Content
- Font size: 16px, regular weight (400)
- Line height: 1.7-1.8 for readability
- Paragraph spacing: 16-24px
- Max width constrains text for comfortable reading (65-75 characters per line)

#### Headings (H2, H3)
- H2: 22-26px, semibold (600), margin-top 32-48px, margin-bottom 16px
- H3: 18-20px, semibold (600), margin-top 24-32px, margin-bottom 12px
- Each heading should have an anchor link (hover-revealed # icon or click-to-copy link)
- Anchor IDs auto-generated from heading text (kebab-case)

#### Code Blocks
- Background: Slightly different from page background (darker in light mode, lighter in dark mode)
- Border radius: 8px
- Padding: 16px
- Font: Monospace, 13-14px
- Syntax highlighting (build-time via Shiki or similar)
- Copy button: Top-right corner, icon-only (clipboard icon), appears on hover or always visible
- File name label: Optional top bar showing file path (e.g., "app/layout.tsx"), 12-13px, muted background
- Horizontal scroll for long lines (no wrapping)
- Line numbers: Optional, muted color

#### Callout/Admonition Blocks
- Types: info (blue), warning (amber/yellow), tip (green), danger (red)
- Structure: Left border (3-4px, type color) + light tinted background + icon + title (optional) + content
- Border radius: 6-8px
- Padding: 12-16px
- Icon: 20px, type-specific (info circle, warning triangle, lightbulb, exclamation)
- Font size: 14-15px

#### Previous/Next Navigation
- Position: Bottom of content, full width
- Layout: Two-column (Previous on left, Next on right)
- Each shows: Direction label ("Previous" / "Next") + Page title
- Padding: 16px
- Border: 1px border, hover highlight
- Border radius: 8px

#### Page Meta
- "Last updated: [date]" text, 13px, muted
- "Edit this page on GitHub" link, 13px
- Optional "Was this helpful?" feedback widget (thumbs up/down)
- Position: Below content, above prev/next navigation

**Behavior:**
- Content scrolls naturally (page-level scroll, not container scroll)
- Smooth scroll to anchor when clicking TOC links
- Heading anchor links update URL hash without full page reload

### 4. Right Sidebar (Table of Contents)

**Dimensions:**
- Width: 220px
- Position: Sticky (top offset: header height + 16-24px padding)
- Max height: Viewport minus header and padding

**Elements:**

#### TOC Header
- Text: "On this page"
- Font size: 12-13px uppercase, medium weight (500-600), muted color

#### TOC Links
- List of H2 and H3 headings from current page
- H2 links: 13-14px, regular weight
- H3 links: 13-14px, regular weight, indented 12-16px
- Active state: Primary color text or left border indicator
- Hover: Subtle color change
- Vertical gap: 6-8px between items

#### Scroll Spy
- Implementation: Intersection Observer API watching all H2/H3 elements
- Active heading: The heading currently in or nearest to the top of the viewport
- Threshold: Heading is "active" when it crosses into the top ~20-30% of the viewport
- Transition: Smooth color change (150ms) when active heading changes
- Only one heading is active at a time

**Behavior:**
- Desktop (>=1280px): Visible, sticky alongside content
- Tablet (768-1279px): Hidden (insufficient space for three columns)
- Mobile (<768px): Rendered as collapsible "On this page" disclosure widget above the content area
- Hidden entirely when page has fewer than 2 headings
- Independent scroll if TOC is longer than viewport (overflow-y: auto)

### 5. Footer

**Dimensions:**
- Width: 100% viewport
- Padding: 32-48px vertical, 24-32px horizontal

**Layout:**
- Multi-column link grid: 3-4 columns (Resources, Community, Legal, Product)
- Column header: 13-14px, semibold (600), uppercase or normal case
- Column links: 14px, regular weight, muted color, hover reveals primary color

**Elements:**
- Link columns with category headers
- Social media icons row (GitHub, X/Twitter, Discord, etc.)
- Copyright notice: 13px, muted

**Behavior:**
- Appears after content (not fixed)
- Responsive: Columns stack on mobile (2 columns on tablet, single column on smallest screens)

## Responsive Breakpoints

### Desktop (>=1280px)
- Three columns visible: Sidebar (260px) + Content (flexible, max 768px) + TOC (220px)
- Header: Full navigation visible
- Sidebar: Fixed position, always visible
- TOC: Sticky, visible
- Search trigger: Full pill-shaped button with text

### Tablet (768px-1279px)
- Two columns: Sidebar (260px) + Content (fills remaining)
- TOC: Hidden (or collapsed inline above content)
- Header: May collapse some nav links
- Sidebar: Visible on larger tablets, off-canvas on smaller
- Search trigger: May shrink to icon + shorter text

### Mobile (<768px)
- Single column: Content only
- Sidebar: Off-canvas drawer (slide from left)
- TOC: Collapsible "On this page" disclosure above content
- Header: Hamburger menu, icon-only search
- Footer: Stacked columns
- Content padding: Reduced to 16-20px

### Window Resize Handling
- Debounce: 200ms
- Close mobile sidebar drawer when resizing to desktop
- TOC visibility toggles based on breakpoint

## Interaction Patterns

### Sidebar Tree Navigation
1. User clicks section header to expand/collapse
2. Chevron rotates to indicate state
3. Child items reveal/hide with smooth height transition (150-200ms)
4. Clicking a page link navigates to that page
5. Active page is highlighted
6. On mobile: sidebar closes after navigation

### Scroll Spy (TOC)
1. As user scrolls, Intersection Observer tracks heading visibility
2. The heading nearest the top of the viewport becomes "active"
3. Corresponding TOC link highlights with primary color
4. Clicking a TOC link smooth-scrolls to that heading
5. URL hash updates to reflect current heading

### Command Palette Search (Cmd+K)

**IMPORTANT**: Implement the search overlay by reading and following the full [Command Palette component potion](/potions/components/command-palette). The palette should be populated with a command registry built from the sidebar navigation tree (each page becomes a searchable command). The implementation below summarizes the key interaction flow — see the Command Palette potion for complete details on fuzzy matching, scoring, grouping, keyboard navigation order, pointer-moved flag, ARIA, and mobile behavior.

1. User presses Cmd+K / Ctrl+K or clicks search trigger
2. Command Palette overlay opens with focus on search input
3. When query is empty, all commands are shown grouped by section (matching sidebar sections)
4. User types search query, results are fuzzy-matched and re-ranked instantly
5. ArrowUp/Down navigates results in visual grouped order, Enter executes
6. Escape clears query first, then closes on second press
7. User selects result, navigates to that page, palette closes
8. Recently executed commands are persisted in localStorage

### Mobile Sidebar Drawer
1. User taps hamburger icon in header
2. Sidebar slides in from left (300ms)
3. Backdrop fades in (200ms)
4. Focus moves to first focusable element in sidebar
5. Focus is trapped within sidebar
6. Body scroll is locked
7. User navigates or taps backdrop or presses Escape
8. Sidebar slides out, focus returns to hamburger button

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

- **1.3.1 Info and Relationships**: Semantic HTML structure with proper landmark roles (nav, main, aside, header, footer)
- **1.4.3 Contrast Minimum**: 4.5:1 for body text, 3:1 for large text
- **2.1.1 Keyboard**: All interactive elements keyboard accessible
- **2.1.2 No Keyboard Trap**: Focus trapping only in mobile sidebar overlay
- **2.4.2 Page Titled**: Descriptive page title reflecting current docs page
- **2.4.3 Focus Order**: Logical tab order (Header > Sidebar > Content > TOC > Footer)
- **2.4.4 Link Purpose**: All links have descriptive text
- **2.4.5 Multiple Ways**: Both sidebar navigation and search provide multiple ways to reach content
- **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements
- **3.2.1 On Focus**: No context changes on focus
- **4.1.2 Name, Role, Value**: All elements have accessible names and roles

### Keyboard Navigation

**Tab Order:**
- Header (logo, nav, search, theme, github) > Sidebar navigation > Main content links > TOC links > Footer links

**Sidebar Navigation:**
- Arrow Up/Down: Move between items within current section
- Enter/Space: Navigate to page or expand/collapse section
- Escape: Close mobile drawer

**TOC:**
- Tab through TOC links
- Enter: Scroll to heading

### ARIA Attributes

**Required:**

1. **Sidebar (desktop):**
   - nav element with aria-label="Documentation navigation"

2. **Sidebar (mobile drawer):**
   - role="dialog", aria-modal="true", aria-label="Documentation navigation"

3. **Mobile Menu Toggle:**
   - aria-label="Toggle navigation menu", aria-expanded="true/false", aria-controls="docs-sidebar"

4. **Active Page Link:**
   - aria-current="page"

5. **TOC:**
   - nav element with aria-label="On this page"

6. **Search Trigger:**
   - aria-label="Search documentation", aria-keyshortcuts="Meta+K" (or "Control+K")

7. **Section Expand/Collapse:**
   - button with aria-expanded="true/false", aria-controls="section-id"

8. **Theme Toggle:**
   - aria-label="Switch to dark/light theme" (update dynamically)

9. **Main Content:**
    - main element with id="main-content"

10. **Breadcrumbs:**
    - nav with aria-label="Breadcrumb", ol with list items, current page marked with aria-current="page"

### Screen Reader Support

**Announcements:**
- Sidebar state changes announced via aria-live region
- Page navigation announced via document title update

**Landmarks:**
- header: Site header
- nav (sidebar): Documentation navigation
- main: Page content
- nav (TOC): On this page
- footer: Site footer

**Hidden Text:**
- Icon-only buttons (theme toggle, github, copy, hamburger) must have aria-label
- Decorative icons use aria-hidden="true"

### Color Contrast
- Body text: 4.5:1 minimum
- Heading text: 4.5:1 minimum
- Muted text (breadcrumbs, meta): 4.5:1 minimum
- TOC links: 4.5:1 minimum
- Active indicators: 3:1 minimum against adjacent colors
- Focus outlines: 3:1 minimum

## Design System Specifications

**Important**: These design specifications are tool-agnostic. Implement using the project's chosen styling approach.

### Color Guidelines

Dark mode uses a modern 2026 aesthetic with near-black backgrounds (#0a0a0a), zinc grays for text (#a1a1aa, #71717a), and refined borders (rgba 0.06).

#### Header
- Background (Light): White (#ffffff) or very light gray (#f9fafb)
- Background (Dark): #0a0a0a
- Border: 1px solid bottom border, light: rgba(0,0,0,0.08), dark: rgba(255,255,255,0.06)
- Text (Light): #1f2937
- Text (Dark): #fafafa
- Icons: Default #6b7280 (light) / #71717a (dark), hover #374151 (light) / #fafafa (dark)

#### Left Sidebar
- Background (Light): White (#ffffff) or very light gray (#fafafa)
- Background (Dark): #0f0f0f
- Border: 1px solid end border, light: rgba(0,0,0,0.08), dark: rgba(255,255,255,0.06)
- Section headers: #6b7280 (light), #71717a (dark)
- Page links (Light): #374151 default, #111827 hover
- Page links (Dark): #a1a1aa default, #fafafa hover
- Active item: Primary color text + primary background (8-12% opacity) + start border (2-3px)
- Hover: Neutral at 5-8% opacity, 150ms transition

#### Main Content
- Background (Light): White (#ffffff)
- Background (Dark): #0a0a0a
- Body text (Light): #1f2937 or #374151
- Body text (Dark): #a1a1aa
- Heading text (Light): #111827, (Dark): #fafafa
- Link color: Primary color with underline on hover
- Muted text: #6b7280 (light), #71717a (dark)
- Code block background (Light): #f8fafc or #f5f5f5
- Code block background (Dark): #171717

#### Right Sidebar (TOC)
- Background: Transparent (same as content area)
- TOC header: #6b7280 (light), #71717a (dark)
- TOC links default: #6b7280 (light), #71717a (dark)
- TOC links hover: #374151 (light), #a1a1aa (dark)
- TOC active link: Primary color (#6366f1)

#### Footer
- Background (Light): #f9fafb or white
- Background (Dark): #0a0a0a
- Border: 1px solid top border, light: rgba(0,0,0,0.08), dark: rgba(255,255,255,0.06)
- Text: #6b7280 (light), #71717a (dark)
- Links: Muted default, primary or lighter on hover

#### Code Blocks
- Background (Light): #f8fafc, #f5f5f5, or #fafafa
- Background (Dark): #171717
- Border: light rgba(0,0,0,0.08), dark rgba(255,255,255,0.06)
- File label bar: Slightly different shade from code background
- Copy button: Muted icon, hover reveals full opacity

#### Callouts
- Info: Blue (bg: #eff6ff light, rgba(59,130,246,0.08) dark, border: #3b82f6)
- Warning: Amber (bg: #fffbeb light, rgba(245,158,11,0.08) dark, border: #f59e0b)
- Tip: Green (bg: #f0fdf4 light, rgba(34,197,94,0.08) dark, border: #22c55e)
- Danger: Red (bg: #fef2f2 light, rgba(239,68,68,0.08) dark, border: #ef4444)

#### Backdrop (Mobile Drawer)
- Light: rgba(0,0,0,0.5), optional blur
- Dark: rgba(0,0,0,0.7), optional backdrop-filter: blur(8px)

### Typography

- Font family: Use project font stack (system-ui, -apple-system, sans-serif or custom)
- Code font: Monospace (JetBrains Mono, Fira Code, Menlo, or system monospace)
- Body: 16px, regular (400), line-height 1.7-1.8
- H1 (page title): 30-36px, bold (700), line-height 1.2
- H2: 22-26px, semibold (600), line-height 1.3
- H3: 18-20px, semibold (600), line-height 1.4
- Sidebar nav items: 14px, regular (400)
- Sidebar section headers: 12-13px, medium (500), uppercase
- TOC links: 13-14px, regular (400)
- Breadcrumbs: 13-14px, regular (400)
- Code: 13-14px, monospace
- Footer: 13-14px, regular (400)

### Spacing System

Use consistent spacing scale (4, 8, 12, 16, 20, 24, 32, 48, 64px):

- Header: 16-24px horizontal padding, 16px vertical
- Sidebar: 16-20px horizontal padding, 8-12px vertical per item
- Content: 32-48px horizontal padding, 32px vertical (16-20px on mobile)
- TOC: 16px start padding
- Footer: 32-48px vertical padding, 24-32px horizontal
- Between sections: 24-32px
- Between paragraphs: 16-24px

### Shadows and Borders

- Header: Bottom border preferred over shadow for clean documentation aesthetic
- Sidebar: End border (1px solid) on desktop, shadow on mobile drawer
- Mobile drawer shadow: 4px 0 16px rgba(0,0,0,0.1) (light), 4px 0 16px rgba(0,0,0,0.3) (dark)
- Code blocks: Subtle border, no shadow
- Callouts: No shadow, rely on border and background tint
- Prev/Next cards: 1px border, shadow on hover (light: 0 2px 8px rgba(0,0,0,0.08), dark: 0 2px 8px rgba(0,0,0,0.2))

### Border Radius

- Code blocks: 8px
- Callouts: 6-8px
- Search trigger: 8px or pill (9999px)
- Prev/Next cards: 8px
- Buttons (header): 6-8px
- Mobile sidebar: 0 (full edge)

### Mobile Safe Area
- On devices with notches, add safe-area padding to the sticky header: env(safe-area-inset-top)

### RTL Support
- Use logical CSS properties (inset-inline-start/end, margin-inline-start/end, padding-inline-start/end) so sidebar and TOC swap sides in RTL layouts
- Sidebar on start (left in LTR, right in RTL), TOC on end

### Reduced Motion Preferences
When prefers-reduced-motion: reduce:
- Disable sidebar drawer slide animation (use instant show/hide)
- Disable section expand/collapse animation
- Disable smooth scroll (use instant jump)
- Keep TOC active state color change (subtle, non-motion)
- Keep backdrop opacity change but reduce to 100ms

## State Management Considerations

### States to Track

1. **sidebarOpen: boolean** - Mobile drawer visibility (default: false, component state only)
2. **activePage: string** - Current page identifier (synced with router/URL)
3. **expandedSections: string[]** - Which sidebar sections are expanded (sessionStorage or component state, auto-expand section containing active page)
4. **activeHeading: string** - Currently visible heading for scroll spy (component state, derived from Intersection Observer)
5. **searchOpen: boolean** - Whether Cmd+K search overlay is open (component state only)

Theme is handled by the Dark/Light Mode pattern potion (separate).

### State Persistence

- sidebarOpen: Component state only (resets on navigation)
- activePage: Sync with router/URL
- expandedSections: sessionStorage recommended (expand parent of active page on load)
- activeHeading: Component state only (derived from scroll position)
- searchOpen: Component state only

### SSR/Hydration Considerations

- sessionStorage access: Only in onMounted/useEffect
- Default expanded sections: Derive from active page URL on server, expand on client
- Scroll spy: Initialize Intersection Observer only on client
- Theme: Prevent flash of wrong theme (inject script in head to set data-theme attribute before render)

## Critical Implementation Guidelines

### Scroll Spy Implementation

Use Intersection Observer API to track heading visibility:
- Observe all H2 and H3 elements in the content area
- Use rootMargin to offset for the sticky header (e.g., rootMargin: "-60px 0px -70% 0px")
- When multiple headings are intersecting, use the one closest to the top
- Debounce is not needed (Intersection Observer is already efficient)
- Clean up observer on unmount/page change

### Vanilla CSS Detection

CRITICAL: When detecting vanilla CSS, ALWAYS create CSS classes in a stylesheet. NEVER use inline style attributes.
- Define classes like .docs-sidebar, .docs-content, .docs-toc, .toc-link--active
- Apply via className/class attributes
- Do NOT use: style="width: 240px"

### React Hook Patterns

CRITICAL: When detecting React, extract logic into separate custom hooks:
- useScrollSpy(headingSelector) - Handles Intersection Observer for TOC
- useSidebarNavigation(activePage) - Manages sidebar expansion state
- useBodyScrollLock(isLocked) - Handles mobile drawer scroll lock
- useFocusTrap(containerRef, isActive) - Handles mobile drawer focus trap
- useMediaQuery(query) - Responsive breakpoint detection

## Code Implementation Patterns

### React Example Pattern
```jsx
<DocsLayout>
  <DocsHeader
    onMenuToggle={toggleSidebar}
    onSearchOpen={openSearch}
  />
  <DocsSidebar
    navigation={sidebarTree}
    activePage={currentPage}
    open={sidebarOpen}
    onClose={closeSidebar}
  />
  <DocsContent>
    <Breadcrumbs items={breadcrumbPath} />
    <article>{children}</article>
    <PageMeta lastUpdated={meta.updated} editUrl={meta.editUrl} />
    <PrevNextNav previous={prevPage} next={nextPage} />
  </DocsContent>
  <DocsTOC headings={pageHeadings} activeId={activeHeading} />
  <DocsFooter />
</DocsLayout>
```

### Vue Example Pattern
```vue
<template>
  <DocsLayout>
    <DocsHeader @menu-toggle="toggleSidebar" @search-open="openSearch" />
    <DocsSidebar
      :navigation="sidebarTree"
      :active-page="currentPage"
      :open="sidebarOpen"
      @close="closeSidebar"
    />
    <DocsContent>
      <Breadcrumbs :items="breadcrumbPath" />
      <article><slot /></article>
      <PageMeta :last-updated="meta.updated" :edit-url="meta.editUrl" />
      <PrevNextNav :previous="prevPage" :next="nextPage" />
    </DocsContent>
    <DocsTOC :headings="pageHeadings" :active-id="activeHeading" />
    <DocsFooter />
  </DocsLayout>
</template>
```

### Angular Example Pattern
```html
<app-docs-layout>
  <app-docs-header
    (menuToggle)="toggleSidebar()"
    (searchOpen)="openSearch()"
  />
  <app-docs-sidebar
    [navigation]="sidebarTree"
    [activePage]="currentPage"
    [open]="sidebarOpen"
    (close)="closeSidebar()"
  />
  <main class="docs-content">
    <app-breadcrumbs [items]="breadcrumbPath" />
    <article><router-outlet></router-outlet></article>
    <app-page-meta [lastUpdated]="meta.updated" [editUrl]="meta.editUrl" />
    <app-prev-next-nav [previous]="prevPage" [next]="nextPage" />
  </main>
  <app-docs-toc [headings]="pageHeadings" [activeId]="activeHeading" />
  <app-docs-footer />
</app-docs-layout>
```

### Svelte Example Pattern
```svelte
<DocsLayout>
  <DocsHeader on:menutoggle={toggleSidebar} on:searchopen={openSearch} />
  <DocsSidebar
    {navigation}
    {activePage}
    {sidebarOpen}
    on:close={closeSidebar}
  />
  <DocsContent>
    <Breadcrumbs {items} />
    <article><slot /></article>
    <PageMeta {lastUpdated} {editUrl} />
    <PrevNextNav {previous} {next} />
  </DocsContent>
  <DocsTOC {headings} {activeHeading} />
  <DocsFooter />
</DocsLayout>
```

### CSS Layout Approach

The three-column layout is best achieved with CSS Grid:

```css
.docs-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 220px;
  grid-template-rows: auto 1fr auto;
}
```

On tablet, drop the TOC column. On mobile, single column with sidebar as overlay.

## Animation Specifications

### Sidebar Drawer (Mobile)
- Slide in: 300ms, cubic-bezier(0.4, 0, 0.2, 1)
- Slide out: 250ms, cubic-bezier(0.4, 0, 0.2, 1)
- Transform: translateX(-100%) to translateX(0)

### Backdrop (Mobile)
- Fade in: 200ms, ease
- Fade out: 150ms, ease
- Opacity: 0 to 0.5

### Sidebar Section Expand/Collapse
- Height transition: 180ms, ease-in-out
- Use max-height or grid-template-rows animation technique

### TOC Active State
- Color transition: 150ms, ease
- Smooth color change when scroll spy updates active heading

### Anchor Scroll
- Smooth scroll behavior: scroll-behavior: smooth on html or programmatic scrollTo with behavior: "smooth"
- Offset for sticky header: scroll-margin-top on heading elements (header height + 16-24px)

### Search Overlay
- Fade in: 200ms, ease-out
- Fade out: 150ms, ease-in
- Scale: Optional subtle scale(0.98) to scale(1) with opacity

## Z-Index Layer System

- Header: 40
- Sidebar (desktop): 30
- TOC: 10
- Mobile Backdrop: 40
- Mobile Sidebar Drawer: 50
- Search Overlay: 60
- Tooltips: 70

## Edge Cases

### Very Long Sidebar Navigation
- Sidebar scrolls independently from content
- Active page should be scrolled into view on load
- Maintain scroll position when navigating between pages in same section

### Short Pages (Few Headings)
- Hide TOC when page has fewer than 2 H2/H3 headings
- Content expands to fill available width

### Very Long Headings
- TOC links: Truncate with ellipsis after 2 lines (line-clamp: 2)
- Sidebar links: Truncate with ellipsis after 1 line

### Deep Nesting in Sidebar
- Max recommended depth: 3 levels
- Beyond 3 levels: Flatten or use separate sidebar section

### Code Block Overflow
- Horizontal scroll within code block container
- Never allow code blocks to expand beyond content width

### Rapid Scroll (Scroll Spy)
- Intersection Observer handles this efficiently by design
- No additional debounce needed

### Print Styles
- Hide sidebar, TOC, header nav, and footer
- Show content area at full width
- Expand all code blocks

## Common Variations

### With Version Switcher
- Add dropdown in sidebar header or main header for version selection
- URL pattern: /docs/v2/... or /docs/latest/...

### With API Reference Layout
- Wider content area or two-panel (description + code example side by side)
- Auto-generated from code or OpenAPI spec

### With Search Results Page
- Replace content area with search results list
- Maintain sidebar context

### With Feedback Widget
- "Was this helpful?" thumbs up/down at page bottom
- Optional comment field on negative feedback

### With Tabbed Content
- Inline tabs for showing code in multiple languages or framework variants (e.g., npm/yarn/pnpm, React/Vue/Angular)
- See Tabs component potion for full specification

## Testing Checklist

When implementing this layout, test:

- [ ] Three-column layout renders correctly on desktop (>=1280px)
- [ ] Two-column layout works on tablet (sidebar + content, no TOC)
- [ ] Single-column layout works on mobile (content only, sidebar as drawer)
- [ ] Sidebar navigation tree expands and collapses sections
- [ ] Active page is highlighted in sidebar
- [ ] Active page's parent section auto-expands on load
- [ ] Sidebar scrolls independently and active page is visible on load
- [ ] TOC displays H2/H3 headings from current page
- [ ] Scroll spy correctly highlights current heading in TOC
- [ ] Clicking TOC link scrolls to heading with proper offset for sticky header
- [ ] URL hash updates when scrolling to headings
- [ ] Cmd+K / Ctrl+K opens search overlay
- [ ] Search trigger button opens search overlay on click
- [ ] Mobile sidebar drawer opens and closes with animation
- [ ] Mobile backdrop dismisses sidebar on click
- [ ] Focus is trapped in mobile sidebar drawer
- [ ] Focus returns to hamburger button when drawer closes
- [ ] Body scroll is locked when mobile drawer is open
- [ ] Escape closes mobile drawer
- [ ] Sidebar closes after navigation on mobile
- [ ] Breadcrumbs display correct path
- [ ] Prev/Next navigation links work correctly
- [ ] Code blocks have syntax highlighting and copy button
- [ ] Code block copy button copies content to clipboard
- [ ] Code block file labels display correctly
- [ ] Callout blocks render with correct type styling
- [ ] Theme toggle switches between light and dark mode
- [ ] Keyboard navigation works throughout (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader landmarks are correctly identified
- [ ] All icon-only buttons have aria-label
- [ ] aria-current="page" set on active sidebar link
- [ ] aria-expanded updated on sidebar section toggles
- [ ] Color contrast meets WCAG AA (4.5:1 body text)
- [ ] Responsive at all breakpoints (no horizontal scroll)
- [ ] Window resize transitions between layouts correctly
- [ ] TOC hides on pages with fewer than 2 headings
- [ ] Footer renders below content (not fixed)
- [ ] Print styles hide navigation and show content at full width
- [ ] Prefers-reduced-motion reduces or disables animations
- [ ] Styling uses only project conventions (no ad-hoc CSS)
- [ ] SSR/hydration safe (no sessionStorage/Intersection Observer during SSR)

---

## See Also

This documentation layout works well with these components:

- **[Command Palette](/potions/components/command-palette)** — **Required** for the Cmd+K search overlay. The documentation search MUST be implemented as a Command Palette following this potion's full specification (fuzzy matching, grouped results, keyboard navigation, active row tracking, ARIA, mobile full-screen takeover)
- **[Navbar](/potions/components/navbar)** - For the header navigation bar with responsive mobile menu
- **[Tabs](/potions/components/tabs)** - For content variant switching within documentation (e.g., npm/yarn/pnpm installation tabs)
- **[Dark/Light Mode](/potions/patterns/dark-light-mode)** - For the theme switching functionality
- **[Button](/potions/components/button)** - For header actions, copy buttons, navigation buttons, and feedback widgets

These are suggestions for components that pair well with documentation layouts. The layout works independently.

---

## Summary for AI Agents

This documentation layout is a three-column reading layout (sidebar + content + TOC) for developer documentation. Key implementation points:

1. **Layout**: CSS Grid with three columns on desktop, two on tablet, one on mobile
2. **Sidebar**: Hierarchical nav tree with collapsible sections, off-canvas drawer on mobile
3. **Content**: Prose area (max 768px) with breadcrumbs, code blocks, callouts, prev/next nav
4. **TOC**: Scroll-spy powered "On this page" navigation using Intersection Observer
5. **Search**: Cmd+K trigger opens a full Command Palette overlay — **MUST read and follow the [Command Palette component potion](/potions/components/command-palette)** for fuzzy matching, grouped results, keyboard navigation, active row tracking, and accessibility. Do not implement a simple filter input.
6. **Accessibility**: Landmarks, ARIA attributes, keyboard navigation, focus management
7. **Responsive**: Three columns (desktop) > two columns (tablet) > one column (mobile drawer)
8. **Framework-agnostic**: Adapt patterns to any framework's component model
