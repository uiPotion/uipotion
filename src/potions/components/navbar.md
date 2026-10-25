---
layout: 'potion'
title: 'Navigation Bar (Responsive) with Mobile Menu'
publicationDate: '2026-01-12'
excerpt: 'A site''s top bar with a skip link, links with disclosure dropdowns, and a menu in a native dialog on small screens. It sticks with CSS alone and keeps focused elements in view below it.'
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
path: 'potions/components/navbar'
promptSubject: 'a responsive navigation bar'
useWhen: 'a site or app needs a top bar with its main links, groups of links in dropdowns, and a menu for small screens.'
specifies:
  - 'The bar sticks with CSS alone, and the page scrolls a focused link clear of it instead of leaving it underneath.'
  - 'Dropdowns are disclosures: a button that shows a list of links, closed by Escape, by a click outside, or when focus leaves the navigation.'
  - 'Below 1024 px the links move into a menu in a native dialog, which makes the rest of the page inert and returns focus to the Menu button.'
example: 'A keyboard user tabs past the skip link to Products, presses Enter, tabs through its two links, and presses Escape: the list closes, and focus is back on Products.'
---

The navigation bar is on every page, so its mistakes repeat everywhere: a sticky bar that hides the focused link, dropdowns that trap focus or vanish, a mobile menu that leaves the page behind it reachable. This guide covers the bar, its dropdowns, its menu on small screens, and the app variant's account menu and notifications, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a header or navigation component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise build it from plain HTML: a `<header>` with the skip link, the logo, a `<nav>` with the links, and the actions.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Structure

- The bar is the page's `<header>`, its banner landmark. It starts with the skip link, then the logo, a link to the home page named with the site's name (the logo image's `alt` text), then a `<nav>` with the site's links, labelled "Main", then the actions.
- The current page's link has `aria-current="page"` and looks different by more than color, such as an underline.
- Leave out links the person can't use. One that has to show as unavailable for now is an `<a>` without `href`, with `role="link"`, `tabindex="0"`, and `aria-disabled="true"`, so it's still found and does nothing; say why next to it.
- A link that opens a new tab says so in its text, visible or visually hidden.
- **Variants**: a marketing bar has links, dropdowns for groups of pages, and one call to action, which is a link when it goes to a page. An app bar has links, notifications, and the account menu (see "App bar" below), and stays solid.

## Dropdowns

- An item with children is a button that shows or hides its list of links, with `aria-expanded` and `aria-controls`. It has no `aria-haspopup` and no `role="menu"`: those announce an app menu with arrow-key behavior, and these are links.
- An item with its own page and children needs two controls: the link, and a separate button that shows the list, named after it ("More Products pages").
- Focus stays on the button when the list opens, and Tab moves on into the list. One list is open at a time. A closed list has the `hidden` attribute, so its links aren't in the Tab order.
- Escape closes the open list and puts focus back on its button. A click outside the navigation, or focus moving out of it, closes the list too. When focus goes nowhere (`relatedTarget` is null, as when macOS Safari doesn't focus a clicked link), the click decides, so a click on a link in the list still lands.
- Lists open on a click, Enter, or Space, never on hover alone.
- In a single-page app, close the list when one of its links is followed.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<nav class="site-nav" aria-label="Main">
  <ul>
    <li>
      <button type="button" aria-expanded="false" aria-controls="nav-products">Products</button>
      <ul id="nav-products" hidden>
        <li><a href="/analytics">Analytics</a></li>
        <li><a href="/reports">Reports</a></li>
      </ul>
    </li>
    <li>
      <button type="button" aria-expanded="false" aria-controls="nav-company">Company</button>
      <ul id="nav-company" hidden>
        <li><a href="/about">About</a></li>
        <li><a href="/careers">Careers</a></li>
      </ul>
    </li>
    <li><a href="/pricing" aria-current="page">Pricing</a></li>
  </ul>
</nav>
```

```js
// Disclosure dropdowns: each button shows or hides its own list of links, one list at a time.
// A closed list is hidden, so its links aren't in the Tab order.
const nav = document.querySelector('.site-nav');
const toggles = [...nav.querySelectorAll('button[aria-controls]')];

function setOpen(toggle, open) {
  toggle.setAttribute('aria-expanded', String(open));
  document.getElementById(toggle.getAttribute('aria-controls')).hidden = !open;
}
const closeAll = () => toggles.forEach((toggle) => setOpen(toggle, false));

for (const toggle of toggles) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    closeAll();
    setOpen(toggle, open);
  });
}
// Escape closes the open list and puts focus back on its button
nav.addEventListener('keydown', (event) => {
  const open = toggles.find((toggle) => toggle.getAttribute('aria-expanded') === 'true');
  if (event.key !== 'Escape' || !open) return;
  setOpen(open, false);
  open.focus();
});
// Focus moving out of the navigation, or a click outside it, closes the list. When focus goes
// nowhere (relatedTarget is null, as when Safari doesn't focus a clicked link), the click decides.
nav.addEventListener('focusout', (event) => {
  if (event.relatedTarget && !nav.contains(event.relatedTarget)) closeAll();
});
document.addEventListener('click', (event) => {
  if (!nav.contains(event.target)) closeAll();
});
```

## Sticky bar and skip link

- `position: sticky` with `top: 0` keeps the bar at the top without a script. Switching to `position: fixed` from a scroll handler makes the content jump up by the bar's height.
- `scroll-padding-top` on the root element, set to the bar's height, makes the page scroll focused elements and link targets clear of the bar (WCAG 2.2 2.4.11). Without it, a link focused under the bar stays covered (checked in Chromium, Firefox, and WebKit). Where the bar's height changes, as on phones, set the value again; keep the bar to one line so its height holds.
- The skip link is the first focusable element: "Skip to content", shown while it has focus, going to `<main id="main" tabindex="-1">` (WCAG 2.4.1).
- Optional, for marketing pages: the bar starts transparent over a hero and turns solid once the page scrolls. An `IntersectionObserver` on a small element at the top of the page switches it exactly at the threshold, with no scroll listener; the same observer can add a shadow. The bar's text meets 4.5:1 against what's behind it in both states, the hero image included. App bars stay solid.

```html
<!-- The skip link is the header's first child, so it's the page's first Tab stop -->
<header class="site-header">
  <a class="skip-link" href="#main">Skip to content</a>
  <a class="logo" href="/">Acme</a>
  <!-- the site's <nav> -->
