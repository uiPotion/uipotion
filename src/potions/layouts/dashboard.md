---
layout: 'potion'
title: 'Dashboard Layout with Collapsible Sidebar'
publicationDate: '2026-01-10'
excerpt: 'A responsive admin dashboard layout with collapsible sidebar navigation and fixed header. Perfect for admin panels, SaaS applications, and data-driven interfaces.'
category: 'Layouts'
tags:
  - layouts
  - dashboard
  - sidebar
  - responsive
  - admin
agentManifest: 'potions/layouts/dashboard.json'
---

# Dashboard Layout

A responsive admin dashboard layout with collapsible sidebar navigation and a fixed header. Perfect for admin panels, SaaS applications, and data-driven interfaces.

## Structure Specification

### Layout Hierarchy

The layout consists of an AppContainer that holds a Sidebar component and a Main Content Wrapper. The Sidebar contains a Logo/Brand Section, Navigation Menu with multiple Nav Items (including active state support), and a Collapse Toggle Button. The Main Content Wrapper includes a fixed Header (with Menu Toggle Button for mobile, Title/Breadcrumbs, and User Actions including Notifications Button and User Menu Dropdown) and a scrollable Content Area for page content.

## Detailed Component Specifications

### 1. Sidebar Component

**Dimensions:**
- Desktop (expanded): 240-280px width
- Desktop (collapsed): 64-80px width
- Mobile: Full screen overlay or hidden

**States:**
- `expanded` (default on desktop)
- `collapsed` (icon-only mode)
- `hidden` (mobile default)
- `overlay` (mobile when open)

**Elements:**

#### Logo/Brand Section
- Height: 64px (matches header height)
- Contains: Logo image/text + app name
- Collapsed state: Shows only logo icon
- Alignment: Center or left-aligned with padding

#### Navigation Items
- Height: 44-48px each
- Padding: 12-16px horizontal, 12px vertical
- Icon: 20-24px, positioned left
- Text: 14-16px font size
- Gap between icon and text: 12-16px
- Active state indicator: Background color or left border (3-4px)
- Hover state: Subtle background color change
- Collapsed state: Center icon only, show tooltip on hover
  - Tooltip trigger: hover
  - Tooltip position: right
  - Tooltip delay: 200ms
  - Fallback: Use `aria-label` or `sr-only` text if tooltip library not available
- Scrollbar: Custom thin scrollbar (6px width) when many items
  - Dark sidebar: `rgba(255, 255, 255, 0.2)`
  - Light sidebar: `rgba(0, 0, 0, 0.2)`

#### Collapse Toggle
- Position: Bottom of sidebar or after nav items
- Button: Icon button, 40px x 40px
- Icon: Chevron or arrows indicating direction
- Behavior: Rotates/changes on state

**Behavior:**
- Persists state in localStorage/session
- Smooth transition animation (200-300ms ease-in-out)
- On mobile: Overlay with backdrop, dismissible
  - Backdrop click closes sidebar (prevent event bubbling)
  - Body scroll is locked when sidebar is open (`document.body.style.overflow = 'hidden'`)
  - Focus is trapped within sidebar when open
  - Focus is restored to menu toggle when sidebar closes
- Keyboard accessible (Tab navigation, Enter/Space to activate)
- Custom scrollbar styling for navigation menu (6px width, subtle color)

### 2. Header Component

**Dimensions:**
- Height: 64px (fixed)
- Width: 100% of content area
- Width calculation: `calc(100% - sidebar-width)` or use CSS Grid/Flexbox approach
- Position: Fixed or sticky

**Layout:**

The header contains a Menu Toggle button (visible on mobile only, left-aligned), Title/Breadcrumbs section (left-aligned), and User Actions including Notifications button and User Menu (right-aligned).

**Elements:**

#### Menu Toggle Button (Mobile Only)
- Size: 40px x 40px
- Icon: Hamburger (☰) or close (×) icon
- Visibility: Hidden on desktop (≥1024px)
- Position: Left-most

