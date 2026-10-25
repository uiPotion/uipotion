---
layout: 'potion'
title: 'Command Palette'
publicationDate: '2026-02-22'
excerpt: 'A search box for commands in a modal dialog: Cmd or Ctrl+K opens it, the first result is highlighted so Enter runs it, the arrows move a highlight while focus stays in the input, and Escape always closes it.'
category: 'Components'
tags:
  - components
  - command-palette
  - command-menu
  - omnibox
  - keyboard-shortcuts
  - search
  - combobox
  - a11y
  - aria
agentManifest: 'potions/components/command-palette.json'
path: 'potions/components/command-palette'
promptSubject: 'a command palette'
useWhen: 'an app has many destinations or actions, and keyboard users want one shortcut to reach any of them.'
specifies:
  - 'Focus stays in the search box: the arrow keys move a highlight, and the first result is highlighted so Enter runs it.'
  - 'Only the latest search''s answer fills the list, and the number of results is said once typing pauses.'
  - 'Escape always closes it, focus returns to where it was before, and destructive commands ask first, with focus on Cancel.'
example: 'Someone presses Ctrl+K, types "inv", and presses Enter. The first result, Create invoice, runs, and focus goes back to where it was.'
---

A command palette is a search box for an app's destinations and actions, in a dialog that one shortcut opens. It is mostly a combobox, and its problems are a combobox's: an ARIA model left open, a highlight nobody can see, focus returned to a trigger that wasn't used, an Escape that only clears the text, and an older search's answer replacing a newer one. This guide follows the APG combobox with automatic selection and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a command menu, or a combobox it can build on, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise build it from a native `<dialog>`, a text input, and a list.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Opening and closing

- Cmd+K on macOS and Ctrl+K elsewhere open it. A visible trigger in the header ("Search" or "Commands") shows the shortcut for the person's system, ⌘K or Ctrl K, and has `aria-keyshortcuts="Meta+K Control+K"`.
- Don't take over Cmd or Ctrl+P, which is the browser's Print, or other browser shortcuts. When focus is in a rich text editor that uses the same shortcut, the editor keeps it.
- The palette is a native `<dialog>` opened with `showModal()`, as in the Modal Dialog guide: focus goes into the search box, and the rest of the page is inert.
- Escape closes it, with text in the box too. The input is `type="text"`: in a `type="search"` field inside a modal dialog, Chromium and Firefox clear the text on the first Escape and keep the palette open, while WebKit closes it at once (checked).
- Focus returns to the element that had focus before it opened, which the native dialog does by itself (checked in Chromium, Firefox, and WebKit). The shortcut usually opens it, so that isn't the trigger. After a command navigates, focus goes where the new page puts it.
- A visible Close button is always there, since touch screens and many tablets have no Escape key; a button in a `<form method="dialog">` closes the dialog without a script.

## The search box and the results

- The search box follows the APG combobox with list autocomplete and automatic selection. The input has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"` (the list always shows), and `aria-controls` pointing to the list, and it's labelled "Search commands", visibly or visually hidden. `autocomplete="off"` and `spellcheck="false"` keep the browser's suggestions out of the way.
- The results are a `role="listbox"` of `role="option"` rows with unique ids. Groups are `role="group"` elements, labelled by their headings.
- Focus stays in the input. The highlighted command is the input's `aria-activedescendant`, with `aria-selected="true"`, and scrolls into view.
- The first result is highlighted whenever the list changes, so Enter runs it. Select and Combobox highlights nothing until an arrow key, because a picked option fills a form; a palette runs commands, and destructive ones ask first.
- Down and Up Arrow move the highlight and wrap at the ends, through the options in the order on screen: build the order from the rendered list, not from the ranked array, since grouping reorders the ranks. Space types, and while an input method composes text, its keys are its own (`isComposing`, and `keyCode` 229 in Safari).
- A click runs a command, and focus stays in the input: cancel `mousedown` on the list. The highlight follows the pointer only when the pointer really moves. Scrolling the list under a still pointer fires `pointerover` and `mouseover` in all three engines, and `pointermove` too in WebKit (checked), so a move counts only from a known, different position. An arrow key makes the position unknown again, since a mouse resting over the list may not have moved since the palette opened.
- The highlight is the focus indicator, since focus stays in the input: give it 3:1 contrast against what's around it, with an outline or a solid background. A faint tint such as `bg-neutral-100` on white is 1.1:1. Style it from `aria-selected` or a class, not `:focus`; options never get focus.
- A command that's shown but can't run right now stays reachable with the arrows, has `aria-disabled="true"`, and Enter doesn't run it (APG). Commands the person can never run are left out. Hiding them is only for convenience: the server checks permission when a command runs.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version. `runCommand()` and `findCommands()` stand for the app's commands and its search; the two scripts share the input, the list, and `highlight()`.

