---
layout: 'potion'
title: 'Dashboard Layout with Collapsible Sidebar'
publicationDate: '2026-01-10'
excerpt: 'A responsive admin dashboard layout with collapsible sidebar navigation and fixed header. Perfect for admin panels, SaaS applications, and data-driven interfaces.'
category: 'Layouts'
tags:
  - dashboard
  - sidebar
  - responsive
  - admin
agentManifest: 'jsonData/potions/dashboard-layout.json'
---

# Dashboard Layout 📊

A responsive admin dashboard layout with collapsible sidebar navigation and a fixed header. Perfect for admin panels, SaaS applications, and data-driven interfaces.

## Visual Preview

```
┌─────────────────────────────────────────────────────────────┐
│  [☰] Dashboard App                    [🔔] [👤] User ▾      │ ← Header (fixed)
├─────────────┬───────────────────────────────────────────────┤
│  📊 Dashboard│                                              │
│  📈 Analytics│  Main Content Area                          │
│  👥 Users    │                                              │
│  ⚙️  Settings│  (Scrollable)                               │
│             │                                              │
│             │                                              │
│  [Collapse] │                                              │
└─────────────┴───────────────────────────────────────────────┘
     Sidebar                    Content Area
  (Collapsible)
```

## Structure Specification

### Layout Hierarchy

```
AppContainer (Full viewport)
├── Sidebar (Fixed, collapsible)
│   ├── Logo/Brand Section
│   ├── Navigation Menu
│   │   ├── Nav Item (active state)
│   │   ├── Nav Item
│   │   ├── Nav Item
│   │   └── Nav Item
│   └── Collapse Toggle Button
├── Main Content Wrapper
│   ├── Header (Fixed, spans content area)
│   │   ├── Menu Toggle Button (mobile)
│   │   ├── Title/Breadcrumbs
│   │   └── User Actions
│   │       ├── Notifications Button
│   │       └── User Menu Dropdown
│   └── Content Area (Scrollable)
│       └── Page Content
```

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

#### Collapse Toggle
- Position: Bottom of sidebar or after nav items
- Button: Icon button, 40px x 40px
- Icon: Chevron or arrows indicating direction
- Behavior: Rotates/changes on state

**Behavior:**
- Persists state in localStorage/session
- Smooth transition animation (200-300ms ease-in-out)
- On mobile: Overlay with backdrop, dismissible
- Keyboard accessible (Tab navigation, Enter/Space to activate)

### 2. Header Component

**Dimensions:**
- Height: 64px (fixed)
- Width: 100% of content area
- Position: Fixed or sticky

**Layout:**
```
[Menu Toggle] [Title/Breadcrumbs]          [Notifications] [User Menu]
    (Mobile)      (Left aligned)              (Right aligned)
```

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
- Icon: Bell (🔔)
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
- Margin-left: Sidebar width (dynamic)
- Smooth transition when sidebar toggles
- Responsive padding (reduces on mobile)

## Responsive Breakpoints

### Desktop (≥1024px)
- Sidebar: Visible, expanded by default
- Header: Full width minus sidebar
- Content: Fills remaining space
- Menu toggle: Hidden

### Tablet (768px - 1023px)
- Sidebar: Collapsed by default or overlay mode
- Header: Full width
- Content: Full width
- Menu toggle: Visible

### Mobile (<768px)
- Sidebar: Hidden by default, fullscreen overlay when open
- Header: Full width, compact mode
- Content: Full width, reduced padding (16px)
- Menu toggle: Visible
- User menu: Simplified (avatar only)

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

### Keyboard Navigation
- Tab order: Header → Sidebar → Content
- Sidebar items: Tab to focus, Enter/Space to activate
- Escape key: Close dropdowns and mobile sidebar
- Skip to content link for screen readers

### ARIA Attributes
- Sidebar: `role="navigation"`, `aria-label="Main navigation"`
- Menu toggle: `aria-expanded="true/false"`, `aria-controls="sidebar"`
- Dropdown menus: `role="menu"`, `aria-haspopup="true"`
- Active nav item: `aria-current="page"`
- Mobile overlay: `aria-modal="true"`

