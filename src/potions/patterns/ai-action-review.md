---
layout: 'potion'
title: 'AI Action Review Pattern'
publicationDate: '2026-05-23'
excerpt: 'A framework-agnostic pattern for reviewing AI-proposed actions before they run: plan preview, risk labels, scoped permissions, approve, reject, and edit controls, undo, progress, and an audit trail.'
category: 'Patterns'
tags:
  - patterns
  - ai
  - agent
  - approval
  - review
  - permissions
  - undo
  - audit-log
  - a11y
agentManifest: 'potions/patterns/ai-action-review.json'
path: 'potions/patterns/ai-action-review'
promptSubject: 'review and approval of AI agent actions'
useWhen: 'an AI agent proposes actions with consequences, such as sending email, changing records, or making payments, and people approve them first.'
specifies:
  - 'Nothing with consequences runs until someone approves it, and blocked actions can''t be approved at all.'
  - 'Approval gets stronger with risk: one click for a low-risk draft, a typed confirmation for an action that can''t be undone.'
  - 'When some actions fail, the ones that succeeded stay visible, with Retry for the failures and Undo where it''s possible.'
example: 'The assistant proposes emailing 3 customers and updating 43 records. The person approves the emails but not the records, and the review then shows each action''s result.'
---

When an AI assistant wants to do something with consequences, such as sending an email, changing records, or paying an invoice, people need to see what it will do and decide before it happens. This guide defines that review: what to show, how approval scales with risk, and what happens during and after the run. It targets WCAG 2.2 AA. It works on its own, and with the [AI Agent Chat Layout](/potions/layouts/ai-agent-chat) and the [AI Response Rendering Pattern](/potions/patterns/ai-response-rendering), which define the conversation and the assistant's messages.

## Start from what the project has

1. Build on the project's dialog, drawer, button, checkbox, disclosure, and table components, and its permission and audit services. Keep their APIs.
2. Choose what the task needs: the review surfaces, partial approval, editing, pause, undo, and the audit trail. Leave out the rest.

Add no dependency, such as a focus-trap library or a form library, without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility, security, or correctness requirement here, ask instead of choosing.

The guide covers reviewing one action, a batch, or a plan before it runs; risk labels; approve, reject, edit, pause, stop, retry, and undo; task-scoped permission requests; progress; and the audit trail. It doesn't cover back-end authorization, policy engines, model safety, legal approval workflows, or background agents that run without anyone watching.

## The action model

Turn the agent's proposal into typed action items, never generated prose alone. Each has a stable id (never key rows by index), a title, a plain-language summary of its consequence, an action type, a risk level, its reversibility, the objects it affects, the permissions it needs, its inputs and destination, what led to it, its state, an idempotency key once it's approved, and audit details.

Action types: message (send, post, publish, notify), record-update, file-operation, schedule, code-change, payment-or-order, external-api, and system-setting. An unknown type still renders as a reviewable item, clearly labelled, and is never approved automatically.

## Risk levels

Risk shows as text and an icon, never color alone. It sets how much review an action gets.

- **low**: reversible, local, expected, limited in scope
- **medium**: changes shared data, several targets, or saved state
- **high**: external, sensitive, costly, changes permissions, destructive, or hard to undo
- **blocked**: invalid, missing a permission, failing a policy check, unsupported, or missing a prerequisite

Reversibility is reversible, partially reversible, irreversible, or unknown. Treat unknown as higher risk.

## The review

- **Header**: the goal in plain language ("Update 12 overdue invoices"), the status, the highest risk among the selected actions, and the main controls.
- **Plan summary**, before any details: what will happen, why the agent suggests it, what data or tool results it's based on, whether it can be undone, and how many steps or how long. When the proposal follows content from outside the product, such as an email, a web page, or a shared file, say so and link to it: instructions inside such content may not come from the user.
- **Action list**: each action's title and summary, what it affects (records, files, recipients, settings), where it goes, the permission it uses, its risk and reversibility, a preview or diff where there is one, and a checkbox when partial approval is supported.
- **Details**, behind disclosures: input parameters, the tool and integration, the raw payload, policy checks, the evidence behind the proposal, and audit details.