#### Title/Breadcrumbs Section
- Font size: 20-24px (title) or 14-16px (breadcrumbs)
- Color: Primary text color
- Truncate with ellipsis if too long

#### Notifications Button
- Size: 40px x 40px
- Icon: Bell
- Badge: Red dot or count for unread
- Opens dropdown/modal on click

#### User Menu
- Avatar: 36px circle
- Username: 14px, optional (can hide on small screens)
- Dropdown indicator: Small chevron
- Dropdown opens below with:
  - Profile link
  - Settings link
  - Logout button

**Behavior:**
- Shadow or border-bottom for depth
- Remains fixed at top during scroll
- Dropdowns close on outside click or escape key
- Accessible via keyboard

### 3. Main Content Area

**Dimensions:**
- Padding: 24-32px on all sides
- Max-width: Optional (e.g., 1400px for better readability)
- Min-height: Fill available viewport

**Behavior:**
- Scrollable (overflow-y: auto)
- Margin-top: Header height (64px)
- Margin-bottom: Footer height (60px)
- Margin-left: Sidebar width (dynamic)
- Smooth transition when sidebar toggles
- Responsive padding (reduces on mobile to 16px)

### 4. Footer Component

**Dimensions:**
- Height: 60px (fixed)
- Width: 100% of content area
- Width calculation: `calc(100% - sidebar-width)` or use CSS Grid/Flexbox approach
- Position: Fixed at bottom

**Layout:**

The footer contains a Copyright section on the left and Footer Navigation Links on the right.

**Elements:**
- Copyright: 14px font size
- Footer Navigation: Links (Privacy, Terms, Support), 14px, 24px gap between links

**Behavior:**
- Fixed at bottom, always visible even with minimal content
- Adjusts left position based on sidebar state (280px expanded, 80px collapsed on desktop)
- Full width (left: 0) on mobile/tablet
- Shadow or border-top for depth
- Smooth 300ms transition when sidebar toggles

## Responsive Breakpoints

### Desktop (≥1024px)
- Sidebar: Visible, expanded by default
- Header: Full width minus sidebar, left: 280px (80px when collapsed)
- Footer: Full width minus sidebar, left: 280px (80px when collapsed)
- Content: Fills remaining space between header and footer
- Menu toggle: Hidden

### Tablet (768px - 1023px)
- Sidebar: Collapsed by default or overlay mode
- Header: Full width (left: 0)
- Footer: Full width (left: 0)
- Content: Full width
- Menu toggle: Visible

### Mobile (<767px)
- Sidebar: Hidden by default, fullscreen overlay when open
- Header: Full width, compact mode (left: 0)
- Footer: Full width, compact mode (left: 0)
- Content: Full width, reduced padding (16px)
- Menu toggle: Visible
- User menu: Simplified (avatar only)

### Window Resize Handling
- **Debounce**: 300ms recommended to avoid excessive re-evaluations
- **Behavior**: Re-evaluate breakpoint on resize, close mobile sidebar if switching to desktop
- **Implementation**: Add window resize listener with debounce, update breakpoint state, handle sidebar state transitions
- **Edge case**: Complete current animation before re-evaluating breakpoint on resize

## Interaction Patterns

### Sidebar Toggle
1. User clicks toggle button or menu icon
2. Sidebar transitions to collapsed/expanded state
3. Content area adjusts width with smooth animation
4. State persists across page loads
5. On mobile: Backdrop appears/disappears

### Active Navigation
1. Current page is highlighted in sidebar
2. Visual indicator: Background color, border, or icon color
3. Persist active state on page reload
4. Support for nested navigation (expandable sections)

### User Dropdown
1. Click avatar/username to open
2. Dropdown appears below with fade/slide animation
3. Click outside or press Escape to close
4. Click item to navigate
5. Maintain dropdown state during navigation if SPA

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This dashboard layout should meet WCAG 2.1 Level AA standards. Key requirements:

