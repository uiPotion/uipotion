---
layout: 'potion'
title: 'Button'
publicationDate: '2026-02-04'
excerpt: 'A foundational, accessible Button component with semantic variants, sizes, icon-only support, loading/disabled states, and optional link/toggle behavior. Designed to map cleanly into existing design systems via tokens.'
category: 'Components'
tags:
  - components
  - button
  - cta
  - a11y
  - wcag
  - aria
  - focus-visible
  - loading
  - icon-button
  - states
  - variants
  - forms
agentManifest: 'potions/components/button.json'
path: 'potions/components/button'
---

# Button

A foundational, accessible Button component with semantic variants (primary, secondary, ghost, destructive, link), sizes (sm, md, lg), icon-only support, loading and disabled states, and optional link or toggle behavior. Designed to integrate into existing design systems via tokens and adapter rules.

## Overview

The Button component provides a single, design-system-friendly control for actions and navigation. It uses native semantics by default (button for actions, anchor for navigation when appropriate), supports multiple visual variants and sizes, and handles loading and disabled states without layout shift. Accessibility is built in: focus-visible ring, correct ARIA for icon-only and toggle modes, and keyboard activation.

## Component Structure

The button is composed of a root element that wraps optional leading icon, optional spinner (when loading), the label, and optional trailing icon. The focus ring is applied to the root for keyboard focus. When loading, the spinner appears without changing the button width; the label remains in place to avoid layout shift. Icon-only buttons hide the label visually but require an accessible name via aria-label.

## Anatomy Slots

- **root** – The clickable element (button or anchor), carries variant/size/state styling and focus ring.
- **label** – Visible text content.
- **leadingIcon** – Optional icon before the label.
- **trailingIcon** – Optional icon after the label.
- **spinner** – Shown when loading; does not replace the label.
- **focusRing** – Visible focus indicator (e.g. outline or ring), shown on focus-visible only.

## States

### Variant (semantic style)

- **primary** – Main call-to-action; highest emphasis. Use primary action tokens and strong contrast.
- **secondary** – Secondary actions; neutral surface with border or subtle fill.
- **ghost** – Low emphasis; minimal background with clear hover/focus affordance.
- **destructive** – Dangerous actions (delete, remove). Use danger tokens and ensure contrast.
- **link** – Text-like button for inline actions or navigation. Prefer anchor for real navigation; underline on hover/focus; use aria-disabled when disabled.

### Size

- **sm** – Height 36px, horizontal padding 12px, vertical padding 8px, font size 14px.
- **md** – Height 44px (min touch target), horizontal padding 14px, vertical padding 11px, font size 16px.
- **lg** – Height 52px, horizontal padding 16px, vertical padding 14px, font size 16px.

### Interactive states

- **disabled** – No interactions; native disabled on button; for link variant use aria-disabled and remove from tab order.
- **loading** – Spinner visible, interactions blocked, aria-busy; prevents double submit.
- **focused** – Focus-visible ring shown; never remove focus indication.
- **hovered** – Pointer hover feedback (desktop); variant-specific.
- **pressedVisual** – Brief pressed feedback on pointer down (e.g. subtle scale or brightness).

### Toggle (optional)

When togglable is true, the button acts as a toggle: use aria-pressed and maintain visible on/off styling. Support controlled (pressed + onPressedChange) or uncontrolled (defaultPressed) usage.

## Required and Optional Props

**Required:** When `iconOnly=true`, an accessible name is required via `ariaLabel` (or equivalent) because the label is not visible.

**Optional props (summary):**

