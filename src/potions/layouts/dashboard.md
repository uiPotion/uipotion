---
layout: 'potion'
title: 'Dashboard Layout with Collapsible Sidebar'
publicationDate: '2026-01-10'
excerpt: 'An app shell where the page itself scrolls: a sticky header that never covers the focused element, the sidebar in its own column or as a drawer on small screens, and a footer that scrolls with the content.'
category: 'Layouts'
tags:
  - layouts
  - dashboard
  - sidebar
  - app-shell
  - responsive
  - admin
  - a11y
agentManifest: 'potions/layouts/dashboard.json'
path: 'potions/layouts/dashboard'
promptSubject: 'a dashboard layout'
useWhen: 'an admin panel or a SaaS app needs its shell: a sidebar, a header with search and the account menu, and room for tables and charts.'
specifies:
  - 'The page itself scrolls, with a sticky header and sidebar, and a focused element is never left under the header.'
  - 'Below 1024 px the same sidebar is a drawer, and the rest of the page is inert while it''s open.'
  - 'Wide tables scroll inside themselves instead of widening the page, and the footer scrolls with the content.'
example: 'On a phone, someone opens the menu, tabs through the sidebar''s links without reaching the page behind it, and presses Escape: the drawer closes, and focus is back on Menu.'
---

A dashboard's shell holds everything else: the sidebar, the header with search and the account menu, and the tables and charts in between. The shell's own mistakes are about space and focus: fixed bars that cover what has focus, a content box that scrolls on its own, a wide table that pushes the page sideways, and a mobile sidebar whose page stays reachable behind it. This guide covers the shell, and targets WCAG 2.2 AA; the Sidebar Navigation guide covers the sidebar itself.

## Start from what the project has

1. If the project has an app shell or layout components, in its design system or a framework it already uses, configure or extend them to meet this guide. Keep their APIs.
2. Otherwise build it from plain HTML: a grid with a `<nav>`, a `<header>`, `<main>`, and a `<footer>`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The page grid

- The page scrolls, not a box inside it. A grid has two columns: the sidebar's, sticky at the top at the window's full height and scrolling inside itself, and the main column, whose header is sticky at its top. The footer sits at the end of the main area and scrolls with the content; it's never fixed. Keyboard scrolling then works without first focusing an area, and so do find in page, links to a section, the scroll position after Back, and phone toolbars that hide while scrolling.
- `scroll-padding-top` on the root element, set to the header's height, makes the page scroll focused elements and link targets clear of the header (WCAG 2.2 2.4.11). Checked in Chromium, Firefox, and WebKit: with it, a link focused under the header is scrolled clear (Chromium and Firefox center it, WebKit puts it just below the header); without it, the link stays covered.
- The main column is `minmax(0, 1fr)`. Grid and flex children default to `min-width: auto`, so with `1fr` a table with many columns or a long line of code widens the page, even inside its own scrolling container (checked in Chromium, Firefox, and WebKit). Wide tables and code blocks scroll inside their own container, as the Data Table guide says; don't hide overflow on the content area, which clips content and focus outlines.
- Full heights use `100dvh`, with `100vh` before it for older browsers, so phone toolbars don't hide the bottom.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version. The sidebar's own markup, its collapsed rail, and its saved state are in the Sidebar Navigation guide.

```html
<a class="skip-link" href="#main">Skip to content</a>
<div class="app">
  <nav class="sidebar" id="sidebar" aria-label="Main">
    <button type="button" class="drawer-close">Close menu</button>
    <!-- the sidebar's links (the Sidebar Navigation guide) -->
  </nav>
  <div class="drawer-backdrop" hidden></div>
  <div class="app-main">
    <header class="app-header">
      <button type="button" class="menu-button" aria-controls="sidebar" aria-expanded="false">Menu</button>
      <!-- search, notifications, the account menu -->
    </header>
    <main id="main" tabindex="-1">
      <h1>Orders</h1>
      <!-- the page -->
    </main>
    <footer class="app-footer">
      <!-- scrolls with the page, never fixed -->
    </footer>
  </div>
</div>
```

