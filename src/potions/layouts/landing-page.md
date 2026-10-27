---
layout: 'potion'
title: 'Landing Page Layout (Marketing)'
publicationDate: '2026-01-24'
excerpt: 'A marketing page from the header to the footer: a header that sticks with CSS alone and turns solid as the page scrolls, calls to action that are links, social proof from the user''s real content, and motion that never leaves a section hidden.'
category: 'Layouts'
tags:
  - layouts
  - landing-page
  - marketing
  - hero
  - feature-highlights
  - testimonials
  - cta
  - responsive
  - a11y
agentManifest: 'potions/layouts/landing-page.json'
path: 'potions/layouts/landing-page'
promptSubject: 'a marketing landing page'
useWhen: 'a product, a launch, or a campaign needs a page that explains the offer and leads to one action, such as signing up or booking a demo.'
specifies:
  - 'The header sticks with CSS alone and can turn solid once the page scrolls, and a focused link is never left under it.'
  - 'Calls to action are links named by their visible text, and testimonials, logos, and numbers come from the user''s real content.'
  - 'Sections fade in only when motion is allowed, and none stays hidden without the script, when printing, or when it is taller than the window.'
example: 'A keyboard user tabs from the hero''s "Start free trial" down the page: each section shows as soon as focus reaches it, and no focused link ever sits under the header.'
---

A landing page explains an offer and leads to one action. Its common mistakes are about trust and access: invented testimonials, calls to action whose names don't match their text, a sticky header over the focused link, and entrance animations that leave sections blank. This guide covers the page from the header to the footer, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a header, sections, cards, or buttons, in its design system or a library it already uses, configure or extend them to meet this guide. Keep their APIs.
2. Otherwise build it from plain HTML: a `<header>`, a `<main>` with a `<section>` for each part, and a `<footer>`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Content

- The page uses the user's real copy, testimonials, client logos, and numbers. Where the task doesn't give them, use placeholders that look like placeholders, such as "[Customer quote]" and "[Name, role, company]", and ask for the real ones.
- Never invent testimonials, customer names, logos, ratings, or statistics. Invented social proof misleads visitors, and fake reviews and testimonials are against consumer protection rules in the US and the EU.

## Structure

- The page is a `<header>`, a `<main>`, and a `<footer>`. In `<main>`, each part is a `<section>` named by its heading (`aria-labelledby`): the hero, the features, social proof, an optional pricing section, and a closing call to action.
- The hero's headline is the page's only `<h1>`; each section has an `<h2>`, and cards inside a section have `<h3>` titles.
- The page itself scrolls; no section scrolls on its own.

## The header

- The header starts with a skip link, "Skip to content", shown while it has focus and going to `<main id="main" tabindex="-1">` (WCAG 2.4.1). Then the logo, a link to the home page named with the site's name, a `<nav>` labelled "Main", and one call to action.
- `position: sticky; top: 0` keeps the header at the top without a script and keeps its space in the page. A fixed header takes no space, so the page would need padding that matches its height. `scroll-padding-top` on the root element, set to the header's height, scrolls focused elements and in-page link targets clear of it (WCAG 2.2 2.4.11).
- Optional: the header starts transparent over the hero and turns solid once the page has scrolled past a threshold. The hero is pulled up under the header by the header's height. An `IntersectionObserver` on a sentinel at the top of the page, as tall as the threshold, switches it, with no scroll listener. At exactly the threshold, the sentinel's edge still touches the window, so the header turns solid one pixel later (checked in Chromium, Firefox, and WebKit). Without script, the header stays solid.
- The header's text meets 4.5:1 in both states: in the transparent state against the hero behind it, the lightest part of a hero image included.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version. The header's links, dropdowns, and menu are in the Navigation Bar guide.

```html
<!-- The sentinel is as tall as the distance the page scrolls before the bar turns solid -->
<div class="scroll-sentinel" aria-hidden="true"></div>
<header class="site-header">
  <a class="skip-link" href="#main">Skip to content</a>
  <a class="logo" href="/">Acme</a>
  <!-- the site's <nav> (the Navigation Bar guide) and the call to action -->
</header>
<main id="main" tabindex="-1">
  <section class="hero" aria-labelledby="hero-title">
    <h1 id="hero-title">Reports your whole team reads</h1>
    <!-- the subtitle, the calls to action, the product image -->
  </section>
  <!-- the other sections -->
</main>
```

