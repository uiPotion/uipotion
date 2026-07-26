---
layout: 'potion'
title: 'AI Response Rendering Pattern - Streaming, Tool Calls, and Optional Reasoning'
publicationDate: '2026-04-18'
excerpt: 'A framework-agnostic pattern for rendering an AI assistant reply: streaming tokens, incremental Markdown, code blocks, tool-call cards, citations, artifacts, and recovery from mid-stream errors. Optional reasoning-status surface when the provider explicitly exposes it. Companion to the AI Agent Chat Layout.'
category: 'Patterns'
tags:
  - patterns
  - ai
  - streaming
  - markdown
  - tool-calls
  - reasoning
  - citations
  - artifacts
  - a11y
agentManifest: 'potions/patterns/ai-response-rendering.json'
path: 'potions/patterns/ai-response-rendering'
---

# AI Response Rendering Pattern - Streaming, Tool Calls, and Optional Reasoning

A framework-agnostic pattern for rendering the contents of a single AI assistant reply: streaming tokens, incremental Markdown, code blocks with copy controls, tool-call cards with lifecycle states, citations and source pills, artifact handoffs, message-level controls, and recovery from mid-stream failures. Includes an optional reasoning-status surface for products whose model provider explicitly exposes a reasoning channel.

This pattern is the companion to the [AI Agent Chat Layout](/potions/layouts/ai-agent-chat). The chat layout defines the room (sidebar, header, message list, input). This pattern defines what goes inside one assistant message bubble in that room. The two are designed to work together: the layout streams chunks into the bubble; this pattern decides how those chunks become visible UI.

## Scope and Boundary

This pattern covers:

- The internal structure of one assistant message bubble
- How streamed tokens are appended without layout thrash
- How Markdown, code, tool calls, citations, and (when the provider exposes it) reasoning are rendered
- The lifecycle of a streaming response (idle, queued, streaming, tool-running, awaiting-review when composed with an action review surface, complete, cancelled, errored)
- Per-message controls (stop, regenerate, copy, edit, feedback)
- Accessibility for live, partially rendered content

This pattern does NOT cover:

- The chat shell, sidebar, header, conversation switching (see AI Agent Chat Layout)
- The user input field or send button (see AI Agent Chat Layout)
- Conversation history or persistence (see AI Agent Chat Layout)
- The transport layer (SSE, WebSocket, fetch streaming) - implementation detail

## The Problem

Modern AI assistants do not return a finished string. They emit a sequence of events over time: text deltas, tool invocations, tool results, citations, structured artifacts, stop reasons, and in some providers a separate reasoning channel. Naive rendering causes:

- Layout shift on every token (jumping scroll, jittery cursors)
- Broken Markdown during streaming (unclosed code fences render as raw text or eat content)
- Tool calls appearing as opaque JSON dumps
- Reasoning (when present) overwhelming the answer, or being surfaced verbatim when a status label would suffice
- Citations rendered as bare numbers with no source resolution
- Lost context on cancellation or mid-stream errors (user does not know what happened)
- Screen reader spam from each token announcement
- No way to copy or regenerate after the fact

A coherent response renderer turns the event stream into a stable, readable, accessible message that behaves correctly at every point in its lifecycle.

## The Solution

Treat the assistant message as a state machine over a structured content tree, not as a growing string.

1. Model the message as an ordered list of typed blocks: text, code, tool-call, citation, artifact-ref, error, with an optional reasoning block only when the provider exposes it
2. Append blocks and grow the trailing block as deltas arrive
3. Render an explicit streaming cursor at the trailing edge while the message is in progress
4. Use an incremental Markdown renderer that tolerates unclosed fences and lists
5. Render tool calls as cards with explicit lifecycle states, not raw JSON
6. Surface reasoning only when the provider exposes it and the product decides to show it; prefer a summary or status affordance over verbatim content
7. Resolve citation markers to source pills with hover and click affordances
8. Show recoverable error blocks in place rather than discarding the message
9. Announce status changes (started, tool running, completed, error) via a single polite live region; do not announce every token
10. Expose stable per-message controls (copy, regenerate, stop, feedback) once interactivity is appropriate

## Block Types

A rendered assistant message is an ordered sequence of blocks. Each has a stable id, a type, and a state. Renderers must handle every type below; unknown types should fall back to a labelled raw block, never silently drop.

### text

Streamed prose. Rendered through an incremental Markdown pipeline. May contain inline citation markers.

### code

A fenced code block with language hint. During streaming the closing fence may be absent; the renderer must still render correctly. Includes a copy button that becomes available once the block is complete or once the user explicitly requests it.