```css
/* The page scrolls. The sidebar's column and the header stick, and the page scrolls focused
   elements and link targets clear of the header. */
.app {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr); /* minmax: wide content can't widen the page */
  min-height: 100vh;
  min-height: 100dvh;
}
.sidebar {
  align-self: start;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  position: sticky;
  top: 0;
}
.app-header {
  min-height: 64px;
  position: sticky;
  top: 0;
  z-index: 10; /* the sticky-bar layer of the project's scale */
}
html {
  scroll-padding-top: 64px; /* the header's height */
}
```

## Landmarks and headings

- The sidebar comes first in the page, so the page starts with a skip link to `<main id="main" tabindex="-1">` (WCAG 2.4.1).
- The sidebar is a labelled `<nav>`, the header a `<header>`, the content `<main>`, and the footer a `<footer>`.
- The page's title is its `<h1>`, at the start of `<main>`. Breadcrumbs, when the app has them, are a `<nav aria-label="Breadcrumb">` with an ordered list, the current page last with `aria-current="page"`, and the separators hidden from screen readers.
- In a single-page app, a route change updates `document.title`, moves focus to the new page's `<h1>` (`tabindex="-1"`), closes the drawer and any open menu, and moves `aria-current`.

## The sidebar

- It's the Sidebar Navigation guide's sidebar: 260 px expanded and 64 px collapsed as suggested defaults, with an 80 px rail with a short label under each icon as an option. In the rail, labels are hidden visually only, so every link keeps its name, and the collapse toggle's name says what it does ("Collapse sidebar", "Expand sidebar").
- A saved collapsed state is applied before the first paint, by a cookie the server reads or a small inline script, and stored under the app's own prefix, such as `acme.sidebar`. The rail's styles apply from 1024 px only, so a saved rail never shrinks the drawer.
- Collapsing changes the main column's width. Charts and virtualized tables measure their container, so they measure again after the change (a `ResizeObserver`). Under reduced motion, the width changes at once.

## The drawer on small screens

- Below 1024 px, tablets included, a Menu button in the header (`aria-expanded`, `aria-controls`) opens the same sidebar as a drawer over the page. There's no second copy, so no id appears twice.
- While it's open, everything else is `inert` (the Modal Dialog guide's model, without a focus-trap library), so focus and screen readers stay in it, and the page behind doesn't scroll. It makes inert only what isn't inert yet, and closing undoes only that, so a part of the page the app made inert stays inert. Focus moves to its Close button.
- Close ("Close menu"), Escape, a click on the backdrop, and a followed link close it, and focus returns to Menu.
- If the window gets wider than 1024 px while it's open, it docks, and the inertness it added goes.
- When the window crosses 1024 px, focus on an element that hides moves to the nearest control that stays, and focus anywhere else stays where it is. Widening hides Menu and Close, so focus on them, the drawer open or closed, moves to the current page's link, or to the first link that shows when that one is in a closed group (a selector list such as `[aria-current="page"], a` finds whichever comes first in the page, so pick the current one first); narrowing hides the docked sidebar, so focus in it moves to Menu. The same goes for any header control the project hides at a breakpoint. Chromium drops focus from an element a media query hides before a `matchMedia` listener runs, so the snippet remembers the last focused element and checks whether it still shows. React to a `matchMedia` change, not to resize events.

```css
/* Below 1024 px the same sidebar is a drawer over the page */
@media (max-width: 1023.98px) {
  .app {
    grid-template-columns: minmax(0, 1fr);
  }
  .sidebar {
    height: auto;
    inset-block: 0;
    inset-inline-start: 0;
    position: fixed;
    width: min(260px, 85vw);
    z-index: 30; /* the modal layer of the project's scale */
  }
  .sidebar:not(.is-open) {
    display: none;
  }
  .drawer-backdrop {
    background: rgb(0 0 0 / 50%);
    inset: 0;
    position: fixed;
    z-index: 29;
  }
  html:has(.sidebar.is-open) {
    overflow: hidden; /* the page behind doesn't scroll */
  }
}
@media (min-width: 1024px) {
  .menu-button,
  .drawer-close {
    display: none;
  }
}
```