```css
/* The bar sticks with CSS alone and keeps its space. The hero is pulled up under it, so the bar
   can start transparent over the hero, and the page scrolls focused elements and link targets
   clear of it. */
:root {
  --site-header-height: 64px;
}
html {
  scroll-padding-top: var(--site-header-height);
}
.site-header {
  background: var(--surface);
  min-height: var(--site-header-height);
  position: sticky;
  top: 0;
  transition: background-color 300ms;
  z-index: 10; /* the sticky-bar layer of the project's scale */
}
.site-header.is-transparent {
  background: transparent; /* its text meets 4.5:1 against the hero behind it */
}
.hero {
  margin-top: calc(-1 * var(--site-header-height));
  padding-top: calc(var(--site-header-height) + 48px);
}
.scroll-sentinel {
  height: 48px; /* the bar turns solid after 48 px of scrolling */
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 1px;
}
@media (prefers-reduced-motion: reduce) {
  .site-header {
    transition: none;
  }
}
```

```js
// The bar is transparent while the sentinel at the top of the page is in view, and solid once
// the page has scrolled past it. An IntersectionObserver switches it, so nothing runs while the
// page scrolls; without script, the bar stays solid.
const header = document.querySelector('.site-header');
new IntersectionObserver(([entry]) => {
  header.classList.toggle('is-transparent', entry.isIntersecting);
}).observe(document.querySelector('.scroll-sentinel'));
```

## The menu on small screens

- Below 1024 px, the links move into a menu opened by a Menu button, and from 1024 px the header shows them: one switch, as in the Navigation Bar guide.
- The menu is a native `<dialog>` opened with `showModal()` and named "Main menu", so the rest of the page is inert, Escape closes it, and focus returns to Menu. It has a visible Close button ("Close menu"), and closes when a link in it is followed.
- A click on the backdrop closes it as in the Modal Dialog guide: the `<dialog>` has no padding of its own (an inner wrapper has it), so only the backdrop makes the dialog the click's target, and the press has to start on the backdrop too. A rule that checks only the target also closes the menu on a click on its padding, and on a drag from inside it onto the backdrop (checked in Chromium, Firefox, and WebKit).
- Menu and Close are at least 44 px square on touch screens.

## Calls to action

- A call to action that goes to a page (sign up, book a demo, see pricing) is a link (`<a href>`). A button is only for an action on this page, such as opening a dialog.
- Its visible text says where it goes ("Start free trial", "Book a demo"), and nothing replaces that text as its name: an `aria-label` that differs from the visible text fails WCAG 2.5.3, since voice control users say what they see. Where two calls to action read the same but go to different places, add visually hidden words after the visible text ("Get started", then hidden "with Professional").
- One primary call to action per section; the secondary one is outlined or a text link.

## The hero

- The headline, a short subheadline, the calls to action, and a product image or video. On phones they stack in that order; from 1024 px, text and media sit side by side.
- The headline and the image are visible at load. They're usually the Largest Contentful Paint, so they don't fade in from opacity 0.
- The hero image is never lazy-loaded and gets `fetchpriority="high"`. Every image gets `width` and `height`, so nothing shifts while images load, and `srcset` with `sizes` when it comes in several widths.
- Text over an image gets an overlay or a scrim that keeps it at 4.5:1, checked over the lightest part of the image.
- A background video is muted and `playsinline`, has a visible pause button (WCAG 2.2.2), and doesn't play on its own under `prefers-reduced-motion: reduce`, where its poster image shows. A demo video with speech has captions.

## Features

- A grid from CSS alone, such as `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))`, or one, two, and three columns at 768 and 1024 px. It needs no resize handler.
- Each card has a decorative icon (`aria-hidden="true"`), an `<h3>`, and a short description.
- More than six features: a second row, not a carousel or tabs. A carousel hides features behind controls, and one that turns on its own needs a pause button (WCAG 2.2.2).

