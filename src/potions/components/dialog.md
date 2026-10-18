---
layout: 'potion'
title: 'Modal Dialog'
publicationDate: '2026-01-11'
excerpt: 'An accessible modal dialog for confirmations and short tasks, built on the project''s dialog component or the native dialog element: focus that moves in and comes back, Escape and backdrop rules, a busy state that survives a failed action, and a full-screen layout on phones.'
category: 'Components'
tags:
  - components
  - modal
  - dialog
  - overlay
  - focus-management
  - a11y
  - wcag
  - aria
agentManifest: 'potions/components/dialog.json'
path: 'potions/components/dialog'
promptSubject: 'modal dialogs'
useWhen: 'you need someone to confirm a choice or finish a short task, such as a delete confirmation or a small form, without leaving the page.'
specifies:
  - 'Focus moves into the dialog when it opens and returns to the element that opened it, however it closes.'
  - 'Escape closes it, and so can a backdrop click, unless the dialog is marked non-dismissible.'
  - 'If the primary action fails, the dialog stays open and its buttons work again, so the user can retry.'
example: 'Someone clicks Delete project, then changes their mind and presses Escape. The dialog closes, and focus is back on Delete project.'
---

A modal dialog stops the page for a decision or a short task, then returns people to where they were. This guide builds on the dialog your project already has, or on the browser's native `<dialog>`, and targets WCAG 2.2 AA.

## When to use something else

- Information that needs no answer: show it in the page, or as a toast.
- A long or multi-step task: give it its own page.
- A short list of choices: use a menu or a popover.

## Start from what the project has

1. If the project has a dialog or modal component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise use native `<dialog>` and open it with `showModal()`. The browser draws it in the top layer with its own backdrop (`::backdrop`), and makes the rest of the page inert, so nothing behind it can be clicked or focused. Don't show a modal with the `open` attribute or `show()`: they give a non-modal dialog without a backdrop or an inert page.
3. Only if neither fits, build one from a container element (see "Without native dialog").

Implement only the options the task needs, and add no dependency, such as a focus-trap or scroll-lock library, without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Structure

- **Trigger**: the control that opens the dialog.
- **Title**: a visible heading that names the dialog (`aria-labelledby`).
- **Description** (optional): one short plain-text message, as in a confirmation (`aria-describedby`). Leave it out when the body holds a form or longer content, which a screen reader would read in full on open.
- **Body**: the content. It scrolls inside the dialog when it's long.
- **Status message**: an element with `role="status"`, present from the moment the dialog opens, for busy and error text.
- **Actions**: Cancel and the primary action, named for what it does ("Delete project", not "OK").
- **Close button** (optional): an icon button with an accessible name such as "Close".

Every dialog has a visible Cancel or Close button, because touch and screen reader users may have no Escape key. Use `role="alertdialog"` for an urgent decision, such as confirming a deletion. Native `<dialog>` is already a dialog; add `aria-modal="true"` only to a dialog that isn't native. On the trigger, `aria-haspopup="dialog"` is optional (never `"true"`, which announces a menu), and `aria-expanded` is rarely useful for a modal.

## Opening and focus

When the dialog opens, focus moves to:

- the least destructive action, usually Cancel, in confirmations and alert dialogs
- the first field in a form
- the title or the top of the content (`tabindex="-1"`) when the content is long or should be read first
- otherwise the first focusable element