- **1.1.1 Non-text Content**: All images have descriptive alt text
- **1.3.1 Info and Relationships**: Semantic HTML structure with proper roles
- **1.4.3 Contrast Minimum**: 4.5:1 for normal text, 3:1 for large text (verify with contrast checker)
- **2.1.1 Keyboard**: All interactive elements keyboard accessible
- **2.1.2 No Keyboard Trap**: Focus trapping only in mobile sidebar overlay
- **2.4.2 Page Titled**: Descriptive page title
- **2.4.3 Focus Order**: Logical tab order throughout
- **2.4.4 Link Purpose**: Clear link labels, icons have text or aria-label
- **2.4.7 Focus Visible**: Clear focus indicators on all interactive elements
- **4.1.2 Name, Role, Value**: All elements have accessible names and roles
- **4.1.3 Status Messages**: Use aria-live for dynamic content updates (recommended)

### Keyboard Navigation

**Tab Order:**
- Header → Sidebar → Content → Footer

**Implementation:**
- Sidebar items: Tab to focus, Enter/Space to activate
- Escape key: Close dropdowns and mobile sidebar, restore focus to trigger

**Focus Management:**
- **Focus trap**: Trap focus within sidebar when open on mobile (use focus-trap library or manual implementation)
- **Focus restoration**: Restore focus to menu toggle button when sidebar closes
- **Focus visible**: Clear focus indicators (2px solid outline, 2px offset) on all interactive elements
- **Focus order**: Logical reading order maintained throughout

### ARIA Attributes

**Required ARIA Attributes:**

1. **Sidebar:**
   ```html
   <aside role="navigation" aria-label="Main navigation" aria-hidden="false">
   ```

2. **Menu Toggle:**
   ```html
   <button aria-label="Toggle menu" aria-expanded="false" aria-controls="sidebar">
   ```

3. **Sidebar Toggle:**
   ```html
   <button aria-label="Toggle sidebar" aria-expanded="true">
   ```

4. **Active Navigation Item:**
   ```html
   <a href="/dashboard" aria-current="page">Dashboard</a>
   ```

5. **Notifications Button:**
   ```html
   <button aria-label="Notifications: 3 unread" aria-haspopup="true" aria-expanded="false">
     <span class="notifications-icon" aria-hidden="true">🔔</span>
     <span class="notifications-badge" aria-label="3 unread notifications">3</span>
   </button>
   ```

6. **User Menu:**
   ```html
   <button aria-label="User menu" aria-haspopup="true" aria-expanded="false" aria-controls="userDropdown">
   <div class="user-dropdown" id="userDropdown" role="menu">
     <a href="#" class="dropdown-item" role="menuitem">Profile</a>
     <a href="#" class="dropdown-item" role="menuitem">Settings</a>
     <a href="#" class="dropdown-item" role="menuitem">Logout</a>
   </div>
   ```

7. **Backdrop:**
   ```html
   <div class="backdrop" aria-hidden="true" role="presentation"></div>
   ```

8. **Main Content:**
   ```html
   <main id="contentArea" role="main">
   ```

**Dynamic ARIA Updates:**
- Update `aria-expanded` when dropdowns/sidebar open/close
- Update `aria-hidden` for backdrop and mobile sidebar
- Update `aria-current="page"` on active navigation item
- Update `aria-label` on notifications button to include count

### Screen Reader Support

**Announcements:**
- Announce sidebar state changes (use aria-live region or visually hidden text)
- Example: `<span role="status" class="sr-only">Sidebar opened</span>`

**Labels:**
- All icon-only buttons must have descriptive `aria-label`
- In collapsed state, nav items should have `aria-label` or sr-only text
- Example: `<span class="sr-only">Dashboard</span>` or `aria-label="Dashboard"`

**Screen Reader Only Text (sr-only class):**
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

**Badges:**
- Notification badge count must be announced
- Include count in button `aria-label`: `"Notifications: 3 unread"`
- Alternative: Use `aria-describedby` pointing to badge element

