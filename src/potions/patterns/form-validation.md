---
layout: 'potion'
title: 'Form Validation Pattern - UX and Timing Strategies'
publicationDate: '2026-01-24'
excerpt: 'When form errors appear, what they say, and where focus goes: errors when someone leaves a field they typed in or tries to submit, never while they type or tab through, an error summary for longer forms, and the browser''s checks working with the project''s form library.'
category: 'Patterns'
tags:
  - patterns
  - validation
  - forms
  - ux
  - accessibility
  - error-handling
  - progressive-disclosure
  - user-experience
agentManifest: 'potions/patterns/form-validation.json'
path: 'potions/patterns/form-validation'
promptSubject: 'form validation'
useWhen: 'you add or fix validation on a form, from a sign-up form to a multi-step checkout, and want errors to appear at the right time and reach everyone.'
specifies:
  - 'Errors appear when someone leaves a field they typed in, or tries to submit, never while they type or tab through.'
  - 'Once a field shows an error, the error goes the moment the value is fixed.'
  - 'A failed submit moves focus to an error summary that links to each field, or to the first invalid field on a short form.'
example: 'Someone tabs through a checkout form to read it, and no errors appear. They submit with two fields empty, and focus moves to a summary with links to both.'
---

Validation decides how a form feels. Errors that appear too early nag, errors that appear too late waste time, and errors only some people can perceive lock the others out. This pattern says when errors appear, what they say, and where focus goes, with the project's form library or without one. It targets WCAG 2.2 AA.

## Start from what the project has

1. If the project has a form library, such as React Hook Form, TanStack Form, Formik, VeeValidate, Angular forms, or SvelteKit Superforms, or a schema library, such as Zod, Valibot, or Yup, apply this timing and these messages through it, and keep its rules.
2. Without one, use the browser's constraint validation: `required`, `type`, `pattern`, `min`, `max`, and `minlength` in the markup, read through `field.validity`, with the app's own messages.

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

