---
layout: 'potion'
title: 'Text Input Field - Accessible Form Input with Label, Error, and Success States'
publicationDate: '2026-01-24'
excerpt: 'An accessible text input component with label, hint text, error display, success indicator, and comprehensive state management. Foundation for all form inputs.'
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
---

# Text Input Field

An accessible text input component with label, hint text, error display, success indicator, and comprehensive state management. Foundation for all form inputs with full keyboard and screen reader support.

## Overview

The Text Input component provides a fully accessible form input field that handles all common states: default, focus, error, success, disabled, and readonly. It includes proper labeling, ARIA attributes, keyboard navigation, and screen reader support.

## Component Structure

```
Container
├── Label
│   ├── Label Text
│   ├── Required Indicator (*) [optional]
│   └── Tooltip [optional]
├── Input Wrapper
│   ├── Leading Icon [optional]
│   ├── Input Field
│   └── Trailing Icon/Button [optional]
├── Hint Text [optional]
├── Error Message [optional]
└── Character Counter [optional]
```

## States

### Default State
- Clean, clear input field
- Border: neutral gray (`border-gray-300`)
- Background: white
- Cursor: text cursor

### Focus State
- Border changes to focus color (`border-blue-500`)
- Focus ring appears (`ring-2 ring-blue-500`)
- Smooth transition (150ms)
- Label optionally changes to primary color

### Error State
- Border changes to error color (`border-red-500`)
- Error message appears below input
- Error icon shown
- `aria-invalid='true'` set
- Optional: subtle shake animation

### Success State
- Border changes to success color (`border-green-500`)
- Checkmark icon appears (trailing)
- `aria-invalid='false'` set
- Validates field is correct

### Disabled State
- Background grayed out (`bg-gray-50`)
- Text grayed (`text-gray-500`)
- Cursor: not-allowed
- Not interactive
- Label grayed out

### Readonly State
- Input not editable
- Can be selected and copied
- Visually distinct from disabled
- Still keyboard accessible

## Required Props

```typescript
{
  label: string;        // Input label text
  name: string;         // Input name attribute
}
```

## Optional Props

```typescript
{
  id?: string;                    // Input ID (generated if not provided)
  value?: string;                 // Controlled value
  defaultValue?: string;          // Uncontrolled default value
  placeholder?: string;           // Placeholder text
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  error?: string | null;          // Error message
  success?: boolean;              // Success state
  hint?: string;                  // Hint text below input
  required?: boolean;             // Required field
  disabled?: boolean;             // Disabled state
  readonly?: boolean;             // Readonly state
  size?: 'small' | 'medium' | 'large';
  leadingIcon?: ReactNode;        // Icon before input
  trailingIcon?: ReactNode;       // Icon after input
  maxLength?: number;             // Max character length
  showCharacterCount?: boolean;   // Show character counter
  fullWidth?: boolean;            // Full width (default: true)
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  autoComplete?: string;
  autoFocus?: boolean;
}
```

## Size Variants

### Small
- Height: 36px
- Padding: 12px horizontal, 8px vertical
- Font size: 14px
- Label font size: 13px

### Medium (Default)
- Height: 44px
- Padding: 14px horizontal, 11px vertical
- Font size: 16px
- Label font size: 14px

### Large
- Height: 52px
- Padding: 16px horizontal, 14px vertical
- Font size: 18px
- Label font size: 16px

## Common Variations

### Search Input
```jsx
<TextInput
  label="Search"
  name="search"
  type="search"
  placeholder="Search..."
  leadingIcon={<SearchIcon />}
  trailingIcon={value ? <ClearButton /> : null}
/>
```

### Password Input
```jsx
<TextInput
  label="Password"
  name="password"
  type={showPassword ? 'text' : 'password'}
  required
  trailingIcon={<PasswordToggle />}
/>
```

### Email Input with Validation
```jsx
<TextInput
  label="Email Address"
  name="email"
  type="email"
  required
  error={errors.email}
  success={isValid.email}
  hint="We'll never share your email"
  leadingIcon={<AtIcon />}
/>
```

### Phone Input
```jsx
<TextInput
  label="Phone Number"
  name="phone"
  type="tel"
  placeholder="(555) 123-4567"
  leadingIcon={<PhoneIcon />}
  hint="Include area code"
/>
```

## Accessibility Requirements

### ARIA Attributes

**Input Element:**
```html
<input
  id="email"
  name="email"
  type="email"
  aria-labelledby="email-label"
  aria-describedby="email-hint email-error"
  aria-invalid="true"
  aria-required="true"
/>
```

**Label:**
```html
<label id="email-label" for="email">
  Email Address
  <span aria-hidden="true">*</span>
</label>
```

**Error Message:**
```html
<div id="email-error" role="alert" aria-live="polite">
  Please enter a valid email address
</div>
```

