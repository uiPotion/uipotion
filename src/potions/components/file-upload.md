---
layout: 'potion'
title: 'File Upload Component'
publicationDate: '2026-02-03'
excerpt: 'A file upload that works by keyboard, pointer, and drag and drop: a button opens the picker, the whole area takes dropped files without the browser opening them, and each file is checked and listed with its own progress and Remove button, while the server checks everything again.'
category: 'Components'
tags:
  - components
  - file-upload
  - dropzone
  - drag-and-drop
  - forms
  - a11y
  - wcag
  - aria
  - keyboard-navigation
  - progress
  - validation
agentManifest: 'potions/components/file-upload.json'
path: 'potions/components/file-upload'
promptSubject: 'file upload'
useWhen: 'people attach files to a form or upload them, such as documents, images, or a CSV import, and you need drag and drop that also works without dragging.'
specifies:
  - 'A Choose files button opens the picker, so nothing needs dragging, and files dropped anywhere in the area are added.'
  - 'Each file is listed by name, with its progress and a Remove button named after it.'
  - 'A file that can''t be added says why, and the server checks the type, size, and count again.'
example: 'Someone drops three PDFs and a photo onto the area. The PDFs are listed and start uploading, and the photo shows "photo.heic isn''t a PDF or Word file" next to its name.'
---

Attaching a file should work however people work: with a keyboard, a mouse, a touch screen, or by dragging from their desktop. This guide covers choosing and dropping files, checking them, and listing them with their progress and errors. It targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has an upload component, library, or service, configure or extend it to meet this guide. Keep its API and its upload code.
2. Otherwise build on the native `<input type="file">`: a visible button opens it, and the app keeps the chosen files and sends them.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Structure

- **Group**: an element with `role="group"`, named by the field's visible label (`aria-labelledby`). The whole group is the drop area. It isn't a button: interactive elements can't sit inside a button, and a drop area is a region, not a control.
- **Hint**: what's accepted and the limits ("PDF or Word files, up to 10 MB each"), and that files can be dropped or chosen. It describes Choose files (`aria-describedby`).
- **Error**: for the field as a whole, such as "Choose at least one file", also in Choose files' `aria-describedby`, empty and hidden until it's needed.
- **Choose files**: a `<button type="button">` that opens the picker by calling the hidden input's `click()`. It's the way in that needs no dragging (WCAG 2.2 2.5.7).
- **File input**: `type="file"` with `accept` and `multiple`, hidden. `accept` filters the picker.
- **File list**: each file's name as text, never HTML, its size, its status, its progress while uploading, and its buttons.
- **Status region**: one, present before it changes, for files added, removed, rejected, uploaded, and failed.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<div class="upload" role="group" aria-labelledby="documents-label">
  <p class="upload-label" id="documents-label">Documents (optional)</p>
  <p class="upload-hint" id="documents-hint">PDF or Word files, up to 10 MB each. Drop them here, or choose them.</p>
  <p class="upload-error" id="documents-error" hidden></p>
  <button type="button" class="upload-choose" aria-describedby="documents-hint documents-error">Choose files</button>
  <input type="file" id="documents" multiple accept=".pdf,.doc,.docx" hidden>
  <ul class="upload-files" aria-label="Chosen files">
    <!-- One item per file, its name set as text, never as HTML -->
    <li>
      <span class="upload-name">report.pdf</span>
      <progress max="100" value="40" aria-label="Uploading report.pdf"></progress>
      <button type="button">Remove <span class="visually-hidden">report.pdf</span></button>
    </li>
  </ul>
  <p class="visually-hidden" role="status"></p>
</div>
```

## Choosing and dropping

- Choose files opens the picker with a click, Enter, or Space.
- Files dropped anywhere in the area are added. The area highlights while files are dragged over it; a counter keeps the highlight steady while the pointer crosses the elements inside, and drags of text or links don't highlight it.
- A file dropped just outside the area would open in the tab and replace the page, form and all. While the uploader is on the page, cancel `dragover` and `drop` for files on the whole page.
- After reading the chosen files, clear the input's value. Otherwise, choosing the same file again, for example after removing it, fires no `change` in Chrome and Safari.
- Paste (optional): pasted files go through the same checks.

```js
// Choosing and dropping files. The whole upload group takes dropped files, and a counter keeps
// its highlight steady while the pointer crosses the elements inside it. addFiles(files)
// stands for the app's own handling: check each file, list it, and start its upload.
const area = document.querySelector('.upload');
const input = document.getElementById('documents');
const hasFiles = (event) => event.dataTransfer?.types.includes('Files');
let depth = 0;

area.querySelector('.upload-choose').addEventListener('click', () => input.click());
input.addEventListener('change', () => {
  addFiles([...input.files]);
  input.value = ''; // so choosing the same file again fires change again
});

area.addEventListener('dragenter', (event) => {
  if (!hasFiles(event)) return;
  depth += 1;
  area.classList.add('is-dragging');
});
area.addEventListener('dragleave', (event) => {
  if (hasFiles(event) && --depth === 0) area.classList.remove('is-dragging');
});
area.addEventListener('drop', (event) => {
  depth = 0;
  area.classList.remove('is-dragging');
  addFiles([...event.dataTransfer.files]);
});