**Landmarks:**
- Use semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`
- Or use ARIA roles: `role="navigation"`, `role="main"`, `role="banner"`, `role="contentinfo"`

### Color Contrast

**Requirements:**
- **WCAG AA**: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- **WCAG AAA (Recommended)**: 7:1 for important text

**Verification:**
- Use WebAIM Contrast Checker or similar tool
- Test all text/background combinations:
  - Sidebar text on background
  - Header text on background
  - Footer text on background
  - Content text on background
  - Link text on background
  - Button text on background
  - Active nav item text
  - Focus indicators

### Focus Visible Styles

**Implementation:**
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

When implementing this dashboard, ensure:

- [ ] All buttons have `aria-label` or visible text
- [ ] All icons have `aria-label` or sr-only text
- [ ] Navigation items have `aria-current="page"` when active
- [ ] Dropdowns have `role="menu"` and items have `role="menuitem"`
- [ ] All interactive elements have `aria-expanded` when applicable
- [ ] Notifications badge count included in button `aria-label`
- [ ] Focus visible on all interactive elements
- [ ] Focus trapped in mobile sidebar
- [ ] Focus restored when sidebar closes
- [ ] `aria-hidden` managed correctly for backdrop and mobile sidebar
- [ ] `aria-live` regions for dynamic content (optional but recommended)
- [ ] Color contrast verified with contrast checker tool
- [ ] Keyboard navigation works throughout
- [ ] Screen reader tested with NVDA, VoiceOver, or JAWS

## Design System Specifications

**Important**: The design specifications below are tool-agnostic and should be implemented using your project's chosen styling approach (Tailwind, CSS Modules, styled-components, Chakra UI, Material-UI, SCSS, etc.). The styling examples in the "Code Implementation Patterns" section show how to apply these design values, but these specifications are the source of truth for the design.

### Color Guidelines

#### Sidebar
- **Background (Light)**: Dark neutral (e.g., #1f2937, #111827) or white (#ffffff) with subtle border
- **Background (Dark)**: #1a1a1a or #0f172a
- **Text (Light)**: High contrast white (#ffffff) or light gray (#f3f4f6) on dark background
- **Text (Dark)**: #e0e0e0 or #f1f5f9
- **Active Item**: Primary color at 10-20% opacity overlay, or solid primary color. Text in primary color or white if using solid background
- **Hover**: Subtle background change (5-10% opacity overlay of primary or neutral) with smooth 150ms transition
- **Icons**: Match text color by default, primary color or white when active
- **Contrast**: Minimum 4.5:1 contrast ratio (WCAG AA)

#### Header
- **Background (Light)**: White (#ffffff) or very light gray (#f9fafb)
- **Background (Dark)**: #1a1a1a or #0f172a
- **Border/Shadow**: 1px solid border-bottom or subtle box-shadow (rgba(0, 0, 0, 0.05) to rgba(0, 0, 0, 0.1) for light, rgba(255, 255, 255, 0.1) for dark)
- **Text (Light)**: Dark gray (#111827, #1f2937) or black (#000000)
- **Text (Dark)**: #e0e0e0 or #f1f5f9
- **Icons**: Medium gray (#6b7280, #9ca3af) by default, darker gray (#374151) or primary color on hover

#### Footer
- **Background**: Match header (white or light gray for light mode, #1a1a1a for dark mode)
- **Border**: 1px solid border-top or subtle box-shadow on top (same colors as header)
- **Text**: Muted dark gray (rgba(0, 0, 0, 0.6) or #6b7280) for light, muted light gray (rgba(255, 255, 255, 0.6) or #9ca3af) for dark
- **Links**: Match footer text color by default, primary color or darker/lighter variant on hover

#### Content Area
- **Background (Light)**: Light gray (#f5f5f5, #f9fafb) or white (#ffffff)
- **Background (Dark)**: #121212 or #0f172a
- **Text (Light)**: Dark gray (#111827, #1f2937, #1a1a1a)
- **Text (Dark)**: #e0e0e0 or #f1f5f9
- **Contrast**: Ensure 4.5:1 contrast ratio minimum (WCAG AA), 7:1 recommended for important text (WCAG AAA)

#### Mobile Backdrop
- **Background**: rgba(0, 0, 0, 0.5) to rgba(0, 0, 0, 0.75)
- **Optional**: backdrop-filter: blur(4px) for modern browsers

### Typography

- **Font Family**: Use project's font stack (typically: system-ui, -apple-system, sans-serif or custom font)
- **Sidebar Nav Items**: 14-16px, medium weight (500-600)
- **Sidebar Logo**: 18-24px, bold (700)
- **Header Title**: 20-24px, semibold (600) or bold (700)
- **Header Breadcrumbs**: 14-16px, regular (400) or medium (500)
- **Footer Text**: 14px, regular (400)
- **Content Body**: 16px, regular (400)
- **Content Headings**: Use semantic heading sizes (h1: 32-36px, h2: 24-28px, etc.)
- **Line Height**: 1.25 for headings, 1.5 for body text, 1.75 for long-form content

### Spacing System

Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px) or your project's spacing system:

- **Sidebar**: 16px horizontal padding, 12px vertical padding for nav items, 12-16px gap between icon and text, 24-32px gap between sections
- **Header**: 16-24px horizontal padding, 16-24px gap between elements
- **Footer**: 16-24px horizontal padding, 24px gap between links
- **Content**: 24-32px padding on all sides (desktop), 16px (mobile), optional max-width 1400px for better readability

### Shadows & Elevation

Use subtle shadows for depth and separation:

- **Header Shadow (Light)**: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
- **Header Shadow (Dark)**: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)
- **Footer Shadow (Light)**: 0 -1px 3px rgba(0, 0, 0, 0.1), 0 -1px 2px rgba(0, 0, 0, 0.06)
- **Footer Shadow (Dark)**: 0 -1px 3px rgba(0, 0, 0, 0.3), 0 -1px 2px rgba(0, 0, 0, 0.2)
- **Dropdowns (Light)**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **Dropdowns (Dark)**: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)

### Border Radius

- **Buttons**: 6-8px
- **Dropdowns**: 8-12px
- **Avatars**: 50% (circle)
- **Badges**: 12-16px (pill shape) or 4-6px (rounded square)
- **Cards**: 8-12px (if used in content)

### Visual Hierarchy Principles

1. Sidebar should be visually distinct from content (different background or border)
2. Header and footer should have subtle elevation (shadow or border) to separate from content
3. Active navigation items should be clearly highlighted
4. Hover states should provide clear feedback
5. Icons and text should maintain proper visual balance
6. Spacing should create clear grouping and hierarchy
7. Interactive elements should have clear visual feedback on hover/focus states

## State Management Considerations

### For AI Agents to Implement

**State to Track:**
1. `sidebarOpen: boolean` - Whether sidebar is visible (mobile)
2. `sidebarCollapsed: boolean` - Whether sidebar is in icon-only mode (desktop)
3. `activeNavItem: string` - Current active navigation item ID
   - **Determination**: Sync with router current route or URL hash, update on navigation
4. `userMenuOpen: boolean` - User dropdown state
5. `notificationsOpen: boolean` - Notifications dropdown state
6. `notifications: array` - List of notifications with unread count

**State Persistence:**
- `sidebarCollapsed` → localStorage
- `activeNavItem` → Sync with router/URL
- Other dropdown states → Component state only (don't persist)

### SSR/Hydration Considerations
- **localStorage access**: Only access localStorage in `onMounted`/`useEffect`, check for `window` object existence
- **Default state**: Use `false` as default for `sidebarCollapsed`, update after mount to prevent hydration mismatches
- **Implementation**: Check `typeof window !== 'undefined'` before accessing localStorage, initialize state after component mount
- **React Note**: Extract localStorage logic into a `useLocalStorage` custom hook rather than putting it directly in `useEffect`

## Critical Implementation Guidelines

### Vanilla CSS Detection
**CRITICAL**: When detecting vanilla CSS in the project, ALWAYS create CSS classes in a stylesheet. NEVER use inline style attributes on HTML elements. 

- Define classes like `.sidebar`, `.sidebar--collapsed`, `.header`, `.header--shifted`, etc. in your CSS file
- Apply classes via `className`/`class` attributes: `<aside class="sidebar sidebar--collapsed">`
- Do NOT use: `<aside style="width: 80px">`
- This ensures maintainability, reusability, and proper separation of concerns

### React Hook Patterns
**CRITICAL**: When detecting React, extract logic from `useEffect` hooks into separate custom hooks that do ONE thing each.

- Instead of one `useEffect` handling multiple concerns (localStorage + scroll lock + focus trap), create separate hooks:
  - `useLocalStorage(key, defaultValue)` - Handles localStorage persistence only
  - `useBodyScrollLock(isLocked)` - Handles body scroll locking only
  - `useFocusTrap(containerRef, isActive)` - Handles focus trapping only
  - `useSidebarState()` - Manages sidebar state only
- This improves code organization, testability, and reusability
- Each hook should have a single responsibility

## Code Implementation Patterns

### React Example Pattern
```jsx
// Suggested component structure
<DashboardLayout>
  <Sidebar 
    collapsed={collapsed}
    onToggle={handleToggle}
    activeItem={activeRoute}
    navItems={navigationConfig}
  />
  <MainContent>
    <Header 
      onMenuToggle={handleMobileMenuToggle}
      user={currentUser}
      notifications={notifications}
    />
    <ContentArea>
      {children}
    </ContentArea>
  </MainContent>