### tool-call

A request from the assistant to invoke a tool, along with its eventual result. Has its own lifecycle: pending, running, success, error, cancelled. Rendered as a card, not as raw JSON.

### reasoning (optional)

An optional surface for a model's reasoning channel. Include this block type only when the model provider explicitly exposes a reasoning or thinking channel AND the product has decided to surface it to users. If the provider does not expose reasoning, omit the block type entirely - do not render an empty or placeholder surface.

Preferred form is a compact summary or status affordance such as "Thought for 4s" or "Reasoning". Verbatim reasoning content is shown only when the provider's terms allow it and the product requires it. When verbatim content is included, default to collapsed. Reasoning is supporting context, never the answer.

### citation

An inline marker (often a superscript number) that resolves to a source. Must always be paired with a hoverable or clickable affordance that exposes the source title and URL.

### artifact-ref

A pointer to a separately rendered artifact (document, code file, diagram, canvas). The bubble shows a card with title, type, and an open action; the artifact itself lives in a side panel or sheet.

### error

An in-message recoverable error (tool failure, network drop, rate limit, content policy refusal, truncation). Rendered in place so context is preserved; offers retry where applicable.

## Message Lifecycle

A response moves through these states. UI affordances depend on the current state.

- idle - no response yet, awaiting trigger
- queued - request accepted, waiting for the model
- streaming - blocks are being appended or the trailing block is growing
- tool-running - one or more tool-call blocks are running or pending imminent execution
- awaiting-review - a consequential tool-call block is held in pending while an action review surface presents it for approval; occurs only when composed with the AI Action Review Pattern. The message is waiting on the user, not working: the streaming cursor and running animation are suppressed, the held card shows an awaiting-review status line, and Stop stays reachable
- complete - terminal stop reason received, all blocks finalized
- cancelled - user stopped the response; partial content preserved
- errored - terminal failure; partial content preserved with an error block

Transitions:

- idle to queued on send
- queued to streaming on first delta
- streaming to tool-running when a tool-call enters running
- streaming or tool-running to awaiting-review when a consequential tool call is held for approval (only when composed with an action review surface)
- awaiting-review to tool-running when approval is given and execution begins
- awaiting-review to streaming when the action is rejected (the card becomes cancelled) and text resumes
- tool-running to streaming when text resumes
- any non-terminal to complete on natural stop
- any non-terminal to cancelled on user stop
- any non-terminal to errored on unrecoverable failure

## Streaming Mechanics

### Append Strategy

- New blocks append to the end of the message list
- Text deltas grow the trailing text block in place
- Code deltas grow the trailing code block in place
- Tool-call lifecycle updates mutate the existing card by id; do not re-create it

### Cursor

- Show a blinking caret or pulsing block at the trailing edge of the active block while streaming
- Hide the cursor on complete, cancelled, or errored
- Cursor must be CSS-only animation; do not trigger React or Vue re-renders for blink

### Layout Stability

- Reserve vertical space for streamed content using min-height on block wrappers when possible
- Avoid scroll jumps: only auto-scroll to bottom when the user is already pinned to the bottom
- Do not animate the appearance of individual tokens; animations must be reserved for whole-block entrance
- Throttle DOM mutations using requestAnimationFrame; coalesce rapid deltas within a single frame

### Incremental Markdown

- Use a parser that tolerates incomplete input (unclosed fences, partial links, partial emphasis)
- Re-parse the trailing block on each batched update; do not re-parse completed blocks
- For very long messages, segment by paragraph so updates re-parse only the trailing paragraph
- Sanitize on render; never trust model output as HTML

### Auto-scroll Rules

- Pinned-to-bottom: continuously follow new content
- Scrolled up: do not yank the viewport; show a "New content below" jump button instead
- Re-pin when the user scrolls back to the bottom

## Tool-Call Card

A tool call is a structured request issued by the assistant. The user must understand what was called, with what inputs, and what came back.

### Lifecycle States

- pending - the call is queued; show name and a muted skeleton
- running - the call is in flight; show name, animated indicator, optional partial progress text
- success - completed with a result; show name, summarized result, expandable raw input and output
- error - failed; show name, error summary, expandable details, optional retry
- cancelled - aborted; show name and a cancelled label

### Required Surface

- Tool name (human-readable, not internal id)
- Short status line for the current state
- Disclosure to expand input arguments as a JSON or labelled-fields view
- Disclosure to expand the raw result on success or the error payload on failure
- Stable identity by tool-call id so updates mutate one card

### Result Summarization

