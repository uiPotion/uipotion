---
layout: 'potion'
title: 'Toast Notifications'
publicationDate: '2026-01-24'
excerpt: 'Toasts that screen readers announce and keyboard users can reach: live regions in the page from the start, Undo that stays until dismissed, timers that pause, F8 to the newest toast, and a stack that never covers what has focus.'
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
path: 'potions/components/toast-notifications'
promptSubject: 'toast notifications'
useWhen: 'an app needs to tell people what just happened, such as a saved change or a deleted file with Undo, without interrupting them.'
specifies:
  - 'Toasts are read out through two live regions that are in the page from the start: errors assertively, the rest politely.'
  - 'Errors and toasts with an action stay until dismissed, and the other timers pause on hover, on focus, and while the page is hidden.'
  - 'F8 moves focus to the newest toast and back, and Escape dismisses only the toast that has focus.'
example: 'Someone deletes a file and hears "File deleted. Press F8 for Undo." The toast stays, F8 reaches it, and Undo brings the file back and returns focus to where they were.'
---

Toasts tell people what just happened without interrupting them. Their usual failures can't be seen: messages screen readers never hear, an Undo that's gone before a keyboard user reaches it, a stack that covers what has focus, and an Escape that closes the wrong thing. This guide covers when to use a toast, the stack and its live regions, timing, keys, and focus, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a toast or notification component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise build one stack for the app, with a small API such as `showToast({ title, description, variant, action })`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## When to use a toast

- A toast is brief news about something that just happened, often with one action: "Message sent", "File deleted" with Undo, "Link copied".
- Errors people must fix show next to what they concern, as in the Form Validation guide; anything people must read or decide before going on is a dialog.
- Repeats are grouped ("3 files deleted"), and the same message within a second or so shows once.

## The stack and its live regions