```html
<dialog class="palette" aria-labelledby="palette-label">
  <label class="visually-hidden" id="palette-label" for="palette-input">Search commands</label>
  <!-- type="text": in a type="search" field, Escape clears the text in some browsers instead of closing -->
  <input id="palette-input" type="text" role="combobox" autocomplete="off" spellcheck="false"
    aria-autocomplete="list" aria-expanded="true" aria-controls="palette-results">
  <form method="dialog"><button class="palette-close">Close</button></form>
  <ul id="palette-results" role="listbox" aria-labelledby="palette-label"></ul>
  <p class="palette-status visually-hidden" role="status"></p>
</dialog>
```

```js
// The search box, after the APG combobox with automatic selection: focus stays in the input,
// aria-activedescendant marks the highlighted command, and the first result is highlighted
// whenever the list changes, so Enter runs it. Space types, and keys that belong to an input
// method are left to it. Escape is the dialog's own: it closes the palette.
const input = document.getElementById('palette-input');
const list = document.getElementById('palette-results');
// The results that can run, in the order on screen: none while a search is out (the list is busy)
const options = () => (list.getAttribute('aria-busy') === 'true' ? [] : [...list.querySelectorAll('[role="option"]')]);
let active = -1;
let pointer = null; // the pointer's last position; unknown again after an arrow key

function highlight(index, scroll = true) {
  active = index;
  options().forEach((option, i) => option.setAttribute('aria-selected', String(i === index)));
  const option = options()[index];
  if (option) input.setAttribute('aria-activedescendant', option.id);
  else input.removeAttribute('aria-activedescendant');
  if (option && scroll) option.scrollIntoView({ block: 'nearest' });
}
function run(option) {
  if (options().includes(option) && option.getAttribute('aria-disabled') !== 'true') runCommand(option.dataset.command);
}
input.addEventListener('keydown', (event) => {
  const count = options().length;
  if (event.isComposing || event.keyCode === 229 || count === 0) return;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    pointer = null;
    highlight((active + (event.key === 'ArrowDown' ? 1 : -1) + count) % count);
  } else if (event.key === 'Enter' && active >= 0) {
    event.preventDefault();
    run(options()[active]);
  }
});
list.addEventListener('mousedown', (event) => event.preventDefault()); // focus stays in the input
list.addEventListener('click', (event) => run(event.target.closest('[role="option"]')));
// The highlight follows the pointer only when it moves. Scrolling the list under a still
// pointer fires pointermove in WebKit, so a move counts only from a known, different position.
list.addEventListener('pointermove', (event) => {
  const position = `${event.clientX},${event.clientY}`;
  const moved = pointer !== null && position !== pointer;
  pointer = position;
  const option = event.target.closest('[role="option"]');
  if (moved && option) highlight(options().indexOf(option), false);
});
```

## Searching

- Matching is up to the app: fuzzy matching, keywords and aliases, and ranking by prefix, recent use, and the current context. Matched characters show in bold, not only in color.
- With an empty box, show recent and suggested commands. Recent commands are kept under the app's own storage prefix, as ids, never with their data.
- Only the latest search's answer fills the list: number the requests and drop older answers, or abort the previous request.
- While a search is out, the previous results stay in view but can't run: nothing is highlighted, the list has `aria-busy="true"` (which the project's styles can dim), Enter and clicks do nothing, and the previous announcement is cancelled. Otherwise, with results from a server, Enter in that moment runs a command from the previous query.
- One status region, present from the start, says the number of results once typing pauses ("3 commands"), "No matching commands", and failures. It doesn't speak on every key.
- A long list can render only part of itself; then the highlighted option stays rendered, and every option has `aria-setsize` and `aria-posinset`.

