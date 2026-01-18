---
layout: 'potion'
title: 'Navigation Bar (Responsive) with Mobile Menu + Dropdowns'
publicationDate: '2026-01-12'
excerpt: 'A responsive navigation bar component with mobile hamburger menu, sticky scroll behavior, optional transparent-to-solid transition, and first-class dropdown support. Supports marketing (logo + links + CTA) and app (user menu, notifications) variants.'
category: 'Components'
tags:
  - components
  - navbar
  - navigation
  - header
  - responsive
  - mobile-menu
  - sticky
  - dropdown
  - a11y
agentManifest: 'potions/components/navbar.json'
---

# Navigation Bar (Responsive) with Mobile Menu + Dropdowns

A responsive navigation bar component with mobile hamburger menu, sticky scroll behavior, optional transparent-to-solid transition, and first-class dropdown support. Supports marketing (logo + links + CTA) and app (user menu, notifications) variants.

## Structure Specification

### Component Hierarchy

The navbar consists of a Navbar Container that holds a Logo/Brand Section, Navigation Links with Dropdown Panels (desktop), Mobile Menu Toggle Button, Action Buttons (CTA or User Menu), and a Mobile Menu Dialog. The Mobile Menu Dialog contains Navigation Links (with accordion sections for items with children) and Action Buttons.

The navbar structure flows as: Navbar contains Logo, NavLinks (desktop with dropdown toggles/panels), MobileToggle, and Actions. The MobileMenu (dialog) contains NavLinks (with accordion behavior) and Actions.

## Detailed Component Specifications

### 1. Navbar Component

**Goal**: Provide a responsive navigation bar that adapts to screen sizes, supports sticky/transparent behavior, and includes accessible mobile menu and dropdown navigation.

**Anatomy Slots**:
- `logo` - Brand logo/image/text
- `navLinks` - Navigation links (desktop visible, mobile in dialog)
- `mobileToggle` - Hamburger menu button (mobile only)
- `actions` - CTA button(s) or user menu (desktop)
- `dropdownPanels` - Desktop dropdown panels (disclosure pattern)
- `mobileMenu` - Modal dialog for mobile navigation

**Dimensions**:
- Desktop: Full width, height 64-80px (default: 72px)
- Mobile: Full width, height 56-64px (default: 60px)
- Sticky: Fixed at top when scrolling
- Max-width: Optional container constraint (e.g., 1400px)

**States**:
- `variant` (enum: "marketing" | "app", default: "marketing") - Navbar style variant
- `sticky` (boolean, default: true) - Whether navbar is sticky on scroll (default true for both variants)
- `transparent` (boolean, default: false) - Transparent background (becomes solid on scroll; recommended only for marketing variant when background contrast is sufficient)
- `mobileMenuOpen` (boolean, default: false) - Whether mobile menu dialog is visible
- `scrolled` (boolean, computed) - Whether page has scrolled beyond threshold (used for transparent→solid and sticky elevation)
- `activeLink` (string) - Current active navigation link ID/route (syncs with router/URL)
- `openDropdownId` (string, default: "") - ID of currently open desktop dropdown (prefer single open dropdown at a time)
- `mobileExpandedItemIds` (array, default: []) - IDs of expanded accordion sections inside mobile dialog (allow multiple expanded)

**Elements**:

#### Logo/Brand Section
- Height: 40-48px (logo image/text)
- Padding: 16-24px from left edge
- Clickable: Links to home page
- Responsive: May shrink on mobile or show icon-only variant

#### Navigation Links (Desktop)
- Horizontal layout with gap: 24-32px between links
- Font size: 14-16px, medium weight (500-600)
- Active state: Underline, color change, or background highlight
- Hover state: Subtle color change or underline
- Hidden on mobile (< 768px)
- **Dropdown Support**: Items with children open disclosure dropdown panels on click (no hover-only behavior)
- **Dropdown Toggle**: Button with `aria-haspopup="true"`, `aria-expanded`, and `aria-controls`
- **Dropdown Panel**: Container for links (disclosure pattern; avoid `role="menu"` unless fully implementing ARIA menu semantics)

#### Mobile Menu Toggle
- Size: 40px × 40px icon button
- Icon: Hamburger (☰) when closed, close (×) when open
- Position: Right-aligned, 16px from edge
- Visible: Only on mobile/tablet (< 1024px)
- ARIA: `aria-label="Toggle menu"`, `aria-expanded="true/false"`, `aria-controls="mobile-menu"`

#### Action Buttons/User Menu
- **Marketing Variant**: Primary CTA button (e.g., "Get Started", "Sign Up")
  - Button size: 32-40px height, padding 12-16px horizontal
  - Position: Right-aligned, 16-24px from edge
- **App Variant**: User menu dropdown with avatar
  - Avatar: 36-40px circle
  - Dropdown: Opens below avatar on click
  - Contains: Profile, Settings, Logout links
  - Optional: Notifications button with badge

#### Desktop Dropdown Panels
- **Pattern**: Disclosure pattern (button controls a panel of links)
- **Position**: Below dropdown toggle, aligned to toggle or left edge
- **Z-index**: 80 (dropdowns from tokens)
- **Behavior**: Opens on toggle click, closes on outside click or Escape
- **Focus**: Does not trap focus; uses normal Tab order
- **ARIA**: Toggle has `aria-haspopup="true"`, `aria-expanded`, `aria-controls`; panel has matching `id`
- **Animation**: 180ms open, 150ms close (opacity, transform, visibility)
- **Note**: Avoid `role="menu"` / `role="menuitem"` unless fully implementing ARIA menu button pattern with arrow-key semantics

