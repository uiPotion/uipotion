---
layout: 'potion'
title: 'Modal Dialog (Accessible) with Focus Trap and Actions'
publicationDate: '2026-01-11'
excerpt: 'An accessible modal dialog component with focus trapping, Escape/backdrop dismissal rules, scroll locking, and action footer. Includes confirm/alert variants and responsive fullscreen behavior on small screens.'
category: 'Components'
tags:
  - components
  - modal
  - dialog
  - overlay
  - focus-trap
  - a11y
  - wcag
  - aria
agentManifest: 'potions/components/dialog.json'
---

# Modal Dialog (Accessible) with Focus Trap and Actions

An accessible modal dialog component with focus trapping, Escape/backdrop dismissal rules, scroll locking, and action footer. Includes confirm/alert variants and responsive fullscreen behavior on small screens.

## Structure Specification

### Component Hierarchy

The dialog consists of a Trigger element, a Backdrop overlay, and a Dialog container. The Dialog contains a Header (with Title and optional Close Button), a Body section for content, and an optional Footer with action buttons (Primary and Secondary).

The dialog structure flows as: Trigger opens the Backdrop which contains the Dialog. The Dialog includes Header (with Title and Close button), Body for content, and Footer for action buttons.

## Detailed Component Specifications

### 1. Dialog Component

**Goal**: Provide a safe, accessible modal dialog for confirmations, forms, and focused tasks without leaving the current page context.

**Anatomy Slots**:
- `trigger` - Element that opens the dialog (button, link, etc.)
- `backdrop` - Overlay behind the dialog
- `dialog` - Main dialog container
- `title` - Dialog title/heading
- `description` - Optional description text
- `body` - Main content area
- `footer` - Action buttons container
- `closeButton` - Optional close button in header

**Dimensions**:
- Desktop: Max width 640px, centered horizontally and vertically
- Mobile: Fullscreen when `fullscreenOnMobile=true`, otherwise near-full width with 16px margins
- Body max height: `calc(100vh - 200px)` on desktop
- Body overflow: `auto` when content exceeds max height

**States**:
- `open` (boolean, default: false) - Whether the dialog is visible
- `loading` (boolean, default: false) - Whether primary action is processing
- `variant` (enum: "dialog" | "alertdialog", default: "dialog") - Dialog semantics variant
- `dismissible` (boolean, default: true) - Whether Escape/backdrop can close
- `closeOnBackdropClick` (boolean, default: true) - Whether backdrop click closes
- `fullscreenOnMobile` (boolean, default: true) - Fullscreen on small screens

**Elements**:

#### Trigger
- Any interactive element (button, link, etc.)
- Should have `aria-haspopup="dialog"` and `aria-expanded="true/false"`
- Focus is captured and restored on close

#### Backdrop
- Full viewport overlay
- Background: `rgba(0, 0, 0, 0.5)` to `rgba(0, 0, 0, 0.75)`
- Optional: `backdrop-filter: blur(4px)` for modern browsers
- Z-index: 40 (from tokens)
- Clickable when `dismissible && closeOnBackdropClick`

#### Dialog Container
- Z-index: 50 (from tokens)
- Centered on desktop
- Rounded corners: 8-12px border-radius
- Shadow: Elevated shadow for depth
- Background: White (light) or dark neutral (dark mode)
- Padding: 24px (desktop), 16px (mobile)

#### Header
- Contains title and optional close button
- Title: 20-24px font size, semibold (600)
- Close button: 40px × 40px icon button, positioned top-right
- Padding: 24px horizontal, 20px vertical

#### Body
- Scrollable content area
- Padding: 24px (desktop), 16px (mobile)
- Max height with overflow handling
- Text: 16px font size, regular weight

#### Footer
- Action buttons container
- Padding: 16-24px
- Gap between buttons: 12-16px
- Primary button: Prominent, left-aligned or right-aligned
- Secondary button: Less prominent, next to primary
- Loading state: Disable all actions, show spinner on primary

