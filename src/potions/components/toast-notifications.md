---
layout: 'potion'
title: 'Toast Notifications (Accessible) with Queue System'
publicationDate: '2026-01-24'
excerpt: 'A non-blocking toast notification system with success/error/warning/info variants, queue management, auto-dismiss, keyboard navigation, and screen reader announcements. Perfect for user feedback after actions.'
category: 'Components'
tags:
  - components
  - toast
  - notifications
  - snackbar
  - feedback
  - alerts
  - a11y
  - wcag
  - aria
  - queue
agentManifest: 'potions/components/toast-notifications.json'
---

# Toast Notifications (Accessible) with Queue System

A non-blocking toast notification system for providing user feedback after actions. Features success, error, warning, and info variants with queue management, auto-dismiss timers, manual dismiss controls, keyboard navigation, and full screen reader support.

## Structure Specification

### Component Hierarchy

The toast system consists of a Toast Container (fixed-position wrapper) that holds multiple Toast Items. Each Toast contains an Icon (indicating variant type), Content area (with Title and optional Description), and Action Buttons (Dismiss button and optional action like Undo).

The system flows as: Application triggers toast → Toast Manager adds to queue → Container renders visible toasts → Toast auto-dismisses or user dismisses → Next toast in queue appears.

## Detailed Component Specifications

### 1. Toast Container

**Goal**: Manage the display and lifecycle of multiple toast notifications without blocking user interaction.

**Positioning Options**:
- `top-right` (default) - Most common, good for desktop apps
- `top-left` - Alternative for right-to-left layouts
- `bottom-right` - Less intrusive, good for long sessions
- `bottom-left` - Alternative placement
- `top-center` - High visibility, good for critical messages
- `bottom-center` - Mobile-first, often used in mobile apps

**Container Dimensions**:
- Desktop: 380px width, fixed position
- Mobile: Full width minus 32px total margins (16px each side)
- Gap between toasts: 12px vertical spacing
- Max visible toasts: 3 (configurable, older toasts queue)
- Distance from viewport edge: 20px

**States**:
- `position` (enum, default: "top-right") - Container placement
- `maxVisible` (number, default: 3) - Maximum toasts shown simultaneously
- `queue` (array) - Pending toasts waiting to be displayed
- `pauseOnHover` (boolean, default: true) - Pause auto-dismiss on mouse hover
- `pauseOnFocusWithin` (boolean, default: true) - Pause when toast has focus

### 2. Toast Item Component

**Anatomy Slots**:
- `icon` - Variant-specific icon (success checkmark, error X, warning triangle, info circle)
- `content` - Text content area
- `title` - Main message (required)
- `description` - Optional secondary text
- `action` - Optional action button (e.g., "Undo")
- `dismiss` - Close/dismiss button (X icon)
- `progressBar` - Optional visual timeout indicator

**Dimensions**:
- Height: Auto-sizing, minimum 60px
- Padding: 16px all sides
- Border radius: 10px
- Shadow: Medium elevation (comparable to modals)
- Icon size: 22px
- Dismiss button size: 32×32px touch target
- Progress bar height: 3px (if enabled)

**Visual States**:
- `variant` (enum: "success" | "error" | "warning" | "info") - Visual style and semantics
- `visible` (boolean) - Display state (controls enter/exit animations)
- `paused` (boolean) - Whether auto-dismiss timer is paused
- `action` (object, optional) - Action button config {label, onClick}

**Color Variants**:

**Success**:
- Background: Green 50-100 (light), Green 900 (dark)
- Border: Green 200-300 (light), Green 700 (dark)
- Icon/Text: Green 600-700 (light), Green 100 (dark)
- Icon: Checkmark circle

**Error**:
- Background: Red 50-100 (light), Red 900 (dark)
- Border: Red 200-300 (light), Red 700 (dark)
- Icon/Text: Red 600-700 (light), Red 100 (dark)
- Icon: X circle or exclamation circle

