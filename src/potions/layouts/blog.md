---
layout: 'potion'
title: 'Blog Layout (List and Post)'
publicationDate: '2026-02-12'
excerpt: 'A blog''s list page and post page: post cards whose title link covers the card, an article with underlined links and code that scrolls inside itself, pagination that marks the current page, and sharing without third-party scripts.'
category: 'Layouts'
tags:
  - layouts
  - blog
  - article
  - post
  - content
  - responsive
  - sidebar
  - pagination
  - newsletter
agentManifest: 'potions/layouts/blog.json'
path: 'potions/layouts/blog'
promptSubject: 'a blog layout'
useWhen: 'a site needs a blog: a list of posts with pagination, and a post page with the article, its author and date, and related posts.'
specifies:
  - 'A post card is one link, named by its title, that covers the whole card, and a category link inside it still works.'
  - 'Links in the article are underlined, code blocks scroll inside themselves, and dates are machine-readable.'
  - 'Share links need no third-party scripts, and Copy link says whether copying worked.'
example: 'A screen reader user lists the links on the blog''s front page and hears each post''s title once, instead of each card read out as one long link.'
---

A blog has two pages, the list and the post, which share a header and a footer. On the list page, the common mistakes are cards that read as one long link and pagination that nobody can tell apart; on the post page, links lost in the text, code that pushes the page sideways, and share buttons that bring in trackers. This guide covers both pages, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has blog templates or a theme, in its CMS, its static site generator, or a library it already uses, configure or extend them to meet this guide. Keep their APIs.
2. Otherwise build them from plain HTML: `<main>`, an `<article>` for the post, an `<aside>` for the sidebar, and a `<nav>` for the pagination.
3. The colors, type, and shapes under "Appearance" are a fallback for a project without a design of its own.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The two pages

