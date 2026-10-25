---
layout: 'potion'
title: 'Sidebar Navigation'
publicationDate: '2026-03-03'
excerpt: 'An app''s side navigation: groups and nested lists, a collapsible icon rail that still names every link, a saved collapsed state that never jumps, and the same nav as a drawer on small screens.'
category: 'Components'
tags:
  - components
  - sidebar
  - navigation
  - collapsible
  - multi-level
  - responsive
  - drawer
  - a11y
agentManifest: 'potions/components/sidebar-navigation.json'
path: 'potions/components/sidebar-navigation'
promptSubject: 'sidebar navigation'
useWhen: 'an app needs its main navigation in a side column, with groups, nested lists, or a collapsed icon rail.'
specifies:
  - 'Collapsed to a 64 px rail, every link keeps its name for screen readers, and an item with children expands the sidebar.'
  - 'A saved collapsed state is applied before the first paint, under the app''s own storage prefix, so the sidebar never jumps.'
  - 'Below 1024 px the same navigation becomes a drawer, and the rest of the page is inert while it''s open.'
example: 'Someone collapses the sidebar on Monday. On Tuesday every page opens with the rail already in place, and a screen reader still reads "Orders 12 new" for the first icon.'
---

A sidebar holds an app's main sections, often in groups and nested lists, and many apps let people collapse it to a column of icons. The usual problems are in that rail: links that lose their names, a saved state that makes the page jump on every load, and a mobile copy of the sidebar with duplicate ids. This guide covers the sidebar, its rail, and its drawer on small screens, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a sidebar or navigation component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise build it from plain HTML: a `<nav>` with lists of links, and buttons for groups.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Structure

- The sidebar is a `<nav>` labelled for its purpose ("Main"). An `<aside>` can't take `role="navigation"`, so the root is the `<nav>` itself.
- Links sit in lists (`<ul>`), in groups under visible group labels; a nested list sits inside its parent's `<li>`. The DOM order is the order on screen, top to bottom, and so is the Tab order.
- The current page's link has `aria-current="page"`, marked by more than color: a bar at its edge with 3:1 contrast (WCAG 1.4.11), or a stronger background.
- An item with children is a button with `aria-expanded` and `aria-controls` that shows its nested list; focus stays on it, and several groups can be open. A closed list is hidden (`hidden`, or `display: none` once a closing animation ends), so its links aren't in the Tab order; a list animated to height 0 alone keeps them there. An item with its own page and children needs two controls: the link, and a separate button for the list.
- The group with the current page opens on load and on every route change, and the current link scrolls into view.
- A badge's count is part of the link's text ("Orders 12 new"), visually hidden where the badge shows only "99+" or a dot. A plain `<span>` can't take an `aria-label`.
- Leave out items the person can't use. One that has to show as unavailable for now is an `<a>` without `href`, with `role="link"`, `tabindex="0"`, and `aria-disabled="true"`, so it's still found and does nothing; say why next to it. A link that opens a new tab says so.
- When the sidebar comes before the main content, the page starts with a skip link to the main content (WCAG 2.4.1).

## The collapsed rail

- Suggested sizes: 260 px expanded, and a 64 px icon-only rail collapsed. An 80 px rail with a short label under each icon is an option; it helps people who don't know the icons or can't hover for a tooltip.
- The rail is for 1024 px and wider, and so is its saved state: scope its styles to that width, as the snippet does. Below it, the sidebar is the drawer, always expanded, and the collapse toggle is hidden. Unscoped, a saved rail shrinks the drawer to 64 px and hides its labels.
- The collapse toggle is a button whose name says what it does: "Collapse sidebar", then "Expand sidebar". Don't add `aria-expanded` to a name that changes, or it reads as a double state ("Collapse sidebar, expanded"); a stable name with `aria-expanded` is the other way. Focus stays on the toggle.
- Collapsed, the labels are hidden visually only, so every link keeps its name; icons are `aria-hidden`. A badge shows as a dot on its icon, its number hidden visually the same way. If the dot has a ring to set it off from the icon, the ring takes the sidebar's background color; a white ring shows as a halo in dark mode.
- Tooltips show the label on hover and on focus. They don't add `aria-describedby`: the name already has the label, so it would be read twice. They meet WCAG 1.4.13: Escape closes them, the pointer can move onto them, and they stay while the pointer or focus is on the link or the tooltip. Draw them in the top layer (the `popover` attribute), so the scrolling column doesn't clip them.
- An item with children, pressed in the rail, expands the sidebar, as the toggle does, and opens its group, with focus kept on it. A search field shows as a search button that does the same and moves focus into the field.
- Optional: hover expand. After a short delay (about 300 ms), the rail expands over the content while the pointer is on it, without moving the page, and collapses when the pointer leaves. Keyboard focus doesn't expand it; tooltips show the labels.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<nav class="sidebar" id="sidebar" aria-label="Main">
  <ul>
    <li>
      <a href="/orders" aria-current="page">
        <svg class="icon" aria-hidden="true"><use href="#icon-orders"></use></svg>
        <span class="label">Orders</span>
        <span class="badge">12<span class="visually-hidden"> new</span></span>
      </a>
    </li>
    <li>
      <a href="/customers">
        <svg class="icon" aria-hidden="true"><use href="#icon-customers"></use></svg>
        <span class="label">Customers</span>
      </a>
    </li>
  </ul>
  <button type="button" class="sidebar-toggle" aria-label="Collapse sidebar">
    <svg class="icon" aria-hidden="true"><use href="#icon-chevron"></use></svg>
  </button>