**Warning**:
- Background: Amber/Yellow 50-100 (light), Amber 900 (dark)
- Border: Amber 200-300 (light), Amber 700 (dark)
- Icon/Text: Amber 700-800 (light), Amber 100 (dark)
- Icon: Warning triangle or exclamation triangle

**Info**:
- Background: Blue 50-100 (light), Blue 900 (dark)
- Border: Blue 200-300 (light), Blue 700 (dark)
- Icon/Text: Blue 600-700 (light), Blue 100 (dark)
- Icon: Info circle or "i" icon

### 3. Toast Manager (State Management)

**Core Responsibilities**:
- Queue management (add, remove, reorder toasts)
- Auto-dismiss timers (start, pause, resume, cancel)
- Maximum visible enforcement (hide overflow, show on dismiss)
- Unique ID generation for each toast
- Global toast API (show, dismiss, dismissAll methods)

**State Variables**:
```
toasts: Array<Toast>
- id: string (unique identifier)
- variant: "success" | "error" | "warning" | "info"
- title: string
- description?: string
- duration: number (ms, 0 = persistent)
- action?: {label: string, onClick: Function}
- dismissible: boolean
- timestamp: number (creation time)
- paused: boolean

queue: Array<ToastConfig>
- Pending toasts waiting for available slot

timers: Map<id, TimeoutID>
- Active auto-dismiss timers by toast ID
```

**API Methods**:
- `toast.success(title, options?)` - Show success toast
- `toast.error(title, options?)` - Show error toast
- `toast.warning(title, options?)` - Show warning toast
- `toast.info(title, options?)` - Show info toast
- `toast.custom(config)` - Show custom toast
- `toast.dismiss(id)` - Dismiss specific toast
- `toast.dismissAll()` - Clear all toasts
- `toast.promise(promise, messages)` - Show loading → success/error based on promise result

### 4. Auto-Dismiss Behavior

**Default Durations** (configurable):
- Success: 4000ms (4 seconds)
- Info: 5000ms (5 seconds)
- Warning: 6000ms (6 seconds)
- Error: 7000ms (7 seconds) - Longer for critical messages
- Persistent: 0ms (requires manual dismiss)

**Timer Behavior**:
- Timer starts when toast becomes visible
- Timer pauses on hover (if `pauseOnHover=true`)
- Timer pauses when toast or action button has keyboard focus
- Timer resumes when hover/focus ends
- Timer resets if user interacts with action button
- Timer cancelled on manual dismiss

**Progress Bar** (optional visual indicator):
- Thin bar (2-4px height) at bottom or top of toast
- Fills from 0% to 100% over duration period
- Pauses fill when timer paused
- Color matches variant accent color
- Provides visual countdown for auto-dismiss

### 5. Queue System

**Queue Rules**:
- Max visible toasts enforced (default: 3)
- New toasts added to queue when limit reached
- Oldest toast dismissed first when queue is full (FIFO)
- Exception: High-priority toasts (error) can bump lower-priority
- Queue processed on toast dismiss or timeout

**Stacking Behavior**:
- **Stack (default)**: Toasts stack vertically in container
- **Replace**: New toast replaces previous toast (for rapid updates)
- **Queue**: Toasts wait in queue until slot available

**Position Ordering**:
- Top positions: Newest toast appears at top, pushes older down
- Bottom positions: Newest toast appears at bottom, pushes older up
- Animation: Slide in from edge, slide out on dismiss

## Responsive Design

### Desktop (≥1024px)
- Fixed width: 380px
- Positioned in corner (top-right default)
- Multiple toasts stack vertically (max visible: 3-5)
- Hover interactions enabled

### Tablet (768px - 1023px)
- Width: 360px
- Positioned similar to desktop
- Touch-friendly dismiss buttons (larger targets)
- Max visible: 2-3 toasts

### Mobile (<768px)
- Full width minus 32px total margins (16px each side)
- Positioned at bottom-center (recommended for mobile)
- Swipe to dismiss gesture enabled (optional)
- Single toast visible at a time (maxVisible: 1)
- Touch targets: 44×44px minimum for all buttons