## Social proof

- A testimonial is a `<figure>` with the quote in a `<blockquote>` and the name, role, and company in a `<figcaption>`. The name isn't a heading. An avatar beside the name is decorative (`alt=""`), or the name is read twice.
- Client logos are a list of images, each named after its company ("Acme"), not "logo".
- Numbers (customers, uptime, ratings) come from the user, with their source; they're claims like any other.
- With no testimonials yet, leave the section out, or show a logo list; never fill it with invented quotes.

## Email signup

- Optional, in the hero or the closing section. The field has a visible label, not just a placeholder, `type="email"`, and `autocomplete="email"`; the text says what people sign up for and how often they'll hear from you.
- Its result ("Check your inbox to confirm") and its errors go to one polite status region that's in the page from the start; a field error goes in the field's description, as the Form Validation Pattern says.

## Motion

- All motion is optional. The scroll reveal fades sections in as they reach the window. It hides only what it can show again: sections still below the window once the page has loaded and the browser has restored its scroll position, on screens, when motion is allowed. After a reload or Back, WebKit restores the position only after the load event, so a section hidden earlier blinks out and fades back in (checked). Without script, under reduced motion, and when printing, nothing is hidden.
- It observes with threshold 0 and no root margin. A threshold is a share of the section, so with 0.1 a section taller than ten windows never shows, and a root shrunk at the bottom never meets a short last section at the end of the page (both checked in Chromium, Firefox, and WebKit). Focus in a section shows it at once: a waiting section skips the fade, which would start it at opacity 0, and a fade that's under way ends, through `transition: none` on the section while it has focus. That rule covers every section, not only fading ones, so a transition the project gives the section doesn't fade it in either, and it has to win over that transition. It has to be `none`: only a property that leaves `transition-property` cancels its running transition, and a zero duration leaves the fade running (checked in Chromium, Firefox, and WebKit).
- The hero never fades in, since it holds the largest paint.
- Smooth scrolling for in-page links goes in `@media (prefers-reduced-motion: no-preference)`. Turn each animation off where it's defined, rather than with one rule for every element: a reset that removes all animations leaves keyframe-based reveals stuck on their first frame.
- A hover lift on cards and buttons is optional; under reduced motion, use a color change instead.

```css
/* Sections fade in as they scroll into view: only on screens, and only when motion is allowed.
   The script marks the sections it hides (.is-waiting); without it, nothing is hidden. */
@media screen and (prefers-reduced-motion: no-preference) {
  .reveal.is-waiting {
    opacity: 0;
    translate: 0 16px;
  }
  .reveal.is-fading-in {
    transition: opacity 600ms ease-out, translate 600ms ease-out;
  }
  /* Focus in a section shows it at once, over this fade or any transition the project gives the
     section. "none", not a shorter duration: only a property that leaves transition-property
     cancels its running transition. It comes last, to win over .is-fading-in. */
  .reveal:focus-within {
    transition: none;
  }
}
```

```js
// Hides only what it can show again: sections still below the window once the page has loaded
// and the browser has restored its scroll position (WebKit does that after the load event), so
// nothing in view ever disappears. Threshold 0 and no root margin, so a section taller than the
// window, and a short one at the very end of the page, still show. Focus shows a waiting
// section at once; the CSS ends a fade that's under way.
function setUp() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.replace('is-waiting', 'is-fading-in');
      observer.unobserve(entry.target);
    }
  });
  for (const section of document.querySelectorAll('.reveal')) {
    if (section.getBoundingClientRect().top < innerHeight) continue; // in view, or above it
    section.classList.add('is-waiting');
    observer.observe(section);
  }
}
document.addEventListener('focusin', (event) => event.target.closest('.reveal')?.classList.remove('is-waiting'));
if ('IntersectionObserver' in window) {
  const later = () => requestAnimationFrame(() => requestAnimationFrame(setUp));
  if (document.readyState === 'complete') later();
  else addEventListener('load', later, { once: true });
}
```

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The header is a sticky bar, and the menu is a modal.

## Small screens and overflow