Setting up a form library for this timing (check the project's version):

- **React Hook Form 7**: the defaults (`mode: "onSubmit"`, `reValidateMode: "onChange"`) show errors after a submit attempt and clear them as people fix them. To also show format errors before that, call `trigger(name)` on blur when `getFieldState(name).isDirty` is true and the field isn't empty, and on change while `getFieldState(name).invalid` is true: before the first submit, the defaults don't check a field again as it changes. Until `formState.isSubmitted`, clear a field's error with `clearErrors(name)` when it's emptied, since "required" waits for a submit attempt. `mode: "onTouched"` comes close, but also flags required fields someone only tabbed through.
- **VeeValidate 4**: set when fields are checked with `validateOnBlur`, `validateOnChange`, `validateOnInput`, and `validateOnModelUpdate`, globally with `configure()` or per field, and show a `required` error only once the form's `submitCount` is above 0. Version 3's `mode: "lazy"` is gone.
- **Angular forms**: show a control's error when the form was submitted, or when the control is `dirty` and `touched` and its error isn't `required`. The value updates on each input, so the error goes as soon as it's fixed.
- **Schema libraries**, such as Zod, Valibot, or Yup: keep the rules in the schema, and map its messages to the field errors and the summary.

## When errors appear

- Nothing shows while the form loads, or while someone tabs through it to read it.
- A field someone typed in is checked for format errors when they leave it.
- "Required" errors wait for a submit attempt, even for a field someone typed in and emptied. After that attempt, every error shows, required ones included.
- Once a field shows an error, it's checked on every input, so the error goes the moment the value is right. Emptied before a submit attempt, it shows no error.
- Dependent fields follow the same rule: no "Passwords must match" while the confirmation is still being typed.
- Async checks, such as an available username, run once typing pauses (about 500 ms, suggested), with "Checking…" in the status region. Only the latest request's answer counts: number each request, or abort the previous one with an `AbortController`.
- CSS `:user-invalid` comes close: in Chromium, Firefox, and WebKit it matched after typing an invalid value and leaving, and after a submit attempt, also with `novalidate`, and not after tabbing past an empty field. But it also matches a required field someone typed in and emptied, as they leave it (checked). So style `aria-invalid`, which follows the app's timing; use `:user-invalid` only when the browser's validity is the only source.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```js
// When errors appear. A field the person typed in is checked when they leave it, and a field
// that shows an error is checked again on every input, so the error goes as soon as it's
// fixed. "Required" errors wait for a submit attempt, so tabbing through a form, or emptying
// a field, shows none. showError(field, message) stands for the field's error display, and
// message(field) for the app's wording of field.validity.
const form = document.getElementById('signup');
let edited = new WeakSet();
form.noValidate = true; // the app's messages replace the browser's; without script, the browser checks

// Shows the field's error, or clears one it shows; fields without errors are left alone
function check(field) {
  if (!field.willValidate) return;
  const waiting = field.validity.valueMissing && form.dataset.submitted !== 'true';
  const text = field.validity.valid || waiting ? '' : message(field);
  if (text || field.getAttribute('aria-invalid') === 'true') showError(field, text);
}

// Runs fn after a reset that wasn't cancelled. The form puts its values back only after its
// reset event, and a listener after this one can still cancel the reset.
function afterReset(fn) {
  form.addEventListener('reset', (event) => setTimeout(() => {
    if (!event.defaultPrevented) fn();
  }));
}

form.addEventListener('input', (event) => {
  edited.add(event.target);
  if (event.target.getAttribute('aria-invalid') === 'true') check(event.target);
});
form.addEventListener('focusout', (event) => {
  if (edited.has(event.target)) check(event.target);
});
// A reset starts over: no errors, and no field counts as typed in
afterReset(() => {
  edited = new WeakSet();
  form.querySelectorAll('[aria-invalid="true"]').forEach((field) => showError(field, ''));
});
```

## What errors say

- What's wrong and how to fix it, with the field's label: "Enter your full name", "Enter an email address in the correct format, like name@example.com". Not "Invalid input", and not a library's technical message.
- In text next to the field, in its `aria-describedby`, with `aria-invalid="true"` on the field. Color and an icon only add to the text.
- Keep what the person typed; never clear a field because it's wrong.
- Errors from the server show the same way, at the field they belong to, or in the summary for the form as a whole.
- Never reveal private facts. "Email already registered" tells anyone who has an account. Availability checks are for public names, such as usernames or handles, and the server rate-limits them.

## Required and optional fields

Say it in words. When most fields are required, mark the optional ones "(optional)", and say so at the top of the form. If the design uses an asterisk, explain it at the top, and don't color it like an error. Required fields have the `required` attribute, which screen readers announce.

## Submitting

- The submit button stays enabled before a submit attempt and after a failed one, so people can find out what's missing.
- A submit attempt checks every field. With errors, the form isn't sent:
  - **Short forms** (a few fields, all visible): focus moves to the first invalid field.
  - **Longer forms**: an error summary at the top, "There is a problem", lists each error as a link to its field, and focus moves to the summary's heading. Following a link moves focus to the field (checked in Chromium, Firefox, and WebKit).
- Focus is the announcement: no live region repeats the errors. An error that appears when someone leaves a field may be announced once through the form's one polite status region; field errors are never `role="alert"`.
- Focusing a field scrolls it into view. With a sticky header, `scroll-padding-top` on the scrolling element keeps the field clear of it (WCAG 2.4.11).
- While the form is sent, the button gets `aria-disabled="true"` and ignores another press, and the status region says "Sending…". The `disabled` attribute would drop focus from the button, or from a field where someone pressed Enter. On success, go on; on failure, keep everything typed, show the error, and make the button work again.
- The snippet above sets `novalidate` from script, so the app's messages replace the browser's only when the app runs. Without script, the browser still checks the form.

```html
<!-- The first thing in a longer form, hidden until a submit attempt finds errors -->
<div class="error-summary" hidden>
  <h2 tabindex="-1">There is a problem</h2>
  <ul></ul>
</div>
```

```js
// On submit: check every field. With errors, the form isn't sent, and focus moves to the
// error summary's heading when the form has one (longer forms), or else to the first invalid
// field. Each summary link goes to its field (#id), and following it moves focus there.
// Register the app's own submit handler after this one: it runs only for a valid form.
form.addEventListener('submit', (event) => {
  form.dataset.submitted = 'true'; // from now on, "required" errors show too
  const fields = [...form.elements].filter((field) => field.willValidate);
  fields.forEach(check);
  const invalid = fields.filter((field) => !field.validity.valid);
  const summary = form.querySelector('.error-summary');
  if (summary) summary.hidden = invalid.length === 0;
  if (invalid.length === 0) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!summary) return invalid[0].focus();
  summary.querySelector('ul').replaceChildren(...invalid.map((field) => {
    const link = Object.assign(document.createElement('a'), { href: `#${field.id}`, textContent: message(field) });
    const item = document.createElement('li');
    item.append(link);
    return item;
  }));
  summary.querySelector('h2').focus();
});
// A reset starts over: the summary goes, and "required" waits for the next submit attempt
afterReset(() => {
  delete form.dataset.submitted;
  const summary = form.querySelector('.error-summary');
  if (summary) {
    summary.hidden = true;
    summary.querySelector('ul').replaceChildren();
  }
});
```

## Resets

- Most forms don't need a reset button: it's easy to press by mistake, and it loses everything typed. Apps often reset a form from script after sending it, though, so these rules hold either way.
- After a reset that wasn't cancelled, everything worked out from the values is rebuilt from the restored values, as on page load: the errors and the summary go, no field counts as typed in, "required" waits for the next submit attempt, and sections follow their answers.
- The form puts its values back only after its reset event, without input or change events, and a listener after yours can still cancel the reset. So wait for the event to finish, and check `defaultPrevented` first: `afterReset()` in the first snippet does both.

## Fields that don't always apply

- Put a section that only some answers need in a `<fieldset>`, and while it doesn't apply, make it `hidden` and `disabled`. Disabled fields are left out of validation and of the form data (checked in Chromium, Firefox, and WebKit), so they can't block the submit.
- Clear the section's errors when it hides.
- The section follows its answer on page load, on change, and after a reset. A reset puts the answer back without a change event, and leaves the section's own `hidden` and `disabled` as they were.
- Don't skip fields only because they're visually hidden: custom controls often hide their native input and still need its validation.

```html
<!-- A section only some answers need: hidden and disabled while it doesn't apply -->
<input type="checkbox" id="for-company" name="for-company">
<label for="for-company">I'm buying for a company</label>
<fieldset id="company-details" hidden disabled>
  <legend>Company details</legend>
  <label for="company">Company name</label>
  <input id="company" name="company" required aria-describedby="company-error">
  <p class="field-error" id="company-error" hidden></p>