- **variant** – primary | secondary | ghost | destructive | link (default: primary).
- **size** – sm | md | lg (default: md).
- **disabled** – Boolean; disables interaction (default: false).
- **loading** – Boolean; shows spinner and blocks activation (default: false).
- **fullWidth** – Boolean; button expands to container width (default: false).
- **iconOnly** – Boolean; label hidden, aria-label required (default: false).
- **leadingIcon / trailingIcon** – Optional icon content.
- **type** – button | submit | reset (default: button to avoid accidental form submit).
- **as** – button | a; use anchor when rendering a link (default: button).
- **href** – Required when as is anchor; use target/rel as needed for external links.
- **togglable** – Boolean; enables toggle semantics and aria-pressed (default: false).
- **pressed / defaultPressed** – Toggle state (controlled or uncontrolled).
- **onClick / onPressedChange** – Activation and toggle change callbacks.
- **className / styleVariantClassName** – Optional styling hooks for design-system integration.

Behavior rules: loading implies disabled interaction; submit buttons must not double-submit; layout stays stable during loading (spinner alongside label). Use focus-visible for the focus ring; do not show focus ring on mouse click only.

## Interaction Patterns

### Activation (click or keyboard)

1. User clicks the button or focuses it and presses Enter or Space.
2. If `!disabled && !loading`, onClick (or equivalent) is invoked.
3. If `as='a'`, Enter activates the link; Space should not scroll the page (prevent default and trigger click if the anchor is used as a button-like control).

### Loading flow

1. Parent sets `loading=true` (e.g. after submit click).
2. Button shows spinner, keeps label in place, and blocks further clicks and key activation.
3. Native `disabled` is applied when `as='button'` so the button is not focusable.
4. Set `aria-busy="true"` so assistive tech can announce busy state.
5. When the action completes, parent sets `loading=false`.

### Toggle flow (when togglable=true)

1. On activation, toggle `pressed` state and update `aria-pressed` accordingly.
2. Support controlled mode (parent passes `pressed` and `onPressedChange`) or uncontrolled mode (use `defaultPressed` and internal state).
3. Keep pressed and unpressed states visually distinct.

## Responsive Behavior

### Mobile (max width 767px)

- **Touch targets:** Minimum 44px height and width (icon-only: at least 44px square).
- **Size:** Prefer md by default to meet touch target without extra padding.
- **fullWidth:** Common for primary actions in forms (single column).
- **Typography:** Consider label font size at least 16px in form contexts to reduce iOS zoom on focus.

### Tablet (768px – 1023px)

- Same touch and size guidance as mobile unless the layout clearly targets pointer devices.
- fullWidth optional depending on layout.

### Desktop (min width 1024px)

- **Hover:** Enable hover states (background/border emphasis) aligned to the design system.
- **Press:** Keep press animation subtle (e.g. scale or brightness); avoid layout shift.
- **Loading:** Spinner and label together; no width change when loading is toggled.

## Accessibility

### WCAG 2.1 (Level AA)

- **1.3.1** – Use native semantics (button for actions, anchor for navigation) so role and name are correct.
- **1.4.3** – Text and icon contrast must meet WCAG AA (4.5:1 for text; 3:1 for large text/icons where applicable).
- **2.1.1** – Keyboard operable via Enter and Space for buttons.
- **2.4.7** – Visible focus indicator (focus-visible ring); never remove it without a replacement.
- **3.2.2** – Activation must not cause unexpected context changes.
- **4.1.2** – Accessible name, role, and state: disabled, aria-pressed (toggle), aria-busy (loading).

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move focus to button if focusable |
| Shift+Tab | Move focus away |
| Enter | Activate button; activate link when as='a' |
| Space | Activate native button; for anchor-as-button, prevent default and trigger click so page does not scroll |

### ARIA and Semantics

**Native button (as='button'):**

- Use the native `disabled` attribute when `disabled=true` or `loading=true`.
- Optionally set `aria-busy="true"` when loading.
- When togglable, set `aria-pressed="true"` or `aria-pressed="false"`.

**Icon-only button:**

- Provide `aria-label` (or `aria-labelledby`) so the button has an accessible name. Example: `<button type="button" aria-label="Close">...</button>`.

**Link used as button (as='a' when disabled):**

- Use `aria-disabled="true"`, `tabIndex="-1"`, and prevent default on click so the link does not navigate and is removed from the tab order.

### Focus Management