- Success summaries should be one short line: a count, a title, a snippet
- Long results live behind the disclosure; do not dump them inline
- Structured results (search hits, file lists) may render as compact lists of up to N items with a "Show all" affordance

## Reasoning Block (Optional)

A reasoning block is rendered only when two conditions are both true:

1. The model provider explicitly exposes a reasoning or thinking channel
2. The product has decided to surface that channel to users (product decision, not a default)

If either condition is false, do not render a reasoning surface. Do not fabricate reasoning from other signals, and do not render an empty placeholder.

When included:

- Default form is a compact label: "Thought for 4s", "Reasoning", or similar summary or status
- The label may include duration, step count, or a brief one-line summary if the model provides one
- Verbatim reasoning content is shown only when the provider's terms allow it and the product requires it - prefer the summary or status form
- When verbatim content is shown, the label is a disclosure that expands to the text; the disclosure is collapsed by default
- Reasoning is supporting context: never let it dominate the visual hierarchy
- Always keep the answer visually primary

## Citations

- Inline citation markers (e.g. superscript numbers) appear in the text where the claim is made
- Each marker is a focusable element with an accessible name including the source title
- Hovering or focusing reveals a popover with title, domain, and a one-line snippet
- Clicking opens the source in a new tab (or a sheet, depending on host product)
- A consolidated source list at the foot of the message is recommended for messages with three or more sources
- Never render bare numbers without resolution; if the source is missing, omit the marker

## Artifact Reference

When the assistant produces a substantial output that does not belong inline (a long document, a generated file, a chart, a canvas), render an artifact card in the bubble.

- Card shows title, type icon, optional preview thumbnail, and an open action
- Activation routes to a side panel, drawer, or full-screen view depending on host
- The artifact card is interactive immediately; do not block on the rest of the message

## Per-Message Controls

These controls live at or near the foot of the bubble. They appear on hover, focus, or always-visible depending on density preference. All controls must be keyboard reachable.

- Copy - copy the rendered Markdown source of the message
- Regenerate - request a new response for the same prompt; available on complete, cancelled, errored
- Stop - cancel the active stream; available only during streaming, tool-running, or awaiting-review
- Edit - edit the user's preceding prompt and re-send; available on assistant messages whose preceding user message is editable
- Feedback - thumbs up or down; optional comment
- Share - generate a shareable link to the message or conversation; product-dependent

## Error and Partial States

Errors do not erase the message. Render an error block in place so the user keeps the context.

- Network drop mid-stream - error block under the partial content; offer retry that re-requests from the failure point if the API supports it, otherwise full regenerate
- Rate limit - error block with the limit reason and an optional cooldown countdown
- Refusal or content policy - replace or annotate the bubble with the refusal content; do not silently truncate
- Tool failure - error inside the offending tool-call card; the surrounding response continues
- Timeout - error block with a retry; preserve partial content
- Truncation by max tokens - banner at the foot of the message indicating truncation; offer continue if supported

## Do

- Model the message as a typed block list, not a string
- Render a streaming cursor and remove it on terminal state
- Use an incremental, sanitized Markdown renderer that tolerates incomplete input
- Render tool calls as lifecycle cards with stable ids
- Treat reasoning as optional: include a reasoning surface only when the provider exposes a reasoning channel and the product has decided to surface it; prefer a summary or status affordance over verbatim content; keep the answer visually primary
- Resolve citation markers to source affordances; never render bare numbers
- Render artifacts as cards in the bubble; route the body to a side surface
- Pin to bottom only when the user is already pinned; otherwise show a jump button
- Throttle DOM updates with requestAnimationFrame; coalesce deltas per frame
- Announce status changes via one polite live region per conversation; never announce per token
- Sanitize all rendered content; treat model output as untrusted
- Preserve partial content on cancel and error; offer retry in place
- Make Copy, Regenerate, and Stop reachable by keyboard
- Provide stable focus targets so a screen reader can navigate the message after streaming
- Respect prefers-reduced-motion for cursor blink, entrance animations, and auto-scroll

## Don't

- Re-render the entire message tree on every delta
- Animate per-token appearance (causes motion sickness and reads as jitter)
- Yank the scroll position when the user has scrolled up
- Render tool calls as raw JSON dumps with no card and no states
- Render a reasoning surface when the provider does not expose a reasoning channel, or default it to verbatim content when a summary or status affordance would suffice
- Render bare citation numbers with no source link
- Push artifact bodies inline; the bubble becomes unscannable
- Announce every token to assistive tech (verbose live regions exhaust users)
- Trust model output as HTML; always sanitize
- Discard the message on error; users lose context and trust
- Block message-level controls until streaming finishes (Stop must work immediately)
- Use blocking parsers that throw on incomplete Markdown

