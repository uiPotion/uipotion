---
layout: 'potion'
title: 'Button'
publicationDate: '2026-02-04'
excerpt: 'Accessible buttons that build on the project''s own: variants, sizes that grow with their labels, icon-only names, toggles, and a busy state that keeps focus and says what''s happening.'
category: 'Components'
tags:
  - components
  - button
  - cta
  - a11y
  - wcag
  - aria
  - focus-visible
  - loading
  - icon-button
  - states
  - variants
  - forms
agentManifest: 'potions/components/button.json'
path: 'potions/components/button'
promptSubject: 'buttons'
useWhen: 'adding or changing buttons, such as a submit button with a saving state, an icon-only toolbar button, or a toggle.'
specifies:
  - 'While its action runs, a button keeps focus and its name, ignores more presses, and a status message says what''s happening.'
  - 'Heights are minimums, so a label that wraps makes the button taller instead of overflowing it.'
  - 'Focus rings are outlines, which forced colors keep, where shadows disappear.'
example: 'Someone presses Save with the keyboard: a spinner shows, the button keeps its width and focus, "Saving…" is announced, a second Enter does nothing, and "Saved" follows.'
---

A button runs an action; a link goes somewhere. Most button bugs aren't in the look: a busy state that throws focus to the top of the page, a disabled button nobody can find out about, a label cut off by a fixed height, a focus ring that vanishes in forced colors. This guide covers the native `<button>`, its variants, sizes, and states, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a Button component, in its design system or a library it already uses, configure or extend it to meet this guide: add what's missing, such as the busy state or names for icon-only buttons, without breaking existing uses. Keep its API.
2. Otherwise use the native `<button>`, never a `<div>` or `<span>` with `role="button"`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Button or link

- A button does something on this page: it saves, opens a dialog, or changes a setting. A link goes somewhere, even when it looks like a button ("Get started" on a landing page). Screen readers say which is which, and links can be opened in a new tab or copied.
- A button in a form submits it unless it says otherwise, so every other button in a form has `type="button"`.
- A link that looks like a button stays an `<a href>`, and a button that looks like a link stays a `<button>`. Enter presses both; Space presses a button and scrolls the page on a link, so a link that does a button's job becomes a button, not a link with a Space handler.
- A link that can't be followed yet is rendered without `href`: Tab skips it, and screen readers read it as text (checked: Tab skips it in Chromium, Firefox, and WebKit).

## Variants

- Map the variants to the project's own: primary for the main action of a view (one per form or dialog), secondary, ghost for low emphasis in dense toolbars, destructive, and link-style. Leave out the ones the task doesn't need.
- A destructive button is marked by more than its color: its label names the action ("Delete project"), and the action asks first (the Modal Dialog guide) or can be undone (the Toast Notifications guide).
- A link-style button in running text is underlined, like the links around it (1.4.1).

## Size

- The height is a minimum (`min-height`), never a fixed `height`: a label that wraps, after translation, at 200% text, or with text spacing overrides, makes the button taller instead of overflowing it (1.4.4, 1.4.12). Checked: with a fixed 36 px height, a two-line label overflows the button in all three engines; with `min-height`, the button grows.
- Suggested sizes: small 36 px, medium 44 px, and large 52 px high, with 12 to 16 px of padding on each side.
- Targets are at least 24 by 24 px, or have that much room around them (2.5.8); 44 px is the suggested size on touch screens.

## Names and icons

- A button with visible text is named by that text. Extra context goes after it, visually hidden ("Edit", then " profile"), so the name still starts with what people see and can say to voice control (2.5.3); an `aria-label` that replaces the text breaks that.
- An icon-only button gets its name from `aria-label` or visually hidden text ("Close", "Edit profile"), and a tooltip can show the same words. It's square: at least 24 px, 44 px suggested on touch screens.
- Icons are decorative (`aria-hidden="true"`): 16 to 20 px, 8 px from the text.

## States

