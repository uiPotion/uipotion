---
layout: 'potion'
title: 'Navigation Bar (Responsive) with Mobile Menu'
publicationDate: '2026-01-12'
excerpt: 'A responsive navigation bar component with mobile hamburger menu, sticky scroll behavior, and transparent-to-solid transition. Supports marketing (logo + links + CTA) and app (user menu, notifications) variants.'
category: 'Components'
tags:
  - navbar
  - navigation
  - header
  - responsive
  - mobile-menu
  - sticky
  - a11y
agentManifest: 'potions/components/navbar.json'
---

# Navigation Bar (Responsive) with Mobile Menu

A responsive navigation bar component with mobile hamburger menu, sticky scroll behavior, and transparent-to-solid transition. Supports marketing (logo + links + CTA) and app (user menu, notifications) variants.

## Structure Specification

### Component Hierarchy

The navbar consists of a Navbar Container that holds a Logo/Brand Section, Navigation Links (desktop), Mobile Menu Toggle Button, Action Buttons (CTA or User Menu), and an optional Mobile Menu Overlay. The Mobile Menu contains Navigation Links and Action Buttons.

```
Navbar → Logo | NavLinks (desktop) | MobileToggle | Actions
         ↓
MobileMenu (overlay) → NavLinks | Actions
```

## Detailed Component Specifications

### 1. Navbar Component

**Goal**: Provide a responsive navigation bar that adapts to different screen sizes, supports sticky positioning, and includes accessible mobile menu functionality.

**Anatomy Slots**:
- `logo` - Brand logo/image/text
- `navLinks` - Navigation links (desktop visible, mobile in overlay)
- `mobileToggle` - Hamburger menu button (mobile only)
- `actions` - CTA button(s) or user menu (desktop)
- `mobileMenu` - Overlay menu for mobile navigation

**Dimensions**:
- Desktop: Full width, height 64-80px (default: 72px)
- Mobile: Full width, height 56-64px (default: 60px)
- Sticky: Fixed at top when scrolling
- Max-width: Optional container constraint (e.g., 1400px)

**States**:
- `variant` (enum: "marketing" | "app", default: "marketing") - Navbar style variant
- `sticky` (boolean, default: false) - Whether navbar is sticky on scroll
- `transparent` (boolean, default: false) - Transparent background (becomes solid on scroll)
- `mobileMenuOpen` (boolean, default: false) - Whether mobile menu is visible
- `scrolled` (boolean, computed) - Whether page has scrolled (for transparent→solid transition)

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

#### Mobile Menu Overlay
- Full viewport overlay when open
- Background: White (light) or dark neutral (dark mode)
- Position: Fixed, full width, slides from top or left
- Z-index: 50 (from tokens)
- Contains: Navigation links (vertical stack) and action buttons
- Backdrop: Optional dark overlay behind menu
- Animation: Slide-in from top/left (300ms), fade backdrop (200ms)

**Behavior**:
- Sticky positioning: Fixed at top when `sticky=true` and user scrolls
- Transparent→Solid: Background transitions from transparent to solid on scroll (when `transparent=true`)
- Mobile menu: Opens/closes on toggle button click
- Mobile menu: Closes on backdrop click, Escape key, or link click
- Focus trap: Focus trapped within mobile menu when open
- Focus restoration: Returns focus to toggle button when menu closes
- Body scroll lock: Body scroll locked when mobile menu is open
- Active link: Highlights current page/route
- Keyboard navigation: Full keyboard support for all interactive elements

## Responsive Breakpoints

### Mobile (< 768px)
- **Layout**: Logo left, hamburger menu right
- **Navigation**: Hidden, accessible via mobile menu overlay
- **Actions**: Hidden in navbar, shown in mobile menu
- **Height**: 56-60px
- **Mobile Menu**: Full-screen overlay or slide-in from side

### Tablet (768px - 1023px)
- **Layout**: Logo left, hamburger menu right
- **Navigation**: Hidden, accessible via mobile menu overlay (same as mobile - default behavior)
- **Actions**: Visible in navbar or mobile menu depending on space
- **Height**: 64-72px
- **Default**: Use mobile menu overlay pattern (same as mobile breakpoint)

### Desktop (≥ 1024px)
- **Layout**: Logo left, nav links center/left, actions right
- **Navigation**: Horizontal nav links visible
- **Actions**: Visible in navbar
- **Height**: 72-80px
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

### Active Link Highlighting
1. Current page/route is detected
2. Active link is visually highlighted (underline, color change, or background)
3. `aria-current="page"` is set on active link
4. Highlight persists on page reload

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This navbar component should meet WCAG 2.1 Level AA standards. Key requirements:

- **2.1.1 Keyboard**: All navbar controls operable via keyboard; focus is trapped within mobile menu while open.
- **2.1.2 No Keyboard Trap**: No keyboard trap beyond intended focus trap; Escape exits mobile menu.
- **2.4.3 Focus Order**: Logical focus order; focus returns to toggle button when menu closes.
- **2.4.7 Focus Visible**: Visible focus indicators for all interactive elements.
- **4.1.2 Name, Role, Value**: Correct ARIA roles, names, and relationships.

