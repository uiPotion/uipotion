---
layout: 'potion'
title: 'Dark/Light Mode'
publicationDate: '2026-02-14'
excerpt: 'Light, dark, and System themes that never flash: the saved choice applied before the first paint, tokens that set color-scheme, a radio group to choose, and System following the system''s setting as it changes.'
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
promptSubject: 'dark and light mode'
useWhen: 'a site or app needs a dark theme, a theme choice, or a fix for a theme that flashes on load.'
specifies:
  - 'The saved choice is applied in the head before the first paint, and blocked storage falls back to the system''s setting.'
  - 'Light, Dark, and System are a radio group, and System follows the system''s setting as it changes.'
  - 'Tokens set color-scheme, so form controls follow the theme, and borders of controls keep 3:1 in both themes.'
example: 'Someone chooses Dark and reloads: the page is dark before anything paints. Later they choose System, and when the system switches to light at sunrise, the page follows without a reload.'
---

Dark mode is easy to start and easy to get subtly wrong: a flash of the other theme on every load, a choice that's forgotten, a control nobody can read, form fields that stay white, and borders that vanish in one theme. This pattern covers the preference and where it's applied, the color tokens, the control, and media, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project already has themes (a theme provider, a design system's dark mode, Tailwind's dark variant), extend them to meet this guide instead of adding a second system. Keep their API and storage key.
2. Otherwise add a short script in the head, color tokens, and a theme control.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The preference

- Three choices: Light, Dark, and System, which follows the system's setting (`prefers-color-scheme`). System is the default.
- The choice is saved under the app's own storage prefix (`acme.theme`), or in a cookie when the server renders the page. A value the app doesn't know counts as System.

## Before the first paint

