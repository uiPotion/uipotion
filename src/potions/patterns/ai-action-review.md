---
layout: 'potion'
title: 'AI Action Review Pattern'
publicationDate: '2026-05-23'
excerpt: 'A framework-agnostic pattern for reviewing AI-proposed actions before execution: plan preview, risk labels, scoped permissions, approve/reject/edit controls, undo, progress, and audit trail.'
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
---

# AI Action Review Pattern

A framework-agnostic pattern for reviewing AI-proposed actions before they execute. It covers plan previews, affected data, risk labels, scoped permissions, approve/reject/edit controls, undo and rollback affordances, progress states, and audit trails for agentic products.

This pattern complements the [AI Agent Chat Layout](/potions/layouts/ai-agent-chat) and [AI Response Rendering Pattern](/potions/patterns/ai-response-rendering). Those potions define the conversation shell and assistant response body. This pattern defines the control surface that appears when an AI assistant wants to do something with consequences.

## Scope and Boundary

This pattern covers:

- Reviewing a proposed action, batch of actions, or agent plan before execution
- Showing what will happen, why, which data is affected, and what the user can change
- Risk labels for reversible, sensitive, external-facing, destructive, or high-impact actions
- Approve, reject, edit, approve selected, pause, stop, undo, and retry controls
- Permission requests scoped to the current task
- Execution progress and post-action audit trails
- Accessibility for review flows, status updates, and confirmation surfaces

This pattern does NOT cover:

- The chat shell or message list
- General assistant message rendering
- Back-end authorization, policy engines, model safety, or security scanning
- Domain-specific legal approval workflows
- Fully autonomous background agent governance

## The Problem

AI agents can now draft emails, update records, run tools, create files, schedule meetings, and call APIs. If those actions execute without a clear review step, users can lose control over:

- What the agent plans to do
- Which records, people, files, or systems will be affected
- Whether an action is reversible
- What data or permission scope the agent is using
- How to correct a plan before execution
- How to stop or undo execution once it starts
- What happened afterward for accountability

Naive confirmation dialogs are not enough. They often hide details behind vague language, treat every action as equally risky, and give users only "OK" or "Cancel" even when the right move is to edit, approve only part of the plan, or ask the agent to try again.

## The Solution

Treat AI action review as a structured state machine over a proposed plan.

1. Convert the agent proposal into one or more typed action items
2. Summarize the goal in plain language before showing details
3. Show affected objects, permissions, data sources, destination, timing, and reversibility
4. Label risk using human-readable categories and non-color indicators
5. Let users approve, reject, edit, approve selected, or request a revised plan
6. Require stronger confirmation for high-impact or irreversible actions
7. Execute with visible progress, pause/stop controls, and partial failure handling
8. Preserve an audit trail with action id, actor, timestamp, tool, inputs, outputs, and outcome
9. Offer undo or rollback when the action is reversible
10. Announce state changes through live regions without moving focus unexpectedly

The review surface can appear inline in a chat, in a side panel, in a drawer, or in a modal dialog depending on urgency and available space.

## Action Model

Each action item should have a stable id, a human-readable label, a lifecycle state, and enough metadata for review.

### Required Fields

- id
- title
- summary
- actionType
- riskLevel
- reversibility
- affectedObjects
- permissions
- inputs
- destination
- state
- auditMetadata

### Action Types

- message - send, post, publish, or notify
- record-update - create, edit, archive, or delete a record
- file-operation - create, edit, move, share, or delete a file
- schedule - create, update, cancel, or invite
- code-change - edit, generate, run, or deploy code
- payment-or-order - purchase, refund, bill, or change subscription
- external-api - call a third-party service or internal integration
- system-setting - change configuration, permission, role, or automation

Unknown action types must still render as reviewable items. Label them clearly and avoid automatic approval.

## Risk Levels

Risk labels help users calibrate attention. They must be visible as text and icon, not only color.

- low - reversible, local, expected, limited scope
- medium - affects shared data, has multiple targets, or changes a saved state
- high - external-facing, sensitive, costly, permission-changing, or difficult to reverse
- blocked - violates policy, lacks permission, has invalid parameters, or needs a missing prerequisite

Use risk labels to change the review depth, not to shame the user. A high-risk action should show more detail, clearer consequences, and a stronger confirmation step.

## Review Surface

### Header