#### Mobile Menu Dialog
- Modal dialog overlay when open (uses `role="dialog"` with `aria-modal="true"`)
- Background: White (light) or dark neutral (dark mode)
- Position: Fixed, full width, slides from top or left
- Z-index: 60 (mobileMenu from tokens)
- Contains: Navigation links (vertical stack, items with children render as accordion sections) and action buttons
- Backdrop: Optional dark overlay behind menu (z-index: 50)
- Animation: Slide-in from top/left (300ms), fade backdrop (200ms)
- **Accordion Sections**: Items with children expand/collapse without closing the dialog

**Behavior**:
- Sticky positioning: Fixed at top when `sticky=true` and user scrolls (default: true)
- Transparent→Solid: Background transitions from transparent to solid on scroll (when `transparent=true`; marketing variant only)
- Mobile menu: Opens/closes on toggle button click
- Mobile menu: Closes on backdrop click, Escape key, or link click
- Mobile accordion: Items with children expand/collapse as accordion sections (does not close dialog)
- Focus trap: Focus trapped within mobile menu dialog when open
- Focus restoration: Returns focus to toggle button when menu closes
- Body scroll lock: Body scroll locked when mobile menu is open (restore on close)
- Desktop dropdowns: Open on toggle click, close on outside click or Escape (disclosure pattern)
- Desktop dropdown focus: Does not trap focus; uses normal Tab order; Escape restores focus to toggle
- Active link: Highlights current page/route using project's routing solution
- Keyboard navigation: Full keyboard support for all interactive elements

## Responsive Breakpoints

### Mobile (< 768px)
- **Layout**: Logo left, hamburger menu right
- **Navigation**: Hidden, accessible via mobile menu dialog
- **Dropdowns**: Items with children render as accordion sections inside the dialog
- **Actions**: Shown in mobile menu
- **Height**: 60px
- **Mobile Menu**: Modal dialog overlay; full-screen or slide-in panel

### Tablet (768px - 1023px)
- **Layout**: Logo left, hamburger menu right
- **Navigation**: Default to mobile menu dialog pattern
- **Dropdowns**: Items with children still behave as accordion sections inside the dialog
- **Actions**: May be in navbar if space allows; otherwise in mobile menu
- **Height**: 72px
- **Default**: Use mobile menu dialog pattern (same as mobile breakpoint)

### Desktop (≥ 1024px)
- **Layout**: Logo left, nav links center/left, actions right
- **Navigation**: Horizontal nav links visible
- **Dropdowns**: Items with children open disclosure dropdown panels on click (no hover-only behavior)
- **Actions**: Visible in navbar
- **Height**: 72px
- **Mobile Menu**: Hidden (hamburger button hidden)

## Interaction Patterns

### Sticky Scroll Behavior
1. User scrolls down page
2. If `sticky=true`, navbar becomes fixed at top
3. If `transparent=true`, background transitions from transparent to solid
4. Shadow appears for depth (optional)
5. Navbar remains visible during scroll

### Mobile Menu Open
1. User clicks hamburger button
2. Mobile menu overlay appears with animation
3. Focus moves to first link in menu
4. Body scroll is locked
5. Backdrop appears (optional)
6. Focus is trapped within menu

### Mobile Menu Close
1. User clicks close button, backdrop, or Escape key
2. Mobile menu closes with animation
3. Focus returns to hamburger button
4. Body scroll is unlocked
5. Backdrop fades out

### Desktop Dropdown Open
1. User clicks dropdown toggle button
2. Dropdown panel appears below toggle with animation (180ms)
3. `aria-expanded` updates to `true` on toggle
4. Panel receives focus (first link) or focus stays on toggle (product-specific)
5. Other open dropdowns close automatically (single open at a time)

### Desktop Dropdown Close
1. User clicks outside dropdown, clicks toggle again, or presses Escape
2. Dropdown panel closes with animation (150ms)
3. `aria-expanded` updates to `false` on toggle
4. Focus returns to toggle button (on Escape)
5. Outside click does not restore focus

### Mobile Accordion Toggle
1. User clicks accordion toggle inside mobile dialog
2. Accordion section expands/collapses with animation
3. `aria-expanded` updates on accordion toggle
4. Mobile dialog remains open (does not close)
5. Focus remains within the dialog

### Active Link Highlighting
1. Current page/route is detected using project's routing solution
2. Active link is visually highlighted (underline, color change, or background)
3. `aria-current="page"` is set on active link
4. Highlight persists on page reload
5. Route changes update active link and may close open overlays (product-specific)

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This navbar component should meet WCAG 2.1 Level AA standards. Key requirements:

- **2.1.1 Keyboard**: All navbar controls operable via keyboard; focus trapped within mobile dialog while open.
- **2.1.2 No Keyboard Trap**: Escape closes mobile dialog and dropdowns; no keyboard trap beyond intended modal focus trap.
- **2.4.3 Focus Order**: Logical focus order; focus returns to correct toggle when overlays close.
- **2.4.7 Focus Visible**: Visible focus indicators for all interactive elements.
- **4.1.2 Name, Role, Value**: Correct ARIA roles, names, and relationships.