## Accessibility

### Keyboard Navigation

**Focusable Elements**:
- Dismiss button (X): Always focusable
- Action button (e.g., Undo): Focusable when present
- Toast container: Not directly focusable

**Keyboard Controls**:
- `Escape`: Dismiss focused toast (or all toasts if none focused)
- `Tab`: Navigate between action and dismiss buttons within toast
- `Enter/Space`: Activate focused button
- `Shift+Tab`: Navigate backwards

**Focus Management**:
- Newly appeared toasts do NOT steal focus (non-intrusive)
- Keyboard users can Tab to reach toasts
- Focus returns to trigger element on dismiss (if applicable)
- Multiple toasts: Tab order follows visual stacking order

### Screen Reader Support

**ARIA Attributes**:
- Container: `aria-live="polite"` or `aria-live="assertive"` (for errors)
- Toast: `role="status"` (success, info) or `role="alert"` (error, warning)
- Title: `aria-atomic="true"` (announces full message)
- Dismiss button: `aria-label="Dismiss notification"` or `aria-label="Dismiss [variant] notification"`
- Action button: Descriptive label (e.g., `aria-label="Undo delete action"`)

**Announcement Strategy**:
- Success/Info: Polite announcements (don't interrupt)
- Error/Warning: Assertive announcements (interrupt current speech)
- Title + description read together
- Multiple rapid toasts: Queue announcements to avoid overlap

**Reduced Motion**:
- Disable slide/fade animations when `prefers-reduced-motion: reduce`
- Use instant show/hide or simple fade
- Maintain functionality without animations

## Animations

### Entry Animation
- Slide in from container edge + fade in
- Duration: 250ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out bounce)
- Transform: `translateX(100%)` or `translateY(-100%)` → `translate(0)`
- Opacity: 0 → 1

### Exit Animation
- Slide out to edge + fade out + scale down slightly
- Duration: 200ms
- Easing: `cubic-bezier(0.4, 0, 1, 1)` (ease-in)
- Transform: `translate(0)` → `translateX(100%)` or `translateY(-100%)`
- Opacity: 1 → 0
- Scale: 1 → 0.95

### Stacking Animation (Critical Implementation)
- When toast dismissed, remaining toasts slide to fill gap
- Duration: 200ms
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (standard ease)
- **CRITICAL - Coordinated Animation**: Exit animation and stack repositioning happen SIMULTANEOUSLY
  - Exiting toast slides out WHILE remaining toasts smoothly slide up to fill the gap
  - No jumping or instant repositioning
  
**Recommended Implementation Pattern (Wrapper Approach)**:
- Use a **wrapper element** around each toast that handles height collapse
- Structure: `Wrapper (handles height/margin) → Toast (handles slide animation)`
- When exiting:
  - Wrapper animates: `max-height` from current to `0px` AND `margin-bottom` from `12px` to `0px` (200-250ms)
  - Inner toast animates: `translateX` and `opacity` for slide out effect (200-250ms)
  - Both animations run simultaneously with same duration
- Why: Wrapper stays in layout flow and collapses smoothly, allowing remaining toasts to slide up naturally without jumping
- Common mistake: Setting `position: absolute` on toast directly causes it to jump to wrong position before animating

### Progress Bar Animation
- Linear progression from 0% to 100%
- Duration: Matches auto-dismiss duration
- Pause animation on hover/focus
- Resume from current position when unpaused

### Hover/Focus States
- Dismiss button: Scale 1 → 1.1 on hover
- Toast: Subtle elevation increase (shadow grows)
- Action button: Background color shift
- All transitions: 150ms ease-in-out

## Usage Patterns

### Basic Usage
```
// Success feedback
toast.success("Changes saved successfully")

// Error feedback
toast.error("Failed to delete item", {
  description: "Please try again or contact support."
})

// Warning with action
toast.warning("Your session will expire in 5 minutes", {
  action: {
    label: "Extend",
    onClick: () => extendSession()
  }
})

// Info notification
toast.info("New version available", {
  duration: 0, // Persistent until dismissed
  action: {
    label: "Reload",
    onClick: () => window.location.reload()
  }
})
```

