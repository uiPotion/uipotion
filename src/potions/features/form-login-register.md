---
layout: 'potion'
title: 'Login & Registration Forms with Validation'
publicationDate: '2026-01-24'
excerpt: 'Complete authentication forms (login and registration) with real-time validation, error handling, password requirements, and accessibility. Follows current NIST password guidance, never reveals whether an email has an account, and works with password managers and passkeys.'
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
promptSubject: 'login and registration forms'
---

Complete authentication forms (login and registration) with real-time validation, error handling, a password requirements indicator, and full accessibility. Demonstrates best practices for form validation UX, field states, and user feedback, and follows current account-security guidance: NIST SP 800-63B-4 password rules, messages that never reveal whether an email has an account, password manager support, and optional passkeys.

## Overview

This feature provides two complete authentication forms:
- **Login Form**: Email + Password with "Remember me" and "Forgot password"
- **Registration Form**: Name + Email + Password + Password Confirmation with a password requirements indicator

Both forms follow validation best practices with proper timing, clear error messages, success states, and keyboard/screen reader accessibility.

## User Journey

### Login Flow
1. User enters email → Validates format on blur → Shows error if invalid
2. User enters password → Checked for presence only (no length or character rules at sign-in)
3. User clicks "Sign In" → Validates all fields → Shows loading state
4. On success → Navigate to dashboard
5. On a missing or invalid field → Show the error, focus first invalid field
6. On rejected credentials → Show one generic message: "Email or password is incorrect"
7. On a network or service failure → "Unable to sign in right now. Try again shortly", which doesn't blame the password

### Registration Flow
1. User enters name → Validates on blur
2. User enters email → Validates format on blur (no availability check, which would reveal which emails have accounts)
3. User enters password → Shows the requirements indicator in real time
4. User enters password confirmation → Validates in real-time → Shows match/mismatch
5. User clicks "Create Account" → Validates all fields → Shows loading state
6. On a valid submission → The same next step every time, for example "Check your email to continue", whether or not the email already has an account
7. On error → Show errors, focus first invalid field

## Key Features

### Validation Timing (Following Form Validation Pattern)
- **On-blur validation** for email, name, password (wait until user finishes)
- **Real-time validation** for password confirmation (updates as user types)
- **Real-time feedback** for password requirements (visual indicator)
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
- **Requirements Indicator** (Registration and password reset): shows whether the password is too short, too common, or meets the requirements
  - Length alone doesn't make a password strong ("aaaaaaaaaaaaaaaaaaaa" is long but trivial to guess), so the indicator never says "strong"
  - If the project already has a pattern-aware strength estimator, show its rating instead
  - Never ask for numbers, symbols, or mixed case
- **Real-time Confirmation**: Password confirmation validates as user types

### Account Security
- **Rules come from the auth service**: if the project uses an authentication provider or library, follow its password rules, rate limits, and passkey support. Use the defaults below only where it defines nothing. Public error messages always follow the account-privacy rules below: map the service's error codes to them, and if the service can't avoid revealing whether an account exists, raise that conflict instead of shipping it.
- **Password defaults (NIST SP 800-63B-4)**: at least 15 characters when the password is the only sign-in factor (at least 8 when a second factor is always required); accept at least 64 characters; accept spaces, all printable characters, and Unicode; no composition rules; reject common and breached passwords on the server.
- **Sign-in checks presence only**: no length or character rules at sign-in, so accounts created under older rules can still sign in.
- **Never reveal whether an email has an account**: one generic sign-in failure message, the same next step after every registration, and the same confirmation after every password reset request. Rate-limit messages read the same way for every account. This needs email verification at registration: if new accounts are signed in immediately, registration can't hide whether an email exists, so raise that tradeoff.
- **Password managers and paste**: correct autocomplete values, and no blocking of paste or autofill (WCAG 3.3.8 Accessible Authentication).
- **Passkeys (optional)**: a "Sign in with a passkey" option alongside the password form, falling back to the password form if the prompt is cancelled or fails.

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
- **Password Field**: Required input with eye icon for visibility toggle; checked for presence only
- **Remember Me Checkbox**: Optional checkbox for persistent login
- **Submit Button**: Primary "Sign In" button with loading state
- **Forgot Password Link**: Secondary action below the button
- **Divider**: "or" text with horizontal lines
- **Social Login**: "Sign in with Google" button (optional)
- **Passkey Sign-in**: "Sign in with a passkey" button (optional, when the auth service supports passkeys)
- **Form Switch Link**: "Don't have an account? Create one" at the bottom

### Registration Form

The registration form follows the same card layout as login. It contains:

- **Header**: "Create Account" title with "Get started for free" subtitle
- **Name Field**: Required text input, validates on blur (minimum 2 characters)
- **Email Field**: Required input with format validation on blur (no availability check)
- **Password Field**: Required input with eye icon toggle, displays a real-time requirements indicator, validates on blur
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
- Checked for presence on blur and submit
- No length or character rules at sign-in; accounts created under older rules must still be able to sign in
- Error (empty field): "Password is required"
- Rejected credentials: "Email or password is incorrect", without saying which field was wrong
- Network or service failure: "Unable to sign in right now. Try again shortly"

### Registration Form

**Name Field** (Required):
- Validates on blur
- Minimum 2 characters
- Error: "Name must be at least 2 characters"

**Email Field** (Required):
- Validates on blur
- Must be valid email format
- No availability check and no "already registered" error, since both reveal which emails have accounts. Every valid submission shows the same next step, and the backend emails the existing account owner instead
- Error: "Please enter a valid email address"