### Keyboard Navigation

**Tab Order**:
- Logo → Nav Links (desktop, including dropdown toggles) → Actions → Mobile Toggle (mobile)
- Within mobile dialog: Links → Accordion toggles → Actions → Close button
- Desktop dropdown panels: Do not trap focus; use normal Tab order

**Implementation**:
- Tab cycles through focusable elements
- Shift+Tab cycles backwards
- Escape closes mobile dialog when open; otherwise closes open desktop dropdown
- Escape restores focus to the corresponding toggle
- Enter/Space activates links and buttons

**Focus Management**:
- **On Mobile Dialog Open**: Move focus to first focusable element inside dialog (often first nav link)
- **On Mobile Dialog Close**: Return focus to menu toggle button
- **On Desktop Dropdown Open**: Focus may stay on toggle or move to first link (product-specific)
- **On Desktop Dropdown Close (Escape)**: Restore focus to dropdown toggle
- **On Desktop Dropdown Close (Outside Click)**: Focus does not change
- **Mobile Accordion**: Focus remains within dialog when toggling accordion sections
- **Focus Visible**: Clear focus indicators (2px solid outline, 2px offset)

### ARIA Attributes

**Required ARIA Attributes**:

1. **Navbar Element**:
   ```html
   <nav role="navigation" aria-label="Main navigation">
   ```

2. **Mobile Menu Toggle**:
   ```html
   <button id="navbar-menu-toggle"
           aria-label="Toggle menu" 
           aria-expanded="false" 
           aria-controls="navbar-mobile-menu">
   ```

3. **Mobile Menu**:
   ```html
   <div id="navbar-mobile-menu" 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="navbar-menu-toggle"
        aria-hidden="true">
     <nav aria-label="Main navigation">
       <!-- Navigation links -->
     </nav>
   </div>
   ```
   **Note**: Mobile menu uses `role="dialog"` with `aria-modal="true"` because it's a modal overlay with focus trap. Inside the dialog, include `<nav aria-label="Main navigation">` for the links.

4. **Active Navigation Link**:
   ```html
   <a href="/current-page" aria-current="page">Current Page</a>
   ```

5. **User Menu Button**:
   ```html
   <button aria-label="User menu" 
           aria-haspopup="true" 
           aria-expanded="false"
           aria-controls="user-dropdown">
   ```

6. **Desktop Dropdown Toggle**:
   ```html
   <button aria-haspopup="true"
           aria-expanded="false"
           aria-controls="dropdown-panel-products">
     Products
   </button>
   ```

7. **Desktop Dropdown Panel**:
   ```html
   <div id="dropdown-panel-products">
     <a href="/products/feature1">Feature 1</a>
     <a href="/products/feature2">Feature 2</a>
   </div>
   ```
   **Note**: Prefer disclosure semantics (button controls a panel of links). Avoid `role="menu"` unless fully implementing ARIA menu keyboard semantics.

8. **Mobile Accordion Toggle**:
   ```html
   <button aria-expanded="false"
           aria-controls="accordion-panel-products">
     Products
   </button>
   ```

9. **Mobile Accordion Panel**:
   ```html
   <div id="accordion-panel-products">
     <a href="/products/feature1">Feature 1</a>
     <a href="/products/feature2">Feature 2</a>
   </div>
   ```

10. **Notifications Button**:
   ```html
   <button aria-label="Notifications: 3 unread" 
           aria-haspopup="true" 
           aria-expanded="false">
     <span class="notifications-badge" aria-label="3 unread">3</span>
   </button>
   ```

**Dynamic ARIA Updates**:
- Update `aria-expanded` on mobile menu toggle when dialog opens/closes
- Update `aria-expanded` on desktop dropdown toggles when panels open/close
- Update `aria-expanded` on mobile accordion toggles when sections expand/collapse
- Update `aria-hidden` on mobile menu (true when closed; false/omitted when open)
- Update `aria-modal="true"` on mobile menu when open
- Make background content inert/aria-hidden while mobile dialog is open (use `inert` if available, or apply `aria-hidden` to main content)
- Update `aria-current="page"` on active navigation link
- Update `aria-label` on notifications button to include count

### Screen Reader Support

**Announcements**:
- Mobile menu state changes (via `aria-expanded` and focus management)
- Active page changes (via `aria-current="page"`)

**Labels**:
- All icon-only buttons must have descriptive `aria-label`
- Logo image must have descriptive `alt` text
- Navigation links should have clear, descriptive text

**Screen Reader Only Text (sr-only class)**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Focus Visible Styles