```js
// Only the latest search's answer fills the list: a slower answer to an older query is
// dropped. While a search is out, the previous results stay in view but can't run: nothing is
// highlighted, the list is busy, and the previous announcement is cancelled. findCommands()
// stands for the app's search, local or on the server.
const status = document.querySelector('.palette-status');
let latest = 0;
let pause;

input.addEventListener('input', async () => {
  const request = ++latest;
  clearTimeout(pause);
  highlight(-1);
  list.setAttribute('aria-busy', 'true');
  let commands = null;
  try {
    commands = await findCommands(input.value);
  } catch {
    // shown below, if this is still the latest search
  }
  if (request !== latest) return;
  list.replaceChildren(...(commands ?? []).map((command) => {
    const option = Object.assign(document.createElement('li'), { id: `command-${command.id}`, textContent: command.label });
    option.setAttribute('role', 'option');
    option.dataset.command = command.id;
    if (command.disabled) option.setAttribute('aria-disabled', 'true');
    return option;
  }));
  list.removeAttribute('aria-busy');
  highlight(commands?.length ? 0 : -1);
  pause = setTimeout(() => { // said once typing pauses, not on every key
    const n = commands?.length;
    status.textContent = !commands ? 'Search failed. Try again.' : n ? `${n} ${n === 1 ? 'command' : 'commands'}` : 'No matching commands';
  }, 500);
});
```

## Running commands

- A navigation command goes to its page and closes the palette.
- An action runs; when it succeeds, the palette closes and the outcome goes to the app's status region or a toast. When it fails, the palette stays open with the error in text.
- A command that opens a dialog closes the palette first, so no dialog opens on top of it.
- A destructive command asks first, in a step of the same dialog: the message, then Cancel and a button named for the action ("Delete 3 projects"). Focus goes to Cancel, which is described by the message, and Escape goes back to the results instead of closing the palette.
- While a command runs, a second Enter does nothing.

## Layers

Layers, bottom to top: the page, sticky bars, dropdowns and popovers, toasts, then modals, which make the rest of the page inert. The project's layering scale wins; native `<dialog>` and the `popover` attribute use the top layer and need no z-index. The palette is a modal: a native `<dialog>` in the top layer, above sticky bars, dropdowns, and toasts.

## Appearance

These are suggested defaults; the project's design and tokens win.

- The panel is up to 640 to 720 px wide and about 12% of the window's height from the top; on phones it fills the screen (`100dvh`), with the search box at the top and only the results scrolling.
- Rows are 44 px tall, and the input's text is 16 px, so iOS doesn't zoom into it.
- Text meets 4.5:1 in both themes, shortcut hints and group labels included: `text-neutral-500` is only 3.8:1 on a dark panel. Check the project's own colors.
- Motion is optional: the panel fades in over 150 ms. Under `prefers-reduced-motion: reduce`, it appears without movement.

## Edge cases

- **No commands to show**: say so, and offer a way on, such as the settings or the help page.
- **Thousands of commands**: search an index, rank once per query, and render only part of the list.
- **Scopes**: a palette for the current project or workspace says so in its label, and lists that context's commands first.

## Acceptance checklist

- [ ] Cmd+K on macOS and Ctrl+K elsewhere open it, Cmd or Ctrl+P is left to the browser, and a visible trigger shows the right shortcut
- [ ] It's a modal dialog: focus goes into the search box, the rest of the page is inert, and a visible Close button is always there
- [ ] Escape closes it, even with text in the box, and focus returns to the element that had focus before it opened
- [ ] The search box is a combobox controlling a listbox; focus stays in it, and aria-activedescendant marks the highlighted command
- [ ] The first result is highlighted whenever the list changes, so Enter runs it, and the arrows wrap through the results in the order on screen
- [ ] Space types, and keys that belong to an input method are left to it
- [ ] The highlighted command has at least 3:1 contrast against what's around it, and follows the pointer only when the pointer moves
- [ ] A disabled command is reachable with the arrows, and Enter doesn't run it
- [ ] Only the latest search's answer fills the list, and a failed search says so
- [ ] While a search is out, the previous results can't run, by Enter or by a click, and nothing is highlighted
- [ ] One status region says the number of results once typing pauses, and "No matching commands"
- [ ] A destructive command asks first, with focus on Cancel, and Escape goes back to the results
- [ ] A command that opens a dialog closes the palette first, and the server checks permission when a command runs
- [ ] On phones it fills the screen, with 44 px rows and 16 px text
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Navigation Bar (Responsive) with Mobile Menu](/potions/components/navbar)**: the bar with the palette's visible trigger.
- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)**: dense admin apps with many destinations.
- **[Select and Combobox](/potions/components/dropdown-select)**: the same combobox keys, with manual selection, for form fields.
- **[Modal Dialog](/potions/components/dialog)**: the modal dialog the palette is built on.
- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)**: quick access to prompts, tools, and conversations in an AI chat.

These are suggestions; the palette works on its own.