// A file dropped anywhere else on the page would open in the tab and replace it
for (const type of ['dragover', 'drop']) {
  window.addEventListener(type, (event) => {
    if (hasFiles(event)) event.preventDefault();
  });
}
```

## Checking files

- Check each file when it's added: its type against `accept`, its size, and the count. Reject it next to its name with the reason ("photo.heic isn't a PDF or Word file", "video.mp4 is larger than 10 MB"), and say it in the status region.
- `file.type` is the browser's guess from the extension, and empty for types it doesn't know, so match `accept` against the extension too, ignoring case.
- These checks are for the person's convenience. The server checks the type by the file's content, the size, and the count again, and treats file names as text.
- With one file, a new choice replaces the current one, and the status region says so. With several, files are added up to the limit, and the status region says when it's reached.
- A file with the same name, size, and modification time as one already chosen is ignored with a message, or replaces it; say which.

```js
// Why a file can't be added, or null when it can: its type against the input's accept list,
// its size, and how many files are already chosen. file.type is the browser's guess from the
// extension, and empty for types it doesn't know, so extensions count too, in any case. The
// server checks everything again, the type by the file's content.
function rejection(file, { accept = '', maxBytes = Infinity, chosen = 0, maxFiles = Infinity } = {}) {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  const rules = accept.split(',').map((rule) => rule.trim().toLowerCase()).filter(Boolean);
  const typeAllowed = rules.length === 0 || rules.some((rule) => (
    rule.startsWith('.') ? name.endsWith(rule)
      : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1))
        : type === rule));
  if (!typeAllowed) return 'type';
  if (file.size > maxBytes) return 'size';
  if (chosen >= maxFiles) return 'count';
  return null;
}
```

## The file list and uploads

- Each file shows its name, size, and status: ready, uploading, uploaded, failed, cancelled, or unknown. Its buttons are Remove, and Cancel or Retry while they apply, each named after the file, with visually hidden text after the visible word ("Remove report.pdf").
- Progress is the native `<progress>` element, named after its file. `fetch()` reports no upload progress, so use `XMLHttpRequest`'s upload events, or the project's upload library.
- Cancel aborts the request. Give each file an id (`crypto.randomUUID()`). A dropped connection leaves the outcome unknown, since the server may have the file: the status says so, and Retry sends the same id, so the server keeps one copy.
- The status region says when each file is added, removed, uploaded, or fails ("report.pdf uploaded"), at meaningful moments, never every percent.
- After Remove, focus moves to the next file's Remove button, or the previous one, or Choose files when the list is empty, never to the page body.
- Image previews are optional: an `<img>` from `URL.createObjectURL()`, released with `URL.revokeObjectURL()` when the file is removed. An `<img>` doesn't run an SVG's scripts; a user's file never goes in an `<iframe>` or `<object>`.
- Files sent with the form, rather than uploaded as they're added, are added to the form data by the app, since the input is cleared after each choice.
- A form reset doesn't clear the app's list of chosen files, since the input is empty after each choice anyway. After a reset that wasn't cancelled, clear the list, cancel unfinished uploads, release preview URLs, and say so in the status region. Wait for the reset event to finish, and check `defaultPrevented` first: a later listener can still cancel the reset.

## Accessibility

- Everything works from the keyboard: Choose files, and each file's buttons. File rows aren't focusable, and there are no row shortcuts: Delete or Backspace on a row would need a Tab stop per file, and the Remove button is enough.
- The hint says that files can be dropped, so the highlight isn't the only cue.
- A required upload says so in words. A submit without a file shows the field's error, and focus moves to Choose files.
- Text meets 4.5:1, and the area's edge, the highlight, and the focus indicator 3:1. Buttons are at least 24 by 24 px (44 px suggested on touch).

## Layout and motion

These are suggested defaults; the project's design and tokens win.

- The area fills its container and is at least 96 px tall. On phones, the list is one column, with each file's buttons at the end of its row; thumbnails are optional.
- At 320 px wide, long file names wrap, and nothing scrolls sideways.
- Motion is optional: the highlight fades in over about 140 ms, and new files over 160 ms. Under `prefers-reduced-motion: reduce`, nothing moves, and the progress element still fills.

## Edge cases

- **Long file names** wrap, or are shortened in the middle with the full name kept in the item's text for screen readers.
- **Leaving during uploads**: warn before the page is left (`beforeunload`) while uploads run, or let them finish in the background if the app can.
- **When the upload can't be used yet**: say why in text, and give Choose files `aria-disabled="true"`, so it can still be found.
- **Files the server rejects** show its message next to the file, with Remove.

## Acceptance checklist

- [ ] Choose files opens the picker with a click, Enter, or Space, so nothing needs dragging
- [ ] Files dropped anywhere in the area are added, and a file dropped elsewhere on the page doesn't open in the tab
- [ ] The highlight shows only while files are dragged over the area, and doesn't flicker over the elements inside it
- [ ] The same file can be chosen again after it was removed
- [ ] Each file is checked against the accepted types, with extensions in any case, the size, and the count, and a rejected file says why, by name
- [ ] The server checks the type by content, the size, and the count again, and file names are shown as text
- [ ] Each file's Remove, Retry, and Cancel buttons are named after it, and its progress is a progress element named after it
- [ ] One status region announces files added, removed, uploaded, and failed, without announcing every percent
- [ ] After Remove, focus lands on another file's Remove button or on Choose files, never on the page body
- [ ] A dropped connection shows the upload's outcome as unknown, and Retry doesn't create a second copy
- [ ] A form reset clears the list of chosen files and cancels unfinished uploads, and a cancelled reset changes nothing
- [ ] The area's edge, its text, and the focus indicator meet the contrast minimums, and buttons are at least 24 by 24 px
- [ ] Styles come from the project's styling system and tokens, like its other form controls

## See also

- **[Form Validation Pattern](/potions/patterns/form-validation)**: required uploads, and errors when a form is submitted.
- **[Select and Combobox](/potions/components/dropdown-select)**: the other fields in upload and settings forms.
- **[Login & Registration Forms](/potions/features/form-login-register)**: registration and profile forms that ask for a photo or a document.

These are suggestions; the upload works in any form.
