---
layout: 'potion'
title: 'Dark/Light Mode Pattern - Theme Switching and Color Schemes'
publicationDate: '2026-02-14'
excerpt: 'A framework-agnostic pattern for implementing dark and light theme switching with system preference detection, user override persistence, semantic color tokens, and accessibility compliance.'
category: 'Patterns'
tags:
  - patterns
  - dark-mode
  - light-mode
  - theme
  - color-scheme
  - accessibility
  - design-tokens
  - responsive
agentManifest: 'potions/patterns/dark-light-mode.json'
path: 'potions/patterns/dark-light-mode'
---

# Dark/Light Mode Pattern - Theme Switching and Color Schemes

A framework-agnostic pattern for implementing dark and light theme switching. Covers preference detection (system vs user override), persistence, semantic color tokens, preventing flash of unstyled content, accessibility, and handling of images and media. Works with any frontend framework and styling system.

## The Problem

Users expect dark mode for extended usage and reduced eye strain. Implementing it well is non-trivial:

- **Flash on load** - Page briefly shows wrong theme before preference is applied
- **No persistence** - User must re-select theme on every visit
- **Inconsistent contrast** - Dark themes often fail WCAG in both modes
- **Native controls mismatch** - Form controls and scrollbars stay light in dark mode
- **Images and SVGs** - Media content may look wrong on dark backgrounds
- **Framework lock-in** - Many implementations assume a specific stack

## The Solution

Apply a systematic approach:

1. **Preference resolution** - User override first, then system preference, then fallback
2. **Early application** - Inline script in `<head>` to apply theme before paint
3. **Semantic color tokens** - Variables by purpose (background, text, border) not raw values
4. **`color-scheme`** - Signal support and style native controls correctly
5. **Persistence** - Store user choice in localStorage
6. **Accessibility** - WCAG contrast in both themes, respect reduced motion and forced colors
7. **Media handling** - Adapt images, SVGs, and favicons for both themes

## Do

### Preference Detection
- **User override first** - If user has explicitly chosen light or dark, respect it
- **System preference second** - Use `prefers-color-scheme` when no override exists
- **Support "system" mode** - Let users revert to following OS preference
- **Fallback to light** - When no preference is expressed

### Document and HTML Setup
- Add `<meta name="color-scheme" content="dark light" />` in `<head>` for early browser hint
- Set `color-scheme: light dark` on `:root` or `html` in CSS
- Use `data-theme` or class (e.g. `data-theme="dark"`) on `html` for user override control
- Apply `color-scheme: light` or `color-scheme: dark` when user overrides so native controls match

### Preventing Flash
- Run a blocking inline script in `<head>` that reads localStorage (or cookie)
- Set `data-theme` (or equivalent) on `html` before body renders
- Ensure no visible content renders before theme is applied

### Color System
- Use **semantic tokens** - `--color-background`, `--color-text`, `--color-border`, etc.
- Define tokens per theme; map them to appropriate light/dark values
- Avoid pure black (`#000000`) in dark mode; use dark gray (e.g. `#121212`)
- Consider OKLCH or Oklab for perceptually uniform color manipulation
- Use elevation layers (background, surface, elevated) for hierarchy

### Implementation Approaches
- **`light-dark()`** - When supported (~85% browsers), use for concise single-line theme values
- **`@media (prefers-color-scheme)`** - Fallback for broader support
- **Attribute/class** - Use `[data-theme="dark"]` or `.dark` for user override

### Persistence
- Store in localStorage with key like `theme` or `color-scheme`
- Values: `"light"` | `"dark"` | `"system"`
- Read and apply on every page load before first paint

### Accessibility
- Meet **WCAG AA** contrast in both themes (4.5:1 normal text, 3:1 large text and UI)
- Respect `prefers-reduced-motion` - skip or minimize theme switch animations
- Consider `forced-colors` - avoid relying on specific colors; use semantic tokens where possible
- Ensure focus indicators are visible in both themes

### Media Content
- **Images** - Prefer images that work in both themes; use `<picture>` with `prefers-color-scheme` for variants when needed
- **SVGs** - Use CSS variables for fill/stroke in inline SVGs; add `color-scheme: light dark` to external SVG root when embedded
- **Favicons** - Provide dark-mode favicon via `<link rel="icon" media="(prefers-color-scheme: dark)" href="...">` when applicable

### Logos and Icons (Easy to Forget)
Dark-on-light assets become invisible on a dark background. Audit these explicitly:

- **Header/brand logo** - Dark logo disappears in dark mode. Fix: `[data-theme='dark'] .main-logo-img { filter: invert(1); }`, or provide a separate white logo asset
- **Social icons** - GitHub, Twitter/X, email icons with dark fill in SVGs or PNGs vanish on dark background. Fix: same `filter: invert(1)` for dark mode, or use inline SVG with `fill: currentColor`
- **Decorative icons** - Icons in navbars, article headers, footers may be single-color dark; apply the same treatment
- **Series/card blocks** - Content blocks (e.g. related articles list) often use hardcoded light grey background; use `--color-surface` or another theme token instead

### Transitions
- Use instant switch or very short transitions by default
- If animating, respect `prefers-reduced-motion: reduce` with instant switch
- View Transitions API can create smooth theme changes when supported

## Don't

- Use pure black backgrounds in dark mode
- Ignore system preference when user hasn't overridden
- Apply theme after first paint (causes visible flash)
- Rely only on `prefers-color-scheme` when user can override (need attribute/class)
- Forget `color-scheme` for form controls and scrollbars
- Force dark mode without user or system preference
- Use saturated colors that cause eye strain in dark mode
- Skip contrast checks in both themes
- Animate theme changes without respecting `prefers-reduced-motion`
- Assume one styling system (detect and adapt to project)

## Preference Resolution Logic

```
1. Read stored value from localStorage (e.g. "theme")
2. If value is "light" or "dark" → use that
3. If value is "system" or missing → use prefers-color-scheme
4. If prefers-color-scheme is "dark" → use dark
5. Otherwise → use light
```

## Token Structure

Semantic tokens should map to concrete values per theme:

```
--color-background    (page background)
--color-surface       (cards, panels)
--color-elevated      (dropdowns, modals)
--color-text          (primary text)
--color-text-muted    (secondary text)
--color-border        (borders, dividers)
--color-accent        (links, buttons, highlights)
--color-error, --color-success, --color-warning
```

Each token has a light value and a dark value. Components reference the token, not the raw color.

## Common Oversights

When implementing dark mode, these elements are often forgotten:

- **Header logo**: Issue: dark logo becomes invisible on dark background. Fix: use `filter: invert(1)` in dark mode, or provide a separate light asset.
- **Social icons (GitHub, Twitter, etc.)**: Issue: dark fill disappears. Fix: use `filter: invert(1)`, or inline SVG with `currentColor`.
- **Decorative icons**: Issue: same as social icons. Fix: same treatment.
- **Series/card blocks**: Issue: hardcoded light background. Fix: use `--color-surface` or a theme token.

## Anti-Patterns to Avoid

1. **Late Application** - Applying theme in `useEffect` or `mounted` causes flash
2. **No Persistence** - User selects dark mode, refreshes, sees light again
3. **Pure Black** - Harsh contrast and poor readability
4. **Missing color-scheme** - Form controls and scrollbars stay light in dark pages
5. **Color-Only Indicators** - Errors/warnings that rely only on color may fail in both themes
6. **Aggressive Animations** - Theme switch animations that ignore reduced motion preference
7. **Hardcoded Colors** - Components using `#fff` or `#000` instead of tokens
8. **Images That Don't Adapt** - Bright white-background images glaring in dark mode
9. **Invisible Logos/Icons** - Dark header logo or social icons on dark background (forgotten adaptation)

## Testing Checklist

- [ ] User override persists across page reloads
- [ ] System preference is respected when no override exists
- [ ] No visible flash on initial load
- [ ] Form controls and scrollbars match active theme
- [ ] WCAG AA contrast in both light and dark themes
- [ ] Reduced motion disables or shortens theme switch animation
- [ ] Theme toggle updates UI immediately and stores preference
- [ ] Forced-colors mode degrades gracefully
- [ ] Images and SVGs are acceptable in both themes
- [ ] Works across target breakpoints
- [ ] Logos and icons (header, social, decorative) visible and readable in both themes

## See Also

This pattern complements these potions:

- **[Button Component](/potions/components/button)** - Primary and secondary variants should use theme tokens for colors
- **[Navbar Component](/potions/components/navbar)** - Navigation bars commonly host theme toggle controls
- **[Dialog Component](/potions/components/dialog)** - Dialogs and overlays should inherit theme correctly
- **[Form Validation Pattern](/potions/patterns/form-validation)** - Error and success colors must meet contrast in both themes

These are suggestions. The dark/light mode pattern works independently with any components.