- Hover and press feedback, a color change and an optional scale to 0.98, never moves the layout. The pointer cursor is a style choice; follow the project.
- Focus shows on `:focus-visible` with an outline 2 px wide and 2 px out, at 3:1 against the background. Draw it with `outline`: forced colors (Windows' contrast themes) drop box shadows, while an outline stays, even a transparent one (checked in Chromium). A ring drawn as a shadow keeps a transparent outline under it.
- Prefer a button that stays enabled and says what's missing when it's pressed, as the Form Validation guide does for submit buttons. An action that really can't be used now gets `disabled`, which takes the button out of the Tab order; or `aria-disabled="true"` when people need to reach it to learn why, with the reason next to it and linked by `aria-describedby`. Code ignores presses on an `aria-disabled` button.
- Disabled styles don't rely on opacity alone, and `pointer-events: none` would also hide the "not allowed" cursor.
- A toggle button has `aria-pressed` and one label ("Bold", pressed or not), with the pressed state shown by more than color. A button whose label changes instead ("Mute", then "Unmute") has no `aria-pressed`: both together read as a double state.

## Busy

- While its action runs, a button stays focusable and keeps its name: `aria-disabled="true"`, not `disabled`. Setting `disabled` on the focused button drops focus to the top of the page in Chromium, Firefox, and WebKit (checked), so keyboard and screen reader users lose their place.
- Presses while it's busy are ignored in code. For a submit button, the guard goes in the form's submit handler: Enter in a field submits the form even when its button has `aria-disabled`, in all three engines (checked).
- The label stays the button's name. A spinner can sit over the content, which turns transparent (`opacity: 0`), or beside it in space kept free, so the width doesn't change. `visibility: hidden` on the label would also remove the name (checked in Chromium's accessibility tree).
- `aria-busy` on a button isn't announced reliably. A status region that's in the page from the start says what's happening ("Saving…") and how it ended ("Saved", or what went wrong), as in the Login & Registration and Form Validation guides.
- The busy state ends on success, on failure, and at a time limit, such as 30 seconds, so a request that hangs can't leave the button stuck.

The snippets in this guide are plain HTML, CSS, and JavaScript; adapt them to the project's framework and its version.

```html
<!-- A form's submit button with a busy state: the label stays in the button, a spinner shows
     over it, and the status region, in the page from the start, says what's happening. -->
<form id="profile" method="post" action="/profile">
  <label for="profile-name">Name</label>
  <input id="profile-name" name="name" autocomplete="name">
  <button type="submit" class="button">
    <span class="button-label">Save</span>
    <span class="button-spinner" aria-hidden="true"></span>
  </button>
  <p class="form-status" role="status"></p>
</form>
```

```css
.button {
  align-items: center;
  display: inline-flex;
  gap: 8px; /* between an icon and the label */
  justify-content: center;
  min-block-size: 44px; /* min-height, not height: a label that wraps makes the button taller */
  padding: 10px 16px;
  position: relative;
}
/* The spinner sits over the content, so the button keeps its width when busy */
.button-spinner {
  block-size: 16px;
  border: 2px solid currentColor;
  border-inline-end-color: transparent;
  border-radius: 50%;
  inline-size: 16px;
  inset: 0;
  margin: auto;
  position: absolute;
  visibility: hidden;
}
.button[data-busy="true"] .button-spinner {
  animation: button-spin 0.8s linear infinite;
  visibility: visible;
}
/* Opacity, not visibility: hidden, which would take the label out of the button's name */
.button[data-busy="true"] > :not(.button-spinner) {
  opacity: 0;
}
/* No pointer-events: none, which would also hide this cursor */
.button[aria-disabled="true"] {
  cursor: not-allowed;
}
/* An outline, not a box-shadow: forced colors drop shadows */
.button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
@keyframes button-spin {
  to {
    rotate: 1turn;
  }
}
/* Slower under reduced motion; the status message carries the meaning */
@media (prefers-reduced-motion: reduce) {
  .button[data-busy="true"] .button-spinner {
    animation-duration: 2.4s;
  }
}
```

```js
// A busy submit button keeps focus and its name: aria-disabled, not disabled, which would drop
// focus to the page. A second submit while it's busy is ignored, Enter in a field included,
// and the status region says what's happening. save() stands for the app's request.
const form = document.getElementById('profile');
const button = form.querySelector('[type="submit"]');
const status = form.querySelector('[role="status"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  // Enter in a field submits even when the button has aria-disabled, so the guard is here
  if (button.dataset.busy === 'true') return;
  button.dataset.busy = 'true';
  button.setAttribute('aria-disabled', 'true');
  status.textContent = 'Saving…';
  try {
    // A time limit, so a request that hangs can't leave the button busy for good
    const response = await save(new FormData(form), { signal: AbortSignal.timeout(30_000) });
    status.textContent = response.ok ? 'Saved' : 'Not saved. Try again.';
  } catch {
    status.textContent = 'Not saved. Check your connection and try again.';
  } finally {
    delete button.dataset.busy;
    button.removeAttribute('aria-disabled');
  }
});
```

## Motion

Hover and focus changes take about 120 ms and a press about 80 ms. Under `prefers-reduced-motion: reduce`, nothing scales or moves, and a spinner turns slower; the status message carries the meaning.

## Appearance

These are suggested defaults; the project's design and tokens win.

- A 6 to 8 px radius, a font weight of 600, and the sizes above.
- Labels meet 4.5:1 against the button, and the focus ring and any border that marks the button's edge 3:1 against what's around it: a primary button in `#2563eb` with white text is 5.2:1, while `#3b82f6` is 3.7:1; a destructive one in `#b91c1c` is 6.5:1, while `#ef4444` is 3.8:1; a secondary button's `#767676` border is 4.5:1 on white. Check the project's own colors.

## Edge cases

- A label that grows, after translation for example, wraps or widens the button; it's never cut off.
- A button inside a link, or a link inside a button: interactive elements can't nest, so make them siblings.
- An action that's over in a moment can skip the spinner, but not aria-disabled and the guard.
- A double click on a button that submits: the busy guard ignores the second one.

## Acceptance checklist

- [ ] Actions are buttons and navigation is links; a button in a form that doesn't submit it has type="button"
- [ ] Every button has a name that includes its visible text; an icon-only button gets one from aria-label or visually hidden text, and its icon is hidden from screen readers
- [ ] Buttons are at least 24 by 24 px (44 px suggested on touch screens), and their height is a minimum, so a label that wraps makes them taller
- [ ] The focus ring shows with the keyboard, meets 3:1, and is an outline, so it stays in forced colors
- [ ] While busy, a button has aria-disabled="true", keeps focus and its name, and ignores presses; a form also ignores Enter in its fields
- [ ] A busy state is said in a status region that's in the page from the start, and ends on success, on failure, and at a time limit
- [ ] A busy button keeps its width, and its spinner turns slower under reduced motion
- [ ] A button that can't be used now has disabled, or aria-disabled when people need to reach it and learn why, which is said next to it
- [ ] A toggle keeps one label and changes aria-pressed, or changes its label without aria-pressed, never both
- [ ] Link-styled buttons and links in running text are underlined
- [ ] A destructive action's label names it, and the action asks first or can be undone
- [ ] Labels meet 4.5:1, and the focus ring and any border that marks the button 3:1
- [ ] Hover and press feedback never move the layout, and under reduced motion nothing scales
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Modal Dialog](/potions/components/dialog)**: the buttons in a dialog, and the confirmation for destructive actions.
- **[Form Validation Pattern - UX and Timing Strategies](/potions/patterns/form-validation)**: submit buttons that stay enabled and say what's missing.
- **[Toast Notifications](/potions/components/toast-notifications)**: Undo after a destructive action.
- **[Text Input Field](/potions/components/text-input)**: the fields buttons submit.

These are suggestions; the button works on its own.
