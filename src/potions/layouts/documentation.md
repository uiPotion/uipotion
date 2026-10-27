---
layout: 'potion'
title: 'Documentation Website Layout'
publicationDate: '2026-02-25'
excerpt: 'A documentation site''s layout: a sidebar that''s a sticky column from 1024 px and a drawer below, the article with code that Copy copies, and a table of contents that marks the section being read without touching the URL.'
category: 'Layouts'
tags:
  - layouts
  - documentation
  - sidebar
  - table-of-contents
  - responsive
  - search
  - scroll-spy
  - a11y
agentManifest: 'potions/layouts/documentation.json'
path: 'potions/layouts/documentation'
promptSubject: 'a documentation site layout'
useWhen: 'a product needs documentation pages with a sidebar of sections, a table of contents for each page, search, and code examples people copy.'
specifies:
  - 'The sidebar is one nav: a sticky column from 1024 px and a drawer below, with the rest of the page inert while it''s open.'
  - 'The table of contents marks the section being read, the last short ones included, and never adds history entries.'
  - 'Copy says "Copied", or says that copying failed, and headings'' anchor links stay out of the headings'' names.'
example: 'Someone scrolls to the end of a page whose last two sections are short: the table of contents marks each in turn, and Back still goes to the previous page, not to the previous heading.'
---

Documentation is read in pieces: people arrive from search at one heading, copy one command, and leave. Its layout's common mistakes are a scroll spy that fills the history with headings, a sidebar that covers the footer or traps focus, copy buttons that only appear on hover, and labels cut off with an ellipsis. This guide covers the header and search, the sidebar, the article with its code and callouts, and the table of contents, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project uses a docs framework (Docusaurus, Nextra, VitePress, Starlight, Mintlify) or has a docs layout, configure or extend it to meet this guide. Keep its APIs.
2. Prefer its search: the framework's own, DocSearch, or Pagefind.
3. Otherwise build it from plain HTML: a grid with a `<header>`, a `<nav>` for the sidebar, `<main>`, a `<nav>` for the table of contents, and a `<footer>`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The page grid

- The page scrolls, not a box inside it. The header sticks to the top, and `scroll-padding-top` on the root element, set to its height, scrolls focused elements and link targets clear of it (WCAG 2.2 2.4.11); headings need no `scroll-margin-top` of their own.
- From 1280 px, three columns: the sidebar (260 px), the content (up to 768 px, in a `minmax(0, 1fr)` column, so a wide table or code block can't widen the page), and the table of contents (220 px). From 1024 px, two: the sidebar and the content. Below 1024 px, one: the content, with the sidebar as a drawer.
- The sidebar's column and the table of contents are sticky below the header, as tall as the window minus the header, and scroll inside themselves. A fixed sidebar would cover the start of the footer, which spans the page after the content; a sticky one ends with its column.
- The header and the footer are as wide as the page (`100%`), not the viewport's width, which includes the scrollbar on Windows and makes the page scroll sideways.

## The header

- A skip link to `<main id="main" tabindex="-1">`, the logo, a `<nav>` labelled "Main" with the site's sections (Docs, API, Blog), the search button, the theme control, and the repository link. Below 1024 px, a Menu button for the drawer.
- The search button's name is its visible text ("Search docs"). It shows its shortcut as "⌘K" on Apple systems and "Ctrl K" elsewhere, with `aria-keyshortcuts="Meta+K Control+K"`.
- The theme control follows the Dark/Light Mode guide: a button with `aria-pressed` for two themes, or a radio group or a menu with light, dark, and system for three. A button that cycles through three themes doesn't say what the next press does.
- The repository link is named "GitHub"; like any link that opens a new tab, it says so ("GitHub, opens in a new tab").

## Search

- Prefer the project's existing search: the docs framework's own, DocSearch, or Pagefind. Configure it to meet this guide rather than building another.
- Otherwise: Cmd+K or Ctrl+K, or the search button, opens a modal dialog with a search field and a list of results, with the APG combobox's keys; Escape closes it, and focus returns to the button. The number of results goes to a polite status region once typing pauses. The Command Palette guide covers it in full.

## The sidebar

- One `<nav>` labelled "Docs", with lists of links. A group is a disclosure: a button with `aria-expanded` that shows its list; a closed list is `hidden`, so its links aren't in the Tab order. The Sidebar Navigation guide covers it in full.
- The current page's group is open on load, from the URL on the server, and its link has `aria-current="page"` and looks different by more than color. The current link is scrolled into view in the sidebar on load.
- Saving which other groups are open is optional; if saved, it applies before the first paint, under the app's own prefix (such as `acme.docs.groups`), or the sidebar jumps after hydration.
- Links wrap; nothing is cut off with an ellipsis. Tab moves through the links; arrow keys between them are an optional extra, as in the APG disclosure navigation example.

## The drawer on small screens

- Below 1024 px, the Menu button (`aria-expanded`, `aria-controls`) opens the same `<nav>` as a drawer over the page. There's no second copy, so no id appears twice.
- While it's open, everything else is `inert` (the Modal Dialog guide's model, without a focus-trap library), so focus and screen readers stay in it, and the page behind doesn't scroll. Focus moves to its Close button ("Close menu"); Close, Escape, a click on the backdrop, and a followed link close it, and focus returns to Menu.
- When the window crosses 1024 px, focus on an element that hides moves to the nearest control that stays: from Menu or Close to the current page's link, from the sidebar to Menu. React to a `matchMedia` change, not to resize events. The Dashboard guide's drawer snippet does all of this.

