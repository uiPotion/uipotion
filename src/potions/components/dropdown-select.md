---
layout: 'potion'
title: 'Select and Combobox'
publicationDate: '2026-01-25'
excerpt: 'Choosing from a list: the native select for a simple choice, and a combobox for search and several choices that keeps focus in its input, highlights with aria-activedescendant, and never picks or submits anything by accident.'
category: 'Components'
tags:
  - components
  - dropdown
  - select
  - combobox
  - listbox
  - form
  - a11y
  - wcag
  - aria
  - keyboard-navigation
agentManifest: 'potions/components/dropdown-select.json'
path: 'potions/components/dropdown-select'
promptSubject: 'selects and comboboxes'
useWhen: 'people choose one or more options from a list, such as a country, a category, or tags, and you need to decide between the native select and a searchable combobox.'
specifies:
  - 'A single choice without search uses the native select, which every screen reader knows and which opens the phone''s own picker.'
  - 'In a searchable list, Space types, Enter picks only the highlighted option, and focus never leaves the text box.'
  - 'Escape closes only the list, so a dialog around it stays open, and the form sends the chosen value.'
example: 'Someone types "new y" to find New York. The space types, Down arrow highlights New York, and Enter picks it without sending the form.'
---

People choose from lists everywhere in forms. The browser's `<select>` already does this well, so a custom list is only worth building when it needs search, several choices, or richer options. This guide covers both, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a select or combobox component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise choose by what the list needs:
   - **One choice, no search**: the native `<select>`. Every screen reader knows it, and phones open their own picker.
   - **Search, a long list, or results from the server**: a combobox after the APG pattern, a text input with `role="combobox"` that filters a list.
   - **Several choices**: the same combobox with a multi-select list, and the chosen values shown outside the input.
   - **Rich options without search**, such as icons or two lines: the APG select-only combobox, with its own keys (see "Rich options without search" below). Where the native select only needs custom styling, `appearance: base-select` styles it in Chromium (from Chrome 135); other browsers show the standard select.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The native select

- Give it a `<label for>`, `required` when a choice is needed, and `autocomplete` for personal data, such as `country` or `bday-month`.
- For `required` to work, the first option is a placeholder with `value=""`, such as "Choose a country". A placeholder without `value=""` counts as a choice, so the form accepts it (checked in Chromium, Firefox, and WebKit).
- Group options with `<optgroup label>`.
- Choosing an option doesn't change the page by itself (WCAG 3.2.2); the choice applies when the form is sent.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<!-- The first option's empty value is what makes required work: a placeholder
     without value="" counts as a choice. -->
<label for="country">Country</label>
<select id="country" name="country" autocomplete="country" required>
  <option value="">Choose a country</option>
  <optgroup label="Europe">
    <option value="DE">Germany</option>
    <option value="PL">Poland</option>
  </optgroup>
  <optgroup label="Asia">
    <option value="JP">Japan</option>
  </optgroup>
</select>
```

## The combobox

- **Label**: a visible `<label for>` on the input. The list is labelled by the same label (`aria-labelledby`).
- **Input**: `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` pointing to the list, and `aria-activedescendant` while an option is highlighted. `autocomplete="off"` keeps the browser's own suggestions from covering the list. The combobox role goes on the input; the popup is always the listbox.
- **List**: `role="listbox"`, with options that have `role="option"`, unique ids, and `aria-selected="true"` on the chosen one.
- **Value**: a hidden input with the field's `name` holds the chosen option's value, so the form sends the choice, not the typed text. Hidden inputs are left out of constraint validation (checked), so `required` sits on the visible input, and any text there that isn't a choice, even only spaces, fails with a message such as "Choose a city from the list". A hidden input also can't restore its own value on a form reset, so the snippet keeps the page's starting choice and brings it back, with its text and `aria-selected`, after a reset. It waits for the reset event to finish and checks `defaultPrevented` first, since a later listener can cancel the reset, which keeps the current choice. It sets everything up the same way when the page loads.
- **Status region**: one, present before it changes, for the number of results once typing pauses, "No matches", and loading.

Focus stays in the input the whole time, and nothing is trapped:

- Typing filters the list and opens it, with nothing highlighted yet.
- Down Arrow and Up Arrow open the list and move the highlight, wrapping at the ends. `aria-activedescendant` on the input points to the highlighted option, which scrolls into view.
- Enter picks the highlighted option and closes the list. With nothing highlighted, it picks nothing. While the list is open, Enter never submits the form.
- Space, Home, End, and letters type and move the caret, as in any text box, so "New York" can be typed.
- While an input method editor (IME) composes text, such as Japanese, Chinese, or Korean, its keys are its own: the arrows, Enter, and Escape aren't handled. Check `isComposing`, and `keyCode` 229, which is how Safari reports the Enter that confirms a composition.
- Escape closes the list and keeps the text. It doesn't close a dialog around the combobox: the snippet cancels the key while the list is open (checked in Chromium, Firefox, and WebKit). With the list closed, Escape does what it does around it.
- Tab closes the list and moves on. Typed text isn't a choice unless an option was picked.
- A click or tap on an option picks it, and focus stays in the input: cancel `mousedown` on the list. Cancelling `pointerdown` instead also stops a tap's click in WebKit (checked).
- A click elsewhere closes the list, and focus stays where the click put it.

```html
<label for="city" id="city-label">City</label>
<div class="combobox">
  <input id="city" type="text" role="combobox" autocomplete="off" required
    aria-autocomplete="list" aria-expanded="false" aria-controls="city-options">
  <ul id="city-options" role="listbox" aria-labelledby="city-label" hidden>
    <li id="city-krakow" role="option" aria-selected="false" data-value="krakow">Kraków</li>
    <li id="city-new-york" role="option" aria-selected="false" data-value="new-york">New York</li>
    <li id="city-newcastle" role="option" aria-selected="false" data-value="newcastle">Newcastle</li>
  </ul>
  <input type="hidden" name="city" id="city-value">