The review can be a card in an assistant's message (for low-risk actions), a side panel (for plans of several actions), a drawer or sheet (on phones and tablets), a dialog (for urgent, high-risk, or irreversible confirmations), or full screen (for long plans and dense diffs).

## Controls

- **Approve** runs the selected eligible actions. Name it for the action and its scope, such as "Send to 3 recipients" or "Update 43 records", as a dialog names its primary action.
- **Approve selected** runs only the checked actions, and never the others.
- **Reject** declines the plan. **Edit** opens the parameters, the message text, the selected objects, or the constraints, validated with the project's form rules. **Ask for revision** sends a correction back to the assistant.
- **Pause** and **Stop** are reachable as soon as actions run. Stop starts no new action; one already sent may still finish, and its result shows.
- **Retry** runs failed or skipped actions again, **Undo** reverts completed ones when there's a rollback path, and **View log** opens the audit trail.

## Confirmation rules

- **Low risk**: one Approve button, when the affected objects and reversibility are visible.
- **Medium risk**: show the affected objects and reversibility before approval, and allow editing where parameters matter.
- **High risk**: an explicit step that states the consequences, never just "Are you sure?", with focus on the least destructive action.
- **Irreversible**: a typed confirmation that accepts paste, or a separate step that names the consequence. Don't use hold-to-confirm: holding is hard for many people with motor impairments, and has no standard keyboard or screen reader behavior.
- **Blocked**: approval isn't available, and the review says what must change before it can be.

The snippets in this guide are plain HTML and JavaScript; adapt them to the project's framework and its version.

```html
<label for="confirm-phrase">To confirm, type <strong>delete 43 records</strong></label>
<input id="confirm-phrase" autocomplete="off" spellcheck="false">
<button type="button" id="confirm-action" aria-disabled="true">Delete 43 records</button>
```

```js
// Paste works: the point is a deliberate step, not a typing test. The button stays
// focusable (aria-disabled, not disabled) and ignores activation until the phrase
// matches. approve() stands for the app's approval request.
const input = document.getElementById('confirm-phrase');
const button = document.getElementById('confirm-action');
const phrase = 'delete 43 records';

input.addEventListener('input', () => {
  const matches = input.value.trim().toLowerCase() === phrase;
  button.setAttribute('aria-disabled', String(!matches));
});

button.addEventListener('click', () => {
  if (button.getAttribute('aria-disabled') !== 'true') approve();
});
```

## The run's lifecycle

The review moves through these states: proposed, reviewing, needs-changes (after an edit or a request for revision, until the agent sends a revised plan), approved (and not yet started), executing, paused, completed, partially-completed, failed, cancelled, and reverted. Each action has its own state: proposed, selected, blocked, approved, executing, completed, failed, skipped, cancelled, or reverted.

- Only eligible proposed actions can be selected; blocked ones stay visible but can't be.
- An action that depends on another shows that, and is skipped if the other fails.
- Selections survive opening and closing details.
- A state change never replaces the reviewed plan or its partial results.

## Failures, retries, and undo

- After a failure, every action stays visible with its own state, and completed, failed, skipped, cancelled, and reverted actions look different.
- Retry runs only failed or skipped actions, and only when it's safe. It never reruns a completed action unless the person chooses to.
- Each approved action gets an idempotency key, and every retry sends the same key, so the server runs the action at most once.
- Give each request a time limit. Only an answer from the app decides the outcome: no answer, after a timeout or a dropped connection, or an error from a gateway (502 to 504) instead of the app, leaves it unknown, since the action may have run. Say that instead of "Failed", and retry only with the same key, or after checking the status.
- An answer that only accepts the action, such as 202 Accepted or a pending status in the app's answer, isn't the end. The action stays executing, with its Pause and Stop, and the review tracks it until the app reports how it ended.
- Before Undo, show what it will revert. If the rollback fails, keep that state and show how to escalate.