</DashboardLayout>
```

### Angular Example Pattern
```html
<!-- Suggested template structure -->
<app-dashboard-layout>
  <app-sidebar
    [collapsed]="isCollapsed"
    [activeItem]="activeRoute"
    (toggle)="onSidebarToggle()"
  />
  <div class="main-content">
    <app-header
      [user]="currentUser"
      (menuToggle)="onMobileMenuToggle()"
    />
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
  </div>
</app-dashboard-layout>
```

### Vue Example Pattern
```vue
<!-- Suggested component structure -->
<template>
  <DashboardLayout>
    <Sidebar
      :collapsed="isCollapsed"
      :active-item="activeRoute"
      @toggle="handleToggle"
    />
    <MainContent>
      <HeaderBar
        :user="currentUser"
        @menu-toggle="handleMobileMenuToggle"
      />
      <ContentArea>
        <slot />
      </ContentArea>
    </MainContent>
  </DashboardLayout>
</template>
```

### CSS/Styling Approaches

**Note**: The examples below show how to implement the design specifications using different styling tools. Always refer to the "Design System Specifications" section above for the authoritative design values, then adapt them to your project's styling approach.

#### Tailwind CSS Pattern
```html
<!-- Sidebar -->
<aside class="fixed left-0 top-0 h-full w-[280px] bg-gray-900 text-white transition-all duration-300 ease-in-out md:translate-x-0" 
       :class="{'w-20': collapsed, '-translate-x-full': !mobileOpen}">
  <!-- Content -->
