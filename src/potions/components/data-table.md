---
layout: 'potion'
title: 'Data Table (Sortable, Paginated, Filterable)'
publicationDate: '2026-01-18'
excerpt: 'A table for browsing records, with sortable headers, a filter field, and pages, and a selection kept across pages with a header checkbox for the page. It stays a real table, with a caption and row headers.'
category: 'Components'
tags:
  - components
  - data-table
  - table
  - sortable
  - pagination
  - filtering
  - selection
  - responsive
  - a11y
  - wcag
  - admin
  - dashboard
agentManifest: 'potions/components/data-table.json'
path: 'potions/components/data-table'
promptSubject: 'data tables'
useWhen: 'people browse, sort, filter, or select records in a table, such as orders or customers in an admin app.'
specifies:
  - 'Sortable headers are buttons inside the column headers, and only the sorted column has aria-sort.'
  - 'The selection is kept across pages and filters, and the header checkbox shows only the rows on this page.'
  - 'A filter field narrows the rows, goes back to page 1, and says how many rows match once typing pauses.'
example: 'Someone selects Zoë Saldana and moves to page 2. The toolbar says "1 selected, 1 not on this page", and the header checkbox is empty again.'
---

A data table is where people find and act on records. Its problems are mostly about reach and state: header cells that only a mouse can sort, `aria-sort` on every column, focusable rows that add a Tab stop each, a header checkbox that counts rows on other pages, and a Next button that drops focus on the last page. This guide covers a plain, sortable, filterable, paginated table with selection, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a data table, or a table library it already uses, configure or extend it to meet this guide. Keep its API.
2. Otherwise build it from a plain `<table>`.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Structure

- It's a real `<table>`. A `<caption>` names it, or `aria-labelledby` points to its heading. Column headers are `<th scope="col">`, and the cell that identifies a row, such as a name, is a `<th scope="row">`, so screen readers say whose row a cell is in.
- It's a plain table, not a grid: Tab moves between its controls (sort buttons, checkboxes, links), and rows and cells aren't focusable. Arrow-key navigation between cells belongs to the grid pattern (`role="grid"`, one Tab stop, editing keys), which this guide doesn't cover.
- Numbers are right-aligned, with tabular figures, and dates are `<time datetime>` elements.
- A table wider than its container scrolls inside a region with `role="region"`, named by the caption, and `tabindex="0"`, so keyboard users can scroll to columns that have nothing focusable.
- A cell that's cut short still gives a way to the whole value: let it wrap, or show it in the row's details.

## Sorting

- A sortable column has a `<button>` inside its `<th>`, named by the column's name; the header cell itself can't take focus. As in the APG sortable table example, the caption says that the column buttons sort.
- `aria-sort` ("ascending" or "descending") is only on the sorted column's `<th>`. The other headers have none; ARIA allows one sorted header at a time.
- A click on the sorted column reverses it, and a click on another column sorts it ascending. A third state that restores the original order is optional.
- Each column compares by its type: numbers as numbers, dates by their value, and text with `Intl.Collator` (`numeric: true`), so "Émile" sorts with E, and "Item 2" comes before "Item 10".
- The status region says how the table is sorted ("Sorted by Name, ascending"), and sorting goes back to page 1.
- With sorting on the server, send the column and the direction, set `aria-sort` when the answer arrives, and let only the latest answer fill the table.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version. The two scripts share the table; `status` is the table's status region, and `pageShown()` runs after a page of rows is rendered.

```html
<p class="table-status visually-hidden" role="status"></p>
<p class="selection-count"></p>
<!-- The region scrolls sideways when the table is wider than the page; tabindex lets the
     keyboard scroll it -->
<div class="table-scroll" role="region" aria-labelledby="customers-caption" tabindex="0">
  <table class="customers">
    <caption id="customers-caption">Customers <span class="visually-hidden">(the column buttons sort the table)</span></caption>
    <thead>
      <tr>
        <th scope="col"><input type="checkbox" class="select-all" aria-label="Select all customers on this page"></th>
        <th scope="col" aria-sort="ascending"><button type="button">Name</button></th>
        <th scope="col" data-type="number"><button type="button">Orders</button></th>
        <th scope="col" data-type="date"><button type="button">Last order</button></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="checkbox" value="c-1042" aria-label="Select Émile Zola"></td>
        <th scope="row">Émile Zola</th>
        <td>12</td>
        <td data-value="2026-10-02"><time datetime="2026-10-02">2 Oct 2026</time></td>
      </tr>
      <!-- one row per customer on this page -->
    </tbody>
  </table>
</div>
```

