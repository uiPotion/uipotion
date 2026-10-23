---
layout: 'potion'
title: 'Login & Registration Forms with Validation'
publicationDate: '2026-01-24'
excerpt: 'Sign-in and registration forms that follow current NIST password guidance, never reveal whether an email has an account, work with password managers and passkeys, and keep passwords out of URLs, spell-check services, and plain view.'
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
useWhen: 'you build or fix sign-in, registration, or password reset forms, with your own backend or an auth provider.'
specifies:
  - 'A failed sign-in never says whether the email or the password was wrong, and a dropped connection gets its own message.'
  - 'Password managers and paste work everywhere, and Show password keeps focus on its button.'
  - 'Passwords follow NIST: a minimum length, no required symbols, and no length check at sign-in.'
example: 'Someone signs in with the wrong password and sees "Email or password is incorrect", with their email still filled in. When their connection drops, they see "Unable to sign in right now" instead.'
---

Sign-in and registration are where accessibility, security, and privacy meet. This guide covers the sign-in and registration forms, the password reset request, and their messages. It follows NIST SP 800-63B-4 for passwords, and targets WCAG 2.2 AA.

## Start from what the project has

1. If the project uses an authentication service, its own backend or a provider or library such as Auth0, Clerk, Supabase Auth, Firebase Auth, Amazon Cognito, or Auth.js, follow its password rules, rate limits, and passkey support, and use its components or SDK. This guide fills the gaps; it doesn't override the service's rules.
2. Map the service's error codes to this guide's public messages. Never show messages that reveal whether an account exists, such as "user not found" or "email already in use". If the service can't avoid revealing it, tell the user about the conflict instead of shipping it.
3. Build on the project's form, field, and button components, and its validation (the Form Validation Pattern).

Implement only what the task needs, and add no dependency without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## The forms

- **Sign in**: email (`type="email"`, `autocomplete="username"`), password (`autocomplete="current-password"`), Show password, an optional Remember me, Sign in, a "Forgot your password?" link, and optional passkey and social sign-in. The password is checked for presence only: no length or character rules at sign-in, so accounts made under older rules still work.
- **Registration**: one full name field (`autocomplete="name"`), required but with no minimum length, since some names are one character; email (`autocomplete="username"`); a new password (`autocomplete="new-password"`) with the requirements indicator; an optional confirmation; terms, if the product needs them; and Create account.
- **Password reset request**: email, and the same confirmation for every request.
- Each form is a `<form method="post">` named by its heading (`aria-labelledby`), with a status region at the top. Posting matters: a form sent before its script runs, on a slow connection or a server-rendered page before hydration, would otherwise use GET and put the email and password in the URL, where history and server logs keep them.
- The page title says which form it is, such as "Sign in, Acme". Switching between sign-in and registration moves focus to the new form's heading.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<!-- method="post": a form sent before its script runs never puts the password in the URL -->
<form id="sign-in" method="post" action="/sign-in" aria-labelledby="sign-in-title">
  <h1 id="sign-in-title">Sign in</h1>
  <p class="form-status" role="status"></p>
  <label for="sign-in-email">Email address</label>
  <input id="sign-in-email" name="email" type="email" autocomplete="username" required>
  <label for="sign-in-password">Password</label>
  <div class="password-field">
    <input id="sign-in-password" name="password" type="password" autocomplete="current-password"
      spellcheck="false" autocapitalize="none" required>
    <button type="button" class="password-toggle" aria-pressed="false"
      aria-controls="sign-in-password">Show password</button>
  </div>
  <button type="submit">Sign in</button>
  <p><a href="/forgot-password">Forgot your password?</a></p>
</form>
```

## Passwords

- The minimum length comes from the auth service. Otherwise, NIST SP 800-63B-4: at least 15 characters when the password is the only sign-in factor, and at least 8 when a second factor is always required. Count Unicode code points.
- Accept at least 64 characters, spaces, all printable characters, and Unicode, and don't trim or truncate them.
- No composition rules: never ask for digits, symbols, or mixed case.
- Reject common and breached passwords; the full check runs on the server.
- At registration and reset, a requirements indicator says whether the password is too short, too common, or meets the requirements. It never says "strong" from length: "aaaaaaaaaaaaaaaaaaaa" is long, but easy to guess. A pattern-aware strength estimator the project already has may rate instead. Screen readers hear the status when it changes, through the form's status region, not on every keystroke.

```js
// The requirements indicator's state. MIN_LENGTH comes from the auth service, or the
// NIST SP 800-63B-4 default for password-only sign-in. isCommonPassword() checks a short
// list on the client; the full breached-password check runs on the server.
const MIN_LENGTH = 15;