## The article

- Breadcrumbs, when the docs have levels: a `<nav aria-label="Breadcrumb">` with an ordered list, the current page last with `aria-current="page"`, and the separators hidden from screen readers.
- The page's title is its only `<h1>`. Text is 16 px at line height 1.7, at most 768 px wide; links in the text are underlined.
- Headings `<h2>` and `<h3>` have ids. A heading's anchor link comes after the heading, not inside it, so it doesn't join the heading's name; it's named after it ("Link to Installation"), and shows on focus as well as on hover.
- Callouts have a text label ("Note", "Warning", "Danger"), visible or visually hidden, besides their color and icon (WCAG 1.4.1).
- Variants of the same code (npm, pnpm, yarn) are tabs, as in the Tabs guide.
- "Last updated" is a `<time datetime>`; "Edit this page" says so when it opens a new tab. Previous and next pages are links in a `<nav aria-label="Pages">`, each with its direction and the page's title in its text.

## Code blocks

- A code block is a `<figure>`; its file name, if any, is the `<figcaption>`. A block that scrolls sideways gets `tabindex="0"`, so the keyboard can scroll it, and the page itself never scrolls sideways.
- Copy copies the code's text and reads "Copied" for a moment; the page's one status region says it too, emptied first, so a second copy is announced again. The clipboard can refuse: `navigator.clipboard.writeText` was refused in Chromium without the clipboard permission and allowed after a click in Firefox and WebKit (checked). Then Copy says so and selects the code, so the keyboard's copy shortcut works.
- Line numbers are drawn with CSS counters, or left out of what Copy copies, so screen readers and the clipboard get only the code. Highlighting happens at build time, and every token color meets 4.5:1 against the block's background.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version. The drawer is the Dashboard guide's drawer snippet, and the sidebar's groups are in the Sidebar Navigation guide.

```html
<figure class="code-block">
  <figcaption>app/layout.tsx</figcaption>
  <button type="button" class="code-copy">Copy</button>
  <!-- tabindex="0" lets the keyboard scroll a block that's wider than the column -->
  <pre tabindex="0"><code>export default function Layout({ children }) {
  return &lt;main id="main"&gt;{children}&lt;/main&gt;;
}</code></pre>
</figure>
<!-- once per page, in the page from the start -->
<p class="visually-hidden" role="status" id="page-status"></p>
```