```js
// Sortable headers, after the APG sortable table: a button in each sortable <th>, aria-sort on
// the sorted column only, and a comparison for each column's type. Text sorts with
// Intl.Collator, so "Émile" sorts with E, and "Item 2" comes before "Item 10".
const table = document.querySelector('.customers');
const status = document.querySelector('.table-status');
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
const compare = {
  text: (a, b) => collator.compare(a, b),
  number: (a, b) => Number(a) - Number(b),
  date: (a, b) => (a < b ? -1 : a > b ? 1 : 0), // ISO dates in data-value sort as text
};

table.tHead.addEventListener('click', (event) => {
  const button = event.target.closest('th button');
  if (!button) return;
  const header = button.closest('th');
  const direction = header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
  for (const th of table.tHead.querySelectorAll('th')) th.removeAttribute('aria-sort');
  header.setAttribute('aria-sort', direction);
  const value = (row) => row.cells[header.cellIndex].dataset.value ?? row.cells[header.cellIndex].textContent.trim();
  const sign = direction === 'ascending' ? 1 : -1;
  const rows = [...table.tBodies[0].rows].sort((a, b) => sign * compare[header.dataset.type ?? 'text'](value(a), value(b)));
  table.tBodies[0].append(...rows);
  status.textContent = `Sorted by ${button.textContent}, ${direction}`;
});
```

## Filtering

- One labelled filter field above the table ("Filter customers", an `<input type="search">`) narrows the rows by their text, in the browser or on the server.
- Once typing pauses, the status region says how many rows match ("12 customers"). With none, the table says "No customers match", with a Clear filter button.
- A new filter goes back to page 1, and only the latest answer counts: number the requests, or abort the previous one.
- Rows the filter hides stay selected, and the selection toolbar counts them with the rows on other pages.
- Optional: filters for single columns, such as a status select, in the same bar above the table, each with a visible label, and a Clear all button. The filter's value can also go in the URL, so a link opens the same view.

## Pages

- Below the table: Previous and Next, page numbers from 768 px, a "Rows per page" select (10, 25, 50, or 100), and a summary ("Showing 11–20 of 245").
- Previous on the first page and Next on the last use `aria-disabled="true"` and ignore presses. The native `disabled` attribute on a focused Next, as the last page loads, drops focus to the page (checked in Chromium, Firefox, and WebKit).
- The current page's button has `aria-current="page"`, and page buttons are named with the word ("Page 3"), visible or visually hidden.
- The status region says the new summary after a page change. If the page scrolls to the table's top, focus moves there too, to the caption or the table's heading (`tabindex="-1"`); otherwise the scroll position stays.
- A new page size goes back to page 1. The page and its size can go in the URL. With pages on the server, send the page and the size, and show the total the server returns.

## Selection

- Each row has a checkbox named after the row ("Select Émile Zola"), and the header has one for the page ("Select all customers on this page"). The checkbox is the one control: rows get neither `tabindex` nor `aria-selected`, which belong to the grid pattern.
- The selection is kept by row id across pages and the filter. The header checkbox shows only this page: checked when every row on it is selected, and partly checked (`indeterminate`, read as "mixed") when some are.
- Optional: Shift and a click selects the rows between the last one clicked and this one. Keyboard users check rows one at a time.
- The selection toolbar's space is reserved above the table, so rows don't move under the pointer when it appears. It says how many rows are selected and how many of them aren't on this page ("5 selected, 2 not on this page"), with Clear selection and the bulk actions, named with the count ("Delete 5 customers"). Delete asks first or offers undo, as the Modal Dialog guide describes.
- Optional: after the page is selected, the toolbar offers "Select all 245 customers".

```js
// Row checkboxes, and the header checkbox for this page. The selection is kept by row id
// across pages and filters; the header checkbox shows only this page: checked when every row
// on it is selected, partly checked (indeterminate) when some are.
const selectAll = table.querySelector('.select-all');
const count = document.querySelector('.selection-count');
const selected = new Set();
const boxes = () => [...table.tBodies[0].querySelectorAll('input[type="checkbox"]')];

function update() {
  const onPage = boxes().filter((box) => box.checked).length;
  selectAll.checked = onPage > 0 && onPage === boxes().length;
  selectAll.indeterminate = onPage > 0 && onPage < boxes().length;
  const elsewhere = selected.size - onPage;
  count.textContent = selected.size === 0 ? '' : `${selected.size} selected${elsewhere ? `, ${elsewhere} not on this page` : ''}`;
}
function setRow(box, checked) {
  box.checked = checked;
  if (checked) selected.add(box.value);
  else selected.delete(box.value);
}
table.tBodies[0].addEventListener('change', (event) => {
  if (event.target.type === 'checkbox') setRow(event.target, event.target.checked);
  update();
});
selectAll.addEventListener('change', () => {
  for (const box of boxes()) setRow(box, selectAll.checked);
  update();
});
// After a page of rows is rendered (paging, sorting on the server, filtering)
function pageShown() {
  for (const box of boxes()) box.checked = selected.has(box.value);
  update();
}
```

