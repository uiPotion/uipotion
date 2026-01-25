---
layout: 'potion'
title: 'Form Validation Pattern - UX and Timing Strategies'
publicationDate: '2026-01-24'
excerpt: 'A comprehensive UX pattern for form validation covering timing strategies, error display, async validation, accessibility, and integration with form libraries.'
category: 'Patterns'
tags:
  - validation
  - forms
  - ux
  - accessibility
  - error-handling
  - progressive-disclosure
  - patterns
  - user-experience
agentManifest: 'potions/patterns/form-validation.json'
---

# Form Validation Pattern - UX and Timing Strategies

A comprehensive UX pattern for form validation covering timing strategies (when to show errors), error display patterns, async validation, accessibility, and integration with form libraries. Teaches principles that work with any framework or validation library.

## The Problem

Form validation UX is difficult to get right:

- **Show errors too early** → Users feel frustrated before they finish typing
- **Show errors too late** → Users waste time filling invalid forms
- **Generic error messages** → Users don't know how to fix the problem
- **Missing accessibility** → Screen reader users can't understand validation state
- **Inconsistent timing** → Different fields validate at different times, confusing users

Poor validation timing, unclear messaging, and lack of accessibility are common pain points that degrade user experience and form completion rates.

## The Solution

Apply **progressive validation strategies** based on user interaction patterns:

1. **On-blur validation** for most fields (wait until user finishes input)
2. **Real-time validation** for dependent fields (password confirmation)
3. **On-submit validation** as final check before submission
4. **Specific, actionable error messages** that tell users how to fix issues
5. **ARIA live regions** to announce errors to screen readers
6. **Success states** to confirm valid input
7. **Framework detection** to leverage existing form libraries or suggest appropriate tools

This pattern works with any form library or vanilla approach while maintaining best UX practices.

## Do

### Validation Timing
- Show errors **after user leaves the field** (on blur) - wait until they're done typing
- Use **real-time validation** for password confirmation (updates as user types)
- Allow users to **attempt submission**, then show all errors if any exist
- **Debounce async validation** (username availability) to avoid excessive server calls

### Error Messages
- Provide **specific, actionable messages**: "Email must include @" instead of "Invalid email"
- **Preserve user input** when showing errors - don't clear the field
- **Keep errors visible** until field passes validation
- Mark required fields with **'Required' label or asterisk** before any interaction

### Visual Feedback
- Show **success states** (checkmarks, green borders) for validated fields
- Use **icons, text, and borders** - not just color
- **Scroll to first error** on submit if validation fails

### Accessibility
- Use **aria-live='polite'** for error announcements to screen readers
- Associate errors with fields using **aria-describedby**
- Mark invalid fields with **aria-invalid='true'**
- Use **aria-required='true'** for required fields

### Submit Button
- **Enable submit button** before validation (let users discover errors)
- **Disable only while submitting** (loading state), not before validation

### Library Detection
- **Detect existing form libraries** (React Hook Form, Formik, VeeValidate, etc.)
- **Detect schema validation** (Zod, Yup, Joi) and integrate with it
- **Suggest framework-appropriate tools** if none exist

## Don't

- Show errors **while user is actively typing** (too aggressive and frustrating)
- Use **generic error messages** like "Invalid" or "Error" without explanation
- **Disable submit button** before user attempts to submit (blocks error discovery)
- **Rely only on color** to indicate errors
- **Hide error messages** when user refocuses the field
- **Clear field value** when showing an error
- **Show all errors immediately on page load** before user interaction
- Use **browser alert() dialogs** for validation errors
- **Validate on every keystroke** for text fields (except password confirmation)
- Use **technical error messages** from validation libraries without making them user-friendly

## Examples

### Email Field Validation

```
User types: "john@"
User leaves field (blur)
→ Show: "Please enter a valid email address (e.g., name@example.com)"
→ Red border, X icon

User corrects to: "john@example.com"
User leaves field (blur)
→ Show: Green border, checkmark icon
→ Error message disappears
```

### Password Confirmation

```
User types password: "SecurePass123"
User types confirmation: "Sec"
→ Show immediately: "Passwords must match"
→ Red border

User continues typing: "SecurePass123"
→ Error disappears immediately
→ Green border, checkmark
```

### Async Username Availability