**Password Field** (Required):
- Validates on blur for errors
- Real-time requirements check as user types
- Minimum length from the auth service; otherwise 15 characters when the password is the only sign-in factor (8 when a second factor is always required)
- Accepts at least 64 characters, spaces, and Unicode; no composition rules
- Common and breached passwords are rejected; the server makes the final check
- The indicator shows too short, too common, or meets requirements; a strength rating appears only if the project has a pattern-aware estimator
- Errors: "Use at least 15 characters", "This password is too common. Choose a different one", "This password has appeared in a data breach. Choose a different one"

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
- "Use at least 15 characters"
- "Passwords must match"
- "Name is required"

**Messages That Must Stay Generic** (so they don't reveal which emails have accounts):
- Rejected credentials: "Email or password is incorrect"
- Network or service failure: "Unable to sign in right now. Try again shortly" (the same for every account, and it doesn't blame the password)
- After registration: "Check your email to continue"
- Password reset request: "If an account exists for this email, we've sent a reset link"
- Rate limit: "Too many attempts. Wait a few minutes and try again"

**Bad Error Messages**:
- "Invalid input"
- "Error"
- "Wrong format"

## Password Requirements Indicator

Show requirement status, not a strength estimate. Length and a short common-password list can tell whether a password meets the rules, but not whether it's strong, so this indicator never says "strong". If the project already has a pattern-aware strength estimator, show its rating instead. Take the minimum length from the auth service when it has one.

```javascript
// Illustrative only. MIN_LENGTH comes from the auth service, or the
// NIST SP 800-63B-4 default for password-only sign-in.
const MIN_LENGTH = 15;

function getPasswordRequirementState(password, isCommonPassword) {
  const length = [...password].length; // count Unicode code points, not UTF-16 units
  if (length === 0) return 'none';
  if (length < MIN_LENGTH) return 'too-short';
  if (isCommonPassword(password)) return 'too-common';
  return 'meets-requirements';
}
```

`isCommonPassword` checks a short list of common passwords on the client. The full breached-password check runs on the server when the form is submitted.

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
  autocomplete="username"
/>
<input
  type="password"
  id="password"
  aria-labelledby="password-label"
  aria-required="true"
  autocomplete="current-password"
/>
```

Use `autocomplete="username"` on the email field that identifies the account, and append `webauthn` for passkey autofill (`autocomplete="username webauthn"`). Use `current-password` at sign-in, `new-password` at registration and reset, and `one-time-code` on verification-code fields. Never block paste or autofill.

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
- Password requirement status announced when it changes, not on every keystroke
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
- [ ] Password validation works on blur (presence only at sign-in)
- [ ] Password confirmation validates in real-time
- [ ] Password requirements indicator updates as user types
- [ ] Submit validates all fields
- [ ] Focus moves to first error on submit
- [ ] Form switch resets state
- [ ] Password toggle shows/hides password
- [ ] Loading state disables form during submission

### Security
- [ ] Sign-in accepts any non-empty password (no length error at sign-in)
- [ ] Password feedback never asks for numbers or symbols. Without a pattern-aware estimator it never shows "strong"; with one, "aaaaaaaaaaaaaaaaaaaa" and "abcdabcdabcdabcdabcd" don't rate strong
- [ ] Passwords of 64+ characters, spaces, and Unicode are accepted
- [ ] Registering an email that already has an account shows the same next step as a new email
- [ ] A failed sign-in doesn't say whether the email or the password was wrong
- [ ] A network or service failure shows "Unable to sign in right now", not "Email or password is incorrect"
- [ ] A password reset request shows the same confirmation whether or not the account exists
- [ ] Rate-limit message is the same whether or not the account exists
- [ ] A password manager can save and autofill credentials; paste works in every password field
- [ ] Passkey sign-in, if enabled, falls back to the password form when cancelled or failed

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
- **[Button](/potions/components/button)** - For submit, clear, and link-style actions
- **[Form Validation Pattern](/potions/patterns/form-validation)** - UX guidelines for validation timing and error display

These are suggestions to enhance your implementation. This feature works independently.

---

## Summary for AI Agents

**Goal**: Create accessible login and registration forms with comprehensive validation, error handling, and user feedback.

**Critical Requirements**:
1. Detect framework and styling system first
2. Follow the project's auth service for password rules, rate limits, and passkeys; otherwise use the NIST SP 800-63B-4 defaults. Map its error codes to generic public messages
3. Never reveal whether an email has an account (sign-in, registration, password reset, rate limits)
4. Apply Form Validation Pattern timing (on-blur for most, real-time for password confirmation)
5. Show specific, actionable error messages, except where they must stay generic
6. Implement proper ARIA attributes and autocomplete values; never block paste or autofill
7. Password requirements indicator for registration and reset (too short, too common, meets requirements); a strength rating only from a pattern-aware estimator
8. Success states with checkmarks
9. Loading states for submit buttons
10. Form switching with state reset
11. Password visibility toggles
12. Focus management for errors

**Validation Timing**:
- Email: on-blur (format only)
- Name: on-blur
- Password: on-blur (presence only at sign-in; rules and the requirements indicator at registration and reset)
- Password confirmation: real-time
- Submit: validate all fields

**TIP**: Consider using Text Input Component pattern for consistent inputs and Form Validation Pattern for optimal UX timing (both optional).
