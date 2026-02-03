---
layout: 'potion'
title: 'File Upload Component'
publicationDate: '2026-02-03'
excerpt: 'A fully accessible file upload component with drag-and-drop, browse button fallback, validation (type/size/count), per-file progress, retry/cancel, and robust keyboard and screen reader support.'
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
---

# File Upload Component

A fully accessible file upload component with drag-and-drop, browse button fallback, validation (type/size/count), per-file progress, retry/cancel, and robust keyboard and screen reader support. Supports single or multiple files, optional previews, and async upload integration.

## Overview

The File Upload component provides a dropzone that accepts files via drag-and-drop or by activating a browse control (keyboard or click). It validates files by type, size, and count; displays a manageable list with per-file status and progress; and integrates with async upload flows via hooks. The component meets WCAG AA requirements and avoids keyboard traps while keeping focus management predictable.

## Component Structure

The component is built from a container that holds a label (with optional required indicator and tooltip), a dropzone, a hidden native file input, a file list, and optional hint and error text. The dropzone contains an icon, title, body text, and a browse button; it is wired to the hidden file input so that click or Enter/Space opens the system file picker. The file list shows one item per file: optional thumbnail, name, meta (size/type), status, optional progress bar, optional per-file error, and actions (remove, and optionally retry and cancel). A live region announces add/remove/error and status changes for screen readers.

## States and Configuration

### Component-Level State

- **disabled**: When true, the entire control is non-interactive (no browse, no drop).
- **required**: Shows required indicator (*) and affects validation messaging.
- **multiple**: Single-file mode replaces the current file; multi-file mode appends up to maxFiles.
- **accept**: Native file input accept string (e.g. `image/*,.pdf`) and used for validation messaging.
- **maxFiles**: Maximum number of files in multi-file mode (default 10).
- **maxSizeBytes**: Maximum file size in bytes (default 10MB).
- **globalError**: A single message for errors such as too many files or invalid type.

### Per-File State

Each file item has a stable id and: file reference, name, size, optional mimeType, status (ready, uploading, success, error, canceled), optional progress (0–100), optional error message, optional previewUrl for images, and optional result payload. Preview URLs must be created and revoked (e.g. createObjectURL / revokeObjectURL) to avoid memory leaks.

### Dropzone Visual State

- **Default**: Neutral border and background.
- **Drag over**: Accent border and subtle accent background; transition about 140ms with reduced motion respected.
- **Focus**: Visible focus ring; dropzone is focusable and activates file picker with Enter or Space.

## Required and Optional Props

**Required**: Label (string) and name (string). The control must have an id (generated from name if not provided) and a programmatically associated label.

**Optional configuration**: required (boolean), disabled (boolean), multiple (boolean), accept (string, e.g. `image/*,.pdf`), maxFiles (number, default 10), maxSizeBytes (number, default 10MB), hint (string), error (string or null for global error), showPreviews (boolean, default true), className (string).

**Value and callbacks**: value (controlled array of file items) or defaultValue (uncontrolled); onChange (when file list changes); onFilesRejected (when validation fails); onUploadStart, onUploadProgress, onUploadComplete, onUploadError, onCancelUpload, onRetryUpload for async upload integration.

**FileItem shape**: Each item has id, file, name, sizeBytes, optional mimeType, status (ready | uploading | success | error | canceled), optional progress (0–100), optional error message, optional previewUrl, optional result. Use stable ids (e.g. from name+size+lastModified or a generated id).

## Validation

Validation runs when files are added (via picker or drop). Rejected files get a reason (type, size, count, or unknown) and a message. When validation fails, set per-file error and/or globalError and optionally call onFilesRejected. Accepted files are normalized into internal file items with stable ids and appended (multi) or replace (single).

## Interactions

- **Dropzone click or Enter/Space**: Opens the native file picker (programmatic click on hidden input).
- **Dropzone drag enter/leave**: Sets drag-over visual state; on drop, prevent default and ingest files from DataTransfer.
- **Remove file**: Removes the item; if uploading, call onCancelUpload before removing; announce removal in live region; move focus to next logical target (next remove button or dropzone).
- **Retry**: Calls onRetryUpload (or onUploadStart); resets error and sets status to uploading; announce in live region.
- **Cancel**: Calls onCancelUpload; set status to canceled or remove; announce in live region.

## Async Upload Integration

The component exposes hooks for integration with your upload pipeline: onUploadStart, onUploadProgress (fileId, progress 0–100), onUploadComplete (fileId, result), onUploadError (fileId, error), onCancelUpload (fileId), onRetryUpload (fileId). The component does not upload by itself; it calls these so you can wire to your API. Per-file progress bar and status (uploading, success, error, canceled) should reflect the values you pass back via controlled state or callbacks.

## Accessibility Requirements

### WCAG 2.1 Level AA