</div>
```

```js
// A searchable select, after the APG editable combobox. Focus stays in the input, and
// aria-activedescendant points to the highlighted option. Space types, Enter picks only a
// highlighted option, and the hidden input holds the choice that the form sends.
const input = document.getElementById('city');
const list = document.getElementById('city-options');
const chosen = document.getElementById('city-value');
const options = [...list.querySelectorAll('[role="option"]')];
const visible = () => options.filter((option) => !option.hidden);
const initial = chosen.value; // a hidden input can't restore its value on a form reset
let active = -1; // the highlighted option's index among the visible ones

function highlight(index) {
  active = index;
  visible().forEach((option, i) => option.classList.toggle('is-highlighted', i === index));
  const option = visible()[index];
  if (option) input.setAttribute('aria-activedescendant', option.id);
  else input.removeAttribute('aria-activedescendant');
  option?.scrollIntoView({ block: 'nearest' });
}

function setOpen(open) {
  list.hidden = !open;
  input.setAttribute('aria-expanded', String(open));
  highlight(-1);
}

// Sets the choice, or none: the option's text in the input, its value in the hidden input,
// and aria-selected on it alone. Text that isn't a choice, even only spaces, fails
// validation; required on the input covers an empty one.
function setChoice(option) {
  for (const each of options) each.setAttribute('aria-selected', String(each === option));
  chosen.value = option ? option.dataset.value : '';
  if (option) input.value = option.textContent;
  input.setCustomValidity(input.value !== '' && !option ? 'Choose a city from the list' : '');
}

function choose(option) {
  setChoice(option);
  setOpen(false);
}

input.addEventListener('input', () => {
  const query = input.value.trim().toLocaleLowerCase();
  for (const option of options) option.hidden = !option.textContent.toLocaleLowerCase().includes(query);
  setChoice(null); // typed text isn't a choice until an option is picked
  setOpen(true);
});

input.addEventListener('keydown', (event) => {
  // While an input method composes text, these keys are its own; Safari reports the Enter
  // that confirms a composition as keyCode 229
  if (event.isComposing || event.keyCode === 229) return;
  const count = visible().length;
  if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && count > 0) {
    event.preventDefault();
    if (list.hidden) setOpen(true);
    const down = event.key === 'ArrowDown';
    if (active < 0) highlight(down ? 0 : count - 1);
    else highlight((active + (down ? 1 : count - 1)) % count); // wraps around
  } else if (event.key === 'Enter' && !list.hidden) {
    event.preventDefault(); // while the list is open, Enter never submits the form
    if (active >= 0) choose(visible()[active]); // with nothing highlighted, nothing is picked
  } else if (event.key === 'Escape' && !list.hidden) {
    event.preventDefault(); // closes only the list, not a dialog around it
    setOpen(false);
  }
});

// Cancelling mousedown keeps focus in the input; a cancelled pointerdown would also stop
// a tap's click in WebKit
list.addEventListener('mousedown', (event) => event.preventDefault());
list.addEventListener('click', (event) => {
  const option = event.target.closest('[role="option"]');
  if (option) choose(option);
});
input.addEventListener('blur', () => setOpen(false));

