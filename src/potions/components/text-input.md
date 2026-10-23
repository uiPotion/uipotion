---
layout: 'potion'
title: 'Text Input Field'
publicationDate: '2026-01-24'
excerpt: 'An accessible text field on the native input or textarea: a visible label, hint and error text read with the field, required and optional marked in words, autocomplete for personal data, and a character count that never cuts text off.'
category: 'Components'
tags:
  - components
  - input
  - form
  - text-field
  - validation
  - a11y
  - wcag
  - aria
  - form-control
agentManifest: 'potions/components/text-input.json'
path: 'potions/components/text-input'
promptSubject: 'text inputs'
useWhen: 'you add or fix a text field, such as an email, name, search, or comment box, and want its label, hint, and errors to work for everyone.'
specifies:
  - 'Every field has a visible label, and screen readers read its hint and error with it.'
  - 'Required and optional fields say so in words, not only with an asterisk or a color.'
  - 'A length limit lets people type or paste past it, then says how many characters are too many.'
example: 'Someone pastes a 230-character bio into a field with a 200-character limit. All of it stays, the count says 30 characters too many, and the form asks them to shorten it.'
---

Most forms succeed or fail in their text fields: people need to know what to enter, whether they have to, and what went wrong. This guide covers single-line inputs and multi-line text areas, built on the native `<input>` and `<textarea>`, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a text field component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise use the native `<input>` with the `type` that matches the data, or `<textarea>` for more than one line, with a `<label>`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Structure

- **Label**: visible text in a `<label for>` that names the field. A placeholder is never the label.
- **Hint** (optional): short help, such as the format or why the field is asked for.
- **Input**: `<input>` or `<textarea>`.
- **Error**: an element that's empty and hidden until there's an error.
- **Count** (optional): for fields with a length limit.
- **Leading icon** (optional): decoration, with `aria-hidden="true"`.
- **Trailing button** (optional): such as Clear or Show password, a real `<button type="button">` with a name, at least 24 by 24 px (44 px suggested on touch).

## Labels, hints, and required fields

- The label is visible, and its text is the field's accessible name. A native `<label for>` is enough; use `aria-labelledby` only when the name has to come from elsewhere.
- Say "required" or "optional" in words. When most fields are required, mark the optional ones "(optional)", and say so once at the top of the form: "All fields are required unless marked (optional)". If the design uses an asterisk, explain it at the top of the form, and don't color it like an error.
- Put the native `required` attribute on required fields: screen readers announce it, and the form's validation reads it. When the app shows its own error messages, the form gets `novalidate` (see the Form Validation Pattern).
- Hints are text below the label or the field, connected with `aria-describedby`. A placeholder disappears as soon as someone types, so it never holds the format or instructions. A placeholder that shows anything needed meets 4.5:1.

## Errors

- An error says what's wrong and how to fix it, such as "Enter an email address in the correct format, like name@example.com", in text next to the field, with an icon if the design uses one.
- The error element stays in the field's `aria-describedby`, after the hint. With no error it's empty and hidden, so it adds nothing. While there's an error, the field has `aria-invalid="true"`.
- Field errors are never live regions (`role="alert"` or `aria-live`): on a submit, every field would announce at once. When errors are announced and where focus goes is the form's job (see the Form Validation Pattern).
- Keep what the person typed; never clear a field because it's wrong.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<p>All fields are required unless marked (optional).</p>
<div class="field">
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" autocomplete="email" required
    aria-describedby="email-hint email-error">
  <p class="field-hint" id="email-hint">We'll send your receipt here.</p>
  <p class="field-error" id="email-error" hidden></p>
</div>
<div class="field">
  <label for="phone">Phone number (optional)</label>
  <input id="phone" name="phone" type="tel" autocomplete="tel"
    aria-describedby="phone-hint phone-error">
  <p class="field-hint" id="phone-hint">Include the country code, for example +44 20 7946 0958.</p>
  <p class="field-error" id="phone-error" hidden></p>