**Implementation**:
```css
button:focus-visible,
a:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Fallback for older browsers */
button:focus,
a:focus,
[tabindex]:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Accessibility Implementation Checklist

When implementing this navbar, ensure:

- [ ] All buttons have `aria-label` or visible text
- [ ] Mobile menu uses `role="dialog"` + `aria-modal="true"` and contains `<nav aria-label="Main navigation">`
- [ ] Mobile menu toggle has id, `aria-expanded`, and `aria-controls`
- [ ] Focus trap is active only while the mobile dialog is open; focus restores to the menu toggle on close
- [ ] Background content is inert/aria-hidden while the mobile dialog is open
- [ ] Body scroll lock is applied when mobile dialog is open and cleaned up on close
- [ ] Desktop dropdown toggles have `aria-expanded` + `aria-controls`; Escape closes and restores focus
- [ ] Mobile dropdowns are accordions with `aria-expanded` + `aria-controls`; expanding does not close the dialog
- [ ] Active link uses `aria-current="page"` correctly
- [ ] All interactive elements have visible focus indicators
- [ ] Prefers-reduced-motion reduces durations and avoids transform motion where possible

## Design System Specifications

**Important**: The design specifications below are tool-agnostic and should be implemented using your project's chosen styling approach (Tailwind, CSS Modules, styled-components, Chakra UI, Material-UI, SCSS, etc.). The styling examples in the "Code Implementation Patterns" section show how to apply these design values, but these specifications are the source of truth for the design.

### Color Guidelines

#### Navbar Background
- **Light (Default)**: White (`#ffffff`) or very light gray (`#f9fafb`)
- **Light (Transparent)**: `rgba(255, 255, 255, 0.95)` with `backdrop-filter: blur(8px)`
- **Light (Scrolled)**: White (`#ffffff`) with shadow
- **Dark (Default)**: `#1a1a1a` or `#0f172a`
- **Dark (Transparent)**: `rgba(26, 26, 26, 0.95)` with `backdrop-filter: blur(8px)`
- **Dark (Scrolled)**: `#1a1a1a` with shadow

#### Navigation Links
- **Text (Light)**: Dark gray (`#111827`, `#1f2937`) or black (`#000000`)
- **Text (Dark)**: `#e0e0e0` or `#f1f5f9`
- **Hover (Light)**: Primary color or darker gray
- **Hover (Dark)**: Primary color or lighter gray
- **Active (Light)**: Primary color with underline or background
- **Active (Dark)**: Primary color with underline or background
- **Contrast**: Ensure 4.5:1 contrast ratio minimum (WCAG AA)

#### Logo
- **Text/Icon**: Match navigation link colors or brand color
- **Hover**: Subtle opacity change or color shift

#### Mobile Menu
- **Background (Light)**: White (`#ffffff`)
- **Background (Dark)**: `#1a1a1a` or `#0f172a`
- **Backdrop**: `rgba(0, 0, 0, 0.5)` to `rgba(0, 0, 0, 0.75)`
- **Links**: Match navbar link colors

#### Action Buttons
- **Primary CTA**: Use project's primary button style
- **User Menu**: Match navbar text colors
- **Notifications Badge**: Red (`#ef4444`, `#dc2626`) or primary color

### Typography

- **Font Family**: Use project's font stack (typically: system-ui, -apple-system, sans-serif or custom font)
- **Navigation Links**: 14-16px, medium weight (500-600)
- **Logo**: 18-24px, bold (700) or use logo image
- **CTA Button**: 14-16px, semibold (600)
- **Line Height**: 1.25 for headings, 1.5 for body text

### Spacing System

Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px) or your project's spacing system:

- **Navbar Padding**: 16-24px horizontal (desktop), 16px (mobile)
- **Logo Padding**: 16-24px from left edge
- **Nav Links Gap**: 24-32px between links (desktop)
- **Actions Padding**: 16-24px from right edge
- **Mobile Menu Padding**: 24px on all sides
- **Mobile Menu Link Gap**: 16-24px vertical between links

### Shadows & Elevation

Use subtle shadows for depth and separation:

- **Navbar Shadow (Sticky/Scrolled, Light)**: `0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)`
- **Navbar Shadow (Sticky/Scrolled, Dark)**: `0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)`
- **Mobile Menu Shadow**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

### Border Radius

- **Buttons**: 6-8px
- **Mobile Menu**: 0 (full width) or 8-12px if not full-screen
- **Avatar**: 50% (circle)
- **Badges**: 12-16px (pill shape)

### Visual Hierarchy Principles

1. Logo should be clearly visible and clickable
2. Navigation links should be easily scannable
3. Active link should be clearly highlighted
4. CTA button should stand out (marketing variant)
5. Mobile menu should be clearly separated from main content
6. Focus indicators should be clearly visible
7. Transparent→Solid transition should be smooth and noticeable

## State Management Considerations

### For AI Agents to Implement

**State to Track**:
1. `mobileMenuOpen: boolean` - Whether mobile menu dialog is visible (default: false)
2. `scrolled: boolean` - Whether page has scrolled beyond threshold (computed from scroll position > `tokens.layout.scrollThresholdPx`, default: false)
3. `activeLink: string` - Current active navigation link ID/route (syncs with router/URL)
4. `variant: "marketing" | "app"` - Navbar style variant (default: "marketing")
5. `sticky: boolean` - Whether navbar is sticky on scroll (default: true)
6. `transparent: boolean` - Whether navbar starts transparent (default: false; recommended only for marketing variant)
7. `openDropdownId: string` - ID of currently open desktop dropdown (default: ""; prefer single open at a time)
8. `mobileExpandedItemIds: array` - IDs of expanded accordion sections inside mobile dialog (default: []; allow multiple expanded)

**State Persistence**:
- All state is component-level only (no persistence needed)
- `activeLink` should sync with router/URL