- **1.3.1**: Label is programmatically associated with the file control (for/id or aria-labelledby on the dropzone).
- **1.4.3**: Text, borders, and focus indicators meet contrast requirements.
- **2.1.1**: All functionality is keyboard operable (open picker, remove, retry, cancel).
- **2.1.2**: No keyboard trap; Tab moves naturally through label, dropzone, and file list actions.
- **2.4.3**: Logical focus order: label, then dropzone/button, then file list actions.
- **2.4.7**: Visible focus indicator on dropzone and action buttons.
- **3.3.1**: Errors clearly identified (global and per-file).
- **4.1.2**: Controls expose name, role, and state (dropzone behaves like a button).
- **4.1.3**: Status changes (added, removed, error, progress) announced via live region.

### Keyboard Navigation

- **Dropzone**: Tab to focus; Enter or Space to open file picker. Escape must not clear selection unexpectedly.
- **File list**: Tab between remove/retry/cancel; Enter or Space to activate focused button; Delete or Backspace can remove the focused file if implemented on the row.

### ARIA and Live Region

- Dropzone: role button (or native button), aria-disabled when disabled, aria-labelledby (or aria-label), aria-describedby for hint + error + instructions, aria-invalid when global error exists.
- File list: role list, aria-label "Selected files".
- File item: role listitem; optional aria-label with name and status.
- Progress: role progressbar, aria-valuemin 0, aria-valuemax 100, aria-valuenow current, aria-label "Upload progress for &lt;file name&gt;".
- Live region: role status, aria-live polite, aria-atomic true for add/remove/error/status announcements.

### Focus Management

- After add: Do not steal focus; optionally move focus to first error if validation fails.
- After remove: Move focus to next file action or back to dropzone if the list is empty.
- When disabled: No interactive focus or set aria-disabled and prevent activation.

## Responsive Behavior

- **Mobile (under 768px)**: Stack content vertically; dropzone full-width; file list items in a single column with actions at end; minimum 44px touch targets for buttons and actions; optionally hide or reduce thumbnails.
- **Desktop (1024px and up)**: Dropzone and file list in one column; actions inline to the right; larger previews; hover affordances on dropzone and list actions when not disabled.

## Animations

- **Drag over**: Border and background transition (about 140ms, cubic-bezier(0.4, 0, 0.2, 1)).
- **File item enter**: Opacity and slight vertical translate (about 160ms).
- **File item exit**: Opacity and translate out (about 140ms).
- **Progress bar**: Width updates with short easing (about 120ms).
- **Reduced motion**: Honor prefers-reduced-motion: reduce; disable transforms and minimize transitions.

## Design Tokens (Reference)

Layout: container min height 120px, padding 16px, border radius 8px, dropzone min height 96px, button height 40px, file list gap 10px, file item padding 12px, progress height 6px. Typography: label 14px weight 500, dropzone title 14px, body 13px, file name 14px, meta 12px, hint/error 13px. Motion: hover/focus transitions about 120–150ms, drag-over about 140ms, item enter/exit about 160ms/140ms, easing cubic-bezier(0.4, 0, 0.2, 1). Use your project design tokens for colors, spacing, and focus/error styles.

## Common Variations

- **Single file**: One file at a time; selecting a new file replaces the current one. Set multiple=false and show replace affordance when a file is present.
- **Multi file**: Append until maxFiles; show count or list. Set multiple=true.
- **With preview**: Image thumbnails via object URLs; set showPreviews=true; revoke URLs on remove or unmount to avoid memory leaks.
- **Direct upload**: Wire onUploadStart, onUploadProgress, onUploadComplete, onUploadError, onCancelUpload, onRetryUpload and show per-file progress and status.
- **Documents only**: Use accept (e.g. `.pdf,.doc,.docx`) and validate type; show clear error for wrong type.

## Edge Cases

- **Duplicate files**: User selects or drops the same file twice. Compare by name, size, and lastModified (or hash) and either reject with a message or ignore; document the chosen behavior.
- **Very long filename**: Truncate with ellipsis in the UI; expose full name via title attribute or on focus; avoid layout overflow.
- **Many files**: With many items (e.g. 50+), consider virtualizing the list or limiting visible items; enforce maxFiles and announce when limit reached.
- **Paste from clipboard**: Optionally support paste events: read image (or file) items from the clipboard, run the same validation, and add to the list.
- **Upload aborted**: If the user navigates away or the component unmounts during upload, call onCancelUpload for in-flight uploads and revoke any object URLs in cleanup.
- **Required but empty**: When the field is required and no file is selected, show an error on submit and set aria-invalid with a clear global message.

## Styling Approaches

Use your project's styling system only. Match existing form components for focus ring, error borders, and disabled state.

- **Tailwind**: Use space-y for container and file list; min-height and padding for dropzone; border-dashed and rounded-lg; focus:ring-2 focus:ring-blue-500; state classes for dropzone--drag, fileItem--error; progress bar with h-1.5 and transition-[width].
- **CSS Modules / SCSS**: Create classes for container, label, dropzone, dropzone--drag, dropzone--disabled, fileList, fileItem, fileItem--error, progress, progressBar, hint, error. Use BEM or your project's convention.
- **Styled-components**: Themed components with props for dragActive, disabled, hasError; use theme tokens for spacing, radius, and status colors.