## Accessibility

### WCAG 2.1 AA

- 1.3.1 Info and Relationships - blocks have semantic structure; tool calls are described
- 1.4.3 Contrast - text, code, citation pills, and tool-call labels all meet 4.5:1 (3:1 for large)
- 2.1.1 Keyboard - Copy, Stop, Regenerate, expand reasoning, expand tool call, citation pills are all reachable and operable from keyboard
- 2.2.2 Pause Stop Hide - the cursor blink and any progress animation can be paused via prefers-reduced-motion
- 2.4.7 Focus Visible - clear focus rings on all controls inside the bubble
- 4.1.2 Name Role Value - tool-call cards expose name, state, and current value via accessible roles
- 4.1.3 Status Messages - one polite live region announces lifecycle changes (started, tool running, completed, error); never announce token-level deltas

### Live Region Strategy

- Use a single aria-live=polite region per conversation, not per message
- Announce only state transitions and meaningful events: started, tool X running, response complete, response stopped, response failed
- Do not put the streaming text inside an aria-live region
- For users who prefer full-text announcement, provide an opt-in setting that switches the region to text streaming with a long debounce

### Keyboard Map (suggested)

- Tab - move into and across controls within the bubble
- Enter or Space - activate the focused control
- Escape inside an expanded reasoning or tool-call panel - collapse it and return focus to the disclosure
- The chat-level Stop shortcut (e.g. Esc on the input) should also stop the active stream

### Reduced Motion

- prefers-reduced-motion: reduce - disable cursor blink, disable block entrance transitions, snap auto-scroll instead of smooth-scroll

## Responsive Behavior

- Desktop - bubbles up to the message max-width set by the host chat layout; tool-call cards may show side-by-side input and output on wide screens
- Tablet - tool-call cards stack input above output; artifact cards remain horizontal
- Mobile - all internal cards stack vertically; per-message controls collapse into an overflow menu when more than three are present; cursor and animations remain enabled unless reduced motion is set
- Code blocks scroll horizontally on narrow viewports rather than wrapping
- Citation popovers anchor to the viewport on mobile to avoid clipping

## Performance

- Coalesce stream deltas within a single requestAnimationFrame
- Re-parse only the trailing block on update
- Memoize completed blocks so they never re-render once finalized
- Virtualize the conversation message list at the chat layout level (not at the block level inside one message)
- Defer syntax highlighting on completed code blocks; show plain monospaced text during streaming, upgrade after stop
- Lazy-load citation popovers on hover or focus

## Relationship to the AI Agent Chat Layout

The two potions are designed to compose:

- The chat layout owns the message list scroller, auto-scroll behavior, and the typing indicator at the conversation level
- This pattern owns everything inside one assistant message bubble: blocks, cursor, tool cards, reasoning, citations, artifact cards, controls, error states
- The chat layout's typing indicator should be hidden as soon as this pattern shows its streaming cursor inside the bubble; do not run both at once
- The chat layout's auto-scroll rules and this pattern's pinned-to-bottom rules describe the same behavior from two sides; implement them once at the chat layout level
- User-message bubbles in the chat layout do not use this pattern; this pattern applies only to assistant messages

## Relationship to the AI Action Review Pattern

Tool calls with real-world consequences (sending messages, changing records, payments, file shares) compose with the [AI Action Review Pattern](/potions/patterns/ai-action-review):

- This pattern owns the tool-call card; the review pattern owns the approval surface, confirmation rules, undo, and audit trail
- A consequential tool call holds in the card's pending state and does not run until reviewed; the proposed action maps to the review pattern's proposed state
- While a card is held for review, the message enters the awaiting-review lifecycle state: the held card shows a distinct awaiting-review status line and the running animation and streaming cursor are suppressed - the message is waiting on the user, not working
- Approval maps to the review pattern's approved state; the card transitions to running only when execution actually begins. Rejection transitions it to cancelled and execution failure to error; the surrounding response continues either way
- When composed in a conversation, review lifecycle announcements route through this pattern's single conversation-level live region; never run a second announcer for the same transitions
- Only tool calls the product classifies as non-consequential skip review and run immediately: already authorized, read-only, no sensitive data leaving the product, and no meaningful cost

## Framework Patterns

### React

- Represent the message as a list of immutable block records keyed by stable id
- Use a ref-based stream consumer (not state) for raw deltas, then commit batched updates to React state once per frame
- Memoize completed block components with React.memo using id and a finalized flag
- A custom hook such as useStreamingResponse encapsulates state machine transitions; useToolCall, useReasoning, and useCitation handle block-specific concerns