### SSR/Hydration Considerations
- **Mobile menu state**: Initialize `mobileMenuOpen` as `false` to prevent hydration mismatches
- **Scroll state**: Only access `window` and scroll position after component mount
- **Implementation**: Check `typeof window !== 'undefined'` before accessing window object

## Critical Implementation Guidelines

### Project Detection

Before implementing, AI agents must detect:

1. **Framework**: Identify React/Vue/Angular/Svelte and routing libraries by inspecting package.json and existing components
2. **Styling System**: Detect Tailwind, SCSS, CSS Modules, styled-components, etc. and use ONLY that system
3. **Design Tokens**: Identify existing color systems, spacing scales, and typography from the project

**CRITICAL**: Use ONLY the detected styling system. Do NOT introduce new styling systems.

### Vanilla CSS Detection
**CRITICAL**: When detecting vanilla CSS in the project, ALWAYS create CSS classes in a stylesheet. NEVER use inline style attributes on HTML elements.

- Define classes like `.navbar`, `.navbar--sticky`, `.navbar--transparent`, `.mobile-menu`, etc. in your CSS file
- Apply classes via `className`/`class` attributes: `<nav class="navbar navbar--sticky">`
- Do NOT use: `<nav style="position: fixed">`
- This ensures maintainability, reusability, and proper separation of concerns

### React Hook Patterns
**CRITICAL**: When detecting React, extract logic from `useEffect` hooks into separate custom hooks that do ONE thing each.

- Instead of one `useEffect` handling multiple concerns (scroll listener + mobile menu + focus trap), create separate hooks:
  - `useScrollPosition()` - Handles scroll position tracking only
  - `useMobileMenu()` - Handles mobile menu state only
  - `useFocusTrap(containerRef, isActive)` - Handles focus trapping only
  - `useBodyScrollLock(isLocked)` - Handles body scroll locking only
- This improves code organization, testability, and reusability
- Each hook should have a single responsibility

## Code Implementation Patterns

### React Example Pattern
```jsx
// Suggested component structure
<Navbar
  variant="marketing"
  sticky={true}
  transparent={true}
  activeLink={currentRoute}
>
  <NavbarLogo href="/">Brand</NavbarLogo>
  <NavbarLinks>
    <NavLink href="/about" active={currentRoute === '/about'}>About</NavLink>
    <NavLink href="/pricing" active={currentRoute === '/pricing'}>Pricing</NavLink>
    <NavLink href="/contact" active={currentRoute === '/contact'}>Contact</NavLink>
  </NavbarLinks>
  <NavbarActions>
    <Button variant="primary">Get Started</Button>
  </NavbarActions>
  <MobileMenuToggle />
  <MobileMenu>
    <MobileNavLinks />
    <MobileActions />
  </MobileMenu>
</Navbar>
```

### Angular Example Pattern
```html
<!-- Suggested template structure -->
<nav class="navbar" 
     [class.navbar--sticky]="isSticky"
     [class.navbar--scrolled]="hasScrolled"
     role="navigation"
     aria-label="Main navigation">
  <a class="navbar-logo" href="/">Brand</a>
  <ul class="navbar-links" *ngIf="!isMobile">
    <li><a href="/about" [attr.aria-current]="currentRoute === '/about' ? 'page' : null">About</a></li>
    <li><a href="/pricing" [attr.aria-current]="currentRoute === '/pricing' ? 'page' : null">Pricing</a></li>
  </ul>
  <button class="mobile-toggle" 
          *ngIf="isMobile"
          (click)="toggleMobileMenu()"
          [attr.aria-expanded]="mobileMenuOpen"
          aria-label="Toggle menu">
    ☰
  </button>
  <div class="mobile-menu" 
       *ngIf="isMobile && mobileMenuOpen"
       [attr.aria-hidden]="!mobileMenuOpen">
    <!-- Mobile menu content -->
  </div>
</nav>
```

### Vue Example Pattern
```vue
<!-- Suggested component structure -->
<template>
  <nav class="navbar"
       :class="{ 'navbar--sticky': sticky, 'navbar--scrolled': scrolled }"
       role="navigation"
       aria-label="Main navigation">
    <a class="navbar-logo" href="/">Brand</a>
    <ul class="navbar-links" v-if="!isMobile">
      <li><a href="/about" :aria-current="currentRoute === '/about' ? 'page' : undefined">About</a></li>
      <li><a href="/pricing" :aria-current="currentRoute === '/pricing' ? 'page' : undefined">Pricing</a></li>
    </ul>
    <button class="mobile-toggle"
            v-if="isMobile"
            @click="toggleMobileMenu"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle menu">
      ☰
    </button>
    <Teleport to="body">
      <div v-if="isMobile && mobileMenuOpen" 
           class="mobile-menu"
           :aria-hidden="!mobileMenuOpen">
        <!-- Mobile menu content -->
      </div>
    </Teleport>
  </nav>
</template>
```

### CSS/Styling Approaches

**Note**: The examples below show how to implement the design specifications using different styling tools. Always refer to the "Design System Specifications" section above for the authoritative design values, then adapt them to your project's styling approach.