## Loading, empty, and error

- While loading, skeleton rows keep the table's shape and are hidden from screen readers (`aria-hidden="true"`); the status region says "Loading customers…". The header stays.
- Empty, the table says why, with the next step: "No customers yet" with the action that adds one, or, with a filter, "No customers match" with Clear filter.
- On an error, the table shows a message and Retry, in text. Server errors and stack traces stay in the logs.
- Each table keeps its own loading, empty, and error states, so it still works on its own.

## Phones

- Below 768 px, rows can become cards in a list (`<ul>`), each card's fields a description list (`<dl>`), with the row's name as the card's heading. The checkboxes stay, named after their rows; sorting moves to a "Sort by" select, and pagination to Previous and Next.
- When the columns need to be compared side by side, keep the table, scrolling in its region, instead.

## Sticky header

Optional: a sticky header row. Inside the horizontal scroll region, it doesn't stick to the page, since the region is its scroll container (checked in Chromium, Firefox, and WebKit). Use one per table: a sticky header without sideways scrolling, with `top` at the height of any sticky bar above it, or a region with a maximum height that scrolls both ways.

## Variations

- Row details: a disclosure button in the row ("Show details for Émile Zola") with `aria-expanded`, and the details in the next row, across all columns.
- Editing in cells is the grid pattern, beyond this guide; editing in a form or a dialog keeps the table plain.
- Reordering rows or columns, or resizing columns, by dragging needs a way without dragging (WCAG 2.2 2.5.7), such as Move up and Move down buttons, or a width setting.

## Appearance

These are suggested defaults; the project's design and tokens win.

- Rows are 48 to 52 px tall, with 12 to 16 px of padding in each cell.
- Text meets 4.5:1; sort icons, checkbox edges, and focus indicators 3:1. The current page's button can be `#2563eb` with white text (5.2:1); `#3b82f6` is only 3.7:1. Muted text can be `#6b7280` (4.8:1 on white); `#9ca3af` is 2.5:1. Check the project's own colors.
- A selected row is marked by its checkbox and a background, not by color alone.

## Edge cases

- **One page**: the pagination can go; the summary stays.
- **Many columns**: the table scrolls in its region, or less important columns hide on smaller screens, never the row header.
- **Thousands of rows**: use pages, or render only part of the rows; then the table gets `aria-rowcount` and each row `aria-rowindex`.
- **Sorting a selection**: rows move with their checkboxes, and the selection stays.
- **Deleting rows**: afterwards, focus moves somewhere sensible nearby, such as the caption or the next row's checkbox, never the page's body.

## Acceptance checklist

- [ ] It's a table with a caption, column headers with scope="col", and a row header for the cell that names each row
- [ ] Sortable columns have a button inside the header, and aria-sort is on the sorted column only
- [ ] Numbers sort as numbers, dates by their value, and text by language with Intl.Collator, and the status region says how the table is sorted
- [ ] The filter field is labelled; a new filter goes back to page 1, only the latest answer counts, and the number of matches is said once typing pauses
- [ ] Previous and Next at the ends use aria-disabled, so focus stays on them, and the current page has aria-current="page"
- [ ] If a page change scrolls to the table, focus moves to the table too
- [ ] Each row's checkbox is named after its row, and rows aren't focusable themselves
- [ ] The header checkbox shows only this page: checked when all its rows are selected, mixed when some are
- [ ] The selection is kept across pages and the filter, and the toolbar says how many selected rows aren't on this page
- [ ] The toolbar's space is reserved, so rows don't move when it appears, and Delete asks first or offers undo
- [ ] A wide table scrolls inside a named region with tabindex="0", and the page doesn't scroll sideways
- [ ] Skeleton rows are hidden from screen readers, and empty and error states say what happened in text, with Clear filter or Retry
- [ ] On phones, rows are cards in a list with their fields in a description list, or the table scrolls in its region
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Dashboard Layout with Collapsible Sidebar](/potions/layouts/dashboard)**: the app shell around the table, whose main column wide tables can't widen.
- **[Tabs Component](/potions/components/tabs)**: views of the table, such as All, Open, and Archived, in tab panels.
- **[Modal Dialog](/potions/components/dialog)**: confirming a bulk delete.
- **[Select and Combobox](/potions/components/dropdown-select)**: filters for single columns.

These are suggestions; the table works on its own.