```
User types: "john"
→ Wait 500ms after user stops typing
→ Show loading spinner
→ Check server

If taken:
→ Show: "This username is already taken. Try john_smith or john2024"
→ Red border, X icon

If available:
→ Show: Green border, checkmark icon
```

### Multi-Step Form

```
Step 1: User fills name, email (both validated on blur)
User clicks "Next"
→ Validate entire Step 1
→ If errors: Show all errors, don't advance
→ If valid: Advance to Step 2
```

### Form Submission

```
User clicks Submit
→ Run final validation on all fields
→ If errors exist:
  - Show all error messages
  - Focus first invalid field
  - Scroll to it
  - Keep submit button enabled
→ If valid:
  - Disable submit button
  - Show loading spinner
  - Submit form
```

## Anti-Patterns to Avoid

1. **Aggressive Real-Time Validation**
   - Bad: Showing "Email is invalid" as soon as user types first character
   - Good: Wait for blur

2. **Hidden Submit Button**
   - Bad: Disabling submit until all fields are valid
   - Good: Allow submission attempt to discover errors

3. **Error on Focus**
   - Bad: Showing error immediately when user clicks into field
   - Good: Wait for blur

4. **No Error Recovery**
   - Bad: User fixes error but message stays visible
   - Good: Clear error when field becomes valid

5. **Validation on Page Load**
   - Bad: Form appears with red error messages before user interaction
   - Good: No errors until user interacts

6. **Auto-Clearing Fields**
   - Bad: Field clears when error appears
   - Good: Preserve user input

7. **Cryptic Errors**
   - Bad: "Validation failed on field_email_address"
   - Good: "Please enter a valid email address"

8. **Accessibility Failure**
   - Bad: Error messages not associated with fields, no ARIA
   - Good: Proper aria-invalid, aria-describedby, aria-live

## Framework & Library Integration

### Detect Existing Tools

**First, check what's already in the project:**

1. Check `package.json` for form libraries
2. Check for schema validation libraries (Zod, Yup, Joi)
3. Use existing tools if found
4. Suggest appropriate tools if none exist

### React

**Form Libraries:**
- **React Hook Form** (recommended) - Performant, minimal re-renders, great DX
  - Use `mode: 'onBlur'` for validation timing
  - Integrate with Zod/Yup via `@hookform/resolvers`
- **Formik** - Popular, mature, extensive ecosystem
  - Set `validateOnBlur={true}` and `validateOnChange={false}`
- **TanStack Form** - Framework-agnostic core, excellent TypeScript support

**Schema Validation:**
- **Zod** (recommended) - TypeScript-first, runtime safety
- **Yup** - Mature, works well with Formik

**Vanilla React:**
- Use `useState` for form state
- Implement validation with validation functions
- Listen to blur events

### Vue

**Form Libraries:**
- **VeeValidate** (recommended) - Vue-native, composition API support
  - Use `mode: 'lazy'` for on-blur validation
  - Integrate with Zod/Yup via `toTypedSchema()`
- **Vuelidate** - Lightweight, functional validators

**Schema Validation:**
- **Zod** - Works with VeeValidate
- **Yup** - Works with VeeValidate

**Vanilla Vue:**
- Use `ref`/`reactive` for form state
- Use `computed` for validation
- Use `watch` for real-time validation

### Angular

**Form Libraries:**
- **Reactive Forms** (built-in) - Use `updateOn: 'blur'` in FormControl
- **ngx-sub-form** - Better TypeScript support for nested forms

**Schema Validation:**
- **class-validator** - Decorator-based, works well with Angular classes

### Svelte

**Form Libraries:**
- **svelte-forms-lib** (recommended) - Svelte-native, Yup integration
- **Felte** - Extensible, Zod/Yup integration

**Schema Validation:**
- **Zod** - Works with Felte
- **Yup** - Works with svelte-forms-lib

**Vanilla Svelte:**
- Use Svelte stores for form state
- Implement validation in stores or components

## Accessibility Requirements

### ARIA Attributes

```html
<!-- Invalid field -->
<label for="email">Email (Required)</label>
<input
  type="email"
  id="email"
  aria-invalid="true"
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Please enter a valid email address
</span>

<!-- Valid field -->
<input
  type="email"
  id="email"
  aria-invalid="false"
  aria-required="true"
/>
```

### Live Regions for Dynamic Errors