- Plain-language goal: "Update 12 overdue invoices"
- Status: proposed, reviewing, approved, executing, completed, failed, reverted
- Risk summary: highest risk level across selected actions
- Primary controls: approve, reject, edit, or approve selected

### Plan Summary

- What will happen
- Why the agent suggests it
- What data, context, or tool result influenced the proposal
- Whether the action is reversible
- Estimated time or number of steps

### Action List

Each action item shows:

- Title and concise summary
- Affected objects such as records, files, recipients, customers, or settings
- Destination or external system, if any
- Permission scope requested or already available
- Risk label and reversibility
- Preview, diff, or before/after comparison where applicable
- Checkbox or segmented approval when partial approval is supported

### Details Disclosure

Use progressive disclosure for dense information:

- Input parameters
- Tool name and integration
- Raw payload
- Policy check result
- Source citations or evidence
- Audit metadata

Details should be available but not dominate the primary review task.

## Controls

### Primary Controls

- Approve - executes all selected eligible actions
- Approve selected - executes only checked items
- Reject - declines the proposed plan
- Edit - opens editable parameters, message copy, selected objects, or constraints
- Ask for revision - sends a corrective instruction back to the assistant

### Execution Controls

- Pause - pauses queued or multi-step execution when supported
- Stop - cancels remaining actions immediately when possible
- Retry - retries a failed action or failed subset
- Undo - reverses completed actions when the system has a rollback path
- View log - opens the audit trail

### Confirmation Rules

- Low-risk actions can use a single approve button
- Medium-risk actions should show affected objects and reversibility before approval
- High-risk actions should require an explicit confirmation step with consequences
- Irreversible actions should require a typed confirmation, a least-destructive focus default, or an equivalent strong safeguard
- Blocked actions cannot be approved until the issue is resolved

## Lifecycle

The review flow moves through these states:

- proposed - action plan is available but not reviewed
- reviewing - user is inspecting, selecting, or editing
- needs-changes - user asked for a revision or edited inputs
- approved - action is approved but not yet running
- executing - one or more actions are in progress
- paused - execution is intentionally paused
- completed - all approved actions finished successfully
- partially-completed - some actions succeeded and some failed or were skipped
- failed - no approved action completed
- cancelled - user stopped execution before completion
- reverted - completed action was undone or rolled back

State transitions must preserve the reviewed plan and partial outcomes. Do not replace the review with a generic error.

## Accessibility

- Use semantic buttons, checkboxes, disclosures, and lists
- Keep focus inside a modal review surface when modal, and return focus to the invoking control when it closes
- Move focus to the review heading when a new review surface opens
- Put the least destructive action first in focus order for high-risk confirmations
- Announce lifecycle changes with `aria-live="polite"` or `role="status"`
- Use `role="alert"` only for urgent failures that require immediate attention
- Associate each checkbox with the action title and consequence summary
- Do not rely on color alone for risk labels
- Make all details disclosures keyboard reachable
- Ensure target sizes meet at least 24 by 24 CSS pixels with adequate spacing

## Responsive Behavior

- Desktop: use a side panel or inline split view with plan summary, action list, and details
- Tablet: stack summary above action list and collapse dense metadata into disclosures
- Mobile: use a full-height sheet or full-screen view with sticky action controls
- Long action lists should support filtering by risk, state, or selected status
- Sticky controls must not cover focused elements, errors, or status messages

## Error and Partial Failure

Execution can fail after approval. Preserve context and show exactly what happened.

- Tool failure - show the failed action, reason, retry option, and whether later actions were skipped
- Permission failure - show the missing scope and a scoped permission request
- Validation failure - keep user edits and focus the invalid field
- Network failure - preserve completed actions and retry only unfinished actions when possible
- Partial completion - distinguish completed, skipped, failed, cancelled, and reverted items
- Rollback failure - show completed rollback steps, failed rollback steps, and support escalation

## Do

- Show the proposed action before execution
- Use plain-language summaries before technical payloads
- Show affected objects, destination, permissions, and reversibility
- Use risk labels with text and icon, not color alone
- Let users edit or approve only part of a plan when the workflow supports it
- Require stronger confirmation for high-risk or irreversible actions
- Keep pause, stop, and cancel controls reachable during execution
- Preserve partial results and errors in place
- Provide undo or rollback when possible
- Record an audit trail for approved, rejected, failed, cancelled, and reverted actions
- Detect the user's framework, styling system, design tokens, component conventions, and existing AI/action infrastructure before writing code