</header>
<main id="main" tabindex="-1">
  <!-- the page -->
</main>
```

```css
/* The bar stays at the top without a script, and the page scrolls focused elements and link
   targets clear of it. Both use the bar's height; set it again where the height changes. */
:root {
  --site-header-height: 60px;
}
@media (min-width: 1024px) {
  :root {
    --site-header-height: 72px;
  }
}
html {
  scroll-padding-top: var(--site-header-height);
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 10; /* the sticky-bar layer of the project's scale */
  min-height: var(--site-header-height);
}
/* The skip link shows over the bar while it has focus */
.skip-link {
  position: absolute;
  inset-inline-start: 0.5rem;
  top: 0.5rem;
}
.skip-link:not(:focus) {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  white-space: nowrap;
  width: 1px;
}
```

## The menu on small screens

- Below 1024 px, the links and the actions move into a menu opened by a Menu button. It's one switch: from 1024 px the bar shows its links, below that the Menu button.
- The menu is a native `<dialog>` opened with `showModal()`, named "Main menu". The browser makes the rest of the page inert, closes it on Escape, and returns focus to the Menu button (checked in Chromium, Firefox, and WebKit). Without a native dialog, follow the Modal Dialog guide's model: the rest of the page inert, and no focus-trap library.
- It has a visible Close button ("Close menu"), and it also closes on a click on the backdrop and when a link in it is followed.
- Inside it, an item with children is an accordion section: a button with `aria-expanded` that shows its links. Opening one doesn't close the menu, and several can be open.
- The page behind doesn't scroll: `overflow: hidden` on the root element while the menu is open (`html:has(dialog:modal)`), with `scrollbar-gutter: stable`, so the page doesn't shift.
- When the window crosses 1024 px, focus on an element that hides moves to the nearest control that stays, and focus anywhere else stays where it is. Widening with the menu open closes it and moves focus to the same link in the bar; widening with focus on the Menu button, which hides, moves focus to the current page's link in the bar. In both cases, when that link is in a closed dropdown list, focus goes to the first link in the bar that shows instead; narrowing with focus on the bar's links, which hide, moves focus to the Menu button. React to a `matchMedia` change, not to resize events. Chromium drops focus from an element a media query hides before the listener runs, so remember the last focused element and check whether it still shows.
- The menu's copy of the links gets its own ids.

## App bar: account and notifications

- The account menu is a disclosure like the dropdowns: a button named "Account" (or the person's name) with `aria-expanded`, and a list of links. Sign out is a button that posts a form, not a link.
- The notifications button's name includes the count ("Notifications, 3 unread"), and the badge is hidden from screen readers, since the name already says it. The badge isn't a live region; new notifications, if announced at all, go through one polite status region.

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The bar is a sticky bar: an open dropdown list sits above the page, and a modal dialog covers the bar.

## Appearance

These are suggested defaults; the project's design and tokens win.

- The bar is 72 px tall from 1024 px and 60 px below. Links are 16 px, and links and buttons are at least 24 px tall (44 px is comfortable for touch).
- Text meets 4.5:1, and focus indicators and the current link's marker 3:1. A badge with white text needs a dark enough red: `#dc2626` is 4.8:1, `#ef4444` only 3.8:1. Check the project's own colors the same way.
- Labels wrap; nothing is cut off with an ellipsis. At 320 px wide nothing scrolls sideways.
- Motion is optional: a list fades in over 150 ms, and the menu slides in over 250 ms. Under `prefers-reduced-motion: reduce`, they appear without movement.