- Use `:focus-visible` (or the framework equivalent) so the focus ring appears for keyboard focus only, not after a mouse click.
- Disabled buttons must not be focusable. For disabled anchors, use `tabIndex="-1"` and `aria-disabled="true"`.

## Animations

- **Hover:** About 120ms transition; slight emphasis change (background/border) and optional subtle elevation; use design tokens.
- **Press:** About 80ms; optional subtle scale (e.g. 1 to 0.98) or brightness; avoid layout shift.
- **Focus:** About 120ms; focus ring fades in.
- **Loading:** Spinner fade-in about 120ms; do not change button width.
- **Reduced motion:** Honor prefers-reduced-motion: reduce or disable press transforms; use short opacity/color transitions only.

## Design Tokens (reference)

Map these to the project’s existing tokens (CSS variables, Tailwind theme, or theme files). Do not hardcode colors; use semantic tokens for primary, secondary, danger, and neutral.

### Layout

- **Min touch target:** 44px (height and width for icon-only).
- **Border radius:** 8px.
- **Border width:** 1px (when applicable).
- **Gap between icon and label:** 8px.
- **Icon size:** 18px.
- **Spinner size:** 16px.
- **Focus ring:** width 2px, offset 2px.

### Size variants (dimensions)

- **sm:** height 36px, padding horizontal 12px, vertical 8px, font size 14px.
- **md:** height 44px, padding horizontal 14px, vertical 11px, font size 16px.
- **lg:** height 52px, padding horizontal 16px, vertical 14px, font size 16px.

### Typography

- **Font weight:** 600.
- **Letter spacing:** normal.
- **Line height:** 1.1.

### Motion

- **Hover transition:** 120ms, easing cubic-bezier(0.4, 0, 0.2, 1).
- **Press transition:** 80ms, same easing.
- **Focus ring transition:** 120ms.
- **Spinner fade-in:** 120ms.
- **Reduced motion:** Honor prefers-reduced-motion; use short durations (e.g. 100ms) and avoid transforms.

## Common Variations

### Primary CTA

Main action on a page (e.g. hero, form submit). Use variant primary, size md or lg. Ensure strong contrast and a clear focus ring. Often fullWidth on mobile in forms.

### Icon-only (toolbar)

Use when only an icon is shown (e.g. close, menu, edit). Set iconOnly and provide ariaLabel. A tooltip is recommended for discoverability. Keep minimum 44px touch target in both dimensions.

### Submit in form

Use type submit for the primary form action. Set loading true while submitting so the button cannot be clicked again; show spinner and keep label to avoid layout shift.

### Link-style button

Use variant link for inline or secondary actions that look like links. For real navigation use as='a' with href. When disabled, use aria-disabled and tabIndex=-1 and prevent navigation.

### Destructive action

Use variant destructive for delete, remove, or other dangerous actions. Often paired with a confirmation step (e.g. Dialog) before executing.

## Edge Cases

- **Accidental submit:** Default type to button unless the button is explicitly a submit or reset.
- **Icon-only without label:** Require ariaLabel (or equivalent) when iconOnly is true.
- **Disabled anchor:** Use aria-disabled, tabIndex=-1, and prevent default on click/navigation.
- **Loading double-click:** When loading is true, block activation and show busy state.
- **Layout shift on spinner:** Reserve space for the label and overlay the spinner without changing width.

## Implementation Checklist

### Visual

- [ ] All variants (primary, secondary, ghost, destructive, link) render with correct emphasis and contrast.
- [ ] All sizes (sm, md, lg) render with correct height, padding, and font size.
- [ ] Leading and trailing icons align with label; gap is consistent (e.g. 8px).
- [ ] Focus-visible ring is visible and has sufficient contrast (e.g. 3:1).
- [ ] Disabled and loading states are visually clear (e.g. reduced opacity, no hover).
- [ ] Loading spinner appears without changing button width or causing layout shift.
- [ ] Icon-only buttons are at least 44px in both dimensions.

### Functionality