#### Tailwind CSS Pattern
```html
<!-- Navbar -->
<nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm transition-all duration-300"
     :class="{ 'bg-white/95 backdrop-blur-md': transparent && !scrolled, 'bg-white shadow-md': scrolled }">
  <div class="container mx-auto flex items-center justify-between h-18 px-6">
    <!-- Logo -->
    <a href="/" class="text-xl font-bold">Brand</a>
    
    <!-- Desktop Nav Links -->
    <ul class="hidden md:flex items-center gap-8">
      <li><a href="/about" class="hover:text-primary">About</a></li>
      <li><a href="/pricing" class="hover:text-primary">Pricing</a></li>
    </ul>
    
    <!-- Mobile Toggle -->
    <button class="md:hidden w-10 h-10" aria-label="Toggle menu">☰</button>
    
    <!-- CTA -->
    <button class="hidden md:block px-4 py-2 bg-primary text-white rounded">Get Started</button>
  </div>
</nav>
```

#### Vanilla CSS Pattern
```css
/* CRITICAL: Always create CSS classes, never use inline styles */
/* Apply design system values directly */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  transition: background 300ms, box-shadow 300ms;
}

.navbar--transparent {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: none;
}

.navbar--scrolled {
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.navbar-links {
  display: flex;
  gap: 32px;
  list-style: none;
}

.navbar-link {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  text-decoration: none;
  transition: color 150ms;
}

.navbar-link:hover {
  color: var(--primary-color);
}

.navbar-link.active {
  color: var(--primary-color);
  text-decoration: underline;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  z-index: 50;
  padding: 24px;
  transform: translateX(-100%);
  transition: transform 300ms;
}

.mobile-menu--open {
  transform: translateX(0);
}
```

#### Material-UI/Chakra Pattern
- Use AppBar component for navbar (Material-UI) or Box with flex layout (Chakra)
- **Extend theme** with design system color values, spacing scale, and typography settings
- Use theme.transitions for consistent animations matching design system specifications
- Leverage theme breakpoints for responsive behavior
- **Customize colors, spacing, and typography** to match design system specifications
- Use Drawer component for mobile menu (Material-UI) or Drawer component (Chakra)

## Animation Specifications

