---
layout: 'potion'
title: 'Login & Registration Forms with Validation'
publicationDate: '2026-01-24'
excerpt: 'Complete authentication forms (login and registration) with real-time validation, error handling, password strength, and accessibility. Demonstrates best practices for form validation UX.'
category: 'Features'
tags:
  - features
  - form
  - authentication
  - login
  - registration
  - validation
  - accessibility
  - forms
agentManifest: 'potions/features/form-login-register.json'
path: 'potions/features/form-login-register'
---

# Login & Registration Forms with Validation

Complete authentication forms (login and registration) with real-time validation, error handling, password strength indicator, and full accessibility. Demonstrates best practices for form validation UX, field states, and user feedback.

## Overview

This feature provides two complete authentication forms:
- **Login Form**: Email + Password with "Remember me" and "Forgot password"
- **Registration Form**: Name + Email + Password + Password Confirmation with strength indicator

Both forms follow validation best practices with proper timing, clear error messages, success states, and keyboard/screen reader accessibility.

## User Journey

### Login Flow
1. User enters email → Validates on blur → Shows error if invalid
2. User enters password → Validates on blur → Shows error if invalid
3. User clicks "Sign In" → Validates all fields → Shows loading state
4. On success → Navigate to dashboard
5. On error → Show error message, focus first invalid field

### Registration Flow
1. User enters name → Validates on blur
2. User enters email → Validates on blur → Optional: Check availability
3. User enters password → Shows strength meter in real-time
4. User enters password confirmation → Validates in real-time → Shows match/mismatch
5. User clicks "Create Account" → Validates all fields → Shows loading state
6. On success → Navigate to dashboard or email verification
7. On error → Show errors, focus first invalid field

## Key Features

### Validation Timing (Following Form Validation Pattern)
- **On-blur validation** for email, name, password (wait until user finishes)
- **Real-time validation** for password confirmation (updates as user types)
- **Real-time feedback** for password strength (visual meter)
- **On-submit validation** as final check before submission

### Error Handling
- Clear, specific error messages: "Please enter a valid email address (e.g., name@example.com)"
- Errors appear below fields inline
- Errors announced to screen readers via aria-live
- Errors persist until field becomes valid
- First invalid field receives focus after submit

### Success States
- Green checkmarks appear on valid fields
- Visual confirmation for user progress
- Success state helps user know they're on the right track

### Password Features
- **Visibility Toggle**: Eye icon to show/hide password
- **Strength Meter** (Registration): Weak/Medium/Strong indicator
  - Weak: < 8 characters
  - Medium: 8+ characters with letters + numbers
  - Strong: 8+ characters with letters + numbers + special characters
- **Real-time Confirmation**: Password confirmation validates as user types

### Form Switching
- Toggle between Login and Registration forms
- Reset form state when switching
- Smooth transition with fade animation
- Focus moves to first field of new form

## Form Structure

### Login Form

The login form is a vertically stacked card with maximum width of 420px, centered on the page. It contains:

- **Header**: "Welcome Back" title with "Sign in to your account" subtitle
- **Email Field**: Required input with validation triggered on blur, showing checkmark when valid or error message when invalid
- **Password Field**: Required input with eye icon for visibility toggle, validation on blur
- **Remember Me Checkbox**: Optional checkbox for persistent login
- **Submit Button**: Primary "Sign In" button with loading state
- **Forgot Password Link**: Secondary action below the button
- **Divider**: "or" text with horizontal lines
- **Social Login**: "Sign in with Google" button (optional)
- **Form Switch Link**: "Don't have an account? Create one" at the bottom

### Registration Form

The registration form follows the same card layout as login. It contains:

- **Header**: "Create Account" title with "Get started for free" subtitle
- **Name Field**: Required text input, validates on blur (minimum 2 characters)
- **Email Field**: Required input with validation on blur, optional availability check
- **Password Field**: Required input with eye icon toggle, displays real-time strength meter (Weak/Medium/Strong indicator with visual bar), validates on blur
- **Confirm Password Field**: Required input with eye icon toggle, validates in real-time as user types to show immediate match/mismatch feedback
- **Terms Checkbox**: Required checkbox "I agree to Terms & Privacy"
- **Submit Button**: Primary "Create Account" button with loading state
- **Divider**: "or" text with horizontal lines
- **Social Signup**: "Sign up with Google" button (optional)
- **Form Switch Link**: "Already have an account? Sign in" at the bottom

## Validation Rules

### Login Form

**Email Field** (Required):
- Validates on blur
- Must be valid email format
- Error: "Please enter a valid email address (e.g., name@example.com)"

**Password Field** (Required):
- Validates on blur
- Minimum 8 characters
- Error: "Password must be at least 8 characters"

### Registration Form

**Name Field** (Required):
- Validates on blur
- Minimum 2 characters
- Error: "Name must be at least 2 characters"

**Email Field** (Required):
- Validates on blur
- Must be valid email format
- Optional: Check availability with backend
- Errors: "Please enter a valid email address" or "This email is already registered"

**Password Field** (Required):
- Validates on blur for errors
- Real-time strength calculation as user types
- Minimum 8 characters
- Strength meter shows: Weak (< 8 chars), Medium (8+ with letters+numbers), Strong (8+ with special chars)
- Error: "Password must be at least 8 characters"

**Confirm Password Field** (Required):
- Validates in real-time as user types
- Must match password field exactly
- Shows immediate feedback: success checkmark when matches, error when mismatches
- Error: "Passwords must match"

**Terms Checkbox** (Required):
- Validates on submit
- Must be checked to proceed
- Error: "You must agree to the terms and privacy policy"

## Error Messages

### Clear & Actionable Examples