```js
// Below 1024 px the sidebar is a drawer. While it's open, everything else is inert, so focus
// and screen readers stay in it; Close, Escape, and a click on the backdrop close it.
const sidebar = document.getElementById('sidebar');
const menuButton = document.querySelector('.menu-button');
const closeButton = sidebar.querySelector('.drawer-close');
const backdrop = document.querySelector('.drawer-backdrop');
const wide = matchMedia('(min-width: 1024px)');
let madeInert = []; // closing undoes only this, so what was inert before stays inert
let lastFocused = null;

function setOpen(open) {
  sidebar.classList.toggle('is-open', open);
  backdrop.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  madeInert.forEach((element) => { element.inert = false; });
  madeInert = [];
  if (!open) return;
  for (let node = sidebar; node !== document.body; node = node.parentElement) {
    for (const sibling of node.parentElement.children) {
      if (sibling !== node && sibling !== backdrop && !sibling.inert) madeInert.push(sibling);
    }
  }
  madeInert.forEach((element) => { element.inert = true; });
}
function close() {
  setOpen(false);
  menuButton.focus();
}
menuButton.addEventListener('click', () => {
  setOpen(true);
  closeButton.focus();
});
closeButton.addEventListener('click', close);
backdrop.addEventListener('click', close);
sidebar.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && sidebar.classList.contains('is-open')) close();
});
// Crossing 1024 px moves the same sidebar between the drawer and its column, and hides Menu and
// Close, or the sidebar. Focus on what hides moves to what stays: to the current page's link when
// the sidebar docks (or the first link that shows, when that one is in a closed group), to Menu
// when it hides; focus anywhere else stays where it is. Chromium drops that focus before this
// runs, so the last focused element says where it was.
const shownLink = () => [...sidebar.querySelectorAll('a[aria-current="page"]'), ...sidebar.querySelectorAll('a[href]')]
  .find((link) => link.checkVisibility());
document.addEventListener('focusin', (event) => { lastFocused = event.target; });
wide.addEventListener('change', () => {
  const lost = !document.activeElement || document.activeElement === document.body;
  const focused = lost ? lastFocused : document.activeElement;
  if (wide.matches) setOpen(false);
  if (!focused?.isConnected || focused.checkVisibility()) return;
  if (wide.matches) shownLink()?.focus();
  else menuButton.focus();
});
```

## The header

- The header holds the Menu button below 1024 px, then search or the command palette's trigger, notifications, and the account menu.
- The account menu is a disclosure, as in the Navigation Bar guide: a button with `aria-expanded`, and a list of links. Sign out is a button that posts a form. It isn't `role="menu"`, which promises arrow-key navigation, and no button here has `aria-haspopup`.
- The notifications button's name includes the count ("Notifications, 3 unread"); the badge is hidden from screen readers, and its panel is a disclosure too.
- Escape closes an open menu or panel and puts focus back on its button; a click outside closes it.
- Nothing announces "Sidebar opened": the Menu button's `aria-expanded` already says it.

## Live content

- Widgets that refresh don't announce themselves, and the dashboard's grid isn't a live region. One polite status region, in the page from the start, says the results people asked for ("Report exported"); `role="alert"` is only for urgent errors.
- Each widget keeps its own loading, empty, and error states, as the Data Table guide does for tables, so each still works on its own.

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The sticky header and the sidebar's column are sticky bars, the header's panels are dropdowns, and the drawer is a modal.

## Phones and right-to-left text

- On phones with a notch, `env(safe-area-inset-top)` pads the header and the drawer, but only when the viewport meta tag has `viewport-fit=cover`; without it, the values are 0.
- Logical properties (`inset-inline-start`, `margin-inline-start`) put the sidebar on the start side in right-to-left text, and the drawer slides in from there.

## Appearance