- A short blocking script, first in `<head>` before the stylesheets, reads the saved choice and sets `data-theme="light"` or `"dark"` on `<html>`. Applied later, in a framework's mount or effect, the other theme paints first.
- Reading storage can throw where it's blocked (a SecurityError in a sandboxed frame, in Chromium, Firefox, and WebKit, checked), so it's wrapped in `try`/`catch`, and the page then follows the system's setting.
- The script also sets `<meta name="theme-color">`, which colors the browser's toolbar on phones. Under a Content-Security-Policy it needs the page's nonce or its hash.
- Server-rendered apps put the script where the framework writes the head (Next.js: the root layout; Nuxt: `app.head`; SvelteKit: `app.html`). The attribute it sets differs from the server's HTML, so React needs `suppressHydrationWarning` on `<html>`; or the server reads a cookie and renders the right theme.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<!-- First in <head>, before the stylesheets: the saved choice is applied before the first paint.
     "acme" stands for the app's own storage prefix. Under a Content-Security-Policy, the script
     needs the page's nonce or its hash. -->
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff">
<script>
  (() => {
    let choice = 'system';
    try {
      choice = localStorage.getItem('acme.theme') ?? 'system';
    } catch {
      // Storage can be blocked; the page then follows the system's setting
    }
    // Light or Dark as chosen; anything else follows the system's setting
    const dark = choice === 'dark' || (choice !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#121212' : '#ffffff';
  })();
</script>
```

```css
/* color-scheme: light dark follows the system's setting, without script too, and the script's
   data-theme pins one. Each token has its light and its dark value. */
:root {
  color-scheme: light dark;
  --color-background: light-dark(#ffffff, #121212);
  --color-surface: light-dark(#f5f5f5, #1e1e1e);
  --color-text: light-dark(#111111, #eeeeee);
  --color-text-muted: light-dark(#666666, #999999);
  --color-border: light-dark(#e0e0e0, #333333); /* dividers only */
  --color-border-strong: light-dark(#767676, #8a8a8a); /* fields and controls: 3:1 */
  --color-accent: light-dark(#0066cc, #4da6ff);
}
:root[data-theme="light"] {
  color-scheme: light;
}
:root[data-theme="dark"] {
  color-scheme: dark;
}
body {
  background: var(--color-background);
  color: var(--color-text);
}
```

## Colors

- Colors are tokens by purpose (background, surface, text, muted text, border, strong border, accent), each with a light and a dark value, and components use the tokens, never raw colors.
- `color-scheme: light dark` on `:root` with `light-dark()` follows the system's setting even without script, and `data-theme` pins `color-scheme` to one theme, which also switches form controls and scrollbars (checked: an input's background in all three engines). `light-dark()` has been in every current browser since 2024; for older ones, repeat the tokens under `[data-theme="dark"]`.
- Contrast holds in both themes: 4.5:1 for text, and 3:1 for the borders of fields and controls (1.4.11). Thin dividers can be lighter (`#e0e0e0` is 1.3:1 on white), so controls get a stronger border token (`#767676`, 4.5:1). Check the project's own colors in both themes.
- Dark backgrounds are usually a dark gray, such as `#121212`, rather than black, and saturated colors are toned down; both are suggestions, and the project's palette wins.
- Tailwind follows the attribute with `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` in its CSS (version 4), or `darkMode: ['selector', '[data-theme="dark"]']` in its config (version 3.4.1 and later).

## The theme control

- Three choices are a radio group (a `<fieldset>` with the legend "Theme") drawn as a segmented control, or a menu of three radio items. Two themes are one button with `aria-pressed` and a label that stays the same ("Dark theme"). A button that cycles through three states doesn't say what the next press does.
- Icons beside the words are decorative; with icons only, each option still has its name.
- A choice applies at once and holds for the page, which keeps it in memory; it's saved where storage works, so a save that fails, with storage blocked or full, loses nothing on the page. Under System, the theme follows the system's setting as it changes: a `matchMedia` listener fires in all three engines (checked).
- The control shows the saved choice at load, again on `pageshow` (after Back, Chromium restores the checked radio after the page's scripts have run, checked), and when another tab saves a choice or clears storage (the `storage` event, whose key is `null` after a clear).
- A page restored from the back/forward cache takes the saved choice only if what storage holds changed while it was away (a removed choice is a change, not saved System), so a choice that couldn't be saved isn't lost (checked in Chromium's back/forward cache).
- Without script, the control stays hidden, since it couldn't do anything. Choosing announces nothing more: the radio says its new state.

```html
<!-- The theme choice, shown by the script: a radio group drawn as a segmented control -->
<fieldset class="theme-choice" hidden>
  <legend>Theme</legend>
  <div class="theme-options">
    <label><input type="radio" name="theme" value="light"> Light</label>
    <label><input type="radio" name="theme" value="dark"> Dark</label>
    <label><input type="radio" name="theme" value="system" checked> System</label>
  </div>
</fieldset>
```

```css
/* A radio group drawn as a segmented control: the radios stay real, so the arrows move between
   them, and each label shows the state */
.theme-choice {
  border: 0;
  margin: 0;
  padding: 0;
}
.theme-options {
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  display: inline-flex;
  padding: 4px;
}
.theme-options label {
  border-radius: 999px;
  cursor: pointer;
  padding: 6px 12px;
  position: relative;
}
.theme-options input {
  inset: 0;
  margin: 0;
  opacity: 0;
  position: absolute;
}
.theme-options label:has(input:checked) {
  background: var(--color-text);
  color: var(--color-background);
}
/* :focus, not :focus-visible: WebKit doesn't match :focus-visible on a radio the arrows moved to */
.theme-options label:has(input:focus) {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
/* Forced colors replace backgrounds, so the chosen option takes the system's highlight */
@media (forced-colors: active) {
  .theme-options label:has(input:checked) {
    background: Highlight;
    color: HighlightText;
    forced-color-adjust: none;
  }
}
```

```js
// The theme choice: Light, Dark, or System. A choice applies at once and holds for this page, and
// is saved where storage works; System follows the system's setting as it changes; and the
// control matches the saved choice after Back and when another tab changes or clears it. The
// colors repeat the head script's.
const KEY = 'acme.theme';
const control = document.querySelector('.theme-choice');
const inputs = [...control.querySelectorAll('input')];
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let choice = 'system'; // nothing saved (null) or a value the app doesn't know counts as System
let stored = null; // what storage held when this page last read or wrote it, null for nothing

// What storage holds, or this page's own choice where storage can't be read
function saved() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return choice;
  }
}

function apply() {
  const input = inputs.find((option) => option.value === choice) ?? inputs.find((option) => option.value === 'system');
  input.checked = true;
  const dark = input.value === 'dark' || (input.value === 'system' && systemDark.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#121212' : '#ffffff';
}

control.addEventListener('change', (event) => {
  choice = event.target.value;
  try {
    localStorage.setItem(KEY, choice);
    stored = choice;
  } catch {
    // Not saved where storage is blocked or full; the choice still holds on this page
  }
  apply();
});
systemDark.addEventListener('change', apply);
// Another tab saved a choice, or cleared storage (an event without a key)
addEventListener('storage', (event) => {
  if (event.storageArea !== localStorage || (event.key !== KEY && event.key !== null)) return;
  choice = stored = saved();
  apply();
});
// After Back, Chromium restores the checked radio after this script has run, so the choice is
// applied again. A page restored from the back/forward cache takes the saved choice only if
// storage changed while it was away, so a choice that couldn't be saved isn't lost.
addEventListener('pageshow', (event) => {
  const now = event.persisted ? saved() : stored;
  if (now !== stored) choice = stored = now;
  apply();
});
choice = stored = saved();
control.hidden = false;
apply();
```

## Media

- Logos and icons need to show in both themes: an inline SVG with `currentColor`, a second asset, or `<picture>` with `prefers-color-scheme` sources, which follow the system's setting rather than the saved choice. `filter: invert(1)` suits single-color dark logos only; it turns an orange logo blue.
- Images with white backgrounds can sit on a surface, or be dimmed slightly in the dark theme.
- A favicon for dark tabs: `<link rel="icon" media="(prefers-color-scheme: dark)">`.

## Motion

Colors change at once. Elements with hover transitions also animate when the theme changes; if that looks wrong, turn transitions off for a frame while switching, with a class on `<html>`. Under `prefers-reduced-motion: reduce`, a theme change never animates, View Transitions included.

## Forced colors

In forced colors, the system's colors replace the tokens. Nothing depends on a color or a background image alone, and the chosen option in the control takes `Highlight`.

## Edge cases

- Several tabs: a choice in one applies in the others.
- Frames from other sites keep their own theme; pass it as a parameter where they take one.
- Charts and code highlighting need their own colors in each theme.
- An app that has only a dark theme sets `color-scheme: dark` and offers no control.

## Acceptance checklist

- [ ] The saved choice is applied in the head, before the first paint, so no load or reload shows the other theme first
- [ ] Light and Dark apply as chosen; System, nothing saved, or a value the app doesn't know follows the system's setting
- [ ] Where storage is blocked or full, nothing breaks: the page follows the system's setting or the saved choice, and a new choice holds until the page closes, also when the page comes back from the back/forward cache
- [ ] Under System, the theme follows the system's setting when it changes, without a reload
- [ ] The control offers Light, Dark, and System as a radio group or a menu of the three, or for two themes one button with aria-pressed; no button cycles through three states
- [ ] The control shows the saved choice at load, after Back, and when another tab changes or clears it
- [ ] color-scheme matches the theme, so form controls and scrollbars follow it, and so does theme-color
- [ ] Without script, the page follows the system's setting and the control is hidden
- [ ] Colors are tokens with a light and a dark value, and components use the tokens
- [ ] Text meets 4.5:1 and the borders of fields and controls 3:1 in both themes; thin dividers may be lighter
- [ ] Focus indicators show in both themes
- [ ] Logos, icons, and images stay visible in both themes
- [ ] In forced colors, the page uses the system's colors and the chosen option stays visible
- [ ] Under reduced motion, a theme change doesn't animate
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Button](/potions/components/button)**: buttons and their focus rings in both themes.
- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: the header that usually holds the theme control.
- **[Modal Dialog](/potions/components/dialog)**: dialogs and their backdrop in both themes.
- **[Form Validation Pattern - UX and Timing Strategies](/potions/patterns/form-validation)**: error and success colors that meet contrast in both themes.

These are suggestions; the pattern works on its own.