## Implementation Checklist

- Label renders and is associated with the control (for/id or aria-labelledby).
- Required indicator (*) when required=true.
- Dropzone opens file picker with Enter/Space and click.
- Drag-and-drop adds files and prevents default browser behavior.
- Validation rejects invalid type, oversize, or over-count with clear messages.
- Global error is visible and referenced via aria-describedby.
- Per-file error is visible near the file item.
- Remove works via mouse and keyboard; focus moves to next target or dropzone.
- Cancel and retry work when provided.
- Progress bar updates and is exposed with progressbar semantics when used.
- Live region announces add, remove, error, and status transitions.
- Disabled state prevents interaction and is communicated to assistive tech.
- Focus ring is visible and meets contrast; no keyboard traps; Tab/Shift+Tab behave normally.
- Mobile layout uses at least 44px touch targets; reduced motion respected.

## Framework Examples

### React (Controlled)

Use useState for the files array and useRef for the hidden input. Assign a stable id per file (e.g. nanoid or name+size+lastModified). Wire onChange and upload callbacks.

```jsx
const [files, setFiles] = useState([]);

<FileUpload
  label="Documents"
  name="documents"
  multiple
  accept=".pdf,.doc"
  maxSizeBytes={5242880}
  value={files}
  onChange={setFiles}
  onUploadStart={uploadFile}
  onUploadProgress={setProgress}
  onUploadComplete={onDone}
  onUploadError={onErr}
  error={errors.files}
/>
```

### Vue

Use ref for the files array and input element. Revoke object URLs in onBeforeUnmount. Use :value and @change (or v-model with computed get/set) for the file list.

```vue
<FileUpload
  label="Documents"
  name="documents"
  :multiple="true"
  accept=".pdf,.doc"
  :max-size-bytes="5242880"
  :value="files"
  @change="files = $event"
  @upload-start="uploadFile"
  @upload-progress="setProgress"
  :error="errors.files"
/>
```

### Angular

Integrate with Reactive Forms via ControlValueAccessor; value is an array of FileItem. Use ViewChild for the input element; call your upload service from onUploadStart and related outputs.

```html
<app-file-upload
  [label]="'Documents'"
  formControlName="documents"
  [multiple]="true"
  accept=".pdf,.doc"
  [maxSizeBytes]="5242880"
  (uploadStart)="uploadFile($event)">
</app-file-upload>
```

### Svelte

Use bind:value and on:change for the file list (or a reactive store). Use bind:this for the input element. Revoke object URLs when a file is removed or on destroy.

```svelte
<FileUpload
  label="Documents"
  name="documents"
  multiple
  accept=".pdf,.doc"
  maxSizeBytes={5242880}
  bind:value={files}
  on:change={(e) => files = e.detail}
  on:uploadStart={handleUploadStart}
  error={errors.files}
/>
```

## Testing Checklist

- Label association and required indicator.
- Dropzone activates file picker with Enter/Space.
- Drag-and-drop adds files; validation rejects invalid type/size/count with messages.
- Global and per-file errors display and are announced.
- Remove, retry, and cancel work (mouse and keyboard).
- Progress and status update; progressbar semantics when used.
- Live region announcements for add/remove/error/status.
- Disabled state prevents interaction.
- Focus order and visible focus; no keyboard traps.
- Mobile layout and 44px touch targets; reduced motion support.

---

## See Also

The File Upload component works well with these potions:

- **[Dropdown/Select Component](/potions/components/dropdown-select.html)** - Often used alongside dropdowns in forms and settings; shares patterns for errors, focus, and keyboard support.
- **[Form Validation Pattern](/potions/patterns/form-validation.html)** - Apply validation timing and error display best practices to file validation and submission flows.
- **[Login & Registration Forms](/potions/features/form-login-register.html)** - Full form UX patterns; file upload often appears in profile and onboarding flows.

These are suggestions. File Upload works independently and can be used in any context.

---

## Summary for AI Agents

**Goal**: Implement an accessible file upload with drag-and-drop and browse fallback, validation (type/size/count), per-file list with status and progress, retry/cancel hooks, and WCAG AA-compliant keyboard and screen reader support.

**Critical requirements**:
1. Detect the project's framework and styling system first; use only that system.
2. Use a hidden native input type="file" wired to the dropzone/button; dropzone must be keyboard operable (Enter/Space).
3. Validate accept, maxSizeBytes, maxFiles; set global and per-file errors and optional onFilesRejected.
4. Maintain stable file ids and per-file state (status, progress, error); optional preview with safe URL lifecycle (createObjectURL/revokeObjectURL).
5. Expose upload hooks (onUploadStart, onUploadProgress, onUploadComplete, onUploadError, onCancelUpload, onRetryUpload) for async integration.
6. ARIA: label association, aria-describedby for hint/error/instructions, live region for add/remove/error/status, progressbar for progress.
7. Focus: no trap; after remove, move focus to next action or dropzone; visible focus ring.
8. Responsive: compact on mobile, 44px touch targets; reduced motion support.