```html
<!-- Error container with live region -->
<div aria-live="polite" aria-atomic="true">
  <span id="email-error" class="error-message">
    Please enter a valid email address
  </span>
</div>
```

### Keyboard Navigation

- Tab key moves through all form fields logically
- Shift+Tab moves backward
- Enter key submits form when appropriate
- First invalid field receives focus after submit failure
- Focus ring visible on all interactive elements

### Screen Reader Requirements

- Use `aria-invalid='true'` on fields with errors
- Associate error messages with fields via `aria-describedby='error-id'`
- Use `aria-required='true'` on required fields
- Use `aria-live='polite'` on error containers for announcements
- Use `role='alert'` for critical errors
- Field labels properly associated with inputs via `for`/`id`

## Implementation Checklist

### Validation Timing
- [ ] Required fields marked clearly before interaction
- [ ] Most fields validate on blur (user has finished input)
- [ ] Password confirmation validates in real-time while typing
- [ ] Async validation is debounced and shows loading state
- [ ] Submit validates all fields

### Error Messages
- [ ] Error messages are specific and actionable
- [ ] Errors persist until field passes validation
- [ ] Errors don't disappear on refocus
- [ ] User input preserved when showing errors

### Visual Feedback
- [ ] Success states shown for valid fields
- [ ] Color is not the only indicator (icons, text, borders)
- [ ] First error receives focus on submit failure
- [ ] All errors visible on screen (no scrolling needed)

### Submit Button
- [ ] Enabled before validation
- [ ] Only disables while actually submitting
- [ ] Shows loading state while submitting

### Accessibility
- [ ] `aria-invalid` on invalid fields
- [ ] `aria-describedby` links fields to errors
- [ ] `aria-required` on required fields
- [ ] `aria-live` regions for dynamic errors
- [ ] Keyboard navigation works correctly
- [ ] Screen readers announce errors and state changes

### Form Library Integration
- [ ] Existing form library detected and used
- [ ] Schema validation integrated if present
- [ ] Framework-appropriate library suggested if none exist
- [ ] Validation timing patterns applied correctly

### Testing
- [ ] Required validation works
- [ ] Format validation works (email, phone, URL)
- [ ] Range validation works (min/max length)
- [ ] Async validation works with debouncing
- [ ] Multi-step validation works
- [ ] Error recovery works (errors clear when fixed)
- [ ] Keyboard navigation works
- [ ] Screen reader testing passed

## Additional Resources

- [WCAG 2.1: Error Identification](https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html)
- [WCAG 2.1: Error Suggestion](https://www.w3.org/WAI/WCAG21/Understanding/error-suggestion.html)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [VeeValidate Documentation](https://vee-validate.logaretm.com/)
- [Zod Documentation](https://zod.dev/)
- [Angular Forms Guide](https://angular.io/guide/reactive-forms)

---

## See Also

This pattern complements these potions:

- **[Text Input Component](/potions/components/text-input.html)** - Foundation component for form inputs with built-in error/success states
- **[Dropdown/Select Component](/potions/components/dropdown-select.html)** - Form selection component that benefits from validation timing patterns
- **[Login & Registration Forms](/potions/features/form-login-register.html)** - Complete authentication forms that demonstrate this pattern in practice
- **[Dialog Component](/potions/components/dialog.html)** - For complex validation scenarios requiring modals

These are suggestions to help you build complete forms. This pattern works with any form components you choose to use.

---

## Summary for AI Agents

This pattern provides UX guidelines for form validation that work with any framework or form library. Key implementation points:

**Detection First**:
1. Detect framework (React, Vue, Angular, Svelte)
2. Check for existing form libraries (React Hook Form, Formik, VeeValidate, etc.)
3. Check for schema validation (Zod, Yup, Joi, etc.)
4. Use what exists, or suggest framework-appropriate tools

**Validation Timing Principles**:
- On-blur for most fields (wait until user finishes)
- Real-time for password confirmation
- Debounced async for server checks
- On-submit as final validation

**UX Principles**:
- Specific, actionable error messages
- Success states for valid fields
- Don't block submission before validation
- Preserve user input
- Accessible error announcements

**Accessibility**:
- aria-invalid, aria-describedby, aria-required
- aria-live for error announcements
- Proper focus management
- Keyboard navigation

Apply these principles regardless of whether you're using a form library or vanilla approach. The pattern guides timing and UX - the implementation adapts to the detected tech stack.