**Behavior**:
- Focus trap: All keyboard focus trapped within dialog when open
- Focus restoration: Returns focus to trigger element on close
- Scroll lock: Body scroll locked while dialog is open
- Escape key: Closes dialog when `dismissible=true`
- Backdrop click: Closes dialog when `dismissible && closeOnBackdropClick`
- Animation: Smooth open/close transitions with prefers-reduced-motion support

## Responsive Breakpoints

### Mobile (< 768px)
- **Fullscreen Mode** (when `fullscreenOnMobile=true`):
  - Dialog uses full viewport width and height
  - No margins or rounded corners
  - Header, body, footer stack vertically
  - Padding: 16px on all sides
- **Centered Mode** (when `fullscreenOnMobile=false`):
  - Near-full width with 16px margins
  - Maintains rounded corners and shadow
  - Max width: `calc(100vw - 32px)`

### Desktop (≥ 1024px)
- **Centered Dialog**:
  - Max width: 640px
  - Centered horizontally and vertically
  - Body max height: `calc(100vh - 200px)`
  - Body overflow: `auto` when content exceeds max height
  - Padding: 24px on all sides

## Interaction Patterns

### Opening Dialog
1. User clicks trigger element
2. Dialog opens with animation
3. Focus moves to first focusable element in dialog (or close button, or primary action)
4. Body scroll is locked
5. Trigger element reference is stored for focus restoration

### Closing Dialog

#### Escape Key
1. User presses Escape key
2. If `dismissible=true`, dialog closes
3. Focus returns to trigger element
4. Body scroll is unlocked
5. Event is prevented and stopped from propagating

#### Backdrop Click
1. User clicks backdrop
2. If `dismissible && closeOnBackdropClick`, dialog closes
3. Focus returns to trigger element
4. Body scroll is unlocked
5. Event propagation is stopped

#### Close Button
1. User clicks close button
2. Dialog closes
3. Focus returns to trigger element
4. Body scroll is unlocked

#### Primary Action
1. User clicks primary action button
2. If `!loading`, action is invoked
3. `loading` state is set to `true`
4. Actions are disabled
5. On success: Dialog closes, focus restored, scroll unlocked
6. On error: Dialog stays open, `loading` set to `false`, error announced (optional)

### Focus Management
- **Initial Focus**: First focusable element in body, else close button, else primary action button
- **Focus Trap**: Tab and Shift+Tab cycle only within dialog
- **Focus Restoration**: Always return to trigger element on close (all close paths)
- **Focus Visible**: Clear focus indicators (2px solid outline, 2px offset)

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This dialog component should meet WCAG 2.1 Level AA standards. Key requirements:

- **2.1.1 Keyboard**: All dialog controls operable via keyboard; focus is trapped within dialog while open.
- **2.1.2 No Keyboard Trap**: No keyboard trap beyond intended focus trap; Escape exits when dismissible.
- **2.4.3 Focus Order**: Logical focus order; initial focus placed inside dialog; focus returns to trigger on close.
- **2.4.7 Focus Visible**: Visible focus indicators for all interactive elements.
- **4.1.2 Name, Role, Value**: Correct ARIA roles, names, and relationships.

### Keyboard Navigation

**Tab Order**:
- Focus trapped within dialog when open
- Tabbing cycles through focusable elements
- Shift+Tab cycles backwards
- Escape closes when `dismissible=true` and restores focus to trigger

**Initial Focus**:
- Prefer first focusable element in body
- Else close button
- Else primary action button

**Implementation**:
- Use focus-trap library or manual implementation
- Track focusable elements within dialog
- Prevent tabbing outside dialog boundaries
- Handle Escape key globally when dialog is open

### ARIA Attributes

**Required ARIA Attributes**:

1. **Dialog Element**:
   ```html
   <div role="dialog" 
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description">
   ```
   - Use `role="alertdialog"` for alert variant
   - `aria-labelledby` points to title element ID
   - `aria-describedby` points to description/body element ID (when present)

2. **Close Button**:
   ```html
   <button aria-label="Close dialog">
   ```

3. **Trigger**:
   ```html
   <button aria-haspopup="dialog" 
           aria-expanded="true/false">
   ```

