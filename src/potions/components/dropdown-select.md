---
layout: 'potion'
title: 'Dropdown/Select Component - Accessible Select with Search and Multi-Select'
publicationDate: '2026-01-25'
excerpt: 'An accessible dropdown/select component with search/filter capability, multi-select support, keyboard navigation, and full ARIA combobox/listbox pattern. Supports grouped options, loading states, and error handling.'
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
---

# Dropdown/Select Component

An accessible dropdown/select component with search/filter capability, multi-select support, keyboard navigation, and full ARIA combobox/listbox pattern. Supports grouped options, loading states, and error handling.

## Overview

The Dropdown/Select component provides a fully accessible way to select one or more options from a list. It includes optional search/filter functionality, keyboard navigation, proper ARIA semantics, and support for single-select and multi-select modes. The component handles all common states: default, open, focus, error, disabled, and loading.

## Component Structure

```
Container
├── Label
│   ├── Label Text
│   ├── Required Indicator (*) [optional]
│   └── Tooltip [optional]
├── Trigger
│   ├── Selected Value(s) or Placeholder
│   └── Dropdown Icon
├── Dropdown (when open)
│   ├── Search Input [optional]
│   ├── Option List
│   │   ├── Group Label [optional]
│   │   ├── Option
│   │   │   ├── Option Text
│   │   │   └── Selected Icon [optional]
│   │   └── ...
│   ├── Loading Spinner [optional]
│   └── Empty State [optional]
├── Hint Text [optional]
└── Error Message [optional]
```

## States

### Default State
- Trigger displays placeholder or selected value
- Border: neutral gray
- Background: white
- Cursor: pointer
- Dropdown closed

### Open State
- Dropdown appears below trigger
- Options list visible and scrollable
- Search input visible (if searchable)
- Focus moves to search input or first option
- `aria-expanded='true'` set

### Focus State
- Trigger shows focus ring when focused
- Highlighted option shows focus background
- Smooth transition (150ms)
- Visible focus indicator

### Selected State
- Selected options show checkmark or highlight
- Trigger displays selected value(s)
- In multi-select: shows count or first few with "+N more"
- `aria-selected='true'` on selected options

### Error State
- Border changes to error color
- Error message appears below trigger
- Error icon shown
- `aria-invalid='true'` set

### Disabled State
- Background grayed out
- Text grayed
- Cursor: not-allowed
- Not interactive
- Label grayed out

### Loading State
- Spinner appears in dropdown
- Options may be disabled
- Indicates async data loading

### Empty State
- Message shown when no options match filter
- "No options found" or similar message
- Allows user to clear search

## Required Props

```typescript
{
  label: string;        // Dropdown label text
  name: string;         // Form field name
  options: Array<{     // Array of selectable options
    value: string;
    label: string;
    disabled?: boolean;
    group?: string;
  }>;
}
```

## Optional Props

```typescript
{
  id?: string;                          // Trigger ID (generated if not provided)
  value?: string | string[] | null;     // Selected value(s)
  defaultValue?: string | string[] | null; // Uncontrolled default value
  placeholder?: string;                 // Placeholder text
  error?: string | null;                // Error message
  hint?: string;                        // Hint text
  required?: boolean;                   // Required field
  disabled?: boolean;                   // Disabled state
  multiSelect?: boolean;                // Multi-select mode
  searchable?: boolean;                 // Enable search/filter
  loading?: boolean;                   // Loading state
  size?: 'small' | 'medium' | 'large';
  onChange?: (value: string | string[] | null) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (query: string) => void;   // Async search callback
  fullWidth?: boolean;                  // Full width (default: true)
}
```

## Size Variants

### Small
- Trigger height: 36px
- Padding: 12px horizontal, 8px vertical
- Font size: 14px
- Label font size: 13px

### Medium (Default)
- Trigger height: 44px
- Padding: 14px horizontal, 11px vertical
- Font size: 16px
- Label font size: 14px

### Large
- Trigger height: 52px
- Padding: 16px horizontal, 14px vertical
- Font size: 18px
- Label font size: 16px

## Variants

### Single-Select
- Selecting an option closes dropdown
- Value is a string
- Uses combobox or listbox ARIA pattern
- One option selected at a time