### Promise-Based Usage
```
toast.promise(
  saveData(),
  {
    loading: "Saving changes...",
    success: "Changes saved!",
    error: "Failed to save changes"
  }
)
```

### Undo Pattern
```
toast.success("Item deleted", {
  duration: 5000,
  action: {
    label: "Undo",
    onClick: () => {
      restoreItem()
      toast.dismiss() // Close this toast
    }
  }
})
```

### Custom Configuration
```
toast.custom({
  variant: "success",
  title: "Profile updated",
  description: "Your changes are now visible to others",
  duration: 4000,
  position: "bottom-center",
  dismissible: true,
  pauseOnHover: true
})
```

## State Management Integration

### Context/Provider Pattern (React/Vue)
- ToastProvider wraps application root
- useToast hook provides toast methods
- Central state management for all toasts

### Global Singleton Pattern
- Exported toast object with methods
- Works across any component
- No provider required

### Event-Based Pattern
- Dispatch custom events for toast actions
- Toast container listens for events
- Framework-agnostic approach

## Testing Checklist

- [ ] Success/error/warning/info variants display correct colors and icons
- [ ] Toasts appear in correct container position (top-right, bottom-center, etc.)
- [ ] Auto-dismiss works with correct durations (success: 4s, error: 7s, warning: 6s, info: 5s)
- [ ] Manual dismiss (X button) removes toast with smooth exit animation
- [ ] **CRITICAL**: Create 3 toasts, dismiss the MIDDLE one - it should slide out smoothly WITHOUT jumping to a different position first
- [ ] **CRITICAL**: When middle toast exits, bottom toast should smoothly slide up (not jump instantly)
- [ ] **CRITICAL**: Exit animation and stack repositioning happen simultaneously (coordinated animation)
- [ ] Exit animation (200ms) and stack repositioning (200ms) run in parallel, not sequentially
- [ ] Hover pauses auto-dismiss timer (if pauseOnHover enabled)
- [ ] Keyboard focus pauses auto-dismiss timer (if pauseOnFocusWithin enabled)
- [ ] Timer resumes when hover/focus ends
- [ ] Queue enforces maxVisible limit (default: 3 toasts visible)
- [ ] New toasts added to queue when maxVisible reached
- [ ] Oldest toast dismissed first when queue is full (FIFO)
- [ ] Queue processed correctly when toast dismissed or times out
- [ ] Multiple toasts stack vertically with 12px spacing
- [ ] Toasts slide to fill gap when one dismissed (stack animation)
- [ ] Escape key dismisses focused toast or all toasts if none focused
- [ ] Tab key navigates between action button and dismiss button
- [ ] Enter/Space activates focused button
- [ ] Focus order follows visual stacking order for multiple toasts
- [ ] Screen reader announces new toasts with correct role (status/alert)
- [ ] aria-live region configured correctly (polite for success/info, assertive for error/warning)
- [ ] Title and description read together atomically by screen readers
- [ ] Dismiss button has descriptive aria-label
- [ ] Action button has descriptive aria-label (if present)
- [ ] Entry animation: Slide in from edge + fade in (250ms)
- [ ] Exit animation: Slide out to edge + fade out + slight scale down (200ms)
- [ ] prefers-reduced-motion disables slide/scale animations, uses simple fade or instant
- [ ] Progress bar (if enabled) animates from 0-100% over duration
- [ ] Progress bar pauses when timer paused
- [ ] Action button executes onClick callback
- [ ] Action button optionally dismisses toast after callback
- [ ] Mobile: Toasts are full width minus 32px margins
- [ ] Mobile: Position switches to bottom-center (recommended)
- [ ] Mobile: Touch targets are 44×44px minimum for buttons
- [ ] Mobile: Only 1 toast visible at a time (maxVisible: 1)
- [ ] Tablet: Toasts are 360px wide with touch-friendly buttons
- [ ] Desktop: Toasts are 380px wide at configured position
- [ ] Dark mode: Colors adapt with sufficient contrast for all variants
- [ ] Rapid toast creation doesn't cause performance issues or queue overflow
- [ ] toast.dismissAll() clears all active toasts and queue
- [ ] Toast IDs are unique across all toasts
- [ ] Timers cleaned up on unmount/dismiss (no memory leaks)
- [ ] Container z-index (9999) places toasts above most UI but below modals
- [ ] Long titles/descriptions wrap properly without truncation
- [ ] Toast height adjusts automatically based on content length