**Optional ARIA Attributes**:

4. **Status Region** (for loading/error announcements):
   ```html
   <div role="status" aria-live="polite">
     <!-- Loading or error messages -->
   </div>
   ```

**Dynamic ARIA Updates**:
- Update `aria-expanded` on trigger when dialog opens/closes
- Update `aria-hidden` on backdrop (set to `true` when dialog closed)
- Ensure `aria-labelledby` and `aria-describedby` point to existing elements

### Screen Reader Support

**Announcements**:
- Dialog open/close state changes (via `aria-modal` and focus management)
- Loading state changes (via status region with `aria-live="polite"`)
- Error messages (via status region)

**Labels**:
- All icon-only buttons must have descriptive `aria-label`
- Title element must have unique ID for `aria-labelledby`
- Description/body element should have unique ID for `aria-describedby` (when present)

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

When implementing this dialog, ensure:

- [ ] Focus trap implemented and tested
- [ ] Focus restored to trigger on close (all close paths)
- [ ] Escape closes dialog only if `dismissible=true`
- [ ] Backdrop click closes only if `closeOnBackdropClick=true`
- [ ] `role` and `aria-*` attributes present and correctly wired
- [ ] Body scroll lock applied and cleaned up
- [ ] `prefers-reduced-motion` reduces or removes transforms
- [ ] All interactive elements have visible focus indicators
- [ ] `aria-labelledby` and `aria-describedby` point to existing elements
- [ ] Screen reader tested with NVDA, VoiceOver, or JAWS

## Design System Specifications

**Important**: The design specifications below are tool-agnostic and should be implemented using your project's chosen styling approach (Tailwind, CSS Modules, styled-components, Chakra UI, Material-UI, SCSS, etc.). The styling examples in the "Code Implementation Patterns" section show how to apply these design values, but these specifications are the source of truth for the design.

### Color Guidelines

#### Backdrop
- **Background**: `rgba(0, 0, 0, 0.5)` to `rgba(0, 0, 0, 0.75)`
- **Optional**: `backdrop-filter: blur(4px)` for modern browsers

#### Dialog Container
- **Background (Light)**: White (`#ffffff`) or very light gray (`#f9fafb`)
- **Background (Dark)**: `#1a1a1a` or `#0f172a`
- **Border**: Optional 1px solid border (subtle)
- **Shadow**: Elevated shadow for depth
  - Light: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
  - Dark: `0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)`

#### Header
- **Background**: Match dialog container
- **Text (Light)**: Dark gray (`#111827`, `#1f2937`) or black (`#000000`)
- **Text (Dark)**: `#e0e0e0` or `#f1f5f9`
- **Border**: Optional 1px solid border-bottom (subtle)

#### Body
- **Background**: Match dialog container
- **Text (Light)**: Dark gray (`#111827`, `#1f2937`)
- **Text (Dark)**: `#e0e0e0` or `#f1f5f9`
- **Contrast**: Ensure 4.5:1 contrast ratio minimum (WCAG AA)

#### Footer
- **Background**: Match dialog container
- **Border**: Optional 1px solid border-top (subtle)
- **Button Colors**: Follow your design system's button styles

### Typography

- **Font Family**: Use project's font stack (typically: system-ui, -apple-system, sans-serif or custom font)
- **Title**: 20-24px, semibold (600) or bold (700)
- **Description**: 14-16px, regular (400) or medium (500)
- **Body Text**: 16px, regular (400)
- **Button Text**: 14-16px, medium (500) or semibold (600)
- **Line Height**: 1.25 for headings, 1.5 for body text

### Spacing System

Use consistent spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px) or your project's spacing system:

- **Dialog Padding**: 24px (desktop), 16px (mobile)
- **Header Padding**: 24px horizontal, 20px vertical
- **Body Padding**: 24px (desktop), 16px (mobile)
- **Footer Padding**: 16-24px
- **Button Gap**: 12-16px between primary and secondary buttons
- **Content Gap**: 16-24px between sections