These are suggested defaults; the project's design and tokens win.

- The header is 64 px tall. Content padding is 24 to 32 px from 1024 px and 16 px on phones; a maximum width for reading, such as 1400 px, is optional.
- Text meets 4.5:1, and focus indicators, the current link's marker, and form controls' edges 3:1. Check the project's own colors the same way.
- Motion is optional: the sidebar's width changes over 200 ms, and the drawer slides in over 250 ms. Under `prefers-reduced-motion: reduce`, nothing slides.
- Colors: a `#f9fafb` page with `#111827` text (17.0:1), a `#ffffff` header with `#4b5563` icons (7.6:1), and a `#111827` sidebar with `#d1d5db` links (12.0:1) and a `#60a5fa` marker for the current one (7.0:1). In dark mode, a `#030712` page with `#f3f4f6` text (18.3:1) and a `#1f2937` header and sidebar. A badge with white text needs `#dc2626` (4.8:1); `#ef4444` is only 3.8:1.

## Edge cases

- **Many navigation items**: the sidebar's column scrolls on its own, and keeps the current link in view.
- **Short screens**: phones in landscape and 400% zoom leave little height, so only the 64 px header sticks; the footer scrolls with the content.
- **Wide content**: tables and code scroll inside their own container, and the page doesn't scroll sideways at 320 px wide.
- **A second panel**: a panel of filters or details on the other side follows the same rules: its own column from 1024 px, a drawer below.
- **Before the script runs**: render the sidebar and the page on the server. Below 1024 px the drawer needs the script, so keep the main sections reachable without it too, such as from the home page.

## Acceptance checklist

- [ ] The page itself scrolls; the sidebar's column and the header stick, and the footer scrolls with the content
- [ ] A link focused under the sticky header is scrolled clear of it (scroll-padding-top at the header's height)
- [ ] A table or code block wider than the column scrolls inside itself, and the page never scrolls sideways, down to 320 px wide
- [ ] The page starts with a skip link to the main area, and has one h1, the page's title, at the start of main
- [ ] Breadcrumbs, if any, are a nav named "Breadcrumb" with the current page last, marked aria-current="page"
- [ ] Below 1024 px, Menu opens the same sidebar as a drawer with a visible Close button, and focus moves into it
- [ ] While the drawer is open, the rest of the page is inert and doesn't scroll; Close, Escape, the backdrop, and a followed link close it, focus returns to Menu, and what was inert before it opened stays inert
- [ ] Crossing 1024 px either way, focus on what hides moves to what stays: from Menu or Close to the current page's link (or the first link that shows, when that one is in a closed group), and from the sidebar to Menu; focus anywhere else stays where it is
- [ ] The account menu and the notifications panel are disclosures that close on Escape and on a click outside; Sign out is a button
- [ ] The notifications button's name includes the count, and widgets, badges, and the dashboard's grid aren't live regions
- [ ] In a single-page app, a route change updates the title and moves focus to the new page's h1
- [ ] A saved collapsed sidebar applies before the first paint, so the layout doesn't shift on load, and from 1024 px only, so the drawer stays expanded
- [ ] Under reduced motion, the sidebar and the drawer change without sliding
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Sidebar Navigation](/potions/components/sidebar-navigation)**: the sidebar itself, with its collapsed rail and its saved state.
- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: the same disclosure menus and skip link in a top bar.
- **[Command Palette](/potions/components/command-palette)**: keyboard-first navigation and commands for dense apps.
- **[Data Table (Sortable, Paginated, Filterable)](/potions/components/data-table)**: tables in the main area.
- **[Modal Dialog](/potions/components/dialog)**: confirmations and forms over the dashboard.
- **[Toast Notifications](/potions/components/toast-notifications)**: brief messages about results.
- **[Select and Combobox](/potions/components/dropdown-select)**: filters and settings.
- **[File Upload Component](/potions/components/file-upload)**: imports and attachments.
- **[Button](/potions/components/button)**: the header's and the page's actions.

These are suggestions; the layout works with any content.