</nav>
```

```css
.sidebar {
  width: 260px;
}
.sidebar a {
  position: relative;
}
/* The rail is for 1024 px and wider. Below that the sidebar is a drawer, always expanded,
   whatever the saved state, so the rail's toggle goes too. */
@media (max-width: 1023.98px) {
  .sidebar-toggle {
    display: none;
  }
}
@media (min-width: 1024px) {
  [data-sidebar="collapsed"] .sidebar {
    width: 64px;
  }
  /* Collapsed, the label and the badge's text are hidden visually only, so the link keeps its
     name ("Orders 12 new"). A tooltip that shows the label adds nothing to the name. */
  [data-sidebar="collapsed"] .sidebar :is(.label, .badge) {
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
  /* In the rail, a badge shows as a dot on the icon */
  [data-sidebar="collapsed"] .sidebar a:has(.badge)::after {
    background: currentColor;
    border-radius: 50%;
    content: "";
    height: 8px;
    inset-inline-start: 34px;
    position: absolute;
    top: 6px;
    width: 8px;
  }
}
```

## Saving the collapsed state

- Saving the collapsed state is optional. When the product saves it, keep it where the project keeps preferences: a cookie the server reads, so the server renders the right width, or storage under the app's own prefix (`acme.sidebar`, where `acme` stands for that prefix), applied by a small inline script in `<head>` before the first paint.
- Reading it after hydration and hiding the jump with a fade still makes the sidebar jump on every page load for everyone who keeps it collapsed.
- Storage can be blocked, so read and write it in `try` and `catch`; the sidebar then starts expanded, and the toggle still works on the page.
- Where the framework renders `<html>` itself, as a Next.js root layout does, the attribute the script sets differs from the server's HTML, so tell the framework (React's `suppressHydrationWarning` on `<html>`).

```html
<!-- In <head>, before the stylesheets render: apply the saved state, so the sidebar doesn't
     jump. "acme" stands for the app's own storage prefix. -->
<script>
  try {
    if (localStorage.getItem('acme.sidebar') === 'collapsed') {
      document.documentElement.dataset.sidebar = 'collapsed';
    }
  } catch {
    // Storage can be blocked; the sidebar then starts expanded
  }
</script>
```

```js
// The collapse toggle: its name says what it does, and the choice is saved for the next page
const toggle = document.querySelector('.sidebar-toggle');
const root = document.documentElement;

function setCollapsed(collapsed) {
  if (collapsed) root.dataset.sidebar = 'collapsed';
  else delete root.dataset.sidebar;
  toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
}
toggle.addEventListener('click', () => {
  const collapsed = root.dataset.sidebar !== 'collapsed';
  setCollapsed(collapsed);
  try {
    localStorage.setItem('acme.sidebar', collapsed ? 'collapsed' : 'expanded');
  } catch {
    // Not saved where storage is blocked; the choice still holds on this page
  }
});
setCollapsed(root.dataset.sidebar === 'collapsed'); // the name matches the saved state
```

## Search

Optional: a labelled `<input type="search">` ("Filter navigation") above the groups filters the links by their labels, opens the groups that have matches, and keeps the field in place when nothing matches. The number of matches goes to one polite status region once typing pauses ("3 links", "No links match"; WCAG 4.1.3).

## The drawer on small screens

- Below 1024 px, the same `<nav>` becomes a drawer, opened by a Menu button in the header. There's no second copy, so no id appears twice, and open groups and the search stay as they were.
- While it's open, everything else on the page is `inert` (the Modal Dialog guide's model, without a focus-trap library), so focus and screen readers stay in it, and the page behind doesn't scroll. It makes inert only what isn't inert yet, and closing undoes only that, so a part of the page the app made inert stays inert. It shows expanded, whatever the saved state, 260 px wide or 85% of the window on phones.
- It has a visible Close button ("Close menu"), because touch screen readers have no Escape key, and it also closes on Escape, on a click on the backdrop, and when a link in it is followed. Focus returns to the Menu button.
- Closed, it's `display: none`; with a closing animation, it's `inert` from the moment closing starts.
- If the window gets wider than 1024 px while it's open, it docks, the inertness it added goes, and focus on one of its links stays there, since it's the same element. When the window crosses 1024 px, focus on an element that hides moves to the nearest control that stays, and focus anywhere else stays where it is: widening hides the Menu button and Close, so focus on them, the drawer open or closed, moves to the current page's link, or to the first link that shows when that one is in a closed group, and narrowing hides the docked sidebar, so focus in it moves to the Menu button. React to a `matchMedia` change, not to resize events. Chromium drops focus from an element a media query hides before the listener runs, so remember the last focused element and check whether it still shows. The Dashboard Layout guide's drawer snippet shows this.

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The docked sidebar is page content, the drawer is a modal, and tooltips are popovers.

## Appearance

These are suggested defaults; the project's design and tokens win.

- Items are 40 px tall (44 px is comfortable for touch), icons 20 px, nested lists indented 16 px per level. Keep nesting to two or three levels.
- Text meets 4.5:1, and the current item's marker and focus indicators 3:1. Check the project's own colors.
- Labels wrap; nothing is cut off with an ellipsis.
- Motion is optional: the width changes over 200 ms, and the drawer slides in over 250 ms. During the width change, `overflow-x: hidden` on the column and on its scrolling area stops a scrollbar from flashing. Under `prefers-reduced-motion: reduce`, nothing slides.

## Edge cases

- **Deep nesting**: past three levels, flatten the tree or move the deeper pages into their section's own navigation.
- **Many items**: the column scrolls on its own, and the current link scrolls into view.
- **Right side and right-to-left**: logical properties (`inset-inline-start`, `margin-inline-start`) put the sidebar and the drawer on the start side in right-to-left text, or on either side by choice.
- **With a top bar**: the sidebar starts below it: its sticky `top` is the bar's height. The drawer covers both.
- **Before the script runs**: render the links on the server, with the current group open.

## Acceptance checklist

- [ ] The sidebar is a nav labelled for its purpose, with its links in lists and aria-current="page" on the current one, marked by more than color
- [ ] An item with children is a button with aria-expanded that shows its nested list, and a closed list is hidden, so its links are out of the Tab order
- [ ] The group with the current page opens on load and on route changes, and its link scrolls into view
- [ ] Collapsed to the rail, every link keeps its name (the label visually hidden, the icon aria-hidden), and a badge's count is in the link's name
- [ ] Tooltips in the rail show on hover and on focus, close on Escape, can be hovered, and add no aria-describedby
- [ ] In the rail, an item with children expands the sidebar and opens its group, with focus kept on it
- [ ] The collapse toggle's name says what it does, focus stays on it, and the choice is saved under the app's own prefix
- [ ] A saved collapsed state applies before the first paint, so the sidebar doesn't jump on load; with storage blocked it starts expanded
- [ ] The search field's number of matches is said in one polite status region
- [ ] Below 1024 px, the same nav opens as a drawer with a visible Close button; while it's open, the rest of the page is inert and doesn't scroll
- [ ] Close, Escape, the backdrop, and a followed link close the drawer, focus returns to the Menu button, and what was inert before the drawer opened stays inert
- [ ] Crossing 1024 px either way, focus on what hides moves to what stays: from the Menu button or Close to the current page's link (or the first link that shows, when that one is in a closed group), and from the sidebar to the Menu button; focus anywhere else stays where it is
- [ ] The rail and its saved state apply from 1024 px only: the drawer is always expanded, without the collapse toggle
- [ ] Labels wrap instead of being cut off, and under reduced motion nothing slides
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)**: the app shell this sidebar docks into, with the drawer snippet.
- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: a top bar next to the sidebar, with the same skip link and layering.
- **[Command Palette](/potions/components/command-palette)**: keyboard-first navigation to the same destinations.
- **[Documentation Website Layout](/potions/layouts/documentation)**: a documentation site's page tree.
- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)**: an AI chat whose conversation list sits next to the app's navigation.

These are suggestions; the sidebar works on its own.