```js
// Copy copies the code's text and reads "Copied" for a moment, and the page's status region says
// it too, emptied first so a second copy is announced again. If the clipboard refuses, it says
// so and selects the code, so the keyboard's copy shortcut works.
const status = document.getElementById('page-status');

function say(message) {
  status.textContent = '';
  setTimeout(() => { status.textContent = message; }, 100);
}
for (const button of document.querySelectorAll('.code-copy')) {
  const code = button.closest('.code-block').querySelector('code');
  let reset;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied';
      say('Copied');
    } catch {
      getSelection().selectAllChildren(code);
      say("Couldn't copy. The code is selected, so you can copy it yourself.");
    }
    clearTimeout(reset);
    reset = setTimeout(() => { button.textContent = 'Copy'; }, 2000);
  });
}
```

## The table of contents

- From 1280 px the table of contents is its own column: a `<nav>` labelled by its heading, "On this page", with links to the page's `<h2>` and `<h3>`, sticky below the header and scrolling inside itself. Below 1280 px the same list sits in a collapsed `<details>` with the summary "On this page" at the top of the content. With fewer than two headings, leave it out.
- The scroll spy marks the link of the section being read with `aria-current="true"`, and never touches the URL. Setting the URL's hash on every change adds a history entry for each heading and jumps the page, so Back walks through headings; `history.replaceState` adds none (both checked in Chromium, Firefox, and WebKit). A click on a link of the table of contents is a normal link, with one history entry.
- A heading counts once its top passes a line that follows the scroll down to 30% of the window; over the last window of scrolling, the line moves on to the bottom. A fixed band (such as an IntersectionObserver with a root margin of 60 px at the top and 70% at the bottom) misses the first heading, which starts above it, and the last headings of a page whose last sections are short, which never reach it: in a 700 px window, only the second of four headings ever entered it (checked in Chromium, Firefox, and WebKit).

```html
<nav class="toc" aria-labelledby="toc-title">
  <h2 id="toc-title">On this page</h2>
  <ul>
    <li><a href="#install">Install</a></li>
    <li>
      <a href="#configure">Configure</a>
      <ul>
        <li><a href="#options">Options</a></li>
      </ul>
    </li>
    <li><a href="#deploy">Deploy</a></li>
  </ul>
</nav>
```

```js
// Marks the table of contents' link for the section being read, and never touches the URL. A
// heading counts once its top passes a line that follows the scroll down to 30% of the window;
// over the last window of scrolling, the line moves on to the bottom, so the short sections at
// the end get their turn. At the very top, and on a page that doesn't scroll, the first counts.
const links = [...document.querySelectorAll('.toc a[href^="#"]')];
const headings = [...new Set(links.map((link) => decodeURIComponent(link.hash.slice(1))))]
  .map((id) => document.getElementById(id))
  .filter(Boolean);
let frame = 0;

function update() {
  frame = 0;
  const end = document.documentElement.scrollHeight - innerHeight;
  const start = Math.max(0, end - innerHeight);
  const top = Math.min(scrollY, innerHeight * 0.3);
  const toEnd = end > start ? Math.min(1, Math.max(0, (scrollY - start) / (end - start))) : 0;
  const line = top + (innerHeight - top) * toEnd;
  const current = headings.findLast((heading) => heading.getBoundingClientRect().top <= line) ?? headings[0];
  for (const link of links) {
    if (current && decodeURIComponent(link.hash.slice(1)) === current.id) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  }
}
const schedule = () => { frame ||= requestAnimationFrame(update); };
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
update();
```

## Route changes

- In a single-page app, a route change updates `document.title`, moves focus to the new page's `<h1>` (`tabindex="-1"`) unless the framework announces routes itself, closes the drawer, moves `aria-current`, and starts the scroll spy on the new headings.

## Versions

- A version switcher is a disclosure with links, as the Navigation Bar guide's dropdowns are. A `<select>` that navigates when its value changes changes the context on input (WCAG 3.2.2).

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The header, the sidebar's column, and the table of contents are sticky bars, and the drawer and the search dialog are modals.

## Phones and right-to-left text

- Logical properties (`inset-inline-start`, `margin-inline-end`) put the sidebar on the start side and the table of contents on the end side in right-to-left text.
- On phones with a notch, `env(safe-area-inset-top)` pads the header only when the viewport meta tag has `viewport-fit=cover`.