### Sticky Scroll Transition
- **Duration**: 200-300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` or `ease-in-out`
- **Properties**: `background-color`, `box-shadow`, `backdrop-filter`
- **Trigger**: Scroll position > threshold (e.g., 20px)

### Transparent→Solid Transition
- **Duration**: 200-300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Properties**: 
  - Background: transparent/surface-overlay → surface-solid (use project tokens)
  - Shadow: none → elevated shadow (use project tokens)
  - Backdrop filter: `blur(8px)` → `none` (optional; prefer tokens)

### Mobile Menu Open
- **Duration**: 250-300ms (from `tokens.motion.mobileMenuOpenMs`)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Menu**: Slide from top/left: `translateX(-100%)` → `translateX(0)` or `translateY(-100%)` → `translateY(0)`
- **Backdrop**: Fade in: `opacity: 0` → `opacity: 1` (200ms from `tokens.motion.backdropFadeMs`)

### Mobile Menu Close
- **Duration**: 250ms (from `tokens.motion.mobileMenuCloseMs`)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Menu**: Slide out: `translateX(0)` → `translateX(-100%)`
- **Backdrop**: Fade out: `opacity: 1` → `opacity: 0` (150ms)

### Desktop Dropdown Open
- **Duration**: 180ms (from `tokens.motion.dropdownOpenMs`)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Properties**: `opacity`, `transform`, `visibility`
- **Note**: If `prefers-reduced-motion` is enabled, avoid transform and reduce durations to ≤100ms

### Desktop Dropdown Close
- **Duration**: 150ms (from `tokens.motion.dropdownCloseMs`)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Properties**: `opacity`, `transform`, `visibility`
- **Note**: If `prefers-reduced-motion` is enabled, avoid transform and reduce durations to ≤100ms

### Prefers-Reduced-Motion Support

**When `prefers-reduced-motion` is enabled**:
- Disable transform-based motion where possible (avoid translate animations)
- Reduce animation durations to ≤100ms (use `tokens.motion.reducedMotionDurationMs`)
- Minimize backdrop-filter blur transitions
- Allow essential opacity transitions (≤100ms)

**Implementation**:
```css
@media (prefers-reduced-motion: reduce) {
  .navbar,
  .mobile-menu {
    animation: none;
    transition: opacity 0.1s ease, background-color 0.1s ease;
  }
  
  .mobile-menu {
    transform: none; /* Disable translateX/translateY animations */
  }
  
  .navbar--transparent {
    backdrop-filter: none; /* Minimize blur transitions */
  }
}
```

**Performance**:
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Set `will-change: transform, opacity` on animating elements
- Use `transform3d(0,0,0)` to trigger GPU acceleration if needed

## Z-Index Layer System

To ensure proper layering of elements:
- **Backdrop**: 50 (from tokens)
- **Mobile Menu**: 60 (from tokens)
- **Navbar**: 70 (from tokens)
- **Dropdowns**: 80 (from tokens)
- **Tooltips**: 90 (from tokens)

## Implementation Details

### Sticky Positioning

**When**: `sticky=true` and user scrolls down

**How**: 
- Set `position: fixed` when scroll position > threshold
- Add shadow for depth
- Smooth transition on background/shadow changes

**Cleanup**: Remove fixed positioning when scrolling back to top (optional, or keep fixed)

### Scroll Detection

**When**: `transparent=true` or need to track scroll state

**How**: 
- Add scroll event listener (throttled/debounced - recommended: `requestAnimationFrame` or ~100ms throttle)
- Update `scrolled` state when scroll position > threshold (default: 20px, from `tokens.layout.scrollThresholdPx`)
- Trigger background/shadow transitions

**Cleanup**: Remove scroll listener on unmount

### Mobile Menu Focus Trap

**When**: Mobile menu is open

**How**: 
- Use focus-trap library (e.g., `focus-trap` for React, `focus-trap-vue` for Vue) or manual implementation
- Identify all focusable elements within mobile menu
- Prevent tabbing outside menu boundaries
- Cycle focus within menu on Tab/Shift+Tab

**Cleanup**: Remove focus trap on close

### Focus Restoration

**When**: Mobile menu closes (all close paths)

**How**: 
- Store reference to toggle button when menu opens
- Restore focus to toggle button on close
- Handle cases where toggle button no longer exists (fallback to body or first focusable element)

### Body Scroll Lock

**When**: Mobile menu is open

**How**: 
- Set `document.body.style.overflow = 'hidden'` (or project-standard utility)
- **Optional: Preserve scroll position**: Use `position: fixed` with `top: -${window.scrollY}px` to prevent jump when locking scroll
- **iOS handling**: If needed, prevent body touchmove scrolling behind the dialog using project-standard approach

**Cleanup**: 
- Restore previous styles on menu close/unmount

### Escape Key Handling

**When**: Mobile menu is open

**How**: 
- Add global keydown listener for Escape key
- Prevent default and stop propagation
- Close menu and restore focus

**Cleanup**: Remove listener on close

### Active Link Detection

**When**: Page loads or route changes

**How**: 
- Compare current URL/route with navigation link hrefs using project's routing solution
- Set `aria-current="page"` on matching link
- Apply active styles (underline, color change, background)
- Route changes may close open overlays (product-specific)

### Desktop Dropdown Management

**When**: User interacts with dropdown toggles

**How**: 
- Track `openDropdownId` state (prefer single open dropdown at a time)
- On toggle click: Open if closed, close if open
- On outside click: Close open dropdown
- On Escape: Close dropdown and restore focus to toggle
- Update `aria-expanded` on toggle dynamically
- Do not trap focus inside dropdown panels (use normal Tab order)

**Cleanup**: Close dropdowns on unmount or route change (if required)

### Mobile Accordion Management

**When**: User interacts with accordion toggles inside mobile dialog

**How**: 
- Track `mobileExpandedItemIds` array (allow multiple expanded sections)
- On accordion toggle click: Add/remove item ID from array
- Update `aria-expanded` on accordion toggle dynamically
- Expanding/collapsing does not close the mobile dialog
- Focus remains within the mobile dialog

## Edge Cases

### Very Long Navigation Labels
- Truncate with ellipsis on mobile
- Show tooltip on hover (desktop)
- Consider icon-only variant for mobile

### Many Navigation Links
- Desktop: May need to wrap to second line or use dropdown
- Mobile: Scrollable menu if many links
- Consider grouping links into categories

### Rapid Opening/Closing
- Debounce or disable interactions during animation
- Prevent multiple simultaneous open/close operations

### Window Resize During Mobile Menu Open
- Close mobile menu when switching to desktop breakpoint
- Re-evaluate breakpoint on resize (debounced)

### Very Small Screens
- Further reduce padding/spacing on screens < 320px
- Consider icon-only logo variant

### Content Overflow
- Ensure navbar doesn't overflow viewport horizontally
- Mobile menu should handle vertical overflow with scrolling

## Common Variations

### Marketing Navbar
- Logo + horizontal nav + primary CTA
- Sticky by default
- Optional transparent-on-hero mode (`transparent=true`) that becomes solid on scroll
- Dropdowns supported for grouped marketing sections
- Simple, clean design

### App Navbar
- Logo + nav + notifications + user menu
- Solid background only (`transparent` forced false)
- Sticky by default
- Dropdowns commonly used for user menu and nav groupings
- More compact, functional design

### Minimal Navbar
- Logo + few nav links only
- No CTA button
- Very clean, minimal design

### Centered Navbar
- Logo centered, nav links centered below or around logo
- Less common, used for specific design styles

### With Search Bar
- Add search input in navbar
- May replace some nav links on mobile
- Search opens modal or expands inline

## Testing Checklist

When implementing this navbar, test:

- [ ] Navbar renders correctly on all breakpoints
- [ ] Mobile menu dialog opens and closes via toggle, Escape, backdrop click, and link click
- [ ] Focus is trapped within the mobile dialog while open
- [ ] Focus is restored to the mobile toggle when the dialog closes
- [ ] Body scroll is locked while the mobile dialog is open and restored on close
- [ ] Sticky positioning works correctly when enabled
- [ ] Transparent→Solid transition works on scroll when enabled (marketing only)
- [ ] Active link is highlighted correctly and uses `aria-current="page"`
- [ ] Desktop dropdown opens/closes on toggle click
- [ ] Desktop dropdown closes on outside click and Escape
- [ ] Escape on desktop dropdown restores focus to the dropdown toggle
- [ ] Desktop dropdown does not trap focus; Tab order is logical
- [ ] Mobile dropdown items render as accordions inside the dialog
- [ ] Mobile accordion expand/collapse updates `aria-expanded` and does not close the dialog
- [ ] Route changes update active link and close open overlays if required by product rules
- [ ] Window resize closes the mobile dialog when switching to desktop breakpoint
- [ ] Prefers-reduced-motion reduces durations and avoids transform motion where possible
- [ ] All interactive elements have visible focus indicators
- [ ] Screen reader announces dialog state changes and expanded/collapsed states appropriately
- [ ] SSR/hydration safe (no DOM access before mount)

## AI Agent Implementation Prompt Template

Use this template when asking an AI agent to implement this navbar:

```
Implement a responsive Navigation Bar component with mobile hamburger menu as a modal dialog (role="dialog" aria-modal="true") including focus trap, focus restoration, inert background, and body scroll lock. Support sticky scroll behavior and optional transparent-to-solid transition (marketing recommended only). Add dropdown navigation: on desktop, implement disclosure dropdowns (button controlling a panel of links with aria-expanded/aria-controls; avoid role="menu" unless fully implementing ARIA menu semantics). On mobile/tablet, integrate dropdown items as accordion sections inside the dialog (aria-expanded/aria-controls), and expanding must not close the dialog. Close the mobile dialog on Escape/backdrop/link click. Close desktop dropdown on outside click/Escape and restore focus to its toggle. Implement smooth animations and prefers-reduced-motion (reduce durations to <= tokens.motion.reducedMotionDurationMs and avoid transform-based motion where possible). Adapt to {{USER_FRAMEWORK}} and {{USER_STYLING_LIBRARY}}.