### Shadows & Elevation

Use subtle shadows for depth and separation:

- **Dialog Shadow (Light)**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **Dialog Shadow (Dark)**: `0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)`

### Border Radius

- **Dialog Container**: 8-12px
- **Buttons**: 6-8px

### Visual Hierarchy Principles

1. Dialog should be clearly elevated above backdrop
2. Header should be visually distinct from body
3. Footer should be visually distinct from body
4. Primary action should be more prominent than secondary
5. Focus indicators should be clearly visible
6. Loading state should provide clear feedback

## State Management Considerations

### For AI Agents to Implement

**State to Track**:
1. `open: boolean` - Whether dialog is visible (default: false)
2. `loading: boolean` - Whether primary action is processing (default: false)
3. `variant: "dialog" | "alertdialog"` - Dialog semantics variant (default: "dialog")
4. `dismissible: boolean` - Whether Escape/backdrop can close (default: true)
5. `closeOnBackdropClick: boolean` - Whether backdrop click closes (default: true)
6. `fullscreenOnMobile: boolean` - Fullscreen on small screens (default: true)
7. `triggerElement: HTMLElement | null` - Reference to trigger for focus restoration

**State Persistence**:
- All state is component-level only (no persistence needed)
- `triggerElement` should be captured when dialog opens and cleared on close

### SSR/Hydration Considerations
- **Dialog state**: Initialize `open` as `false` to prevent hydration mismatches
- **Focus management**: Only access DOM elements after component mount
- **Body scroll lock**: Only apply after component mount, check for `window` object existence

## Critical Implementation Guidelines

### Vanilla CSS Detection
**CRITICAL**: When detecting vanilla CSS in the project, ALWAYS create CSS classes in a stylesheet. NEVER use inline style attributes on HTML elements.

- Define classes like `.dialog`, `.dialog--open`, `.backdrop`, `.dialog-header`, etc. in your CSS file
- Apply classes via `className`/`class` attributes: `<div class="dialog dialog--open">`
- Do NOT use: `<div style="max-width: 640px">`
- This ensures maintainability, reusability, and proper separation of concerns

### React Hook Patterns
**CRITICAL**: When detecting React, extract logic from `useEffect` hooks into separate custom hooks that do ONE thing each.

- Instead of one `useEffect` handling multiple concerns (focus trap + scroll lock + escape handler), create separate hooks:
  - `useFocusTrap(containerRef, isActive)` - Handles focus trapping only
  - `useBodyScrollLock(isLocked)` - Handles body scroll locking only
  - `useEscapeHandler(onEscape, isActive)` - Handles Escape key only
  - `useDialogState(initialOpen)` - Manages dialog open/close state only
- This improves code organization, testability, and reusability
- Each hook should have a single responsibility

## Code Implementation Patterns

### React Example Pattern
```jsx
// Suggested component structure
<Dialog
  open={isOpen}
  onClose={handleClose}
  variant="dialog"
  dismissible={true}
  closeOnBackdropClick={true}
  fullscreenOnMobile={true}
>
  <DialogTrigger onClick={handleOpen}>
    Open Dialog
  </DialogTrigger>
  <DialogBackdrop />
  <DialogContainer>
    <DialogHeader>
      <DialogTitle id="dialog-title">Dialog Title</DialogTitle>
      <DialogCloseButton />
    </DialogHeader>
    <DialogBody id="dialog-description">
      Dialog content goes here
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handlePrimaryAction} loading={isLoading}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContainer>
</Dialog>
```

### Angular Example Pattern
```html
<!-- Suggested template structure -->
<button (click)="openDialog()" 
        [attr.aria-haspopup]="'dialog'"
        [attr.aria-expanded]="isOpen">
  Open Dialog
</button>

<div *ngIf="isOpen" 
     class="backdrop" 
     (click)="onBackdropClick()"
     [attr.aria-hidden]="!isOpen">
  <div role="dialog"
       [attr.aria-modal]="'true'"
       [attr.aria-labelledby]="'dialog-title'"
       [attr.aria-describedby]="'dialog-description'"
       class="dialog">
    <header class="dialog-header">
      <h2 id="dialog-title">Dialog Title</h2>
      <button (click)="closeDialog()" aria-label="Close dialog">×</button>
    </header>
    <div id="dialog-description" class="dialog-body">
      Dialog content
    </div>
    <footer class="dialog-footer">
      <button (click)="closeDialog()">Cancel</button>
      <button (click)="handlePrimaryAction()" [disabled]="isLoading">
        Confirm
      </button>
    </footer>
  </div>
</div>
```