## Appearance

These are suggested defaults; the project's design and tokens win.

- The header is 60 px tall; the sidebar 260 px, the content up to 768 px, the table of contents 220 px; content padding 32 to 48 px, and 16 to 20 px on phones.
- Light: `#ffffff` with `#1f2937` text (14.7:1), `#6b7280` muted text (4.8:1), and `#4f46e5` for links and the current section (6.3:1); `#6366f1` is only 4.47:1. Dark: `#0a0a0a` with `#d4d4d8` text (13.4:1), `#a1a1aa` muted text (7.7:1), `#fafafa` headings (19.0:1), and `#818cf8` for links and the current section (6.6:1); `#71717a` is only 4.1:1.
- Callouts: a tinted background with a dark label, `#1d4ed8` on `#eff6ff` for a note (6.2:1), `#92400e` on `#fffbeb` for a warning (6.8:1), and `#991b1b` on `#fef2f2` for danger (7.6:1).
- Motion is optional: the drawer slides in over 300 ms, and links to headings scroll smoothly only under `prefers-reduced-motion: no-preference`; under reduce, nothing slides.

## Edge cases

- **A short page**: with fewer than two headings, the table of contents is left out and the content takes its space.
- **A long sidebar**: it scrolls inside itself, with the current link scrolled into view on load.
- **Deep nesting**: three levels at most in the sidebar; past that, split the section.
- **Printing**: hide the header's links, the sidebar, and the table of contents, and let code wrap.
- **Before the script runs**: from 1024 px the sidebar works without it; below, the drawer needs it, so keep the docs reachable without it too, such as from the docs' home page.

## Acceptance checklist

- [ ] The page starts with a skip link, and the header, the sidebar, the main area, the table of contents, and the footer are landmarks; the two navs have different names
- [ ] The page scrolls, the header sticks, scroll-padding-top keeps a focused link clear of it, and nothing scrolls sideways at 320 px wide
- [ ] From 1024 px the sidebar is a sticky column; below, Menu opens the same nav as a drawer with a Close button, and the rest of the page is inert
- [ ] Close, Escape, the backdrop, and a followed link close the drawer, focus returns to Menu, and crossing 1024 px keeps focus on something that shows
- [ ] The sidebar's groups are disclosure buttons, the current page's group is open on load, and its link has aria-current="page"
- [ ] The search button is named by its visible text and opens search with Cmd+K on Apple systems and Ctrl+K elsewhere
- [ ] From 1280 px the table of contents is a sticky column; below, a collapsed "On this page" disclosure at the top of the content; it is left out with fewer than two headings
- [ ] Scrolling marks the section being read, the last short sections included, adds no history entries, and leaves the URL alone
- [ ] Each heading's anchor link comes after the heading, is named after it, and shows on focus as well as on hover
- [ ] Copy copies the code and says "Copied", or says that copying failed and selects the code; a second copy is announced too
- [ ] A code block that scrolls sideways can be reached with Tab, and line numbers are not part of what Copy copies
- [ ] Callouts have a text label, such as "Warning", besides their color and icon
- [ ] Links in the article are underlined, and text meets 4.5:1 in both themes
- [ ] In a single-page app, a route change updates the title, moves focus to the new page's h1, and closes the drawer
- [ ] Under reduced motion nothing slides, and links to headings jump instead of scrolling smoothly
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Command Palette](/potions/components/command-palette)**: the search dialog in full, opened with Cmd or Ctrl+K.
- **[Sidebar Navigation](/potions/components/sidebar-navigation)**: the sidebar's groups in full.
- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)**: the drawer snippet, with the rest of the page inert and focus kept across 1024 px.
- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: the header's links and its dropdowns, such as a version switcher.
- **[Tabs Component](/potions/components/tabs)**: variants of the same code, such as npm, pnpm, and yarn.
- **[Dark/Light Mode Pattern](/potions/patterns/dark-light-mode)**: the theme control and a theme set before the first paint.
- **[Button](/potions/components/button)**: Copy, Menu, and the header's buttons.

These are suggestions; the layout works on its own.