### Keyboard Navigation

**Tab Order**:
- Logo → Nav Links (desktop) → Actions → Mobile Toggle (mobile)
- Within mobile menu: Links → Actions → Close button

**Implementation**:
- Tab cycles through focusable elements
- Shift+Tab cycles backwards
- Escape closes mobile menu and restores focus to toggle
- Enter/Space activates links and buttons

**Focus Management**:
- **On Mobile Menu Open**: Move focus to first focusable element in menu
- **On Mobile Menu Close**: Return focus to toggle button
- **On Escape**: Close menu and restore focus to toggle
- **Focus Visible**: Clear focus indicators (2px solid outline, 2px offset)

### ARIA Attributes

**Required ARIA Attributes**:

1. **Navbar Element**:
   ```html
   <nav role="navigation" aria-label="Main navigation">
   ```

2. **Mobile Menu Toggle**:
   ```html
   <button aria-label="Toggle menu" 
           aria-expanded="false" 
           aria-controls="mobile-menu">
   ```

3. **Mobile Menu**:
   ```html
   <div id="mobile-menu" 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="menu-toggle"
        aria-hidden="true">
     <nav aria-label="Main navigation">
       <!-- Navigation links -->
     </nav>
   </div>
   ```
   **Note**: Mobile menu uses `role="dialog"` with `aria-modal="true"` because it's a modal overlay with focus trap. Inside the dialog, use `<nav aria-label="Main navigation">` for the navigation links (not `role="menu"`).

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

6. **Notifications Button**:
   ```html
   <button aria-label="Notifications: 3 unread" 
           aria-haspopup="true" 
           aria-expanded="false">
     <span class="notifications-badge" aria-label="3 unread">3</span>
   </button>
   ```

**Dynamic ARIA Updates**:
- Update `aria-expanded` on toggle when menu opens/closes
- Update `aria-hidden` on mobile menu (false when open, true when closed)
- Update `aria-modal="true"` on mobile menu when open
- Make background content inert/aria-hidden while mobile menu is open (implementation-dependent, e.g., use `inert` attribute or `aria-hidden` on main content)
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
- [ ] Mobile menu toggle has `aria-expanded` and `aria-controls`
- [ ] Mobile menu has `aria-hidden` that updates dynamically
- [ ] Active navigation link has `aria-current="page"`
- [ ] Focus trap implemented for mobile menu
- [ ] Focus restored to toggle button when menu closes
- [ ] Escape key closes mobile menu
- [ ] Body scroll lock applied when mobile menu is open
- [ ] All interactive elements have visible focus indicators
- [ ] Logo image has descriptive `alt` text
- [ ] Screen reader tested with NVDA, VoiceOver, or JAWS

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
1. `mobileMenuOpen: boolean` - Whether mobile menu is visible (default: false)
2. `scrolled: boolean` - Whether page has scrolled (computed from scroll position, default: false)
3. `activeLink: string` - Current active navigation link ID/route (default: current route)
4. `variant: "marketing" | "app"` - Navbar style variant (default: "marketing")
5. `sticky: boolean` - Whether navbar is sticky on scroll (default: false)
6. `transparent: boolean` - Whether navbar starts transparent (default: false)

**State Persistence**:
- All state is component-level only (no persistence needed)
- `activeLink` should sync with router/URL

### SSR/Hydration Considerations
- **Mobile menu state**: Initialize `mobileMenuOpen` as `false` to prevent hydration mismatches
- **Scroll state**: Only access `window` and scroll position after component mount
- **Implementation**: Check `typeof window !== 'undefined'` before accessing window object

## Critical Implementation Guidelines

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
  - Background: `rgba(255, 255, 255, 0.95)` → `#ffffff`
  - Shadow: `none` → `0 1px 3px rgba(0, 0, 0, 0.1)`
  - Backdrop filter: `blur(8px)` → `none`

### Mobile Menu Open
- **Duration**: 300ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Menu**: Slide from top/left: `translateX(-100%)` → `translateX(0)` or `translateY(-100%)` → `translateY(0)`
- **Backdrop**: Fade in: `opacity: 0` → `opacity: 1` (200ms)

### Mobile Menu Close
- **Duration**: 250ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Menu**: Slide out: `translateX(0)` → `translateX(-100%)`
- **Backdrop**: Fade out: `opacity: 1` → `opacity: 0` (150ms)

### Prefers-Reduced-Motion Support