### Vue Example Pattern
```vue
<!-- Suggested component structure -->
<template>
  <div>
    <button @click="openDialog"
            :aria-haspopup="'dialog'"
            :aria-expanded="isOpen">
      Open Dialog
    </button>
    
    <Teleport to="body">
      <div v-if="isOpen" class="backdrop" @click="onBackdropClick">
        <div role="dialog"
             :aria-modal="true"
             :aria-labelledby="'dialog-title'"
             :aria-describedby="'dialog-description'"
             class="dialog">
          <header class="dialog-header">
            <h2 id="dialog-title">Dialog Title</h2>
            <button @click="closeDialog" aria-label="Close dialog">×</button>
          </header>
          <div id="dialog-description" class="dialog-body">
            Dialog content
          </div>
          <footer class="dialog-footer">
            <button @click="closeDialog">Cancel</button>
            <button @click="handlePrimaryAction" :disabled="isLoading">
              Confirm
            </button>
          </footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>
```

### CSS/Styling Approaches

**Note**: The examples below show how to implement the design specifications using different styling tools. Always refer to the "Design System Specifications" section above for the authoritative design values, then adapt them to your project's styling approach.

#### Tailwind CSS Pattern
```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
     @click="onBackdropClick">
  <!-- Dialog -->
  <div class="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[calc(100vh-200px)] flex flex-col">
      <!-- Header -->
      <header class="flex items-center justify-between p-6 border-b">
        <h2 id="dialog-title" class="text-xl font-semibold">Dialog Title</h2>
        <button class="w-10 h-10 flex items-center justify-center" aria-label="Close dialog">×</button>
      </header>
      <!-- Body -->
      <div id="dialog-description" class="flex-1 overflow-auto p-6">
        Dialog content
      </div>
      <!-- Footer -->
      <footer class="flex items-center justify-end gap-3 p-6 border-t">
        <button class="px-4 py-2">Cancel</button>
        <button class="px-4 py-2 bg-primary text-white">Confirm</button>
      </footer>
    </div>
  </div>
</div>
```

#### Vanilla CSS Pattern
```css
/* CRITICAL: Always create CSS classes, never use inline styles */
/* Apply design system values directly */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 40;
}

.dialog {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.dialogContainer {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 640px;
  width: 100%;
  max-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.dialogHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dialogBody {
  flex: 1;
  overflow: auto;
  padding: 24px;
}

.dialogFooter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
```

#### Material-UI/Chakra Pattern
- Use Dialog/Modal component from library
- **Extend theme** with design system color values, spacing scale, and typography settings
- Use theme.transitions for consistent animations matching design system specifications
- Leverage theme breakpoints for responsive behavior
- **Customize colors, spacing, and typography** to match design system specifications
- Ensure focus trap and scroll lock are properly configured

## Animation Specifications

### Open Animation
- **Duration**: 180ms (from tokens)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (from tokens)
- **Backdrop**: Opacity `0 → 1`
- **Dialog**: 
  - Opacity `0 → 1`
  - Transform: `translateY(8px) scale(0.98) → translateY(0) scale(1)`

### Close Animation
- **Duration**: 140ms (from tokens)
- **Easing**: `cubic-bezier(0.2, 0, 0, 1)` (from tokens)
- **Backdrop**: Opacity `1 → 0`
- **Dialog**: 
  - Opacity `1 → 0`
  - Transform: `translateY(0) scale(1) → translateY(8px) scale(0.98)`

### Prefers-Reduced-Motion Support