### Screen Reader Support
- Announce sidebar state changes
- Descriptive labels for icon-only buttons
- Hidden text for icon-only nav items (collapsed state)
- Notification badge count announced

## Color & Styling Guidelines

### Sidebar
- Background: Darker than content (for contrast) or white with border
- Text: High contrast with background
- Active item: Primary color background (10-20% opacity) or solid
- Hover: Subtle background change (5-10% opacity)
- Icons: Match text color or use primary color for active

### Header
- Background: White or light gray
- Border/Shadow: Subtle (1px border or light shadow)
- Text: Dark gray or black
- Icons: Medium gray, darker on hover

### Content Area
- Background: Light gray (#f5f5f5) or white
- Text: Dark gray (#333, #1a1a1a)
- Ensure 4.5:1 contrast ratio minimum

## State Management Considerations

### For AI Agents to Implement

**State to Track:**
1. `sidebarOpen: boolean` - Whether sidebar is visible (mobile)
2. `sidebarCollapsed: boolean` - Whether sidebar is in icon-only mode (desktop)
3. `activeNavItem: string` - Current active navigation item ID
4. `userMenuOpen: boolean` - User dropdown state
5. `notificationsOpen: boolean` - Notifications dropdown state
6. `notifications: array` - List of notifications with unread count

**State Persistence:**
- `sidebarCollapsed` → localStorage
- `activeNavItem` → Sync with router/URL
- Other dropdown states → Component state only (don't persist)

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

#### Tailwind CSS Pattern
```html
<!-- Sidebar -->
<aside class="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0" 
       :class="{'w-20': collapsed, '-translate-x-full': !mobileOpen}">
  <!-- Content -->
</aside>

<!-- Header -->
<header class="fixed top-0 h-16 bg-white shadow-sm transition-all duration-300"
        :class="{'left-64': !collapsed, 'left-20': collapsed}">
  <!-- Content -->
</header>

<!-- Main Content -->
<main class="transition-all duration-300 pt-16"
      :class="{'ml-64': !collapsed, 'ml-20': collapsed}">
  <!-- Content -->
</main>
```

#### CSS Modules Pattern
```css
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  transition: transform 300ms ease-in-out;
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
  transition: left 300ms ease-in-out;
}

.header.sidebarCollapsed {
  left: 80px;
}

.content {
  margin-top: 64px;
  margin-left: 280px;
  transition: margin-left 300ms ease-in-out;
}

.content.sidebarCollapsed {
  margin-left: 80px;
}
```

#### Material-UI/Chakra Pattern
- Use Drawer component for sidebar (persistent variant on desktop, temporary on mobile)
- Use AppBar for header with elevation
- Use Box/Container for main content with appropriate margins
- Use theme.transitions for consistent animations
- Leverage theme breakpoints for responsive behavior

## Animation Specifications

### Sidebar Toggle Animation
- Duration: 300ms
- Easing: ease-in-out or cubic-bezier(0.4, 0, 0.2, 1)
- Properties: width (sidebar), margin-left (content), left (header)

### Mobile Overlay
- Backdrop fade: 200ms
- Sidebar slide: 300ms from left
- Stagger: Backdrop starts first, sidebar follows

### Dropdown Animations
- Duration: 150-200ms
- Easing: ease-out
- Transform: translateY(-8px) → translateY(0)
- Opacity: 0 → 1

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
- [ ] Content area adjusts to sidebar state
- [ ] Header stays fixed on scroll
- [ ] Active navigation item is highlighted
- [ ] User dropdown opens and closes correctly
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces state changes
- [ ] Sidebar state persists on reload
- [ ] Responsive at all breakpoints
- [ ] Touch interactions work on mobile
- [ ] Animations are smooth (60fps)
- [ ] No layout shift or flicker on load

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

## Summary for AI Agents

This dashboard layout is a standard three-section layout (sidebar, header, content) with collapsible sidebar functionality. Key implementation points:

1. **Layout**: CSS Grid or Flexbox with fixed positioning for sidebar and header
2. **State**: Track sidebar collapse state, persist in localStorage
3. **Responsive**: Sidebar becomes overlay on mobile, header spans full width
4. **Animations**: 300ms transitions on width/margin changes
5. **Accessibility**: ARIA labels, keyboard navigation, focus management
6. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user.