- [ ] Default type is button (no accidental form submit).
- [ ] type submit triggers form submit when intended.
- [ ] onClick (or equivalent) fires on activation; does not fire when disabled or loading.
- [ ] loading=true blocks clicks and key activation and prevents double submit.
- [ ] Toggle mode: pressed state and aria-pressed update on activation; onPressedChange (or equivalent) fires when togglable.
- [ ] Link variant: as='a' with href navigates when not disabled; when disabled, navigation is prevented and tabIndex=-1.

### Keyboard

- [ ] Tab and Shift+Tab move focus to/from the button.
- [ ] Enter and Space activate the button (and link when as='a'; Space does not scroll page).
- [ ] Disabled button is not focusable.

### Accessibility

- [ ] Icon-only has aria-label (or aria-labelledby); screen reader announces name.
- [ ] loading: aria-busy or equivalent so assistive tech can announce busy.
- [ ] togglable: aria-pressed reflects state.
- [ ] Focus ring uses :focus-visible (or equivalent); never removed without replacement.

### Styling

- [ ] Matches project styling system (Tailwind, CSS Modules, SCSS, styled-components, etc.).
- [ ] Uses project design tokens for colors and spacing; no hardcoded brand colors.
- [ ] No inline styles when using vanilla CSS (use classes in a stylesheet).

## Testing Checklist

- Renders as button by default and is focusable via Tab.
- Default type is button (no accidental form submit).
- type submit triggers form submit when intended.
- Disabled button cannot be focused or clicked.
- loading true prevents clicks and key activation; no double submit.
- Loading does not cause layout shift.
- Icon-only has aria-label; screen reader announces name.
- Focus-visible ring appears with keyboard navigation and meets contrast.
- Hover state on desktop pointer; not required on touch-only.
- Link variant uses anchor when appropriate; disabled link uses aria-disabled, tabIndex=-1, and blocks navigation.
- Toggle mode sets aria-pressed correctly and updates on activation.
- Reduced motion disables press transforms where implemented and keeps interaction usable.

## Framework Patterns

Remain framework-agnostic: use a stateless button where possible; for togglable, support controlled (pressed/onPressedChange) or uncontrolled (defaultPressed) state. Emit or call onClick and onPressedChange as appropriate. Default type to button in templates. Style via the project’s system only (Tailwind, CSS Modules, SCSS, styled-components); map variants and sizes to existing design tokens and never introduce a new styling system.

## See Also

Button works well with these potions:

- **[Modal Dialog](/potions/components/dialog)** – Buttons are commonly used in dialog action footers (primary, secondary, destructive).
- **[Text Input Field](/potions/components/text-input)** – Buttons often appear with form inputs (submit, clear, next step).

These are suggestions. Button works independently and can be used in any context.

---

## Summary for AI Agents

**Goal:** Implement a reusable, accessible Button component with semantic variants (primary, secondary, ghost, destructive, link), sizes (sm, md, lg), icon-only support, loading and disabled states, and optional link or toggle behavior. Integrate into the existing design system; do not introduce new styling.

**Critical requirements:**

1. Detect the project’s framework and styling system before writing code; use only that system.
2. If a Button primitive already exists, extend or wrap it rather than replacing it.
3. Default type to button to avoid accidental form submit.
4. When loading=true, block activation and show spinner without layout shift; use native disabled and optionally aria-busy.
5. Icon-only requires an accessible name (aria-label or equivalent).
6. Use :focus-visible for the focus ring; never remove focus indication.
7. Map variants and sizes to existing design tokens; avoid hardcoded colors.
8. For vanilla CSS/SCSS, create classes in a stylesheet; do not use inline style attributes.
9. Disabled anchor: use aria-disabled, tabIndex=-1, and prevent navigation/click.

**States to handle:** variant, size, disabled, loading, focused, hovered, pressedVisual, togglable/pressed (optional).

**Integration:** Buttons are used in dialogs (footer actions), forms (submit, clear), toolbars (icon-only), and layouts (CTAs). Each potion remains independent; use related potions as optional context.