</fieldset>
```

```js
// A section that doesn't apply is hidden and disabled: disabled fields are left out of
// validation and of the form data, so they can't block the submit. Its errors go when it
// hides. It follows its answer on load, on change, and after a reset, which puts the answer
// back without a change event. showError() and afterReset() as above.
const answer = document.getElementById('for-company');
const section = document.getElementById('company-details');

function sync() {
  section.hidden = !answer.checked;
  section.disabled = !answer.checked;
  if (section.disabled) {
    section.querySelectorAll('[aria-invalid="true"]').forEach((field) => showError(field, ''));
  }
}

answer.addEventListener('change', sync);
afterReset(sync);
sync(); // the answer the page starts with, such as a saved one, counts too
```

## Multi-step forms

- Check each step when someone tries to move on, as a submit, with only that step's fields (its fieldset's `elements`), and stay on the step while it has errors. Earlier steps stay enabled, so they're sent with the form; a step that an answer skips is disabled, like a section that doesn't apply.
- On a new step, move focus to its heading (`tabindex="-1"`), so its title and instructions are read, and update the page title, such as "Delivery address, step 2 of 4".
- Don't ask again for something given in an earlier step: fill it in, or offer it to choose (WCAG 2.2 3.3.7).
- Before a legal, financial, or data-changing submission, let people review and correct everything (WCAG 3.3.4).

## Formats

- Accept common formats and normalize them, such as spaces in card numbers and dashes in phone numbers.
- Show the expected format in hint text, not in a placeholder, which disappears on typing.
- Dates follow the person's locale. For a date people know by heart, such as a birthday, three fields (day, month, and year) work better than a picker.

## Edge cases

- **The click after an error**: when an error appears as someone leaves a field to press the submit button, the button moves under the pointer before the mouse is released, and the click is lost (checked in Chromium, Firefox, and WebKit). The form is invalid anyway, and the error shows. To keep the click, keep room for one error line under the fields above the button.
- **Sections that don't apply** are hidden and disabled, so they aren't checked or sent (see "Fields that don't always apply").
- **Autofill and paste** count as typing.
- **Server-rendered forms** that reload with errors put the summary at the top, move focus to it on load, and start the page title with "Error:".
- **Several forms on a page**: each has its own summary and status region.

## Examples

- Email: someone types "john@" and moves on; the error "Enter an email address in the correct format, like name@example.com" appears. As they type "example.com", it goes the moment the address is complete.
- Required field: someone tabs past an empty Full name field to read the form, and nothing appears. They type a letter, delete it, and move on: still nothing. They submit, and "Enter your full name" appears, with focus on the field.
- A section that doesn't always apply: "I'm buying for a company" shows the Company details section and enables it; unticked, the section hides, is disabled, and loses its errors, and the form can be sent without it.
- Password confirmation: nothing shows while the confirmation is typed. If it doesn't match when they leave it, "Passwords must match" appears, and goes as soon as it matches.
- Username availability: after a 500 ms pause in typing, "Checking…" in the status region, then "Username available" or "That username is taken. Try another" next to the field. An older answer that arrives late is ignored.
- Checkout, a longer form: a submit with three errors shows the summary "There is a problem" at the top, with links to the three fields, and focus on its heading.
- Multi-step form: Next checks the step; with errors it stays, and without, focus moves to the next step's heading "Delivery address", with the name from step 1 already filled in.
- Card number: the hint says "The 16 digits on the front of your card"; spaces typed between groups are accepted and removed.
- Date of birth: three fields, day, month, and year, in the person's locale order, rather than a date picker.

## Acceptance checklist

- [ ] Tabbing through the form without typing shows no errors
- [ ] A field someone typed in shows a format error when they leave it, and the error goes as soon as the value is right
- [ ] "Required" errors appear only after a submit attempt, even for a field someone typed in and emptied, and then for every empty required field
- [ ] A section that doesn't apply is hidden and disabled, so it never blocks the submit; its errors go when it hides, and it follows its answer on load and after a reset
- [ ] A form reset clears the errors and the summary, forgets which fields were typed in, and holds "required" back again; a cancelled reset changes nothing
- [ ] A failed submit moves focus to the error summary's heading on a longer form, or to the first invalid field on a short one, and each summary link moves focus to its field
- [ ] Errors are text next to their fields, connected with aria-describedby and aria-invalid, and say how to fix the problem
- [ ] No field error is a live region, and screen readers hear each error once
- [ ] The submit button stays enabled until sending starts, then uses aria-disabled, keeps focus, and ignores another press
- [ ] With script, the browser's own error messages don't appear; without it, the browser still checks the form
- [ ] Required and optional fields say so in words
- [ ] Async checks wait for a pause, say "Checking…", and only the latest answer counts
- [ ] Multi-step forms move focus to each step's heading and never ask twice for the same information
- [ ] A focused field is never hidden under a sticky header
- [ ] A form library, if the project has one, is set up to give the same timing

## See also

- **[Text Input Field](/potions/components/text-input)**: the label, hint, and error wiring of each field.
- **[Select and Combobox](/potions/components/dropdown-select)**: required choices, and typed text that isn't a choice.
- **[Login & Registration Forms](/potions/features/form-login-register)**: these rules in sign-in and registration forms.
- **[Modal Dialog](/potions/components/dialog)**: forms in a dialog.

These are suggestions; the pattern works with any form components.