### Multi-Select
- Selecting options toggles them
- Dropdown stays open for multiple selections
- Value is an array of strings
- Uses listbox with `aria-multiselectable='true'`
- Multiple options can be selected

### Searchable
- Includes search input at top of dropdown
- Filters options as user types
- Uses combobox ARIA pattern with `aria-autocomplete='list'`
- Supports async search via `onSearch` callback

### Grouped Options
- Options organized into groups with labels
- Uses optgroup elements or `aria-groupedby`
- Groups visually and semantically separated
- Group labels are not selectable

## Keyboard Navigation

### On Trigger

- `Space`: **If closed**: Opens dropdown and moves focus to search/options. **If open and option highlighted**: Selects highlighted option. **CRITICAL**: Must handle both states - this is a common oversight.
- `Enter`: **If closed**: Opens dropdown and moves focus to search/options. **If open and option highlighted**: Selects highlighted option. **CRITICAL**: Must handle both states - this is a common oversight.
- `ArrowDown`: **If closed**: Opens dropdown and highlights first option. **If open**: Highlights next option.
- `ArrowUp`: **If closed**: Opens dropdown and highlights last option. **If open**: Highlights previous option.
- `Escape`: Closes dropdown if open
- `Tab`: Closes dropdown if open, moves focus to next element

### In Dropdown

- `ArrowDown`: Highlights next option, scrolls into view
- `ArrowUp`: Highlights previous option, scrolls into view
- `Enter`: **CRITICAL**: Selects highlighted option (same as clicking). Must work when option is highlighted via aria-activedescendant. Essential for keyboard accessibility.
- `Space`: **CRITICAL**: Selects highlighted option (same as clicking). Must work when option is highlighted via aria-activedescendant. Essential for keyboard accessibility.
- `Escape`: Closes dropdown, restores focus to trigger
- `Tab`: Closes dropdown, moves focus to next element
- `Shift+Tab`: Closes dropdown, moves focus to previous element
- `Home`: Highlights first option
- `End`: Highlights last option
- `Type-ahead`: Jumps to first option starting with typed character

### In Search Input

- `Enter`: **CRITICAL**: Selects highlighted option (or first option if none highlighted). Essential for keyboard accessibility. This is a common oversight.
- `Space`: **CRITICAL**: Selects highlighted option (or first option if none highlighted). Essential for keyboard accessibility. This is a common oversight.
- `ArrowDown`: Moves focus to first option and highlights it
- `Escape`: Closes dropdown if query empty, clears query if not empty
- `Tab`: Closes dropdown, moves focus to next element

## Accessibility Requirements

### ARIA Attributes

**Trigger Element:**
```html
<button
  id="category-trigger"
  name="category"
  aria-expanded="false"
  aria-haspopup="listbox"
  aria-controls="category-dropdown"
  aria-labelledby="category-label"
  aria-describedby="category-hint category-error"
  aria-invalid="false"
  aria-required="true"
>
  Select category...
</button>
```

**Dropdown:**
```html
<ul
  id="category-dropdown"
  role="listbox"
  aria-labelledby="category-label"
  aria-multiselectable="false"
>
  <!-- options -->
</ul>
```

**Option:**
```html
<li
  id="category-option-1"
  role="option"
  aria-selected="true"
  aria-posinset="1"
  aria-setsize="5"
>
  Option Label
</li>
```

**Search Input (if searchable):**
```html
<input
  id="category-search"
  type="text"
  aria-label="Search options"
  aria-controls="category-dropdown"
  aria-autocomplete="list"
/>
```

### Screen Reader Behavior

When trigger receives focus, screen reader announces:
1. Label text ("Category")
2. Required state ("required")
3. Expanded state ("collapsed" or "expanded")
4. Selected value(s) ("Option 1 selected" or "3 items selected")
5. Hint text (if provided)
6. Error message (if present)

When dropdown opens:
- Screen reader announces "listbox opened" with option count
- First option (or search input) receives focus

When navigating options:
- Screen reader announces option label and selected state
- Highlighted option tracked via `aria-activedescendant`

When option selected:
- Screen reader announces "Option selected" and new value
- In single-select: dropdown closes, focus returns to trigger
- In multi-select: dropdown stays open, focus remains