## Edge cases

- **Many links**: group them into dropdowns, or switch to the menu at a wider breakpoint, so the row never wraps under the bar.
- **Before the script runs**: render the links on the server. A dropdown's parent can be a link to an overview page, so every page is reachable before the script runs.
- **Single-page apps**: a route change closes an open list and the menu, and moves `aria-current`.
- **A missing return target**: if the button that opened something is gone when it closes, move focus somewhere sensible nearby, such as the bar's first link, never the page's body.

## Acceptance checklist

- [ ] The page starts with a "Skip to content" link that shows when it has focus and moves focus to the main area
- [ ] The bar sticks to the top with CSS alone, and a link focused under it is scrolled clear of it (scroll-padding-top at the bar's height)
- [ ] The bar is the page's header, its links are in a labelled nav, and the current page's link has aria-current="page"
- [ ] Each dropdown is a button with aria-expanded and aria-controls and no aria-haspopup, and a closed list is hidden
- [ ] Focus stays on the button when its list opens, Tab moves through the list's links, and one list is open at a time
- [ ] Escape closes the open list and returns focus to its button; a click outside, or focus leaving the navigation, closes it too
- [ ] Lists open on a click, Enter, or Space, never on hover alone
- [ ] Below 1024 px, a Menu button opens the links in a native dialog named "Main menu", with a visible Close button
- [ ] While the menu is open, the rest of the page is inert and doesn't scroll; Close, Escape, the backdrop, and a followed link close it, and focus returns to the Menu button
- [ ] Crossing 1024 px either way, focus on what hides moves to what stays: from the menu or the Menu button to the bar's links when widening, and from the bar's links to the Menu button when narrowing; focus anywhere else stays where it is
- [ ] The account menu is a disclosure with a Sign out button, and the notifications button's name includes the unread count
- [ ] An open modal dialog covers the bar, and a transparent bar's text meets 4.5:1 over whatever is behind it
- [ ] Labels wrap instead of being cut off, nothing scrolls sideways at 320 px wide, and under reduced motion nothing slides
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Modal Dialog](/potions/components/dialog)**: the model for a menu without a native dialog.
- **[Command Palette](/potions/components/command-palette)**: a search and command entry point in the bar, opened with Cmd or Ctrl+K.
- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)**: an app shell whose header has the same account menu and notifications.
- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)**: the header of an AI chat.

These are suggestions; the bar works on its own.