## Don't

- Execute consequential actions directly from an assistant message without review
- Hide affected objects or destination behind generic text
- Treat all actions as equally risky
- Use color-only risk indicators
- Approve blocked, invalid, or missing-permission actions
- Collapse irreversible consequences behind a vague confirmation
- Replace partial execution with a generic failure message
- Move keyboard focus unexpectedly during progress updates
- Auto-grant broad permissions when a task-scoped grant is enough
- Introduce a new modal, drawer, toast, or button system when the project already has one

## Examples

### Email Send Review

An assistant drafts a customer email. The review surface shows recipients, subject, message preview, attachments, source context, and whether the email will send immediately or save as draft. The user can edit copy, remove recipients, approve, or ask for a softer tone.

### Bulk Record Update

An assistant proposes updating 43 customer records. The review surface groups actions by risk, shows a sample diff, lets the user approve selected rows, and requires confirmation because shared records will change.

### Calendar Scheduling

An assistant proposes a meeting. The review surface shows attendees, time zone, conflicts, conferencing details, notes, and external guests. External guests and personal calendar access are labelled as higher risk.

### File Share

An assistant proposes sharing a document. The review surface shows the file, recipients, access level, expiration, inherited permissions, and whether the share can be revoked.

### Code Change

An assistant proposes a code edit. The review surface shows a diff, touched files, commands to run, permission to execute commands, and rollback instructions.

## Anti-Patterns

1. One-button autonomy - the assistant says "I handled it" without showing what changed.
2. Vague confirmation - "Are you sure?" without affected objects, destination, or reversibility.
3. Hidden recipients - messages, invitations, or shares execute without showing who will receive them.
4. All-or-nothing batch approval - one risky item forces users to reject an otherwise good batch.
5. Permission sprawl - asking for broad, persistent access for a narrow task.
6. Non-recoverable progress - execution starts and the user cannot pause, stop, or inspect what is happening.
7. Audit trail as an afterthought - logs omit inputs, actor, tool, timestamps, or partial failures.
8. Color-only risk - red or yellow labels without text, icon, or accessible name.

## Testing Checklist

- [ ] Proposed actions appear before execution
- [ ] Risk labels include text and are not color-only
- [ ] Affected objects, permissions, destination, and reversibility are visible
- [ ] Low, medium, high, and blocked actions render distinct review behavior
- [ ] Approve, reject, edit, ask for revision, and approve selected work as expected
- [ ] High-risk or irreversible actions require stronger confirmation
- [ ] Blocked actions cannot be approved
- [ ] Pause, stop, cancel, retry, undo, and view log controls are reachable when applicable
- [ ] Partial completion preserves completed, failed, skipped, cancelled, and reverted states
- [ ] Audit trail records actor, timestamp, action id, tool, inputs, outputs, and outcome
- [ ] Modal review traps focus and returns focus on close
- [ ] Inline or side-panel review moves focus predictably to the heading
- [ ] Screen readers announce lifecycle changes without repeated noise
- [ ] Keyboard users can select individual actions and expand details
- [ ] Mobile sticky controls do not obscure focused content or status messages
- [ ] Reduced motion disables nonessential progress and state-change animation

## See Also

This pattern complements these potions:

- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)** - hosts review cards, drawers, or side panels inside conversational products
- **[AI Response Rendering Pattern](/potions/patterns/ai-response-rendering)** - renders tool calls and assistant messages that can hand off to review
- **[Dialog Component](/potions/components/dialog)** - works well for urgent or blocking confirmations
- **[Toast Notifications](/potions/components/toast-notifications)** - useful for completion, undo, and rollback feedback
- **[Command Palette](/potions/components/command-palette)** - can route command execution through the same review step
- **[Data Table](/potions/components/data-table)** - commonly pairs with bulk action review
- **[Form Validation Pattern](/potions/patterns/form-validation)** - applies to editable action parameters
- **[Dark/Light Mode Pattern](/potions/patterns/dark-light-mode)** - keeps risk labels and status colors readable in both modes
- **[Button Component](/potions/components/button)** - provides clear action, destructive, loading, and icon-button behavior

These are suggestions. The AI Action Review Pattern remains independently useful in any agentic workflow.