**When `prefers-reduced-motion` is enabled**:
- Disable transform animations (translateX/translateY) - set `transform: none`
- Reduce animation durations to ≤100ms (use `transition: opacity 0.1s ease, background-color 0.1s ease`)
- Remove or reduce backdrop-filter blur transitions
- Keep opacity transitions for essential state changes (≤100ms)

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
    backdrop-filter: none; /* Remove blur transitions */
  }
}
```

**Performance**:
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Set `will-change: transform, opacity` on animating elements
- Use `transform3d(0,0,0)` to trigger GPU acceleration if needed

## Z-Index Layer System

To ensure proper layering of elements:
- **Navbar**: 50 (from tokens)
- **Mobile Menu**: 50 (same as navbar, or 60 if above navbar)
- **Backdrop**: 40 (from tokens)
- **Dropdowns**: 60 (from tokens)
- **Tooltips**: 70 (from tokens)

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
- Add scroll event listener (throttled/debounced - recommended: throttle with `requestAnimationFrame` or 100ms interval)
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
- Set `document.body.style.overflow = 'hidden'`
- **Optional: Preserve scroll position**: Use `position: fixed` with `top: -${window.scrollY}px` to prevent jump when locking scroll
- **iOS handling**: On iOS devices, may need additional handling for overscroll behavior (e.g., prevent `touchmove` events on body element)

**Cleanup**: 
- Restore on close: `document.body.style.overflow = ''`
- Restore scroll position if preserved: `document.body.style.position = ''` and `document.body.style.top = ''`
- Remove iOS touch event listeners if added

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
- Compare current URL/route with navigation link hrefs
- Set `aria-current="page"` on matching link
- Apply active styles (underline, color change, background)

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
- Logo + horizontal nav links + primary CTA button
- Transparent on hero section, solid on scroll
- Sticky by default
- Simple, clean design

### App Navbar
- Logo + horizontal nav links + user menu + notifications
- Solid background (no transparent variant)
- Sticky by default
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
- [ ] Mobile menu opens and closes smoothly
- [ ] Mobile menu closes on backdrop click, Escape key, and link click
- [ ] Focus is trapped within mobile menu when open
- [ ] Focus is restored to toggle button when menu closes
- [ ] Body scroll is locked when mobile menu is open and restored on close
- [ ] Sticky positioning works correctly (if enabled)
- [ ] Transparent→Solid transition works on scroll (if enabled)
- [ ] Active link is highlighted correctly
- [ ] All interactive elements have visible focus indicators
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces state changes
- [ ] `aria-expanded`, `aria-hidden`, `aria-current` are correctly managed
- [ ] Logo is clickable and links to home
- [ ] CTA button works correctly (marketing variant)
- [ ] User menu dropdown works correctly (app variant)
- [ ] Notifications badge displays correctly (app variant)
- [ ] Window resize handling works correctly (closes mobile menu on desktop switch)
- [ ] Animations are smooth (60fps)
- [ ] No layout shift or flicker on load
- [ ] SSR/hydration safe (no DOM access before mount)
- [ ] `prefers-reduced-motion` reduces or removes animations
- [ ] All styling matches project conventions

## AI Agent Implementation Prompt Template

Use this template when asking an AI agent to implement this navbar:

```
Implement a responsive Navigation Bar component with mobile hamburger menu, sticky scroll behavior, and transparent-to-solid transition. Support marketing (logo + links + CTA) and app (user menu, notifications) variants. Include focus trap, focus restoration, body scroll lock, and keyboard accessibility. Add smooth animations with prefers-reduced-motion support. Adapt to {{USER_FRAMEWORK}} and {{USER_STYLING_LIBRARY}}.

Key requirements:
1. Responsive: Desktop shows horizontal nav links, mobile shows hamburger menu
2. Sticky: Fixed at top when scrolling (if sticky=true)
3. Transparent→Solid: Background transitions on scroll (if transparent=true)
4. Mobile Menu: Full-screen overlay with focus trap and body scroll lock
5. Accessibility: ARIA attributes, keyboard navigation, focus management
6. Active Link: Highlights current page/route with aria-current="page"
7. Animations: 300ms mobile menu, 200-300ms scroll transitions
8. Variants: Marketing (CTA button) and App (user menu, notifications)
9. Prefers-reduced-motion: Reduce or remove animations
10. CRITICAL: Styling MUST match the project's existing conventions. Detect framework and styling system first, then use ONLY that system.

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

This navigation bar is a responsive navbar component with mobile menu, sticky positioning, and transparent-to-solid transition. Key implementation points:

1. **Structure**: Logo, Navigation Links (desktop), Mobile Toggle, Actions (CTA/User Menu), Mobile Menu Overlay
2. **State**: Track mobileMenuOpen, scrolled, activeLink, variant, sticky, transparent
3. **Responsive**: Desktop shows horizontal nav, mobile shows hamburger menu overlay
4. **Sticky**: Fixed at top when scrolling (if enabled)
5. **Transparent→Solid**: Background transitions on scroll (if enabled)
6. **Mobile Menu**: Focus trap, body scroll lock, focus restoration, Escape key handling
7. **Accessibility**: WCAG AA compliance with proper ARIA attributes
8. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user.