- At 320 px wide nothing scrolls sideways, and long headlines wrap (`overflow-wrap: break-word`).
- Don't hide overflow on sections. `overflow-x: hidden` makes the other axis compute to `auto`, so the section becomes a scroll container, and a sticky element inside it sticks to the section instead of the page (checked in Chromium, Firefox, and WebKit). Fix what overflows; if something has to be cut, `overflow-x: clip` doesn't make a scroll container.
- On phones with a notch, `env(safe-area-inset-top)` pads the header only when the viewport meta tag has `viewport-fit=cover`; without it, the values are 0.

## Appearance

These are suggested defaults; the project's design and tokens win.

- Content up to 1200 px wide, centered; section padding 96 px from 1024 px and 48 px on phones; grid gaps 32 px and 24 px.
- The headline 48 to 64 px from 1024 px and 32 to 40 px on phones, line height 1.1 to 1.2; section headings 32 to 40 px; body text 16 to 18 px at line height 1.5.
- Calls to action at least 24 px tall, 44 px suggested, with a 2 px focus outline at a 2 px offset.
- Colors: headings `#111827` (17.7:1 on white), body text `#374151` (10.3:1), muted text `#4b5563` (7.6:1, and 7.2:1 on a `#f9fafb` section). A primary call to action with white text needs `#2563eb` (5.2:1); `#3b82f6` is only 3.7:1, and a green one needs `#047857` (5.5:1), since `#10b981` is 2.5:1. The footer's text on `#f9fafb` is `#4b5563`; `#6b7280` on `#f5f5f5` is only 4.4:1.

## Edge cases

- **No testimonials yet**: leave the section out, or show a list of client logos; never invent them.
- **Many features**: a second row of cards, not a carousel.
- **A long headline**: it wraps on phones; shorten it before making the text smaller than 32 px.
- **Before the script runs**: every section is visible and the header is solid. Below 1024 px the menu needs the script, so keep the main pages reachable without it too, such as from the footer.
- **A pricing section**: the Pricing Table guide covers the billing choice and the plans.

## Acceptance checklist

- [ ] The page starts with a skip link to the main area, and has one h1, the hero's headline, with an h2 for each section
- [ ] The header sticks with CSS alone, and a link focused under it, or a section reached by an in-page link, is scrolled clear of it (scroll-padding-top at its height)
- [ ] A header that starts transparent over the hero turns solid once the page has scrolled past the threshold, stays solid without script, and its text meets 4.5:1 in both states
- [ ] Below 1024 px, a Menu button opens the links in a native dialog named "Main menu"; Close, Escape, a click that starts and ends on the backdrop, and a followed link close it, and focus returns to Menu
- [ ] Calls to action that go to a page are links, and each one's accessible name starts with its visible text
- [ ] Testimonials, logos, and numbers are the user's real content, or placeholders marked as such; nothing is invented
- [ ] Testimonials are figures with a blockquote and a figcaption; an avatar beside its name has empty alt text, and logos are named after their company
- [ ] The hero's headline and image are visible at load; the hero image has fetchpriority="high", and every image has width and height
- [ ] A background video has a visible pause button and doesn't play on its own under reduced motion; a video with speech has captions
- [ ] Without script, under reduced motion, and when printing, every section is visible; with the scroll reveal, nothing in view is ever hidden, after a reload or Back included, a section fades in once any part of it scrolls into view, and focus shows it at once, mid-fade included
- [ ] The grids come from CSS alone, nothing scrolls sideways at 320 px wide, and no section hides its overflow
- [ ] An email signup has a visible label, type="email" with autocomplete="email", and gives its result in the status region
- [ ] Text meets 4.5:1 and focus indicators 3:1 against every section's background, text over images included
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: the header in full, with its dropdowns and the menu on small screens.
- **[Pricing Table](/potions/features/pricing-table)**: a pricing section with a billing choice.
- **[Button](/potions/components/button)**: the calls to action's styles and states.
- **[Form Validation Pattern](/potions/patterns/form-validation)**: the email signup's errors and timing.
- **[Blog Layout (List and Post)](/potions/layouts/blog)**: a blog that shares the header and the footer.

These are suggestions; the page works on its own.