**Hint Text:**
```html
<div id="email-hint">
  We'll never share your email with anyone else
</div>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Focus input |
| Shift+Tab | Move focus away |
| Escape | Clear value (optional) |
| Enter | Submit form (if in form) |

### Screen Reader Behavior

When input receives focus, screen reader announces:
1. Label text ("Email Address")
2. Required state ("required")
3. Hint text ("We'll never share your email")
4. Error message (if present)
5. Current value (if any)

When error appears:
- Announced via `aria-live='polite'`
- User hears error without losing context

## Responsive Behavior

### Mobile (< 768px)
- **Full width by default**
- **Font size: 16px minimum** (prevents iOS zoom)
- **Touch targets: 44px minimum**
- Trailing icons: 44px tap target

### Desktop (>= 1024px)
- Fixed or constrained width based on context
- Hover state shows border color change
- Default: 100% of parent width

## Implementation Checklist

### Visual
- [ ] Label displays above input
- [ ] Required indicator (*) shows when required
- [ ] Hint text displays below input
- [ ] Error message displays below input with icon
- [ ] Success checkmark displays when valid
- [ ] Focus ring visible and distinct
- [ ] Disabled state is visually clear
- [ ] All size variants work correctly

### Functionality
- [ ] Value updates on input change
- [ ] onChange callback fires
- [ ] onBlur callback fires
- [ ] onFocus callback fires
- [ ] Clear button clears value
- [ ] Password toggle changes type
- [ ] Character counter updates
- [ ] Controlled and uncontrolled modes work

### Keyboard
- [ ] Tab focuses input
- [ ] Shift+Tab moves focus away
- [ ] Trailing button is keyboard accessible
- [ ] Escape clears value (if implemented)

### Accessibility
- [ ] Label associated with input (for/id)
- [ ] aria-required when required
- [ ] aria-invalid when error
- [ ] aria-describedby references hint and error
- [ ] Error has role='alert' or aria-live
- [ ] Focus ring has sufficient contrast (3:1)
- [ ] Screen reader announces all states
- [ ] Input font size >= 16px on mobile

### Styling
- [ ] Matches project styling system
- [ ] Uses project design tokens
- [ ] No inline styles (uses classes)
- [ ] All colors have sufficient contrast

## Framework Examples

### React (Controlled)
```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState(null);

<TextInput
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={setEmail}
  error={error}
  required
/>
```

### Vue
```vue
<template>
  <TextInput
    v-model="email"
    label="Email"
    name="email"
    type="email"
    :error="errors.email"
    :required="true"
  />
</template>
```

### Angular
```typescript
emailControl = new FormControl('', [Validators.required, Validators.email]);

<app-text-input
  [label]="'Email'"
  [formControl]="emailControl"
  [error]="emailControl.errors?.email"
  [required]="true"
></app-text-input>
```

### Svelte
```svelte
<script>
  let email = '';
  let error = null;
</script>

<TextInput
  bind:value={email}
  label="Email"
  name="email"
  type="email"
  {error}
  required
/>
```

## Integration with Form Validation Pattern

This Text Input component is designed to work seamlessly with the [Form Validation Pattern](/potions/patterns/form-validation.html):

1. **Validation Timing**: Show errors only after `onBlur` (when touched)
2. **Error Display**: Pass error message via `error` prop
3. **Success State**: Pass `success` prop when field is validated
4. **ARIA**: Errors are announced via `aria-live`
5. **Keyboard**: Full keyboard support for accessible forms

## Design Tokens

### Colors
- **Border Default**: `--color-gray-300` or `border-gray-300`
- **Border Focus**: `--color-blue-500` or `border-blue-500`
- **Border Error**: `--color-red-500` or `border-red-500`
- **Border Success**: `--color-green-500` or `border-green-500`
- **Background**: `--color-white` or `bg-white`
- **Background Disabled**: `--color-gray-50` or `bg-gray-50`
- **Text**: `--color-gray-900` or `text-gray-900`
- **Text Disabled**: `--color-gray-500` or `text-gray-500`
- **Label**: `--color-gray-700` or `text-gray-700`
- **Hint**: `--color-gray-500` or `text-gray-500`
- **Error**: `--color-red-600` or `text-red-600`

### Spacing
- **Label margin-bottom**: 6px
- **Hint margin-top**: 6px
- **Error margin-top**: 6px
- **Input padding-x**: 14px (medium)
- **Input padding-y**: 11px (medium)

### Typography
- **Label font-size**: 14px
- **Label font-weight**: 500
- **Input font-size**: 16px
- **Hint font-size**: 14px
- **Error font-size**: 14px

---

## See Also

The Text Input component works well with these potions:

- **[Dropdown/Select Component](/potions/components/dropdown-select.html)** - Complementary form component for selection fields, works alongside text inputs in forms
- **[Form Validation Pattern](/potions/patterns/form-validation.html)** - Apply validation timing and error display best practices to create user-friendly forms
- **[Login & Registration Forms](/potions/features/form-login-register.html)** - Complete authentication forms that demonstrate Text Input in action

These are suggestions to enhance your implementation. Text Input works independently and can be used in any context.

---

## Summary for AI Agents

**Goal**: Create accessible text input with label, error/success states, hint text, and ARIA support.

**Critical Requirements**:
1. Detect framework and styling system first
2. Use project's design tokens for colors and spacing
3. Implement proper ARIA: `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-required`
4. Show required indicator (*) when `required=true`
5. Associate errors via `aria-describedby` and `role='alert'`
6. Provide visible focus ring with sufficient contrast
7. Set input font-size to 16px minimum on mobile (prevents iOS zoom)
8. Support controlled/uncontrolled patterns appropriate for framework
9. Make trailing icons keyboard accessible with `aria-label`
10. Use classes, not inline styles

**States to Handle**: default, focus, error, success, disabled, readonly

**Integration**: Works with Form Validation Pattern for optimal UX timing.