```js
// One idempotency key per approved action, reused on every retry, so the server can tell a
// retry from a new request and never runs the action twice. runAction() stands for the app's
// request: it sends the key, for example in an Idempotency-Key header, and resolves with the
// server's response.
async function execute(action) {
  action.idempotencyKey ??= crypto.randomUUID();
  let response;
  try {
    response = await runAction(action, { idempotencyKey: action.idempotencyKey, signal: AbortSignal.timeout(30_000) });
  } catch {
    // No answer, after a timeout or a dropped connection: the action may still have run
    action.state = 'failed';
    action.failure = 'outcome-unknown';
    return;
  }
  // 202 Accepted: the app has the action but hasn't finished it, so track it until it reports
  if (response.status === 202) action.state = 'executing';
  else if (response.ok) action.state = 'completed';
  else {
    action.state = 'failed';
    // A gateway's error (502 to 504) doesn't say whether the app ran the action
    action.failure = response.status >= 502 && response.status <= 504 ? 'outcome-unknown' : 'error';
  }
}
```

## Permissions and the audit trail

- Show the permission scope in plain language, and why this action needs it. Prefer one-time or task-scoped access to broad, lasting grants, and offer a manual path when permission is denied and the workflow allows it.
- The server checks the permission and the approval again: hiding or disabling a control is a convenience, not security.
- Record audit events for proposals, approvals, rejections, edits, runs, failures, cancellations, retries, and rollbacks. Each records the action and review ids, the actor and the approver, the time, the tool or integration, the permission scope, an input summary or hash, an output reference, the state changes, the failure reason, and the rollback result.
- Show a short activity log by default, with technical details behind disclosures.

## Accessibility

- Use headings for the review title, the plan summary, the action list, and the audit trail. Each selectable action's name contains its title and consequence, and `aria-describedby` connects it to its consequence, permission, and reversibility.
- A modal review follows the Dialog guide: native `<dialog>` opened with `showModal()`, or the rest of the page inert. Focus goes to the heading or the first safe control, and returns to the invoking control on close. Escape closes it as Cancel and never approves; in a high-risk confirmation step, Escape cancels the step and returns to the review.
- An inline, side-panel, or drawer review moves focus to its heading when it opens. Progress updates never move focus.
- A validation failure moves focus to the first invalid field, and a permission failure to the explanation or the scoped request. After Undo, focus stays near the affected action.
- Lifecycle updates, such as executing, completed, failed, cancelled, and reverted, are announced through one polite status region: the conversation's, when the review sits in a chat, otherwise its own. A modal review makes everything outside it inert, which hides the conversation's region, so while it's open it announces through a status region inside the dialog. Use `role="alert"` only for urgent failures, and never stream progress logs into a live region.
- Space toggles selections and disclosures, Enter activates buttons, and nothing runs when an action is selected or a parameter edited.
- Controls are at least 24 by 24 px, or have enough space around them.

## Layouts

- **From 1024 px**: a side panel, a split view, or full screen for dense plans; the summary and the action list can sit beside the details.
- **768 to 1023 px**: the summary above the action list, with dense details behind disclosures.
- **Below 768 px**: a full-height sheet or full screen, with sticky main controls and safe-area padding. Set `scroll-padding-bottom` to the controls' height, so they never cover the focused field, an error, or a status message.
- Long action lists can be filtered by risk, state, or selection.

## Motion

Motion is optional. State changes use a short background or border transition (150 ms), and surfaces follow the project's drawer, sheet, or dialog motion. Progress shows state without constant motion. Under `prefers-reduced-motion: reduce`, progress and state changes don't animate, and the status text stays.

## Working with the other AI guides

- The AI Agent Chat Layout owns the shell, where review cards sit in the conversation, and the conversation's status region. Low-risk reviews render as cards in the transcript; high-risk or dense plans move to a side panel, drawer, or dialog.
- The AI Response Rendering Pattern owns tool-call cards and their states (pending, running, success, error, cancelled). A tool call with consequences stays pending while this pattern reviews it, and the reply waits in its awaiting-review state. Approval moves the action to approved, and the card turns running only when the action starts running, cancelled on rejection, and error when running it fails.
- This pattern owns the review, the action model, the risk and confirmation rules, the run, partial failures, the audit trail, and permission requests.
- Only tool calls the product classifies as without consequences skip review: already authorized, read-only, sending no sensitive data out of the product, and costing nothing meaningful. Reads that send sensitive query data to external services, call metered APIs, or need new permissions are reviewed like any other action.