## Responsive Behavior

### Mobile (< 768px)
- Full width trigger by default
- Dropdown matches trigger width
- Max height reduced to fit viewport
- Touch targets: 44px minimum for trigger and options
- Dropdown positioned above trigger if no space below

### Desktop (>= 1024px)
- Fixed or constrained width based on context
- Default: 100% of parent width
- Hover state on options (if not disabled)
- Dropdown positioned below trigger with viewport boundary detection

## Common Variations

### Country Select
```jsx
<DropdownSelect
  label="Country"
  name="country"
  options={countries}
  searchable
  placeholder="Select country..."
/>
```

### Multi-Select Tags
```jsx
<DropdownSelect
  label="Tags"
  name="tags"
  options={tags}
  multiSelect
  value={selectedTags}
  onChange={setSelectedTags}
/>
```

### Async Search
```jsx
<DropdownSelect
  label="Search Users"
  name="user"
  options={filteredUsers}
  searchable
  loading={isSearching}
  onSearch={handleSearch}
  placeholder="Type to search..."
/>
```

### Grouped Options
```jsx
<DropdownSelect
  label="Category"
  name="category"
  options={[
    { value: "fruit-1", label: "Apple", group: "Fruits" },
    { value: "fruit-2", label: "Banana", group: "Fruits" },
    { value: "veg-1", label: "Carrot", group: "Vegetables" },
  ]}
/>
```

## Implementation Checklist

### Visual
- [ ] Label displays above trigger
- [ ] Required indicator (*) shows when required
- [ ] Hint text displays below trigger
- [ ] Error message displays below trigger with icon
- [ ] Trigger displays placeholder or selected value
- [ ] Dropdown opens and displays options
- [ ] Selected options show checkmark or highlight
- [ ] Focus ring visible and distinct
- [ ] Disabled state is visually clear
- [ ] Loading spinner appears when loading
- [ ] Empty state message appears when no options match

### Functionality
- [ ] Clicking trigger opens/closes dropdown
- [ ] Clicking option selects it
- [ ] Single-select closes dropdown after selection
- [ ] Multi-select keeps dropdown open
- [ ] Search input filters options (if searchable)
- [ ] onChange callback fires on selection
- [ ] onOpen callback fires when dropdown opens
- [ ] onClose callback fires when dropdown closes
- [ ] Controlled and uncontrolled modes work
- [ ] Grouped options display correctly

### Keyboard
- [ ] Space/Enter on trigger opens dropdown when closed
- [ ] **CRITICAL**: Space/Enter on trigger selects highlighted option when dropdown is open (common oversight - must test)
- [ ] Arrow keys navigate options
- [ ] Enter/Space on options selects highlighted option
- [ ] **CRITICAL**: Enter/Space on search input selects highlighted option (or first if none highlighted) - common oversight, must test
- [ ] Escape closes dropdown
- [ ] Tab closes dropdown and moves focus
- [ ] Type-ahead navigation works
- [ ] Home/End keys work

### Accessibility
- [ ] Label associated with trigger (for/id)
- [ ] aria-required when required
- [ ] aria-expanded updates on open/close
- [ ] aria-haspopup on trigger
- [ ] aria-controls points to dropdown
- [ ] aria-selected on options
- [ ] aria-activedescendant tracks highlighted option
- [ ] aria-multiselectable on dropdown for multi-select
- [ ] aria-invalid when error
- [ ] aria-describedby references hint and error
- [ ] Focus ring has sufficient contrast (3:1)
- [ ] Screen reader announces all states
- [ ] Focus returns to trigger on close
- [ ] Focus trapped in dropdown when open

### Styling
- [ ] Matches project styling system
- [ ] Uses project design tokens
- [ ] No inline styles (uses classes)
- [ ] All colors have sufficient contrast
- [ ] Dropdown positioned correctly
- [ ] Viewport boundary detection works

## Framework Examples

### React (Controlled)
```jsx
const [category, setCategory] = useState(null);
const [error, setError] = useState(null);

<DropdownSelect
  label="Category"
  name="category"
  options={categories}
  value={category}
  onChange={setCategory}
  error={error}
  required
  searchable
/>
```