// The page's starting choice, set up now and again after a reset that wasn't cancelled: the
// form puts the input's text back only after its reset event, and a listener after this one
// can still cancel the reset
function restore() {
  for (const option of options) option.hidden = false;
  choose(options.find((option) => option.dataset.value === initial) ?? null);
}
input.form?.addEventListener('reset', (event) => setTimeout(() => {
  if (!event.defaultPrevented) restore();
}));
restore();
```

## Results from the server

- Ask once typing pauses (about 300 ms, suggested), and say "Loading…" in the status region.
- Answers can arrive out of order, so keep only the latest request's answer: number each request and ignore any other answer, or abort the previous request with an `AbortController`.
- "No matches" and errors are text in the popup, not options, and are said in the status region.

## Several choices

- The list gets `aria-multiselectable="true"`. Picking an option toggles its `aria-selected`, and the list stays open.
- The chosen values show outside the input as a list, each with a Remove button named after its value ("Remove Kraków"). Interactive elements can't sit inside the input or another button.
- Each chosen value goes to the form in its own hidden input with the field's name.
- Optional: Backspace in an empty input removes the last value; say so in the hint.

## Groups

In the list, a group is an element with `role="group"`, labelled by its heading with `aria-labelledby`. The heading isn't an option, and the arrows skip it.

## Rich options without search

The APG select-only combobox has no text box, so its keys differ from the searchable one's. The list, the hidden input with the value, and the reset work the same way.

- **Markup**: a focusable element (`tabindex="0"`) with `role="combobox"`, named by the visible label with `aria-labelledby`, with `aria-controls`, `aria-expanded`, and `aria-activedescendant` while the list is open. Its text is the chosen option's text. It isn't a form field, so the form's own validation checks a required choice, and `aria-required="true"` says it.
- **Closed**: Enter, Space, Down Arrow, and Alt+Down Arrow open the list without changing the choice. Up Arrow and Home open it on the first option, and End on the last. Typing letters opens it on the first option that starts with them.
- **Open**: Down Arrow and Up Arrow move the highlight, stopping at the ends. Home and End go to the first and last option, and Page Up and Page Down jump 10 options. Enter, Space, and Alt+Up Arrow pick the highlighted option and close the list. Tab picks it, closes the list, and moves on. Escape closes the list without changing the choice. Typing letters moves to the first option that starts with them, and typing the same letter again moves through the options that start with it.
- Focus stays on the combobox, and `aria-activedescendant` marks the highlighted option, as in the searchable one.

## Appearance

These are suggested defaults; the project's design and tokens win.

- The highlighted option is the focus indicator, since focus stays in the input. Give it at least 3:1 contrast against what's around it, with an outline or a solid background; a faint tint such as `#eff6ff` on white is 1.1:1. Style it with a class or a data attribute, not `:focus`: options never get focus.
- Chosen options show a check, not color alone.
- The list opens in the top layer (the `popover` attribute) or a portal, so a parent with `overflow: hidden` can't clip it. It sits below the input, or above it when there's no room, with CSS anchor positioning where the project's browsers support it, or the positioning code the project already has.
- Sizes: a 44 px tall input, options at least 40 px tall (44 px on touch), 16 px text, and a list at most about 300 px tall that scrolls inside.
- Motion is optional: the list fades in over 150 ms. Under `prefers-reduced-motion: reduce`, it appears without movement.

## Edge cases

- **Many options**: with hundreds, filter on the server or render only part of the list. Then each option needs `aria-setsize` and `aria-posinset`, since browsers can only count rendered options; otherwise leave them out.
- **Options that can't be chosen right now** have `aria-disabled="true"`, and the arrows still reach them, so screen reader users learn they exist; Enter and a click don't pick them (APG).
- **Edit forms** start with the chosen option's text in the input and its value in the hidden input. The snippet sets `aria-selected` and the validity from them when the page loads, and brings them back after a form reset that wasn't cancelled.
- **In a dialog**: the first Escape closes the list, and the second the dialog.
- **Before the script runs**: a server-rendered page can start with the native select and replace it with the combobox once the script runs.

## Acceptance checklist

- [ ] A single choice without search uses the native select, and a required one starts with a placeholder option whose value is empty
- [ ] The combobox and its list are named by the field's visible label
- [ ] Typing filters the list without highlighting anything, and Space types a space
- [ ] The arrow keys move the highlight with aria-activedescendant while focus stays in the input, and the highlight has at least 3:1 contrast
- [ ] Enter picks only a highlighted option, and never submits the form while the list is open
- [ ] Escape closes only the list, so a dialog around it stays open
- [ ] A click or tap on an option picks it and keeps focus in the input, and a click elsewhere closes the list and leaves focus where the click was
- [ ] The form sends the chosen value, not the typed text, and text that isn't a choice, even only spaces, fails validation with a message
- [ ] A form reset brings back the starting choice, with its text and its selection, and a cancelled reset keeps the current one
- [ ] While an input method composes text, the arrows, Enter, and Escape are left to it
- [ ] A select-only combobox opens with Enter, Space, or the arrows, picks with Enter or Space, and finds options by the letters typed
- [ ] With several choices, the list stays open, the chosen values show outside the input, and each Remove button names its value
- [ ] Results, "No matches", and loading are announced through one status region, and an older search answer never replaces a newer one
- [ ] The list isn't clipped by its container, and works on a phone and at 320 px wide
- [ ] Styles come from the project's styling system and tokens, like its other form controls

## See also

- **[Text Input Field](/potions/components/text-input)**: the same label, hint, and error wiring.
- **[Form Validation Pattern](/potions/patterns/form-validation)**: when errors appear, and where focus goes when a form is submitted.
- **[Login & Registration Forms](/potions/features/form-login-register)**: registration forms that ask for a country or a language.

These are suggestions; the select works in any form.