- One `<section>` named "Notifications" holds the toasts, newest last, at the bottom of the screen: at the inline end on wide screens, and as wide as the screen less 32 px on phones. A top corner would sit over the header's own controls (an account menu, a theme choice) and could hide one entirely when it has focus (2.4.11), so toasts go to the bottom on every screen. On a page with a fixed bottom bar, such as a purchase bar or a tab bar, the script measures the bar and sets `--bottom-bar-height` to its height, and the stack sits above it, so the bar's controls stay visible.
- Two live regions read the toasts out: `role="status"` (polite), and `role="alert"` for errors that need attention now; warnings and the rest are polite. Both are in the page, empty, from the start, outside the section, and never hidden: a live region inside a hidden element drops out of the accessibility tree (checked in Chromium). Neither is atomic (`aria-atomic="false"`): both roles are atomic unless told otherwise, and an atomic region is read out whole each time a message is added, the earlier ones still in it included. Each toast's words go into one of them, and go when the toast goes; the toasts themselves aren't in a live region, so nothing is nested.
- At most three toasts show at once, one on phones. The rest wait, and show in order when there's room, read out as they show. When the screen narrows, the toasts already showing stay and new ones wait; when it widens, waiting toasts fill the free places in order.
- Layers: toasts sit above sticky bars and dropdowns and below modals, in the project's layer scale. While a modal is open, the page behind it is inert, toasts and their live regions included, so the result of the modal's task shows in the modal (the Modal Dialog guide's status message) or after it closes.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<!-- At the end of <body>. The section shows the toasts; the two live regions read them out.
     Both regions are in the page, empty, from the start and are never hidden: one polite, one
     for errors that need attention now. Neither is atomic, so a new message is read out alone. -->
<section class="toasts" aria-label="Notifications" aria-keyshortcuts="F8" hidden>
  <ol></ol>
</section>
<div class="visually-hidden" role="status" aria-atomic="false" id="toast-status"></div>
<div class="visually-hidden" role="alert" aria-atomic="false" id="toast-alert"></div>
```

```css
/* At the bottom of every screen, so toasts never cover the header's controls, and above a fixed
   bottom bar, whose height the script measures. The project's layer for toasts puts them above
   sticky bars and dropdowns, and below modals. */
.toasts {
  inline-size: min(380px, calc(100% - 32px));
  inset-block-end: calc(16px + var(--bottom-bar-height, 0px));
  inset-inline-end: 16px;
  position: fixed;
  z-index: var(--layer-toasts);
}
.toasts ol {
  display: grid;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.toast {
  align-items: center;
  background: var(--toast-surface);
  border: 1px solid var(--toast-border);
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
}
.toast p {
  flex: 1 1 12rem;
  margin: 0;
}
/* Only F8 focuses a toast, so the ring shows on :focus */
.toast:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
.toast button {
  min-block-size: 32px;
  min-inline-size: 32px;
}
/* On whatever scrolls the page (here :root; in an app shell, its scroll container): the end of
   the content has room for a fixed bottom bar and the stack, and a focused element scrolls clear
   of both. Where the project already keeps room for its bar, count it once. The script keeps both
   heights up to date. */
:root {
  padding-block-end: calc(var(--bottom-bar-height, 0px) + var(--toast-stack-height, 0px));
  scroll-padding-block-end: calc(var(--bottom-bar-height, 0px) + var(--toast-stack-height, 0px));
}
@media (prefers-reduced-motion: no-preference) {
  .toast {
    animation: toast-in 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}
@keyframes toast-in {
  from {
    opacity: 0;
    translate: 0 8px;
  }
}
```

```js
// showToast({ title, description, variant, action: { label, onSelect }, duration }). Errors and
// toasts with an action stay until they're dismissed; the others leave after `duration` (see the
// timers). At most three show, one on phones; the rest wait in order, and are read out when they
// show. Toasts already showing stay when the screen narrows.
const region = document.querySelector('.toasts');
const list = region.querySelector('ol');
const politeRegion = document.getElementById('toast-status');
const alertRegion = document.getElementById('toast-alert');
const fallbackFocus = document.querySelector('main'); // tabindex="-1", as the skip link's target
const timers = new Map(); // toast → { remaining, started, id }
const messages = new Map(); // toast → its text in a live region
const waiting = [];
const wide = matchMedia('(min-width: 48rem)');
let returnTo = null; // where focus was before it entered the stack

function showToast(toast) {
  waiting.push(toast);
  fill();
}

// Shows waiting toasts, in order, while there's room
function fill() {
  while (waiting.length && list.children.length < (wide.matches ? 3 : 1)) add(waiting.shift());
}
wide.addEventListener('change', fill);

function add(toast) {
  const item = Object.assign(document.createElement('li'), { className: `toast toast-${toast.variant ?? 'info'}`, tabIndex: -1 });
  const text = Object.assign(document.createElement('p'), { textContent: [toast.title, toast.description].filter(Boolean).join(' ') });
  item.append(text);
  if (toast.action) item.append(button(toast.action.label, () => { toast.action.onSelect(); dismiss(item); }));
  item.append(button('Dismiss', () => dismiss(item)));
  list.append(item);
  region.hidden = false;
  // Errors go to the alert region, the rest to the polite one; an action says how to reach it
  const message = Object.assign(document.createElement('p'), { textContent: toast.action ? `${text.textContent} Press F8 for ${toast.action.label}.` : text.textContent });
  (toast.variant === 'error' ? alertRegion : politeRegion).append(message);
  messages.set(item, message);
  if (toast.action || toast.variant === 'error') return;
  timers.set(item, { remaining: toast.duration ?? 5000, id: null });
  update();
}

function button(label, onClick) {
  const element = Object.assign(document.createElement('button'), { type: 'button', textContent: label });
  element.addEventListener('click', onClick);
  return element;
}

// Focus goes back to where it came from, or to the main content when that can't take it (it was
// removed, disabled, hidden, or made inert)
function restoreFocus() {
  returnTo?.focus();
  if (document.activeElement !== returnTo) fallbackFocus?.focus();
}

function dismiss(item) {
  // Focus goes to the newest other toast, or back to where it came from
  if (item.contains(document.activeElement)) {
    const next = [...list.children].filter((other) => other !== item).at(-1);
    if (next) next.focus();
    else restoreFocus();
  }
  clearTimeout(timers.get(item)?.id);
  timers.delete(item);
  messages.get(item).remove();
  messages.delete(item);
  item.remove();
  region.hidden = list.children.length === 0;
  fill();
  update();
}
```

## Timing

- Errors and toasts with an action stay until they're dismissed: an Undo that disappears before a keyboard or screen reader user reaches it fails 2.2.1. The others leave after about 5 seconds (4 to 6 suggested, longer for longer text).
- The timers pause while the pointer is over the stack, while focus is in it, and while the page is hidden, and go on with the time that was left.
- Dismissing a toast is silent; it just goes.

## Keys and focus

- Showing a toast never moves focus.
- F8 moves focus to the newest toast, and F8 again returns it. The section has `aria-keyshortcuts="F8"`, and the read-out of a toast with an action ends with the way to it ("Press F8 for Undo"). Radix uses F8; on many Mac keyboards it needs Fn. A shortcut the project already has for this wins.
- In a toast, Tab moves between its buttons and Escape dismisses it. Escape anywhere else is left to dialogs and menus.
- When a toast with focus goes, focus moves to the newest other toast, or back to where it was before it entered the stack, by F8, Tab, or a click; F8 back does the same. When that element is gone or can't take focus (removed, disabled, hidden, or made inert), focus goes to the main content: `<main>` with `tabindex="-1"`, the skip link's target. The script checks that focus really moved.
- Each toast has a Dismiss button (an icon button named "Dismiss"), and its action is a button named by its visible text ("Undo").

The timers and the keys, which go with the stack's script:

```js
// The timers pause while the stack is hovered or has focus, or the page is hidden, and go on with
// the time that was left. F8 moves focus to the newest toast and back, and Escape dismisses the
// toast that has focus. Goes with the stack's script.
let hovered = false;
const paused = () => hovered || region.contains(document.activeElement) || document.hidden;

// Starts or pauses every timer at once, keeping the time each toast has left
function update() {
  for (const [item, timer] of timers) {
    if (paused() && timer.id) {
      clearTimeout(timer.id);
      timer.id = null;
      timer.remaining -= Date.now() - timer.started;
    } else if (!paused() && !timer.id) {
      timer.started = Date.now();
      timer.id = setTimeout(() => dismiss(item), timer.remaining);
    }
  }
}

region.addEventListener('pointerenter', () => { hovered = true; update(); });
region.addEventListener('pointerleave', () => { hovered = false; update(); });
// However focus enters the stack (F8, Tab, a click), remember where it came from
region.addEventListener('focusin', (event) => {
  if (!region.contains(event.relatedTarget)) returnTo = event.relatedTarget;
  update();
});
region.addEventListener('focusout', (event) => { if (!region.contains(event.relatedTarget)) update(); });
document.addEventListener('visibilitychange', update);
document.addEventListener('keydown', (event) => {
  if (event.key === 'F8' && region.contains(document.activeElement)) {
    restoreFocus();
  } else if (event.key === 'F8' && list.lastElementChild) {
    list.lastElementChild.focus();
  } else if (event.key === 'Escape' && region.contains(event.target)) {
    dismiss(event.target.closest('.toast'));
  } else {
    return;
  }
  event.preventDefault();
});
// A fixed bottom bar, in the page from the start (several things fixed at the bottom go in one)
const bottomBar = document.querySelector('.bottom-bar');

// Scroll padding acts only when something scrolls, so when the stack or the bar appears or
// changes, or the viewport shrinks, over the focused element, that element scrolls clear of both
function keepFocusClear() {
  const focused = document.activeElement;
  if (region.hidden || !focused || focused === document.body || region.contains(focused) || bottomBar?.contains(focused)) return;
  const a = focused.getBoundingClientRect();
  const covers = (b) => a.bottom > b.top && a.top < b.bottom && a.right > b.left && a.left < b.right;
  if ([region, bottomBar].some((element) => element && covers(element.getBoundingClientRect()))) focused.scrollIntoView({ block: 'nearest' });
}
// The stack's height, with its 16 px gap and 8 px for a focus ring, for the padding
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--toast-stack-height', `${region.hidden ? 0 : region.offsetHeight + 24}px`);
  keepFocusClear();
}).observe(region);
addEventListener('resize', keepFocusClear);
visualViewport?.addEventListener('resize', keepFocusClear);
// The bar's height (its border box, so padding counts) keeps the stack above it, and when the bar
// appears, hides, or changes, focus scrolls clear
if (bottomBar) new ResizeObserver(() => {
  document.documentElement.style.setProperty('--bottom-bar-height', `${bottomBar.offsetHeight}px`);
  keepFocusClear();
}).observe(bottomBar, { box: 'border-box' });
```

## Phones and focus

- On phones, toasts sit at the bottom, one at a time, and their buttons are at least 44 px.
- Whatever scrolls the page gets a `padding-bottom` and a `scroll-padding-bottom` of a fixed bottom bar's height plus, while toasts show, the stack's height and room for a focus ring. That's `:root` usually; in an app whose page scrolls inside a container, it's that container, with `box-sizing: border-box`, since otherwise the padding makes a `height: 100%` container taller than the screen and nothing scrolls (checked). An element that gets focus then scrolls clear of the bar and the stack, and even a short page has room at the end to scroll its last element clear (checked). Where the project already keeps room for its bar at the end of the content, count it once.
- Scroll padding acts only when something scrolls, so when a toast appears, the stack grows, the bar changes, or the viewport shrinks (the window, or an on-screen keyboard), and the stack or the bar comes over the element that already has focus, the script scrolls that element clear of both (checked in Chromium, Firefox, and WebKit, in the page and in an app's scroll container). Focus inside the stack or the bar stays put.
- The script measures the bar (`.bottom-bar`, the project's own selector) with a `ResizeObserver` on its border box, so padding counts: when the bar appears, hides (with `hidden`), or changes height, as when its text wraps or its padding makes room for a phone's home indicator, the stack moves above it, and the focused element scrolls clear of the stack and the bar, even when the bar grows past where the stack was (checked). The bar is in the page from the start, and several things fixed at the bottom, such as a tab bar and a cookie banner, go in one fixed container, which is what the script measures.
- This covers the page scrolling, an app's scroll container, a fixed bottom bar, and changes of the viewport's size.
- Swiping a toast away is optional; its Dismiss button does the same with a tap (2.5.7).

## Motion

- Motion is optional: a toast slides in over 250 ms and fades out over 200 ms. When one leaves, its wrapper's height collapses at the same time, so the others move into place without a jump. The snippet shows only the entrance.
- Under `prefers-reduced-motion: reduce`, toasts appear and leave without moving; a short fade is fine.
- A countdown bar is optional. It animates `transform: scaleX()`, not `width`, and pauses with the timer.

## Appearance

These are suggested defaults; the project's design and tokens win.

- Toasts 380 px wide (the screen less 32 px on phones), 12 to 16 px of padding, a 10 px radius, and 12 px apart.
- Each variant has words and an icon, not only a color. Text meets 4.5:1 and icons 3:1 against the toast: on light tints, use the darkest shades for text (`#14532d` on `#f0fdf4` is 8.7:1) and a dark shade for icons (`#15803d`, 4.8:1), since green-600 text on a green tint is only 3.0 to 3.2:1. Check the project's own colors in both themes.

## Edge cases

- Long text wraps; it's never cut off with an ellipsis.
- Many toasts at once: three show, the rest wait in order, and the same message within a second or so shows once.
- An action that fails, such as an Undo after the item is gone for good, shows its own error toast.
- Toasts can be cleared when the page changes; errors stay.
- Offline: one toast that stays while the connection is down, then a brief "Back online".

## Acceptance checklist

- [ ] Toasts are for brief news about something that just happened; errors people must fix show next to what they concern, and anything they must read before going on is a dialog
- [ ] Two live regions, neither atomic, are in the page, empty, from the start and are never hidden: errors go to the alert region, everything else to the polite one
- [ ] Each toast is read out once, its title and description together; a toast that waits for room is read out when it shows
- [ ] Errors and toasts with an action stay until they're dismissed; the others leave after about 5 seconds
- [ ] Timers pause while the stack is hovered or has focus, or the page is hidden, and go on with the time that was left
- [ ] Showing a toast never moves focus
- [ ] F8 moves focus to the newest toast and back, and the read-out of a toast with an action says so
- [ ] Escape dismisses the toast that has focus and does nothing elsewhere
- [ ] When a toast with focus goes, focus moves to the newest other toast, or back to where it was before it entered the stack, or to the main content when that element is gone or can't take focus
- [ ] Every toast has a Dismiss button, and an action button named by its visible text
- [ ] Toasts stack at the bottom, at most three at once (one on phones); the rest wait and show in order when there's room, and the toasts already showing stay when the screen narrows
- [ ] While toasts show, neither the stack nor a fixed bottom bar hides the focused element, in the page or an app's scroll container: it scrolls clear of both when it gets focus, when a toast appears, when the viewport shrinks, and when the bar appears or changes height, with room at the end of the content for both; the stack sits above the bar and never covers the header
- [ ] While a modal is open, the result of its task shows in the modal, since the page outside is inert
- [ ] Long text wraps and is never cut off; text meets 4.5:1 and icons 3:1, and each variant has words and an icon, not only a color
- [ ] Under reduced motion, toasts appear and leave without moving
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Modal Dialog](/potions/components/dialog)**: toasts sit below an open modal, and its task's results show in it.
- **[Button](/potions/components/button)**: the action and Dismiss buttons.
- **[Form Validation Pattern - UX and Timing Strategies](/potions/patterns/form-validation)**: errors people must fix show by their fields, not in toasts.

These are suggestions; toasts work on their own.