function getPasswordRequirementState(password, isCommonPassword) {
  const length = [...password].length; // count Unicode code points, not UTF-16 units
  if (length === 0) return 'none';
  if (length < MIN_LENGTH) return 'too-short';
  if (isCommonPassword(password)) return 'too-common';
  return 'meets-requirements';
}
```

## Show password

- A `<button type="button">` next to the field, named "Show password", with `aria-pressed`. Its name stays the same, screen readers announce its state, and focus stays on it. A "Show password" checkbox works too.
- Password fields have `spellcheck="false"` and `autocapitalize="none"`. Shown as text, a password could otherwise reach a browser's online spell-check service (Chrome's Enhanced Spell Check and Microsoft Editor, when turned on; reported in 2022).
- The password is hidden again when the form is sent or reset, and when the page comes back from the back/forward cache, so it's never left showing.

```js
// The show-password button: a toggle with a name that stays the same and aria-pressed, so
// screen readers announce its state, and focus stays on it. The password is hidden again
// when the form is sent or reset, and when the page comes back from the back/forward cache.
const password = document.getElementById('sign-in-password');
const toggle = document.querySelector('[aria-controls="sign-in-password"]');

function setShown(shown) {
  password.type = shown ? 'text' : 'password';
  toggle.setAttribute('aria-pressed', String(shown));
}

