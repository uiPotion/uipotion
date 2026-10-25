---
layout: 'potion'
title: 'Tabs Component'
publicationDate: '2026-02-14'
excerpt: 'Tabs that switch panels in place, after the APG pattern: a named tab list that is one Tab stop, the arrow keys with Home and End, automatic or manual activation, and disabled tabs that can still be found.'
category: 'Components'
tags:
  - components
  - tabs
  - navigation
  - segmented-content
  - a11y
  - aria
  - keyboard-navigation
  - responsive
  - scrollable
agentManifest: 'potions/components/tabs.json'
path: 'potions/components/tabs'
promptSubject: 'tabs'
useWhen: 'related views share one place on a page and people need one at a time, such as a settings page''s sections.'
specifies:
  - 'The tab list is one Tab stop: the arrow keys, Home, and End move between tabs, and Left and Right swap in right-to-left text.'
  - 'Disabled tabs still get focus, so screen reader users learn they exist, but they''re never selected.'
  - 'When each tab is a page with its own URL, it''s navigation instead: links with aria-current, not tabs.'
example: 'On a settings page, someone presses Right Arrow to move from Profile to Billing. The Billing panel shows at once, and Tab goes into it.'
---

Tabs look simple, and most of their problems are in the parts that don't show: a tab list without a name, every tab in the Tab order, panels that are moved out of view instead of hidden, and pages with URLs dressed up as tabs. This guide follows the APG tabs pattern and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a tabs component, in its design system or a library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise build it from plain HTML: buttons with tab roles, and panels.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## When to use tabs

- Tabs switch between panels of related content in one place on a page, one panel at a time, such as a settings page's sections or a record's details and history.
- When each tab is a page with its own URL, it's navigation: links with `aria-current="page"` on the current one, styled like tabs if the design wants it, never `role="tab"`.
- Content people compare side by side belongs together on the page, and a long form reads better as sections with headings.

## Structure

- The tab list (`role="tablist"`) is named: `aria-labelledby` pointing to a visible heading, or `aria-label`. It holds only tabs.
- Each tab is a `<button>` with `role="tab"`, an `id`, `aria-selected`, and `aria-controls` pointing to its panel. Each panel has `role="tabpanel"` and `aria-labelledby` pointing to its tab. Vertical tabs put `aria-orientation="vertical"` on the list.
- Only the selected tab's panel shows. The others have the `hidden` attribute, or aren't rendered; moving them out of view leaves them in the reading and Tab order.
- A panel gets `tabindex="0"` when its first content isn't focusable, so Tab from the tab list reaches it (APG).
- A tab's full label is its text. Long labels wrap, or the list scrolls; a `title` tooltip doesn't show on focus or on touch. A tab isn't a button to screen readers, so only the Button guide's styles carry over, not its semantics.

## Keys

- The tab list is one Tab stop: Tab enters it on the selected tab and leaves it for the panel. The Tab stop (`tabindex="0"`) follows focus while it's in the list, and goes back to the selected tab when focus leaves. Otherwise, after the arrows move focus to a tab that isn't selected, such as a disabled one or any tab with manual activation, Tab lands on the selected tab instead of leaving the list.
- Right and Left Arrow move between tabs, swapped in right-to-left text, and Down and Up in a vertical list. They wrap at the ends. Home and End go to the first and the last tab. Arrows of the other direction are left to the page.
- With automatic activation, the default, the tab that gets focus is selected; use it when panels show at once. With manual activation, the arrows move focus, and Enter or Space selects the focused tab; use it when a panel takes time to load.
- A disabled tab has `aria-disabled="true"`. It gets focus with the arrows, so screen reader users learn it exists, but it's never selected, by keys or by clicks (APG). Its label can say why, such as "Team (Business plan)".

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<h2 id="settings-title">Settings</h2>
<div role="tablist" aria-labelledby="settings-title">
  <button type="button" role="tab" id="tab-profile" aria-controls="panel-profile" aria-selected="true">Profile</button>
  <button type="button" role="tab" id="tab-billing" aria-controls="panel-billing" aria-selected="false" tabindex="-1">Billing</button>
  <button type="button" role="tab" id="tab-team" aria-controls="panel-team" aria-selected="false" tabindex="-1" aria-disabled="true">Team (Business plan)</button>
  <button type="button" role="tab" id="tab-security" aria-controls="panel-security" aria-selected="false" tabindex="-1">Security</button>
</div>
<!-- tabindex="0" on a panel that starts with text, so Tab from the tab list reaches it -->
<div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile" tabindex="0">…</div>
<div role="tabpanel" id="panel-billing" aria-labelledby="tab-billing" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-team" aria-labelledby="tab-team" tabindex="0" hidden>…</div>
<div role="tabpanel" id="panel-security" aria-labelledby="tab-security" tabindex="0" hidden>…</div>
```

```js
// The tab list is one Tab stop. The arrow keys move between tabs (Left and Right swap in
// right-to-left text; Up and Down move in a vertical list), Home and End go to the first and
// last tab, and with automatic activation the tab that gets focus is selected. A disabled tab
// gets focus, so screen reader users learn it exists, but it's never selected.
const tablist = document.querySelector('[role="tablist"]');
const tabs = [...tablist.querySelectorAll('[role="tab"]')];
const automatic = tablist.dataset.activation !== 'manual';
const disabled = (tab) => tab.getAttribute('aria-disabled') === 'true';
const tabStop = (tab) => tabs.forEach((other) => { other.tabIndex = other === tab ? 0 : -1; });