</div>
```

```js
// Shows or clears a field's error. The error stays in aria-describedby, so it's read with the
// field; cleared, it's empty and hidden and adds nothing. aria-invalid tells screen readers
// that the value needs fixing.
function setFieldError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}
```

## Types, autocomplete, and paste

- Use the `type` that matches the data: `email`, `tel`, `url`, `search`, or `password`. It brings the right phone keyboard, and `email` and `url` a format check.
- Codes, card numbers, and IDs are `type="text"` with `inputmode="numeric"`, and one-time codes add `autocomplete="one-time-code"`. `type="number"` is for quantities.
- Fields that ask for the person's own data get the matching `autocomplete` token (WCAG 1.3.5), such as `name`, `email`, `tel`, `street-address`, `postal-code`, or `bday`. Passwords get `current-password` at sign-in and `new-password` when one is created.
- Never block paste or autofill. Password managers and copied codes depend on them (WCAG 2.2 3.3.8).
- Text is at least 16 px on phones: iOS Safari zooms the page when a smaller field gets focus.

## Variants

- **Search**: `type="search"`, named "Search" by a visible or visually hidden label. Chromium and Firefox clear a search field on Escape themselves; no other field clears on Escape, since that would lose typing, and inside a dialog Escape closes the dialog. Chromium and WebKit also draw their own clear button in search fields, so a custom Clear button means hiding theirs (`::-webkit-search-cancel-button`).
- **Password**: `type="password"` with the right `autocomplete`, `spellcheck="false"`, and paste allowed. A Show password button is a toggle: its name stays "Show password", `aria-pressed` gives its state, and focus stays on it. The password is hidden again when the form is sent. The Login & Registration Forms guide has the full pattern.
- **Multi-line**: `<textarea>` with the same label, hint, and error. It can grow with its content (`field-sizing: content` where supported).
- **Read-only**: `readonly` keeps the value focusable, selectable, and sent with the form. `disabled` removes it from the Tab order and the form data, so use it only for fields that really can't be used yet, and say why in text.
- **Success** (optional): only for checks the person can't see, such as an available username, with text such as "Username available". Not a green border and check on every valid field.

## Length limits

- Don't use `maxlength` for a limit people can reach. It cuts longer typed or pasted text without a word (checked in Chromium, Firefox, and WebKit), and stops typing without saying why.
- Show the limit up front ("You can enter up to 200 characters"), count as people type ("You have 12 characters left"), and let them go over ("You have 30 characters too many"). Over the limit, the field is invalid until it's shortened, and the server checks the limit again.
- The visible count changes on every keystroke; screen readers hear it once typing pauses, through one status region.
- Count characters the way the server does. The snippet counts code points, so an emoji counts as one.
- The count and the validity also cover the text the page starts with, such as a saved bio, and the text a form reset puts back. A reset brings it back without an input event and without clearing custom validity, so the snippet updates after the reset event has finished, unless a listener cancelled the reset; neither is announced. After setting the text from script, run the same update.

```html
<label for="bio">Short bio (optional)</label>
<textarea id="bio" name="bio" rows="4" aria-describedby="bio-count"></textarea>
<p class="field-count" id="bio-count">You can enter up to 200 characters</p>
<p class="visually-hidden" id="bio-count-status" role="status"></p>
```

```js
// A character count that lets people go over the limit, so a paste is never cut short, and
// says by how much. The visible count changes as they type, and the status region speaks
// once typing pauses. Over the limit, the field is invalid until it's shortened; the server
// checks the limit again.
const field = document.getElementById('bio');
const count = document.getElementById('bio-count');
const status = document.getElementById('bio-count-status');
const limit = 200;
const characters = (n) => `${n} ${n === 1 ? 'character' : 'characters'}`;
let pause;