toggle.addEventListener('click', () => setShown(password.type === 'password'));
password.form.addEventListener('submit', () => setShown(false));
password.form.addEventListener('reset', () => setShown(false)); // hiding is always safe
window.addEventListener('pageshow', (event) => {
  if (event.persisted) setShown(false);
});
```

## Messages that stay generic

These never reveal whether an email has an account, and read the same for every account:

- Rejected sign-in: "Email or password is incorrect", without saying which field was wrong.
- Network or service failure: "Unable to sign in right now. Try again shortly". It doesn't blame the password, so an outage never sends people to reset it.
- After registration: "Check your email to continue", for new and existing emails alike; the backend emails the existing account's owner instead. This needs email verification: if the product signs new users in immediately, registration can't hide whether an email exists, so raise that tradeoff.
- Password reset request: "If an account exists for this email, we've sent a reset link".
- Rate limit: "Too many attempts. Wait a few minutes and try again".

Sign-in results show at the top of the form, in its status region, with the email kept. Field errors stay specific: "Enter your email address", "Use at least 15 characters", "This password is too common. Choose a different one", "This password has appeared in a data breach. Choose a different one", and "Passwords must match".

## Sending

- Validation runs first, with the Form Validation Pattern's timing.
- While the request runs, the button has `aria-disabled="true"`, ignores another press, and keeps focus, and the status region says "Signing in…". Don't disable the fields or the button: disabling the focused element drops focus to the page in Chromium and Firefox (checked).
- The request has a time limit, 30 seconds suggested. A timeout or a dropped connection gets the network message, never the wrong-details one.
- On success, go on to the app, or to the "Check your email" step. On failure, keep the email, show the message, and make the button work again.

```js
// Sending the sign-in. The button keeps focus (aria-disabled, not disabled), a second submit
// while one runs is ignored, and the status region says what's happening. Wrong details and
// a failed connection get different messages, and neither says which field was wrong.
// signIn() stands for the app's request and onSignedIn() for its next step; map the auth
// service's answers to these messages.
const form = document.getElementById('sign-in');
const button = form.querySelector('[type="submit"]');
const status = form.querySelector('[role="status"]');
const messages = {
  401: 'Email or password is incorrect',
  429: 'Too many attempts. Wait a few minutes and try again',
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (button.getAttribute('aria-disabled') === 'true') return;
  button.setAttribute('aria-disabled', 'true');
  status.textContent = 'Signing in…';
  try {
    const response = await signIn(new FormData(form), { signal: AbortSignal.timeout(30_000) });
    if (response.ok) return onSignedIn(response);
    status.textContent = messages[response.status] ?? 'Unable to sign in right now. Try again shortly';
  } catch {
    status.textContent = 'Unable to sign in right now. Try again shortly';
  } finally {
    button.removeAttribute('aria-disabled');
  }
});
```

## Password managers, paste, and passkeys

- `autocomplete="username"` on the email that identifies the account, also when it holds an email address; `current-password` at sign-in; `new-password` at registration and reset; and `one-time-code` on verification codes.
- Never block paste or autofill (WCAG 2.2 3.3.8 Accessible Authentication).
- Passkeys (optional): a "Sign in with a passkey" button, and passkey autofill with `autocomplete="username webauthn"` on the email field. If the prompt is cancelled or fails, focus returns to the passkey button, a short generic message shows, and the password form stays.

## Accessibility

- Labels are visible, and required and optional fields say so in words.
- Field errors follow the Form Validation Pattern: text next to the field, `aria-describedby` and `aria-invalid`, and no live regions. A failed submit moves focus to the first invalid field.
- One status region per form, for "Signing in…", the sign-in results, and the requirement status.
- Buttons, Show password included, are at least 24 by 24 px (44 px suggested on touch), and text is at least 16 px on phones.

## Layout and motion

These are suggested defaults; the project's design and tokens win.

- A card at most 420 px wide, centered, with 48 px padding from 768 px wide and 24 px below.
- On phones, the card fills the width minus 16 px gutters. Fields and buttons are 48 px tall.
- Motion is optional: a 200 ms fade when switching forms. Under `prefers-reduced-motion: reduce`, changes are instant.

## Edge cases

- An email that already has an account: registration shows the same next step as for a new email, and the backend emails the account's owner a sign-in or reset link instead.
- An older account whose password is shorter than today's minimum still signs in; ask for a new password after sign-in only if the auth service requires it.
- A password filled by a password manager or pasted is accepted.
- Spaces and Unicode in a password are kept as typed, never trimmed.
- Too many attempts: the generic rate-limit message, worded the same whether or not the account exists.
- A passkey prompt cancelled or failed: the password form stays, and focus returns to the passkey button.
- A request that never answers ends at the time limit with the network message, and pressing Sign in again retries.
- A product that signs new users in immediately can't hide at registration whether an email has an account: raise that tradeoff with the user.
- Long emails and names scroll inside their fields, and nothing is cut off.

## Acceptance checklist

- [ ] Each form posts (method="post"), so a form sent before its script runs never puts a password in the URL
- [ ] Sign-in accepts any non-empty password; registration and reset apply the length, common-password, and breach rules, with no composition rules
- [ ] Passwords of 64 or more characters, spaces, and Unicode are accepted as typed
- [ ] The requirements indicator never says "strong" from length alone, and screen readers hear its status when it changes
- [ ] A failed sign-in says "Email or password is incorrect", a network or service failure says "Unable to sign in right now", and the email stays filled in
- [ ] Registration, password reset, and rate-limit messages read the same whether or not the account exists
- [ ] Password managers can save and fill the credentials, and paste works in every field
- [ ] Show password keeps its name and focus, shows its state with aria-pressed, and the password is hidden again when the form is sent or reset, or the page comes back
- [ ] Password fields have spellcheck="false"
- [ ] While signing in, the button keeps focus with aria-disabled, a second press sends nothing, and the status region says "Signing in…"
- [ ] Field errors follow the Form Validation Pattern, and a failed submit moves focus to the first invalid field
- [ ] Passkey sign-in, if offered, falls back to the password form when it's cancelled or fails
- [ ] The forms work at 320 px wide, with 16 px text on phones
- [ ] Styles come from the project's styling system and tokens

## See also

- **[Text Input Field](/potions/components/text-input)**: the email and password fields.
- **[Select and Combobox](/potions/components/dropdown-select)**: a country or a language in registration forms.
- **[Button](/potions/components/button)**: Sign in, Show password, and link-style actions.
- **[Form Validation Pattern](/potions/patterns/form-validation)**: when field errors appear, and where focus goes when a form is submitted.

These are suggestions; the forms work with any components and auth service.