Key requirements:
1. Responsive: Desktop shows horizontal nav links; mobile/tablet show hamburger menu dialog
2. Sticky: Fixed at top when scrolling (sticky=true, default)
3. Transparent→Solid: Background transitions on scroll (transparent=true; marketing only)
4. Mobile Menu: Modal dialog overlay with focus trap, inert background, and body scroll lock
5. Desktop Dropdowns: Disclosure pattern (button + panel), no focus trap, Escape restores focus to toggle
6. Mobile Accordions: Items with children expand/collapse inside dialog without closing it
7. Accessibility: ARIA attributes, keyboard navigation, focus management
8. Active Link: Highlights current page/route using project's routing solution
9. Animations: 150-300ms transitions with prefers-reduced-motion support
10. CRITICAL: Use ONLY the detected styling system. If vanilla CSS is detected, create CSS classes in a stylesheet, never use inline style attributes. If React is detected, separate effects into single-concern hooks.

Reference: UI Potion Navigation Bar Component
```

## Additional Resources

### Focus Trap Library Examples

**React**:
```javascript
import { createFocusTrap } from 'focus-trap';

const trap = createFocusTrap(mobileMenuRef.current, {
  escapeDeactivates: true,
  clickOutsideDeactivates: true,
  returnFocusOnDeactivate: true,
  initialFocus: mobileMenuRef.current.querySelector('a') || mobileMenuRef.current,
});
trap.activate();
```

**Vue**:
```javascript
import { createFocusTrap } from 'focus-trap';

const trap = createFocusTrap(mobileMenuRef.value, {
  escapeDeactivates: true,
  clickOutsideDeactivates: true,
  returnFocusOnDeactivate: true,
});
trap.activate();
```

### Body Scroll Lock Library Examples

**React**:
```javascript
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

disableBodyScroll(mobileMenuRef.current);
// On close:
enableBodyScroll(mobileMenuRef.current);
```

**Vue**:
```javascript
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

disableBodyScroll(mobileMenuRef.value);
// On close:
enableBodyScroll(mobileMenuRef.value);
```

### Scroll Detection Hook Example (React)

```javascript
function useScrollPosition(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > threshold);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
```

---

## Summary for AI Agents

This navigation bar is a responsive navbar component with mobile menu dialog, sticky positioning (default: true), optional transparent-to-solid transition (marketing variant only), and first-class dropdown support. Key implementation points:

1. **Structure**: Logo, Navigation Links with Dropdown Panels (desktop), Mobile Toggle, Actions (CTA/User Menu), Mobile Menu Dialog with Accordion Sections
2. **State**: Track mobileMenuOpen, scrolled, activeLink, variant, sticky (default: true), transparent (marketing only), openDropdownId (desktop), mobileExpandedItemIds (mobile)
3. **Responsive**: Desktop shows horizontal nav with disclosure dropdowns; mobile/tablet show hamburger menu dialog with accordion sections
4. **Sticky**: Fixed at top when scrolling (default: true for both variants)
5. **Transparent→Solid**: Background transitions on scroll (marketing variant only, when transparent=true)
6. **Mobile Menu**: Modal dialog with focus trap, inert background, body scroll lock, focus restoration, Escape key handling
7. **Desktop Dropdowns**: Disclosure pattern (button + panel), no focus trap, Escape restores focus to toggle, outside click closes
8. **Mobile Accordions**: Items with children expand/collapse inside dialog without closing it
9. **Accessibility**: WCAG AA compliance with proper ARIA attributes (role="dialog", aria-modal="true", disclosure semantics for dropdowns)
10. **Project Detection**: Must detect framework, router, styling system, and design tokens before implementation
11. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user. Use ONLY the detected styling system.