// The count and the validity for the text as it is; call it again after setting the text
// from script
function update() {
  const left = limit - [...field.value].length; // characters, not UTF-16 code units
  if (field.value === '') count.textContent = `You can enter up to ${limit} characters`;
  else count.textContent = left >= 0 ? `You have ${characters(left)} left` : `You have ${characters(-left)} too many`;
  field.setCustomValidity(left >= 0 ? '' : `Enter ${limit} characters or fewer`);
}

field.addEventListener('input', () => {
  update();
  clearTimeout(pause);
  pause = setTimeout(() => { status.textContent = count.textContent; }, 1000);
});
// After a reset that wasn't cancelled, count the text the form put back, unannounced. The
// text comes back only after the reset event, and a later listener can cancel the reset.
field.form?.addEventListener('reset', (event) => setTimeout(() => {
  if (event.defaultPrevented) return;
  clearTimeout(pause);
  update();
}));
update(); // text the page starts with, such as a saved bio, counts too
```

## Appearance

These are suggested defaults; the project's design and tokens win.

- States: default, hover, focus, error, read-only, disabled, and the optional success.
- The field's edge has at least 3:1 contrast against the background in every state, and so does the focus indicator (WCAG 1.4.11). For example, `#6b7280` on white is 4.8:1, while the common `#d1d5db` is 1.5:1, too faint to find the field. Check the project's own colors.
- The error state changes more than the color: it has its message, and an icon if the design uses one.
- Focus shows with `:focus-visible`, an outline or a ring, and is never removed without a replacement.
- Sizes: 44 px tall (36 px compact, 52 px large), 16 px text, and 14 px labels, hints, and errors.
- A field fills its container and has no breakpoints of its own. At 320 px wide and at 200% text size, labels, hints, and errors wrap.
- Motion is optional: a 150 ms transition on the border and the focus ring. Under `prefers-reduced-motion: reduce`, changes are instant.

## Edge cases

- **Hint and error together**: both stay visible, and both stay in `aria-describedby`, the hint first.
- **Errors from the server** show in the same error element, set the same way, at the field they belong to.
- **Autofill**: autofilled values count as typed, and the field stays readable in the browser's autofill style (`:autofill`).
- **Right-to-left**: icons and trailing buttons use logical properties, such as `padding-inline-start`, so they mirror.

## Acceptance checklist

- [ ] Every field has a visible label that is its accessible name, and no placeholder stands in for a label or a hint
- [ ] Required and optional fields say so in words, and required fields have the required attribute
- [ ] A screen reader reads the hint with the field, and the error too when there is one, with the field marked invalid
- [ ] Errors say how to fix the problem, keep what was typed, and aren't live regions
- [ ] Fields that ask for the person's own data have the matching autocomplete token, and paste works in every field
- [ ] Codes and card numbers use inputmode="numeric", not type="number"
- [ ] A field with a length limit keeps everything typed or pasted, says how many characters are too many, and announces the count only when typing pauses
- [ ] The count and the validity are right for text the page starts with, and after a form reset; a cancelled reset changes nothing
- [ ] Escape clears no field except a search field, where the browser does it
- [ ] A Show password button keeps its name and focus, shows its state with aria-pressed, and the password is hidden again when the form is sent
- [ ] Field edges and the focus indicator have at least 3:1 contrast and text 4.5:1, in every state
- [ ] Text is at least 16 px on phones, and nothing is cut off at 320 px wide or at 200% text size
- [ ] Styles come from the project's styling system and tokens, like its other form controls

## See also

- **[Form Validation Pattern](/potions/patterns/form-validation)**: when errors appear, and where focus goes when a form is submitted.
- **[Select and Combobox](/potions/components/dropdown-select)**: choices from a list, with the same label, hint, and error wiring.
- **[Login & Registration Forms](/potions/features/form-login-register)**: email and password fields, and the full Show password pattern.

These are suggestions; the field works with any form setup.