- **The list page**: the header, an optional hero with the blog's title, the post cards, an optional sidebar, the pagination, and the footer. The blog's title is the page's `<h1>`, and each card's title an `<h2>`.
- **The post page**: the header, the post in an `<article>` (its title as the page's `<h1>`, the author, the date, the reading time, and an optional image), share links, comments, related posts, and the footer. Comments and related posts are sections with an `<h2>`, and a related post's card title is an `<h3>`.
- Both pages share the header and the footer, start with a skip link to `<main id="main" tabindex="-1">`, and put an optional sidebar in an `<aside>` named by its heading.

## The header

- The site's header: a skip link, the logo, a `<nav>` labelled "Main", and the links that apply (Search, Subscribe). If it sticks, `position: sticky` and `scroll-padding-top` at its height keep focused elements clear of it (WCAG 2.2 2.4.11).
- Below 1024 px, the links move into a menu in a native `<dialog>`, as the Navigation Bar guide says.

## Post cards

- The card's title link covers the whole card, so a click anywhere follows it, while the card stays one link named by its title. Making the whole card an `<a>` would read the card's text as the link's name, and the category and author links inside it would be nested links.
- Other links in the card (a category, an author) sit above the cover, and still work (checked in Chromium, Firefox, and WebKit). The trade-off: the excerpt's text can't be selected.
- The image is decorative (`alt=""`), since the title names the link. Images in the first screen load at once, the featured one with `fetchpriority="high"`; the rest can be `loading="lazy"`. Every image has `width` and `height`.
- Titles wrap; nothing is cut off with an ellipsis. An excerpt may be clamped to two or three lines, since the post is a click away.
- The date is a `<time datetime="2026-10-01">`, and the meta line reads in a sensible order: category, date, reading time.
- The focus ring goes around the whole card, and a hover changes the shadow; under reduced motion, cards don't move.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<article class="post-card">
  <img src="/images/grid-layouts.jpg" alt="" width="640" height="360">
  <h2 class="post-card-title"><a href="/posts/grid-layouts">Grid layouts that survive real content</a></h2>
  <p>Why minmax(0, 1fr) matters, and three layouts that hold up with long words and wide tables.</p>
  <p class="post-card-meta">
    <a class="post-card-category" href="/categories/css">CSS</a>
    <time datetime="2026-10-01">1 October 2026</time>
  </p>
</article>
```

```css
/* The title's link covers the whole card, so a click anywhere on it follows the link, while the
   card stays one link named by its title. Other links in the card sit above the cover. */
.post-card {
  position: relative;
}
.post-card-title a::after {
  content: "";
  inset: 0;
  position: absolute;
}
.post-card-category {
  position: relative;
  z-index: 1;
}
/* The focus ring goes around the whole card */
.post-card-title a:focus-visible {
  outline: none;
}
.post-card-title a:focus-visible::after {
  outline: 2px solid currentColor;
  outline-offset: 4px;
}
```

## The article

- The body is 16 to 18 px with a line height of 1.6 to 1.8, at most about 70 characters a line (720 px). Headings go `<h2>` to `<h4>` in order.
- Links in the text are underlined. Without an underline, a link's color needs 3:1 against the text around it and another cue on hover and focus (WCAG 1.4.1); the safe default is the underline.
- Images have alt text that says what they show; an image with a caption is a `<figure>` with a `<figcaption>`.
- A code block scrolls sideways inside itself, never the page. A block that scrolls gets `tabindex="0"`, so the keyboard can scroll it, and sits in a `<figure>` whose caption names it, as the Documentation guide shows.
- A post has a table of contents only if it's long; the Documentation guide covers one that marks the section being read.

## The sidebar

- On the list page: categories, tags, search, and the newsletter. Search is a labelled field in a `<search>` element (or a form with `role="search"`), so it's a landmark. On the post page: the table of contents, the author's bio, and related posts.
- Sticky is optional, and only if the sidebar fits the window below the sticky header; otherwise it scrolls inside itself (`max-height` the window's height minus the header's, `overflow-y: auto`), or its end can't be reached until the page ends.
- From 1024 px it sits beside the posts, 280 to 320 px wide; below that it follows the content.

## Pagination

- A `<nav aria-label="Pagination">` with a list of links. The current page is marked with `aria-current="page"` and looks different by more than color.
- Links can't be disabled, so there's no Previous link on the first page and no Next link on the last; show nothing, or plain text.
- A page number's name includes the number it shows: "Page", visually hidden, then "2". On phones, Previous, "Page 2 of 8", and Next are enough.
- Each page has its own URL (`/blog/page/2` or `?page=2`), so pages can be shared and Back works.

## Sharing

- Share links are plain links to each site's share page (X, LinkedIn, Facebook, Mastodon), without the sites' scripts, which track readers. Each is named "Share on X", and says so when it opens a new tab.
- Copy link copies the post's canonical address, not the one with tracking parameters. It says "Link copied" on the button for a moment and in the page's one status region, which is emptied first, so a second copy is announced too. The clipboard can refuse: `navigator.clipboard.writeText` was refused in Chromium without the clipboard permission and allowed after a click in Firefox and WebKit (checked), so a failure is said too.
- `navigator.share()` opens the device's share sheet where it exists; feature-detect it, and keep the links for everyone else.

```html
<button type="button" class="copy-link">Copy link</button>
<!-- once per page, in the page from the start -->
<p class="visually-hidden" role="status" id="page-status"></p>
```

```js
// Copies the post's address and says so: on the button for a moment, and in the page's status
// region, which is emptied first, so copying again is announced again. The clipboard can refuse,
// so a failure is said too.
const button = document.querySelector('.copy-link');
const status = document.getElementById('page-status');
const label = button.textContent;
let reset;

function say(message) {
  status.textContent = '';
  setTimeout(() => { status.textContent = message; }, 100);
}
button.addEventListener('click', async () => {
  const url = document.querySelector('link[rel="canonical"]')?.href ?? location.href;
  try {
    await navigator.clipboard.writeText(url);
    button.textContent = 'Link copied';
    say('Link copied');
  } catch {
    say("Couldn't copy the link. Copy it from the address bar.");
  }
  clearTimeout(reset);
  reset = setTimeout(() => { button.textContent = label; }, 2000);
});
```

## Comments

- Comments are user content: render them as text, or as HTML sanitized on the server, never as raw HTML. The server handles spam and moderation.
- The form's fields have visible labels: name (`autocomplete="name"`), email (`type="email"`, `autocomplete="email"`), and the comment. Errors and timing follow the Form Validation Pattern, and the result goes to the status region.
- An embedded comment service loads third-party scripts and tracking; say so, and ask before adding one.

## Newsletter

- The form says what people sign up for and how often they'll hear from you. The field has a visible label, `type="email"`, and `autocomplete="email"`; the result ("Check your inbox to confirm") and errors go to the status region.

## Motion

- All motion is optional. The hero and the first cards are visible at load; they don't fade in from opacity 0, which would delay the largest image's paint.
- A scroll reveal, if any, hides only cards below the window when the script runs, on screens, when motion is allowed, as the Landing Page guide's does. Without script, under reduced motion, and when printing, nothing is hidden.
- Under `prefers-reduced-motion: reduce`, card hovers change color or shadow only.

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. A sticky header is a sticky bar, and the menu is a modal.

## Layout

- One column of cards below 768 px, two from 768 px; from 1024 px, two beside a sidebar, or three without one, since three beside a 320 px sidebar leaves cards about 240 px wide.
- The post's header can span the page's width; the body stays at its reading width.
- At 320 px wide nothing scrolls sideways.

## Appearance

- These values are a fallback for a project without a design of its own; the project's styles, tokens, and components win.
- Colors: a `#ffffff` page (or `#f8fafc`), `#0f172a` text (17.9:1 on white), `#334155` for secondary text (10.4:1), and `#475569` for muted text (7.6:1, and 7.2:1 on `#f8fafc`). Links take the text color and an underline. The accent is neutral: buttons in `#0f172a` with `#ffffff` text (17.9:1), and a `#0f172a` focus ring, 2 px at a 2 px offset. `#e2e8f0` is for dividers and card edges only; a form field's edge needs 3:1, such as `#64748b` (4.8:1).
- Type: the project's font stack; the post title `clamp(2rem, 4vw, 3.25rem)` at line height 1.15 to 1.3, card titles 18 to 22 px, the body 18 px at line height 1.7.
- Shape: cards with a 12 px radius, a `#e2e8f0` edge, and the shadow `0 1px 3px rgb(15 23 42 / 8%)`, raised to `0 8px 24px rgb(15 23 42 / 12%)` on hover; buttons and fields with an 8 px radius.
- Spacing: 48 to 72 px between sections of the list page, 40 to 64 px in the post, and 20 to 28 px inside cards.

## Edge cases

- **A post without an image**: the card keeps the same title, excerpt, and meta; leave the image's space out rather than showing an empty box.
- **A long title**: it wraps on every screen; nothing is cut off.
- **The first and last pages**: no Previous link on the first page and no Next link on the last.
- **No comments yet**: say so in a sentence, with the form below it.
- **Before the script runs**: every card is visible and every link works; only Copy link and the share sheet need the script.

## Acceptance checklist

- [ ] The list page and the post page each start with a skip link and have one h1; the post is an article, the sidebar an aside, and the pagination a nav
- [ ] A post card is one link, its title, which covers the whole card; a category or author link inside it still works, and the focus ring goes around the card
- [ ] Card images are decorative (alt="") when the title names the link; images in the first screen load at once, and every image has width and height
- [ ] Card titles wrap instead of being cut off; only an excerpt may be clamped
- [ ] Links in the article's text are underlined, and text meets 4.5:1
- [ ] A code block scrolls sideways inside itself and can be reached with Tab, and the page never scrolls sideways at 320 px wide
- [ ] Dates are time elements with a datetime attribute
- [ ] Pagination marks the current page with aria-current="page", and has no Previous link on the first page or Next link on the last
- [ ] Share links go to each site's share page without third-party scripts, and say so when they open a new tab
- [ ] Copy link copies the post's address and says so in the status region, or says that copying failed; a second copy is announced too
- [ ] Comments are rendered as text or sanitized HTML, never as raw HTML
- [ ] The newsletter and comment forms have visible labels, and their results go to the status region
- [ ] A sticky sidebar fits the window below the header, or scrolls inside itself
- [ ] Without script, under reduced motion, and when printing, nothing is hidden, and cards don't move on hover under reduced motion
- [ ] Styles come from the project's styling system and tokens; the guide's colors are only a fallback

## See also

- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: the header and its menu on small screens.
- **[Landing Page Layout (Marketing)](/potions/layouts/landing-page)**: a landing page that shares the header, the footer, and the scroll reveal.
- **[Documentation Website Layout](/potions/layouts/documentation)**: code blocks with Copy, and a table of contents that marks the section being read.
- **[Text Input Field](/potions/components/text-input)**: the search, newsletter, and comment fields.
- **[Form Validation Pattern](/potions/patterns/form-validation)**: errors and timing in the newsletter and comment forms.
- **[Button](/potions/components/button)**: Copy link, Subscribe, and the forms' buttons.

These are suggestions; the blog works on its own.