function select(tab) {
  for (const other of tabs) {
    const selected = other === tab;
    other.setAttribute('aria-selected', String(selected));
    document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
  }
  tabStop(tab);
}
tablist.addEventListener('click', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (tab && !disabled(tab)) select(tab);
});
tablist.addEventListener('keydown', (event) => {
  const index = tabs.indexOf(document.activeElement);
  const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
  const forward = vertical ? 'ArrowDown' : getComputedStyle(tablist).direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const back = vertical ? 'ArrowUp' : forward === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft';
  const target = { [forward]: index + 1, [back]: index - 1, Home: 0, End: tabs.length - 1 }[event.key];
  if (target === undefined || index < 0) return;
  event.preventDefault();
  const tab = tabs[(target + tabs.length) % tabs.length];
  tab.focus();
  if (automatic && !disabled(tab)) select(tab);
});
// The Tab stop follows focus in the list, so Tab always leaves it for the panel, even from a
// tab that has focus but isn't selected; when focus leaves, it goes back to the selected tab
tablist.addEventListener('focusin', (event) => tabStop(event.target));
tablist.addEventListener('focusout', (event) => {
  if (!tablist.contains(event.relatedTarget)) tabStop(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true'));
});
```

## Panels that load

A panel whose content loads: select its tab at once and show the loading state in the panel. If people move on before it arrives, only the latest selection's answer fills its panel; number the requests, or abort the previous one. An error shows in the panel, with Retry. For panels that are always slow, use manual activation or load the likely ones ahead.

## Many tabs

- Fewer, shorter labels come first, then grouping tabs into higher-level sections.
- A scrollable tab list scrolls sideways and keeps the selected tab in view. The arrow keys reach every tab, so Previous and Next scroll buttons, if any, sit next to the list, never inside it, and can stay out of the Tab order (`tabindex="-1"`) and hidden from screen readers (`aria-hidden="true"`).
- Optional: a More button next to the list, for tabs that don't fit. It's a disclosure with a list of buttons, one per hidden tab; choosing one selects that tab and shows it in the row.

## Adding and removing tabs

- When a tab is removed and it had focus, focus moves to its neighbor, the next tab or else the previous one; otherwise focus stays where it is. A selected tab that's removed or becomes disabled hands the selection to its nearest enabled neighbor.
- Optional: keep the selected tab in the URL, as a query parameter, so a reload or a shared link opens the same tab.

## Phones

On phones, tabs are horizontal and scroll when their labels don't fit, and targets are 44 px tall; vertical tabs turn horizontal, or into sections with headings. Nothing scrolls sideways at 320 px wide apart from the tab list itself.

## Appearance

These are suggested defaults; the project's design and tokens win.

- Tabs are at least 44 px tall, with 12 to 16 px of padding on each side.
- The selected tab is marked by more than color: an indicator line 2 to 3 px thick with 3:1 contrast against the background, and a stronger font weight. Focus indicators meet 3:1, and labels 4.5:1, disabled ones included. Check the project's own colors.
- Motion is optional: the indicator moves over 180 ms, and a panel fades in over 150 ms. Under `prefers-reduced-motion: reduce`, nothing moves.

## Edge cases

- **One tab**: show the panel without a tab list.
- **Tabs inside a tab panel**: avoid them; use headings or a second level of navigation.
- **Narrow containers**: in a card or a grid cell, the tab list scrolls inside its container, and the panel never overflows it.

## Acceptance checklist

- [ ] The tab list is named by its heading or by aria-label, and holds only tabs
- [ ] Each tab has role="tab", aria-selected, and aria-controls; each panel has role="tabpanel" and aria-labelledby
- [ ] The tab list is one Tab stop: Tab enters it on the selected tab, and leaves it for the panel from any tab, even one that has focus but isn't selected; the panel has tabindex="0" when it starts with text
- [ ] The arrow keys move between tabs and wrap at the ends, Home and End go to the first and last, and Left and Right swap in right-to-left text
- [ ] Vertical tabs have aria-orientation="vertical" and use Up and Down; the other arrows are left to the page
- [ ] With automatic activation the focused tab is selected; with manual activation, Enter or Space selects it
- [ ] A disabled tab has aria-disabled="true", gets focus with the arrows, and is never selected by keys or clicks
- [ ] Panels that aren't selected are hidden, or not rendered, not only moved out of view
- [ ] A panel that loads shows its loading state at once, and only the latest selection's answer fills it
- [ ] With many tabs, the list scrolls and keeps the selected tab in view, and any scroll buttons sit outside the tab list
- [ ] Removing the focused tab moves focus to its neighbor; removing another tab leaves focus where it is
- [ ] Pages with their own URLs use links with aria-current="page", not tabs
- [ ] The selected tab is marked by more than color, and under reduced motion nothing moves
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Data Table (Sortable, Paginated, Filterable)](/potions/components/data-table)**: views of a table, such as All, Open, and Archived, in tab panels.
- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)**: dense admin pages split into panels.
- **[Button](/potions/components/button)**: the project's button styles for tabs; a tab keeps `role="tab"`.

These are suggestions; tabs work on their own.