</aside>

<!-- Header -->
<header class="fixed top-0 h-16 bg-white shadow-sm transition-all duration-300"
        :class="{'left-[280px]': !collapsed, 'left-20': collapsed}">
  <!-- Content -->
</header>

<!-- Footer -->
<footer class="fixed bottom-0 h-[60px] bg-white shadow-sm transition-all duration-300"
        :class="{'left-[280px]': !collapsed, 'left-20': collapsed}">
  <!-- Content -->
</footer>

<!-- Main Content -->
<main class="transition-all duration-300 pt-16 pb-[60px]"
      :class="{'ml-[280px]': !collapsed, 'ml-20': collapsed}">
  <!-- Content -->
</main>
```

**Note**: Use arbitrary values like `w-[280px]` instead of `w-64` (256px) to match exact design specifications. Use `pb-[60px]` instead of `pb-15` (which doesn't exist in Tailwind). Map design system color values to Tailwind color palette or use arbitrary values like `bg-[#1f2937]`.

#### Vanilla CSS Pattern
```css
/* CRITICAL: Always create CSS classes, never use inline styles */
/* Apply design system values directly */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background: #1f2937; /* From design system */
  color: #ffffff; /* From design system */
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05); /* From design system */
}

.sidebar.collapsed {
  width: 80px;
}

.header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 64px;
  background: #ffffff; /* From design system */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* From design system */
  transition: left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.header.sidebarCollapsed {
  left: 80px;
}

.content {
  margin-top: 64px;
  margin-bottom: 60px;
  margin-left: 280px;
  padding: 24px; /* From design system spacing */
  background: #f5f5f5; /* From design system */
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.content.sidebarCollapsed {
  margin-left: 80px;
}
```

#### Material-UI/Chakra Pattern
- Use Drawer component for sidebar (persistent variant on desktop, temporary on mobile)
- Use AppBar for header with elevation
- Use Box/Container for main content with appropriate margins
- **Extend theme** with design system color values, spacing scale, and typography settings
- Use theme.transitions for consistent animations matching design system specifications
- Leverage theme breakpoints for responsive behavior
- **Customize colors, spacing, and typography** to match design system specifications

## Animation Specifications

### Sidebar Toggle Animation
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties:
  - Sidebar: `width`, `transform`
  - Header: `left`
  - Footer: `left`
  - Content: `margin-left`
- Performance:
  - Prefer `transform` over `width`/`left` for better performance when possible
  - Set `will-change: transform` on animating elements
  - Use `transform3d(0,0,0)` to trigger GPU acceleration if needed

### Mobile Overlay
- Backdrop fade: 200ms
- Sidebar slide: 300ms from left
- Stagger: Backdrop starts first, sidebar follows

### Dropdown Animations
- Duration: 150-200ms
- Easing: ease-out
- Transform: translateY(-8px) → translateY(0)
- Opacity: 0 → 1

## Z-Index Layer System

To ensure proper layering of elements:
- **Backdrop**: 40
- **Sidebar**: 50
- **Header**: 40
- **Footer**: 40
- **Dropdowns**: 50
- **Tooltips**: 60

## Implementation Details

### Body Scroll Lock (Mobile)
- **When**: Mobile sidebar is open
- **How**: Set `document.body.style.overflow = 'hidden'`
- **Cleanup**: Restore on close (`document.body.style.overflow = ''`)

### Focus Management
- **Focus trap**: Trap focus within sidebar when open on mobile (use focus-trap library or manual implementation)
- **Focus restoration**: Return focus to trigger button (menu toggle) when sidebar closes

### Backdrop Click
- Close sidebar when backdrop is clicked
- Prevent event bubbling to avoid closing immediately after opening

## Edge Cases

### Long Navigation Labels
- Truncate with ellipsis, show tooltip on hover
- Maintain min-width for icons

### Many Navigation Items
- Sidebar should scroll, maintain scroll position when toggling collapsed state
- Use custom scrollbar styling (6px width, subtle color)

### Rapid Toggling
- Debounce or disable toggle during transition to prevent animation conflicts

### Window Resize During Animation
- Complete current animation before re-evaluating breakpoint

### Very Small Screens
- Consider further reducing padding/spacing on screens < 320px

### Content Overflow
- Ensure content doesn't overflow horizontally when sidebar collapses

## Common Variations

### With Top Navigation
- Add secondary horizontal navigation below header
- Sticky behavior on scroll
- Breadcrumbs integration

### With Footer
- Footer inside content area or fixed at bottom
- Adjust content area min-height to push footer down

### With Multiple Sidebars
- Right sidebar for contextual actions/filters
- Coordinate toggle states
- Consider collapsing both on smaller screens

### Dark Mode
- Darker sidebar background (#1a1a1a)
- Dark content background (#121212)
- Lighter text colors (#e0e0e0)
- Adjust shadows to lighter colors
- Reduce color saturation slightly

## Testing Checklist

When implementing this layout, test:

- [ ] Sidebar toggles smoothly on desktop
- [ ] Sidebar opens as overlay on mobile
- [ ] Mobile backdrop dismisses sidebar
- [ ] Body scroll is locked when mobile sidebar is open
- [ ] Focus is trapped within mobile sidebar
- [ ] Focus is restored to menu toggle when sidebar closes
- [ ] Content area adjusts to sidebar state
- [ ] Header stays fixed on scroll and adjusts to sidebar state
- [ ] Footer stays fixed at bottom and adjusts to sidebar state
- [ ] Footer is always visible even with minimal content
- [ ] Content area has proper spacing for header (margin-top: 64px) and footer (margin-bottom: 60px)
- [ ] Active navigation item is highlighted
- [ ] User dropdown opens and closes correctly
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces state changes
- [ ] Sidebar state persists on reload
- [ ] No horizontal scroll when sidebar collapses
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)
- [ ] Window resize handling works correctly (debounced, closes mobile sidebar on desktop switch)
- [ ] Touch interactions work on mobile
- [ ] Animations are smooth (60fps)
- [ ] No layout shift or flicker on load
- [ ] SSR/hydration safe (localStorage accessed after mount)
- [ ] Long navigation labels are truncated properly
- [ ] Many navigation items scroll correctly in sidebar

## AI Agent Implementation Prompt Template

Use this template when asking an AI agent to implement this dashboard:

```
Create a responsive dashboard layout with the following specifications:

1. Sidebar: 
   - Fixed position, 280px wide when expanded, 80px when collapsed
   - Collapsible with toggle button
   - Contains logo and navigation menu with icons
   - Overlay mode on mobile (<768px)
   - Persist collapsed state in localStorage

2. Header:
   - Fixed at top, 64px height
   - Contains mobile menu toggle, title, notifications button, and user dropdown
   - Adjusts left margin based on sidebar state

3. Content Area:
   - Scrollable main content
   - 24px padding
   - Adjusts margin based on sidebar state
   - Smooth transitions (300ms)

4. Use [Framework: React/Angular/Vue] with [Styling: Tailwind/Chakra/CSS Modules]

5. Include:
   - Smooth animations
   - Keyboard accessibility
   - ARIA labels
   - Mobile-responsive behavior
   - Active state for current page

Reference: UI Potion Dashboard Layout
```

## Additional Resources

### Navigation Configuration Example
```javascript
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'ChartIcon', href: '/' },
  { id: 'analytics', label: 'Analytics', icon: 'TrendingUpIcon', href: '/analytics' },
  { id: 'users', label: 'Users', icon: 'UsersIcon', href: '/users' },
  { id: 'settings', label: 'Settings', icon: 'SettingsIcon', href: '/settings' },
];
```

### Notification Data Structure
```javascript
const notifications = [
  { id: 1, title: 'New user registered', time: '5 min ago', unread: true },
  { id: 2, title: 'Report generated', time: '1 hour ago', unread: false },
];
```

---

## See Also

This dashboard layout commonly uses these components:

- **[Navbar Component](/potions/components/navbar.html)** - For the header navigation bar
- **[Data Table Component](/potions/components/data-table.html)** - For displaying tabular data in the main content area
- **[Dialog Component](/potions/components/dialog.html)** - For modals and action confirmations
- **[Toast Notifications](/potions/components/toast-notifications.html)** - For user feedback messages

These are examples of components that pair well with dashboards. The layout works with any content you choose.

---

## Summary for AI Agents

This dashboard layout is a standard three-section layout (sidebar, header, content) with collapsible sidebar functionality. Key implementation points:

1. **Layout**: CSS Grid or Flexbox with fixed positioning for sidebar and header
2. **State**: Track sidebar collapse state, persist in localStorage
3. **Responsive**: Sidebar becomes overlay on mobile, header spans full width
4. **Animations**: 300ms transitions on width/margin changes
5. **Accessibility**: ARIA labels, keyboard navigation, focus management
6. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user.