**Implementation**:
```css
@media (prefers-reduced-motion: reduce) {
  .dialog,
  .backdrop {
    animation: none;
    transition: opacity 0.1s ease;
  }
  
  .dialog {
    transform: none;
  }
}
```

**Performance**:
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Set `will-change: transform, opacity` on animating elements
- Use `transform3d(0,0,0)` to trigger GPU acceleration if needed

## Z-Index Layer System

To ensure proper layering of elements:
- **Backdrop**: 40 (from tokens)
- **Dialog**: 50 (from tokens)
- **Tooltips**: 60 (from tokens)

## Implementation Details

### Focus Trap

**When**: Dialog is open

**How**: 
- Use focus-trap library (e.g., `focus-trap` for React, `focus-trap-vue` for Vue) or manual implementation
- Identify all focusable elements within dialog
- Prevent tabbing outside dialog boundaries
- Cycle focus within dialog on Tab/Shift+Tab

**Cleanup**: Remove focus trap on close

### Focus Restoration

**When**: Dialog closes (all close paths)

**How**: 
- Store reference to trigger element when dialog opens
- Restore focus to trigger element on close
- Handle cases where trigger element no longer exists (fallback to body or first focusable element)

### Body Scroll Lock

**When**: Dialog is open

**How**: 
- Set `document.body.style.overflow = 'hidden'`
- Optionally preserve scroll position: `document.body.style.position = 'fixed'` and `document.body.style.top = '-${window.scrollY}px'`

**Cleanup**: 
- Restore on close: `document.body.style.overflow = ''`
- Restore scroll position if preserved

### Escape Key Handling

**When**: Dialog is open and `dismissible=true`

**How**: 
- Add global keydown listener for Escape key
- Prevent default and stop propagation
- Close dialog and restore focus

**Cleanup**: Remove listener on close

### Backdrop Click Handling

**When**: Dialog is open and `dismissible && closeOnBackdropClick`

**How**: 
- Add click listener to backdrop
- Check if click target is backdrop (not dialog content)
- Stop event propagation
- Close dialog and restore focus

## Edge Cases

### Very Long Content
- Body should scroll independently
- Header and footer remain visible
- Max height prevents dialog from exceeding viewport

### Multiple Dialogs
- Stack dialogs with increasing z-index
- Focus trap applies to topmost dialog
- Escape closes topmost dialog first

### Rapid Opening/Closing
- Debounce or disable interactions during animation
- Prevent multiple simultaneous open/close operations

### Trigger Element Removed
- If trigger element is removed from DOM before close, fallback to body or first focusable element for focus restoration

### Very Small Screens
- Fullscreen mode recommended for screens < 320px
- Consider further reducing padding/spacing

### Content Overflow
- Ensure dialog doesn't overflow viewport horizontally
- Body scroll handles vertical overflow

## Common Variations

### Confirm Dialog
- Shows primary and secondary buttons
- Backdrop click allowed if `dismissible=true`
- Typically uses `variant="dialog"`

### Alert Dialog
- Uses `role="alertdialog"`
- Prefer `closeOnBackdropClick=false` to avoid accidental dismissal
- Typically for urgent confirmations
- May only have primary action button

### Form Dialog
- Contains form inputs in body
- Primary action submits form
- Secondary action cancels and closes
- Validation errors shown in body

### Loading Dialog
- Shows loading spinner in body
- No footer actions
- Typically not dismissible
- Used for async operations

### Fullscreen Dialog
- `fullscreenOnMobile=true` by default
- Can be forced fullscreen on all screen sizes
- Useful for complex forms or content

## Testing Checklist

When implementing this dialog, test:

- [ ] Dialog opens from trigger and focus moves inside dialog
- [ ] Tab and Shift+Tab cycle within dialog only
- [ ] Escape closes when `dismissible=true` and restores focus to trigger
- [ ] Backdrop click closes only when enabled; does not close when disabled
- [ ] Close button always closes and restores focus
- [ ] `role='dialog'/'alertdialog'` correctly applied based on variant
- [ ] `aria-labelledby` and `aria-describedby` point to existing elements
- [ ] Body scroll is locked while open and restored on close
- [ ] On mobile, fullscreen variant renders correctly when enabled
- [ ] `prefers-reduced-motion` removes heavy transforms/animations
- [ ] Focus trap works correctly (cannot tab outside dialog)
- [ ] Focus restoration works on all close paths
- [ ] Loading state disables actions and shows feedback
- [ ] Primary action success closes dialog
- [ ] Primary action error keeps dialog open
- [ ] Animations are smooth (60fps)
- [ ] No layout shift or flicker on open/close
- [ ] SSR/hydration safe (no DOM access before mount)
- [ ] Long content scrolls correctly in body
- [ ] Multiple dialogs stack correctly
- [ ] Screen reader announces dialog state changes

## AI Agent Implementation Prompt Template

Use this template when asking an AI agent to implement this dialog:

```
Implement an accessible Modal Dialog component with overlay backdrop, focus trap, focus restoration to trigger, Escape/backdrop dismissal (configurable), and scroll lock. Support role='dialog' and role='alertdialog' variants, with aria-modal, aria-labelledby, aria-describedby, and aria-expanded on the trigger. Provide header (title + close), body, footer (primary/secondary actions) and loading state for primary action. Add open/close animations with prefers-reduced-motion support. Adapt to {{USER_FRAMEWORK}} and {{USER_STYLING_LIBRARY}}.

Key requirements:
1. Focus trap: All keyboard focus trapped within dialog when open
2. Focus restoration: Returns focus to trigger element on close (all close paths)
3. Escape key: Closes dialog when dismissible=true
4. Backdrop click: Closes dialog when dismissible && closeOnBackdropClick
5. Scroll lock: Body scroll locked while dialog is open
6. ARIA: role, aria-modal, aria-labelledby, aria-describedby, aria-expanded
7. Animations: 180ms open, 140ms close with cubic-bezier(0.2, 0, 0, 1) easing
8. Responsive: Fullscreen on mobile when fullscreenOnMobile=true
9. Loading state: Disable actions and show spinner on primary action
10. Prefers-reduced-motion: Reduce or remove transforms

Reference: UI Potion Modal Dialog Component
```

## Additional Resources

### Focus Trap Library Examples

**React**:
```javascript
import { createFocusTrap } from 'focus-trap';

const trap = createFocusTrap(dialogRef.current, {
  escapeDeactivates: dismissible,
  clickOutsideDeactivates: dismissible && closeOnBackdropClick,
  returnFocusOnDeactivate: true,
  initialFocus: dialogRef.current.querySelector('[data-initial-focus]') || dialogRef.current,
});
trap.activate();
```

**Vue**:
```javascript
import { createFocusTrap } from 'focus-trap';

const trap = createFocusTrap(dialogRef.value, {
  escapeDeactivates: dismissible,
  clickOutsideDeactivates: dismissible && closeOnBackdropClick,
  returnFocusOnDeactivate: true,
});
trap.activate();
```

### Body Scroll Lock Library Examples

**React**:
```javascript
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

disableBodyScroll(dialogRef.current);
// On close:
enableBodyScroll(dialogRef.current);
```

**Vue**:
```javascript
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

disableBodyScroll(dialogRef.value);
// On close:
enableBodyScroll(dialogRef.value);
```

---

## Summary for AI Agents

This modal dialog is a standard accessible dialog component with focus trap, focus restoration, scroll lock, and keyboard accessibility. Key implementation points:

1. **Structure**: Trigger, Backdrop, Dialog container with Header, Body, Footer
2. **State**: Track open, loading, variant, dismissible, closeOnBackdropClick, fullscreenOnMobile
3. **Focus Management**: Trap focus within dialog, restore to trigger on close
4. **Keyboard**: Escape closes when dismissible, Tab cycles within dialog
5. **Scroll Lock**: Lock body scroll while dialog is open
6. **Animations**: 180ms open, 140ms close with prefers-reduced-motion support
7. **Accessibility**: WCAG AA compliance with proper ARIA attributes
8. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user.