## Common Variations

### Toast with Loading State
Show spinner in toast while async operation completes, then update to success/error.

### Toast with Custom Icon
Allow custom icon instead of variant defaults (e.g., user avatar, custom SVG).

### Toast with Rich Content
Support for custom content beyond title/description (e.g., images, links, formatted text).

### Toast with Multi-Action
Multiple action buttons (e.g., "Save" and "Discard").

### Notification Center Integration
Archive dismissed toasts in a notification center for later review.

### Grouped Toasts
Combine similar toasts (e.g., "3 items deleted" instead of 3 separate toasts).

## Framework Patterns

### React
- Context + useToast hook for global access
- Custom hooks: `useToastTimer`, `useToastQueue`, `useToastState`
- Portal for rendering outside DOM hierarchy (`ReactDOM.createPortal`)
- useReducer or useState for toast state
- Animations: Use `react-transition-group` or `Framer Motion` with `AnimatePresence`
- **Wrapper pattern recommended**: Outer div handles height collapse, inner div handles slide animation

### Vue
- Composition API with provide/inject or Pinia store
- Composable: `useToast()`, `useToastTimer`, `useToastQueue`, `useToastState`
- Teleport for rendering in body (`<Teleport to="body">`)
- ref/reactive for toast state
- Animations: Use `<TransitionGroup name="toast-list">` - Vue automatically handles move transitions
- **Important**: Set `position: absolute` on `.toast-list-leave-active` to remove from layout during exit

### Angular
- Injectable ToastService with BehaviorSubject
- Services: `ToastService`, `ToastQueueService`, `ToastTimerService`
- Portal from @angular/cdk for rendering
- BehaviorSubject for toast state
- Animations: Use Angular animations with `:enter`, `:leave`, and `query/stagger` for move

### Svelte
- Writable stores for global toast state
- Stores: `toastStore`, `queueStore`, `toastAPI`
- Transition directives for animations (`fly`, `fade`, `flip`)
- Portal pattern for rendering
- Example: `import { toast } from './toast'; toast.success('Saved!');`

## Edge Cases & Considerations

### Rapid Toast Creation
- Debounce identical messages within short timeframe (e.g., 500ms)
- Group similar toasts (e.g., "3 items deleted")
- Prevent queue overflow (max queue size: 10-20)

### Long Messages
- Wrap text properly (don't truncate)
- Auto-adjust height based on content
- Limit max height and add scroll if needed

### Multiple Actions
- Support secondary action button
- Ensure proper keyboard navigation between multiple buttons
- Consider toast width for multiple actions

### Network State Changes
- Offline toast: Persistent, high priority
- Online toast: Brief success notification
- Automatic toast on connection changes

### Cleanup on Route Changes
- Optionally dismiss all toasts on navigation
- Or persist across routes for important messages
- Configurable behavior per toast

### Z-Index Conflicts
- Toast container should be above most UI (z-index: 9999 or similar)
- Below modals/dialogs if both open
- Above dropdowns, tooltips, popovers

### Performance
- Limit DOM nodes (max visible + small queue)
- Use CSS transforms for animations (hardware accelerated)
- Debounce rapid updates
- Clean up timers and event listeners

This toast notification system provides comprehensive user feedback while maintaining accessibility, performance, and a polished user experience across all devices and contexts.