**Good Error Messages**:
- "Please enter a valid email address (e.g., name@example.com)"
- "Password must be at least 8 characters"
- "Passwords must match"
- "Name is required"

**Bad Error Messages**:
- "Invalid input"
- "Error"
- "Wrong format"

## Password Strength Calculation

```javascript
// Example strength calculation
function calculatePasswordStrength(password) {
  if (password.length < 8) return 'weak';
  
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (hasLetters && hasNumbers && hasSpecial) return 'strong';
  if (hasLetters && hasNumbers) return 'medium';
  return 'weak';
}
```

## Responsive Behavior

### Desktop (>= 768px)
- Form card: 420px max width, centered
- Padding: 48px
- Input height: 48px
- Font size: 16px

### Mobile (< 768px)
- Form card: Full width minus 16px margins
- Padding: 24px
- Input height: 48px (minimum for touch)
- Font size: 16px minimum (prevents iOS zoom)

## Accessibility

### Keyboard Navigation
- Tab: Move through fields → checkbox → button → links
- Shift+Tab: Move backward
- Enter: Submit form from any field
- Space: Toggle checkbox, activate button

### ARIA Attributes

**Input Fields**:
```html
<input
  type="email"
  id="email"
  aria-labelledby="email-label"
  aria-describedby="email-error"
  aria-invalid="true"
  aria-required="true"
  autocomplete="email"
/>
```

**Error Messages**:
```html
<div id="email-error" role="alert" aria-live="polite">
  Please enter a valid email address
</div>
```

**Submit Button**:
```html
<button
  type="submit"
  aria-busy="true"
  aria-disabled="true"
>
  <span>Signing in...</span>
  <span class="spinner" aria-hidden="true"></span>
</button>
```

### Screen Reader Support
- Form title announced on load
- Field labels announced on focus
- Required state conveyed via aria-required
- Errors announced via aria-live when they appear
- Password strength announced as it changes
- Loading state announced during submission
- Success/error messages announced

## States

### Field States
- **Default**: Clean input, no validation
- **Focused**: Border color changes, visible focus ring
- **Valid**: Green border, checkmark icon
- **Invalid**: Red border, error message below
- **Disabled**: Gray background, not interactive

### Form States
- **Idle**: Ready for input
- **Validating**: Checking field values
- **Valid**: All fields valid, ready to submit
- **Invalid**: Has errors, show messages
- **Submitting**: Loading state, disabled inputs
- **Success**: Submission successful
- **Error**: Submission failed, show error

## Implementation Notes

### TIP: Consider Using Existing Potions

This feature works great with:
- **Text Input Component** - For consistent input field styling and behavior
- **Form Validation Pattern** - For validation timing and UX best practices

These are optional references - this feature works independently.

### Form State Management

**React Example** (using hooks):
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [errors, setErrors] = useState({});
const [touched, setTouched] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);

const handleBlur = (field) => {
  setTouched({ ...touched, [field]: true });
  validateField(field, formData[field]);
};
```

**Vue Example** (using composition API):
```javascript
const formData = reactive({
  email: '',
  password: ''
});
const errors = ref({});
const touched = ref({});
const isSubmitting = ref(false);

const handleBlur = (field) => {
  touched.value[field] = true;
  validateField(field, formData[field]);
};
```

### Password Toggle Implementation

```javascript
const [showPassword, setShowPassword] = useState(false);

<input
  type={showPassword ? 'text' : 'password'}
  ...
/>
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? 'Hide password' : 'Show password'}
>
  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
</button>
```

## Testing Checklist

### Functionality
- [ ] Email validation works on blur
- [ ] Password validation works on blur
- [ ] Password confirmation validates in real-time
- [ ] Password strength updates as user types
- [ ] Submit validates all fields
- [ ] Focus moves to first error on submit
- [ ] Form switch resets state
- [ ] Password toggle shows/hides password
- [ ] Loading state disables form during submission

### Accessibility
- [ ] Labels associated with inputs
- [ ] Required indicators present
- [ ] aria-required on required fields
- [ ] aria-invalid on invalid fields
- [ ] aria-describedby links to errors
- [ ] aria-live announces errors
- [ ] aria-busy during submission
- [ ] Tab order is logical
- [ ] Focus ring visible
- [ ] Screen reader announces all states

### Responsive
- [ ] Form responsive on mobile
- [ ] Input font size 16px minimum on mobile
- [ ] Touch targets 48px minimum
- [ ] Form centered on desktop
- [ ] Proper padding on all breakpoints

---

## See Also

This form feature works well with these potions:

- **[Text Input Component](/potions/components/text-input)** - Foundation component for form inputs with built-in error/success states
- **[Dropdown/Select Component](/potions/components/dropdown-select)** - For country, language, or other selection fields in registration forms
- **[Form Validation Pattern](/potions/patterns/form-validation)** - UX guidelines for validation timing and error display

These are suggestions to enhance your implementation. This feature works independently.

---

## Summary for AI Agents

**Goal**: Create accessible login and registration forms with comprehensive validation, error handling, and user feedback.

**Critical Requirements**:
1. Detect framework and styling system first
2. Apply Form Validation Pattern timing (on-blur for most, real-time for password confirmation)
3. Show specific, actionable error messages
4. Implement proper ARIA attributes
5. Password strength meter for registration
6. Success states with checkmarks
7. Loading states for submit buttons
8. Form switching with state reset
9. Password visibility toggles
10. Focus management for errors

**Validation Timing**:
- Email: on-blur
- Name: on-blur
- Password: on-blur
- Password confirmation: real-time
- Submit: validate all fields

**TIP**: Consider using Text Input Component pattern for consistent inputs and Form Validation Pattern for optimal UX timing (both optional).