### Vue
```vue
<template>
  <DropdownSelect
    v-model="category"
    label="Category"
    name="category"
    :options="categories"
    :error="errors.category"
    :required="true"
    :searchable="true"
  />
</template>
```

### Angular
```typescript
categoryControl = new FormControl(null, [Validators.required]);

<app-dropdown-select
  [label]="'Category'"
  [formControl]="categoryControl"
  [options]="categories"
  [error]="categoryControl.errors?.required"
  [searchable]="true"
></app-dropdown-select>
```

### Svelte
```svelte
<script>
  let category = null;
  let error = null;
</script>

<DropdownSelect
  bind:value={category}
  label="Category"
  name="category"
  options={categories}
  {error}
  required
  searchable
/>
```

## Integration with Form Validation Pattern

This Dropdown/Select component is designed to work seamlessly with the [Form Validation Pattern](/potions/patterns/form-validation):

1. **Validation Timing**: Show errors only after user attempts to submit or blur
2. **Error Display**: Pass error message via `error` prop
3. **ARIA**: Errors are announced via `aria-describedby` and `aria-live`
4. **Keyboard**: Full keyboard support for accessible forms
5. **Required Fields**: Use `required` prop and show indicator

## Design Tokens

### Colors
- **Border Default**: `--color-gray-300` or `border-gray-300`
- **Border Focus**: `--color-blue-500` or `border-blue-500`
- **Border Error**: `--color-red-500` or `border-red-500`
- **Background**: `--color-white` or `bg-white`
- **Background Disabled**: `--color-gray-50` or `bg-gray-50`
- **Option Hover**: `--color-gray-100` or `bg-gray-100`
- **Option Selected**: `--color-blue-100` or `bg-blue-100`
- **Text**: `--color-gray-900` or `text-gray-900`
- **Text Disabled**: `--color-gray-500` or `text-gray-500`
- **Label**: `--color-gray-700` or `text-gray-700`
- **Hint**: `--color-gray-500` or `text-gray-500`
- **Error**: `--color-red-600` or `text-red-600`

### Spacing
- **Label margin-bottom**: 6px
- **Hint margin-top**: 6px
- **Error margin-top**: 6px
- **Trigger padding-x**: 14px (medium)
- **Trigger padding-y**: 11px (medium)
- **Option padding-x**: 14px
- **Option padding-y**: 10px
- **Dropdown max-height**: 300px

### Typography
- **Label font-size**: 14px
- **Label font-weight**: 500
- **Trigger font-size**: 16px
- **Option font-size**: 16px
- **Hint font-size**: 14px
- **Error font-size**: 14px
- **Group label font-size**: 12px
- **Group label font-weight**: 600

---

## See Also

The Dropdown/Select component works well with these potions:

- **[Text Input Component](/potions/components/text-input)** - Similar form input patterns and styling for consistency
- **[Form Validation Pattern](/potions/patterns/form-validation)** - Apply validation timing and error display best practices
- **[Login & Registration Forms](/potions/features/form-login-register)** - Complete form example that may use dropdown components

These are suggestions to enhance your implementation. Dropdown/Select works independently and can be used in any context.

---

## Summary for AI Agents

**Goal**: Create accessible dropdown/select with search, multi-select, keyboard navigation, and ARIA combobox/listbox pattern.

**Critical Requirements**:
1. Detect framework and styling system first
2. Use project's design tokens for colors and spacing
3. Implement proper ARIA: `aria-expanded`, `aria-haspopup`, `aria-controls`, `aria-activedescendant`, `aria-selected`, `aria-multiselectable`
4. Show required indicator (*) when `required=true`
5. Associate errors via `aria-describedby` and `aria-invalid`
6. Provide visible focus ring with sufficient contrast
7. **CRITICAL**: Implement keyboard navigation - Arrow keys navigate, Enter/Space select highlighted option (must work on trigger when dropdown is open AND on search input). This is a common oversight.
8. Trap focus in dropdown when open, restore to trigger on close
9. Support controlled/uncontrolled patterns appropriate for framework
10. Handle viewport boundary detection for dropdown positioning
11. Use classes, not inline styles

**States to Handle**: default, open, focus, selected, error, disabled, loading, empty

**Integration**: Works with Form Validation Pattern for optimal UX timing.