### Vue

- Use a reactive store (Pinia or composable) holding the block list keyed by id
- Use shallowRef for the active streaming block to avoid deep reactivity overhead during high-frequency updates
- Composables: useResponseStream, useToolCallCard, useReasoningPanel

### Angular

- Use a signal-based store for blocks
- Use OnPush change detection on block components and trackBy by id in the message list
- Services: ResponseStreamService, ToolCallRegistryService

### Svelte

- A writable store holds the block list; tick after batched updates
- Per-block components subscribe to derived stores keyed by id

## Styling Approaches

This pattern is intentionally style-agnostic. Detect the project's styling system and adapt.

- Tailwind - utility classes on block wrappers; group-hover for control reveal; data-state attributes for tool-call lifecycle styling
- CSS Modules - one module per block type; data-state attributes drive lifecycle visuals
- Styled-components or Emotion - one styled wrapper per block type; theme tokens for cursor, tool-call card, reasoning surface
- Vanilla CSS or SCSS - BEM-style class names per block (.message-block, .message-block--code, .tool-call, .tool-call--running)
- Chakra or other component libraries - compose the host library's Box, Card, Collapsible, and Skeleton primitives

## Anti-Patterns to Avoid

- String accumulation - storing the message as one growing string and re-parsing it on every delta
- Per-token animation - fading or sliding each character causes severe motion problems
- Forced auto-scroll - pulling the viewport down even when the user is reading earlier content
- Raw JSON tool calls - dumping invocation arguments and results as unstyled JSON
- Forcing reasoning into every product - not all providers expose a reasoning channel and not all products should surface it; defaulting reasoning into the UI produces empty or misleading affordances
- Verbatim reasoning by default - opening raw chain-of-thought by default buries the answer and may conflict with the provider's terms when a summary would suffice
- Bare citation numbers - rendering [1] [2] with no resolution
- Live region per token - flooding screen readers with delta announcements
- Discarding on error - replacing the partial message with an error wipes user context
- Blocking controls - requiring stream completion before Stop is interactive

## Testing Checklist

- A streaming message renders a visible cursor that disappears on terminal state
- Markdown with an unclosed code fence renders as a code block, not as escaped text
- A tool call passes through pending, running, success or error visibly and the card identity is stable
- A tool call held for an action review surface puts the message in awaiting-review: cursor and running animation are suppressed, Stop stays reachable, and tool-running resumes only when execution begins
- When the provider does not expose reasoning, no reasoning surface is rendered
- When the provider exposes reasoning AND the product surfaces it, the surface defaults to a summary or status label; any verbatim disclosure is collapsed by default and keeps the answer visually primary
- A citation marker exposes the source title and URL via hover, focus, and click
- An artifact reference renders as a card with an open action
- Cancellation preserves the partial message and the cursor disappears
- A mid-stream network drop renders an error block in place; partial content remains
- Rate limit, refusal, timeout, and truncation render distinct messaging
- Auto-scroll follows the bottom only when the user is pinned; otherwise a jump-to-latest control appears
- requestAnimationFrame batching is in place; per-keystroke profiling shows no per-token re-render of completed blocks
- The conversation-level live region announces lifecycle events but not token deltas
- Reduced motion disables cursor blink, entrance animation, and smooth auto-scroll
- Copy copies Markdown source; Regenerate, Stop, Edit, Feedback are all keyboard reachable
- All controls have accessible names; tool-call cards expose state changes to assistive tech
- Color contrast meets WCAG AA in light and dark themes for text, code, citation pills, and tool-call labels

## See Also

This pattern composes with these potions:

- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)** - the chat shell this pattern lives inside; the layout provides the bubble, this pattern fills it
- **[AI Action Review Pattern](/potions/patterns/ai-action-review)** - the approval surface for consequential tool calls; a consequential tool-call card holds in pending during review and moves to running only when execution begins, to cancelled on rejection, or to error on execution failure
- **[Toast Notifications](/potions/components/toast-notifications)** - for non-blocking feedback such as "Message copied" or "Regenerated"
- **[Dialog Component](/potions/components/dialog)** - for confirmation flows like clearing feedback, reporting a refusal, or deleting an artifact
- **[Dark/Light Mode Pattern](/potions/patterns/dark-light-mode)** - tool-call cards, reasoning surfaces, and citation pills must use theme tokens to remain readable in both modes
- **[Form Validation Pattern](/potions/patterns/form-validation)** - for the edit-and-resend control on the preceding user message

These are suggestions. The pattern works independently with any chat shell.