With native `<dialog>`, put `autofocus` on that element. While the dialog is open, Tab and Shift+Tab move through its controls and never reach the page behind it. (With native `<dialog>`, they can also reach the browser's own controls.) Every control shows a visible focus indicator with at least 3:1 contrast.

## Closing

- **Escape** closes a dismissible dialog that isn't busy. Escape, and the back gesture on Android, sends a close request: native `<dialog>` fires `cancel`, then `close`. To keep a dialog open that isn't dismissible, call `preventDefault()` on `cancel`. Browsers may still close it on a repeated request without other user interaction, so treat every close as the safe choice, Cancel, never as a confirmation.
- **Cancel and Close** always close it, except while the primary action runs (see below).
- **A backdrop click** closes a dismissible dialog when `closeOnBackdropClick` is on, and only when the press also started on the backdrop. A text selection dragged from inside the dialog onto the backdrop ends in a click on the dialog, and must not close it. Give the native `<dialog>` no padding of its own, so only a backdrop click targets it. Where the browser supports it, `closedby="any"` does this natively; keep the script for the others. Turn backdrop closing off for alert dialogs, and for forms with typed input.

After every close, focus returns to the trigger; native `<dialog>` does this itself. If the trigger is gone, for example because Delete removed its row, move focus to a sensible place nearby: the next item, the list, or its heading with `tabindex="-1"`. Never leave focus on the page body. If the list updates only after the dialog has closed, move focus when it updates.

## The primary action

- While it runs, the dialog stays open, and the status message says what's happening ("Deleting…"). The actions get `aria-disabled="true"` and ignore activation. Don't use the `disabled` attribute, which drops focus from the button to the page.
- On success, the dialog closes.
- On failure, it stays open, the status message shows the error, and the actions work again with focus still on the primary action, so the person can retry or cancel.
- Give the request a time limit, for example 30 seconds (`AbortSignal.timeout()` with `fetch`). When it runs out, show an error that says so, and make the actions work again, so the person can retry or cancel. Tell a timeout from other failures by the signal's reason (`signal.reason.name` is `"TimeoutError"`), not by the error: WebKit rejects `fetch` with an `AbortError`.
- While it runs, Escape and backdrop clicks do nothing. Cancel and Close abort it only when aborting really stops the work, such as an upload or a search. A request that changes data can still finish on the server, so for that they wait.
- If the browser closes the dialog anyway, for example after a repeated Escape or back gesture, show the result in the page, for example in a toast. If focus was lost with the trigger, move it as described under "Closing". Opened again before the result arrives, the dialog shows the busy state again.
- In a form dialog, the primary action validates first. On errors the dialog stays open, and focus moves to the first invalid field. `<form method="dialog">` closes the dialog on submit and sets `returnValue`, which is enough for confirmations without async work.

## The page behind

- Native `<dialog>` and `inert` stop clicks and focus behind the dialog, but not scrolling. Set `overflow: hidden` on the root element while a modal is open: `html:has(dialog:modal)`.
- Keep the scrollbar's space, so the layout doesn't jump: `scrollbar-gutter: stable` on the root, or padding equal to the scrollbar's width while the page is locked.
- Give the dialog's scrolling body `overscroll-behavior: contain`, so scrolling it doesn't scroll the page at its ends.
- iOS Safari can still scroll the page under a touch. Where it does, fix the body in place while the dialog is open (`position: fixed`, with `top` set to minus the scroll position), and restore the scroll position on close.

## Layout

These are suggested defaults; the project's design and tokens win.

- **From 768 px wide**: centered, at most 640 px wide and `calc(100dvh - 64px)` tall, with 24 px padding. The title row and the actions stay visible while the body scrolls.
- **Below 768 px**: full screen when `fullscreenOnMobile` is on: `100vw` wide (`100%` would leave a reserved scrollbar gutter uncovered), `100dvh` tall, no margins or rounded corners, and padding that includes the safe-area insets. Otherwise near-full width with 16 px gutters. `dvh` keeps the dialog clear of the browser's toolbars; keep `100vh` as the fallback.
- **Short viewports** (under about 480 px tall: landscape phones, high zoom): the whole content scrolls, actions included.
- **320 px wide** (400% zoom on a 1280 px screen): nothing scrolls sideways.
- A scrolling body that holds no focusable element is focusable itself (`tabindex="0"`) and named, so keyboard users can scroll it.
- The close button and the actions are at least 24 by 24 px; 40 px is a comfortable size for the close button.
- The browser stylesheet gives `dialog:modal` default margins and maximum sizes; override them for the full-screen layout.

## Motion

Motion is optional. Open in 180 ms and close in 140 ms with `cubic-bezier(0.2, 0, 0, 1)`: the backdrop fades, and the dialog fades in from `translateY(8px) scale(0.98)`. For native `<dialog>`, animate the open with `@starting-style`. Animating the close also needs `transition-behavior: allow-discrete` on `display` and `overlay`; where a browser can't do that, the dialog closes at once, which is fine. Focus returns and the page unlocks at once, not after the animation. Under `prefers-reduced-motion: reduce`, nothing moves: a short fade, or no animation.

## Example

A delete confirmation in plain HTML, CSS, and JavaScript. Adapt it to the project's framework, its version, and its styling system. `deleteProject()` and `notify()` stand for the app's own request and its toast or page message.

```html
<button type="button" id="delete-trigger">Delete project</button>

<dialog id="confirm-delete" role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-message">
  <div class="dialog-inner">
    <h2 id="confirm-title">Delete project?</h2>
    <div class="dialog-body">
      <p id="confirm-message">This deletes the project and its files for everyone on the team.</p>
    </div>
    <p class="dialog-status" role="status"></p>
    <div class="dialog-actions">
      <button type="button" data-action="cancel" autofocus>Cancel</button>
      <button type="button" data-action="confirm">Delete project</button>
    </div>
  </div>
</dialog>
```

```css
dialog {
  padding: 0; /* .dialog-inner has the padding, so only the backdrop targets <dialog> itself */
  border: none;
  border-radius: 12px;
  width: min(640px, 100% - 32px);
  max-height: calc(100dvh - 64px);
}

dialog::backdrop {
  background: rgb(0 0 0 / 0.5);
}

.dialog-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
  max-height: inherit;
  padding: 24px;
}

.dialog-body {
  overflow: auto;
  overscroll-behavior: contain;
}

.dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-actions [aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.6;
}

/* The page doesn't scroll behind a modal, and keeps the scrollbar's space so nothing shifts */
html {
  scrollbar-gutter: stable;
}

html:has(dialog:modal) {
  overflow: hidden;
}

/* Short viewports (landscape phones, high zoom): everything scrolls, the actions included */
@media (max-height: 480px) {
  .dialog-inner {
    overflow: auto;
    overscroll-behavior: contain;
  }

  .dialog-body {
    overflow: visible;
  }
}

/* Phones: full screen, clear of the browser's toolbars and the screen's rounded corners */
@media (max-width: 767px) {
  dialog.fullscreen-mobile {
    width: 100vw; /* 100% would leave the reserved scrollbar gutter uncovered */
    max-width: none;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    margin: 0;
    border-radius: 0;
  }

  dialog.fullscreen-mobile .dialog-inner {
    height: 100%;
    padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
      max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  }
}
```

```js
// Opens a modal <dialog> with this guide's closing and focus rules.
// fallbackFocus: where focus goes if the trigger is gone when the dialog closes.
function openDialog(dialog, trigger, { dismissible = true, closeOnBackdropClick = true, fallbackFocus } = {}) {
  let pressStartedOnBackdrop = false;

  // <dialog> has no padding, so only the backdrop makes it the event target. A text selection
  // dragged from inside also ends in a click on <dialog>, so the press must start there too.
  const onPointerDown = (event) => {
    pressStartedOnBackdrop = event.target === dialog;
  };
  const onClick = (event) => {
    const fromBackdrop = pressStartedOnBackdrop && event.target === dialog;
    pressStartedOnBackdrop = false;
    if (fromBackdrop && dismissible && closeOnBackdropClick && dialog.dataset.busy !== 'true') {
      dialog.close('cancel');
    }
  };
  // Escape, or the back gesture on Android. A repeated request may still close the dialog, so
  // a close without returnValue 'confirm' always counts as Cancel.
  const onCancel = (event) => {
    if (!dismissible || dialog.dataset.busy === 'true') event.preventDefault();
  };
  const onClose = () => {
    dialog.removeEventListener('pointerdown', onPointerDown);
    dialog.removeEventListener('click', onClick);
    dialog.removeEventListener('cancel', onCancel);
    (trigger.isConnected ? trigger : fallbackFocus)?.focus();
  };

  dialog.returnValue = '';
  dialog.addEventListener('pointerdown', onPointerDown);
  dialog.addEventListener('click', onClick);
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('close', onClose, { once: true });
  dialog.showModal();
}

// The delete confirmation: an alert dialog that a backdrop click doesn't close.
// deleteProject() and notify() stand for the app's request and its toast or page message.
const trigger = document.getElementById('delete-trigger');
const dialog = document.getElementById('confirm-delete');
const status = dialog.querySelector('[role="status"]');
const actions = dialog.querySelectorAll('.dialog-actions button');
const heading = document.getElementById('projects-heading'); // the list's heading, tabindex="-1"

trigger.addEventListener('click', () => {
  // Opened again while the request still runs: keep its busy message
  if (dialog.dataset.busy !== 'true') status.textContent = '';
  openDialog(dialog, trigger, { closeOnBackdropClick: false, fallbackFocus: heading });
});

dialog.querySelector('[data-action="cancel"]').addEventListener('click', () => {
  if (dialog.dataset.busy !== 'true') dialog.close('cancel');
});

// The browser can close the dialog while the request runs (a repeated Escape or back gesture),
// so a result that arrives after that goes to the page, and lost focus goes to the heading
function report(message) {
  if (dialog.open) {
    status.textContent = message;
    return;
  }
  notify(message);
  if (!trigger.isConnected && document.activeElement === document.body) heading.focus();
}

dialog.querySelector('[data-action="confirm"]').addEventListener('click', async () => {
  if (dialog.dataset.busy === 'true') return;
  // Busy: the buttons keep focus (aria-disabled, not disabled), and the status message says why
  dialog.dataset.busy = 'true';
  actions.forEach((button) => button.setAttribute('aria-disabled', 'true'));
  status.textContent = 'Deleting…';
  // A time limit, so a request that hangs can't trap anyone
  const signal = AbortSignal.timeout(30_000);
  try {
    await deleteProject({ signal }); // on success it also removes the project's row, trigger included
    if (dialog.open) dialog.close('confirm');
    else report('Project deleted.');
  } catch {
    // Ask the signal, not the error: WebKit rejects fetch with an AbortError, not the TimeoutError
    report(signal.reason?.name === 'TimeoutError'
      ? 'Deleting is taking too long. Check your connection and try again.'
      : "The project wasn't deleted. Check your connection and try again.");
  } finally {
    dialog.dataset.busy = 'false';
    actions.forEach((button) => button.removeAttribute('aria-disabled'));
  }
});
```

## Without native dialog

Only when neither the project nor native `<dialog>` fits, for example an overlay system the project must keep:

- Render the dialog at the end of `body` with `role="dialog"` (or `"alertdialog"`) and `aria-modal="true"`.
- Make every sibling of its container `inert` while it's open. That keeps focus in the dialog, so no focus-trap library is needed. Don't hide the page with `aria-hidden` instead.
- Move focus in and return it as above, and close on Escape with a `keydown` listener on the dialog.
- Give the backdrop element the same press-and-click check.
- Put the backdrop and the dialog at the top of the project's layering scale, above sticky bars, dropdowns, popovers, and toasts.

## Edge cases

- **Stacked dialogs**: avoid a dialog on top of a dialog; replace the content instead. When it can't be avoided, `showModal()` stacks it: Escape closes the top one, and focus returns into the one below. Without native `<dialog>`, make the lower dialog inert too.
- **Toasts**: a toast below an open modal can't be reached. Show the result of the dialog's action after it closes, or inside the dialog while it stays open.
- **Double clicks**: ignore the trigger while the dialog opens or closes, so a double click never opens two.
- **Navigation**: if the route changes while the dialog is open, close it without returning focus to a trigger on the old page.
- **Server rendering**: render the dialog closed, and call `showModal()` only in the browser, after mount.
- **Unsaved input** (optional): a form dialog can ask before discarding typed input.

## Acceptance checklist

- [ ] Opened from the keyboard, focus lands as the initial-focus rule says, and a screen reader announces the dialog's role and title, plus its short description if it has one
- [ ] Tab and Shift+Tab never reach the page behind it, and the page can't be clicked or scrolled, including by touch on iOS Safari
- [ ] Opening it doesn't shift the page's layout
- [ ] Escape closes a dismissible dialog, and focus returns to the trigger; a dialog that isn't dismissible stays open on the first Escape, and any close counts as Cancel
- [ ] A backdrop click closes the dialog only when that's turned on, and dragging a text selection from inside onto the backdrop never closes it
- [ ] Every dialog has a visible Cancel or Close button with an accessible name, at least 24 by 24 px
- [ ] While the primary action runs, focus stays on its button and the status message announces progress; a failure keeps the dialog open with the error announced and the buttons working; a success closes it
- [ ] A request that never settles ends at its time limit with an error and working buttons, and a result that arrives after the dialog closed shows in the page without leaving focus on the page body
- [ ] When the action removed the trigger, focus lands in a sensible place nearby, not on the page body
- [ ] At 320 px wide and at 400% zoom nothing scrolls sideways and the actions stay reachable; on phones, the full-screen dialog isn't hidden behind the browser's toolbars
- [ ] With reduced motion, nothing moves
- [ ] Styles come from the project's styling system and tokens, like its other components

## See also

- **[Button](/potions/components/button)**: for the dialog's actions.
- **[Toast Notifications](/potions/components/toast-notifications)**: toasts sit below an open modal, so show an action's result after the dialog closes.

These are suggestions; the dialog works with any button or notification implementation.