## Examples

- **Sending an email**: the recipients, subject, body, attachments, the context it came from, and when it sends, with external recipients flagged. People can edit the text, remove recipients, save it as a draft, approve, or ask for a softer tone.
- **A bulk record update**: 43 proposed customer updates grouped by risk, with a sample diff and selectable rows. People approve the low-risk changes and reject one high-risk change.
- **Scheduling**: attendees, time zone, conflicts, conferencing, external guests, the agenda, and whether personal calendar access is used. People can change the time or the attendees before approving.
- **Sharing a file**: the file, its current access, the proposed recipients, the access level, any expiry, inherited permissions, and whether the share can be revoked. A public link needs explicit confirmation.
- **A code change**: the touched files, the diff, the commands the agent wants to run, the permission to run them, the test plan, and how to roll back. Commands run only after approval.
- **A payment or an order**: the amount, account, recipient, invoice, due date, fees, and whether it can be cancelled, with high-risk confirmation and audit logging.
- **A permission request**: the exact missing scope, why this action needs it, for how long, and a manual alternative when there is one.
- **A partial failure**: five actions were approved. Three completed, one failed validation, and one was skipped because it depended on the failed one. The review stays visible, with Retry for the failure and Undo for the completed actions.
- **No answer**: the request to send an invoice times out, or its connection drops. The action says it's unknown whether the invoice was sent, and Retry reuses its idempotency key, so the server sends it at most once.

## Acceptance checklist

- [ ] Proposed actions show before anything runs, each with what it affects, where it goes, the permission it uses, its risk in text and an icon, and whether it can be undone
- [ ] Low, medium, high, and blocked actions get the review the confirmation rules give them, and blocked actions can't be approved
- [ ] Approve is named for the action and its scope, and Approve selected runs only the selected actions
- [ ] An irreversible action's typed confirmation accepts a pasted phrase, and its button stays focusable and does nothing until the phrase matches
- [ ] Reject, Edit, and Ask for revision work, and edited values are validated with the project's form rules
- [ ] Pause and Stop are reachable as soon as actions run, and Stop starts nothing new
- [ ] After a partial failure, every action shows its own state (completed, failed, skipped, cancelled, or reverted), and Retry runs only failed or skipped actions
- [ ] An action whose request gets no answer, after a timeout or a dropped connection, says its outcome is unknown, and retrying it reuses its idempotency key, so it never runs twice
- [ ] An action the app accepts but hasn't finished (202 Accepted) stays executing, with Pause and Stop, until the app reports how it ended
- [ ] Undo says what it will revert, and its result is recorded
- [ ] The audit trail records the action, actor, approver, time, tool, permission scope, inputs, outputs, outcome, and rollback
- [ ] A modal review works like the Dialog guide: focus moves in, the page behind is inert, Escape cancels without approving, and focus returns to the control that opened it
- [ ] An inline or side-panel review moves focus to its heading when it opens, and progress updates never move focus
- [ ] Screen readers hear lifecycle changes once each, without the progress log
- [ ] Sticky controls on phones never cover the focused field, an error, or a status message
- [ ] With reduced motion, progress and state changes don't animate, and the status text stays
- [ ] Styles come from the project's styling system and tokens, and risk labels, text, and controls meet the contrast minimums

## See also

- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)**: places review cards in the conversation.
- **[AI Response Rendering Pattern](/potions/patterns/ai-response-rendering)**: renders the tool-call cards that hand off to the review.
- **[Modal Dialog](/potions/components/dialog)**: for urgent or blocking confirmations.
- **[Toast Notifications](/potions/components/toast-notifications)**: completion, retry, and undo feedback after the review has closed.
- **[Command Palette](/potions/components/command-palette)**: commands with consequences can go through the same review.
- **[Data Table](/potions/components/data-table)**: bulk actions and selectable affected objects.
- **[Form Validation Pattern](/potions/patterns/form-validation)**: editable action parameters.
- **[Dark/Light Mode](/potions/patterns/dark-light-mode)**: risk labels and status colors that stay readable in both themes.
- **[Button](/potions/components/button)**: approve, reject, destructive, busy, and icon-only buttons.

These are suggestions; the pattern works in any agent workflow.
