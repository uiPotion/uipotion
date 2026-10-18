---
layout: 'potion'
title: 'AI Response Rendering Pattern'
publicationDate: '2026-04-18'
excerpt: 'How to render an AI assistant''s reply as it streams: Markdown, code, tool-call cards, citations, artifacts, and optional reasoning, with a Stop that keeps partial text, errors shown in place, and model output treated as untrusted. Companion to the AI Agent Chat Layout.'
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
promptSubject: 'AI response rendering'
useWhen: 'you show an AI assistant reply as it streams in, with Markdown, code, tool calls, or citations.'
specifies:
  - 'Stopping a response keeps the text that already arrived, and a dropped connection shows an error and a retry under it.'
  - 'The view follows new text only while the reader is at the bottom. Once they scroll up, it stays put and offers a jump to the latest content.'
  - 'Screen readers hear status changes, such as started, complete, stopped, or failed, from one polite live region instead of every token.'
example: 'A reply is streaming and the reader clicks Stop. The text so far stays, the cursor disappears, and screen readers hear that the response stopped.'
---

An assistant's reply arrives as a stream of events: text, tool calls and their results, citations, artifacts, and with some providers a reasoning channel. This guide turns that stream into a stable, readable message that's safe to show, and targets WCAG 2.2 AA. It covers the inside of one assistant message. The chat around it, with the transcript, the composer, and its Send and Stop button, is the [AI Agent Chat Layout](/potions/layouts/ai-agent-chat)'s job, and approving actions with consequences is the [AI Action Review Pattern](/potions/patterns/ai-action-review)'s. This guide works with or without them.

## Start from what the project has

1. Find the project's message renderer, its Markdown renderer, and its sanitizer, and build on them. Keep their APIs.
2. If the project's AI SDK already sends typed message parts, such as text, tool calls, and sources, map them to the blocks below instead of parsing text.
3. Choose the block types and controls the task needs. Leave out the rest.

Add no dependency, such as a Markdown parser, a sanitizer, or a syntax highlighter, without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility, security, or correctness requirement here, ask instead of choosing.

## Blocks

A reply is an ordered list of blocks, each with a stable id, a type, a state, its content, and details. Key blocks by id, never by index. An unknown type renders as a labelled block of plain text, never dropped.

- **text**: prose, through the Markdown renderer. It may hold citation markers, and its links are underlined.
- **code**: a fenced code block with its language. It renders before its closing fence arrives, has a Copy code button, and gets syntax highlighting once it's final.
- **tool-call**: a tool the assistant calls, with its result.
- **citation**: a source the text refers to.
- **artifact-ref**: something shown elsewhere, such as a document, a file, or a chart.
- **error**: a failure, shown in place.
- **reasoning** (optional): only when the provider exposes a reasoning channel and the product chooses to show it.

## The reply's states

- **idle**: no reply yet.
- **queued**: the request is accepted, and the first content hasn't arrived. The host shows its waiting indicator.
- **streaming**: blocks are added, or the trailing block grows.
- **tool-running**: a tool call is running.
- **awaiting-review**: a tool call with consequences is held until someone approves it. The reply waits for the person, not for the model.
- **complete**: finished; every block is final.
- **cancelled**: stopped by the person; what arrived stays.
- **errored**: failed; what arrived stays, with an error block.

A reply moves from idle to queued when the message is sent, and to streaming on the first content. It moves between streaming and tool-running as tools run, to awaiting-review when a tool call is held, and back when the call is approved (tool-running) or rejected (streaming, with the card cancelled). From any of these it ends as complete, cancelled on Stop, or errored on a failure it can't recover from.

## Streaming

- Text deltas grow the trailing text block, and code deltas the trailing code block; another type starts a new block. Tool-call updates change their card by id, never by recreating it.
- Collect deltas, update the DOM at most once per animation frame, and flush before the reply ends.
- Re-render only the trailing block, from its full text, with a Markdown renderer that tolerates unclosed fences, partial links, and partial emphasis. Finished blocks never re-render. For long replies, re-parse only the last paragraph of the trailing block.
- A CSS-only caret sits at the end of the growing block while the reply is streaming or running a tool. It hides while the reply awaits review and once it ends. It's steady, or blinks for 5 seconds at most (WCAG 2.2.2).
- Don't animate tokens; whole blocks may fade in.

The snippets in this guide are plain JavaScript; adapt them to the project's framework and its version.

```js
// Deltas can arrive many times per frame. Collect them and update the DOM at most once per
// animation frame. trailingText stands for the growing block's element; with Markdown,
// re-render only that block from its full text instead of appending.
let pending = '';
let frame = 0;

function onTextDelta(delta) {
  pending += delta;
  if (!frame) frame = requestAnimationFrame(flush);
}

// Also call flush() before the message becomes complete, cancelled, or errored
function flush() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (pending) trailingText.append(pending); // append() adds text, never HTML
  pending = '';
}
```

## Keeping model output safe

Model output is untrusted: prompt injection can put anything in it.

- Render Markdown through a sanitizer: no raw HTML from the model, or only an allowlist of harmless elements and attributes.
- Links work only for absolute http, https, and mailto URLs. Anything else, including relative links, renders as text. Links to other sites get `rel="noopener noreferrer"`, and a link that opens a new tab says so.
- Images load only from hosts the product allows. Any other image URL could carry conversation data in its query string to another site, without anyone clicking, so render it as a link with its alt text. The same goes for link previews the product fetches on its own. A Content-Security-Policy `img-src` is a second line of defense.
- Tool inputs and results, file names, and citation titles render as text.
- An artifact rendered as HTML or SVG goes in an iframe with the `sandbox` attribute, without `allow-same-origin`, and with `allow-scripts` only if it has to run code; ideally from a separate origin. The sandbox doesn't stop it from loading images, styles, or fonts from any host, which would send data out the same way. So give its document a Content-Security-Policy that allows requests only to hosts the product allows, such as `default-src 'none'; style-src 'unsafe-inline'; img-src https://images.example.com`: as a header when it's served from its own origin, or as the first element of a `srcdoc` document. A `srcdoc` iframe also inherits the page's own policy. An artifact that runs code also needs `script-src` for that code, such as `'unsafe-inline'` in a `srcdoc` document.
- An artifact can also navigate its own frame to any URL, with data in the URL: through a link the person clicks, or, with `allow-scripts`, by its code or a meta refresh. Its own policy can't stop that, so the page that embeds artifacts limits `frame-src` to the origins it embeds on purpose, such as `frame-src https://artifacts.example.com`, or to `'none'` when every artifact is a `srcdoc` document; a `srcdoc` artifact still loads and runs under it.

```js
// Model output is untrusted. Links work only for absolute https, http, and mailto URLs, and
// images load only from hosts the product allows. Anything else renders as text, and an
// image from another host as a link with its alt text. imageHosts stands for that list.
const imageHosts = new Set(['images.example.com']);

function safeLinkUrl(href) {
  try {
    const url = new URL(href); // no base URL, so a relative link throws and renders as text
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function safeImageUrl(src) {
  const href = safeLinkUrl(src);
  return href?.startsWith('https:') && imageHosts.has(new URL(href).hostname) ? href : null;
}
```

## Tool calls

Each tool call is a card that changes in place by its id. It shows a readable tool name (not the internal id), a status line in text, and disclosures for the input (labelled fields or JSON) and the result.

- **pending**: the name and a muted placeholder.
- **running**: status text with a subtle indicator, static under reduced motion.
- **success**: a one-line summary, such as a count or a title, with the full result behind the disclosure.
- **error**: what failed, with details behind the disclosure, and Retry when it's safe. The rest of the reply continues.
- **cancelled**: a cancelled label.

## Citations

- The marker is a link to the source (`<a href>`), since it navigates. Its name starts with its visible number, such as "1: Example Article, example.com" (WCAG 2.5.3).
- A preview with the title, the domain, and a short snippet shows on hover and focus. It meets WCAG 1.4.13: Escape closes it, the pointer can move onto it, and it stays until the pointer or focus leaves. The `popover` attribute keeps it in the top layer, so `overflow` can't clip it.
- A reply with three or more sources ends with a list of them.
- A marker without a source is left out, never shown as a bare number.

## Artifacts

Something too big for the message, such as a document, a file, or a chart, shows as a card with its title, its type, and an Open button. Opening it shows the artifact in a side panel, a drawer, or full screen, moves focus there, and returns focus to the card on close. The card works as soon as it appears.

## Reasoning (optional)

- Show reasoning only when the provider exposes a reasoning channel and the product chooses to show it. Otherwise there's no reasoning block, not even an empty one.
- By default it's a short status, such as "Thought for 4s".
- Show the full text only when the provider's terms allow it and the product needs it: as a disclosure, collapsed by default. The answer stays visually first.

## Errors

Errors show in place, under what arrived, which stays.

- **Connection lost**: Retry from where it stopped if the API supports it, otherwise Regenerate.
- **Rate limit**: Retry, with an optional countdown that's announced once, not every second.
- **Refusal**: show the refusal as the reply's content; never cut it silently.
- **Tool failure**: in the tool-call card's error state; the reply continues.
- **Timeout**: Retry.
- **Cut off at the length limit**: Continue, if the API supports it.

## Controls

- At the foot of a finished reply: Copy (the Markdown source), Regenerate, and Good and Bad response buttons (`aria-pressed`) with an optional comment. Retry sits on an error block.
- They show on focus as well as on hover, and always on touch screens. Icon buttons have names, such as "Copy response", and are at least 24 by 24 px. On phones, more than three go in a More actions menu.
- **Stop**: in a chat, Stop is the host's: its send button turns into Stop and calls this pattern's stop, which keeps what arrived. Without a host Stop, show Stop at the foot of the streaming reply, available at once, and turn it into Regenerate in place when the reply ends.
- **Edit** belongs to the person's message, which the host renders.
- **Share** is product-dependent. Before creating a link, say what it includes and who can open it.

## Announcements

One element with `role="status"` per conversation, present before anything changes, announces one short sentence at a time. In a chat the host renders it and this pattern announces through it; used on its own, this pattern renders it. While a modal dialog is open over the conversation, the region is inert, and anything to announce goes through a region inside the dialog.

- "Acme Assistant is responding" when the reply starts
- the tool step while one runs, such as "Searching the web"
- "Response complete", "Response stopped", or the failure at the end

The streamed text is never announced; a setting can optionally read each finished reply aloud. Streaming and lifecycle changes never move focus. A visually hidden heading at the start of the message (the host's, in a chat) lets people find the reply after "Response complete".

## Scrolling

The host's scroll area follows new content only while the reader is at the bottom. Once they scroll up, it stays put and offers a jump to the latest content. In the AI Agent Chat Layout the layout does this; elsewhere, the host does.

## Small screens and motion

- On narrow screens, cards stack their parts, citation previews stay inside the viewport, and code blocks scroll sideways instead of wrapping.
- Motion is optional: whole blocks fade in over 200 ms, tool-call cards change background or border over 150 ms, and citation previews fade in over 120 ms. Under `prefers-reduced-motion: reduce`, nothing blinks or fades, the running indicator is static, and scrolling never animates.

## Performance

- Coalesce deltas within one animation frame.
- Re-render only the trailing block, and keep finished blocks from re-rendering (memoize them by id).
- Highlight code once its block is final, and load citation previews on hover or focus.
- Virtualize long conversations at the host, not inside one message.

## Working with the other AI guides

- **With the AI Agent Chat Layout**: the layout owns the shell, the transcript and following new content, the waiting indicator, the Send and Stop button, Edit on the person's messages, the person's messages, and the conversation's status region. This pattern owns the blocks inside each assistant message, the cursor, the cards, Copy, Regenerate, feedback, and Retry, and what to announce through the layout's status region. The layout's waiting indicator hides as soon as this pattern's cursor appears.
- **With the AI Action Review Pattern**, for tool calls with consequences, such as sending messages, changing records, payments, or sharing files:
  - The tool call stays pending until reviewed, and the reply moves to awaiting-review. The card's status line says it's waiting for approval, and the cursor and the running animation stop.
  - Approval moves the action to approved. The card turns running only when the action starts running, cancelled on rejection, and error when running it fails, while the rest of the reply continues.
  - Undo, retry, partial failures, and the audit trail belong to the review pattern; the card only reflects the result.
  - The review's announcements go through the same status region, never a second announcer, except while the review is a modal dialog: the page behind it is inert, so the review announces through its own region inside the dialog.
  - Only tool calls the product classifies as without consequences skip review: already authorized, read-only, sending no sensitive data out of the product, and costing nothing meaningful.

## Acceptance checklist

- [ ] A streaming reply shows a cursor at its end that goes away when the reply completes, stops, or fails, and never blinks for longer than 5 seconds
- [ ] Markdown with an unclosed code fence renders as a code block while it streams
- [ ] Many deltas within one frame cause one DOM update, and finished blocks don't re-render
- [ ] A tool call's card moves through pending, running, and success or error in place, with its state in text
- [ ] A tool call held for approval puts the reply in awaiting-review: no cursor, no running animation, and Stop still works
- [ ] Stop keeps what arrived, and a dropped connection shows an error under the partial content with Retry
- [ ] Rate limits, refusals, timeouts, and truncation each show their own message
- [ ] In model output, scripts never run, javascript: and relative links render as text, and nothing loads from, or navigates to, a host the product doesn't allow, including from inside an HTML artifact
- [ ] A citation marker is a link whose name starts with its number; its preview opens on hover and focus and closes with Escape, and three or more sources get a list
- [ ] A screen reader hears when a reply starts, runs a tool, ends, or fails, and never hears the streamed text
- [ ] Copy, Regenerate, feedback, and every disclosure have names, work from the keyboard, and are at least 24 by 24 px
- [ ] No reasoning surface shows when the provider doesn't expose reasoning; when one shows, it's a short status, collapsed by default
- [ ] With reduced motion, nothing blinks, fades, or scrolls smoothly
- [ ] Styles come from the project's styling system and tokens, and text and controls meet the contrast minimums in light and dark themes

## See also

- **[AI Agent Chat Layout](/potions/layouts/ai-agent-chat)**: the chat shell this pattern fits into.
- **[AI Action Review Pattern](/potions/patterns/ai-action-review)**: the approval surface for tool calls with consequences.
- **[Toast Notifications](/potions/components/toast-notifications)**: feedback outside the message, such as a failed Copy.
- **[Modal Dialog](/potions/components/dialog)**: confirmations, and the full-screen view of an artifact.
- **[Dark/Light Mode Pattern](/potions/patterns/dark-light-mode)**: theme tokens that keep cards, previews, and code readable in both themes.

These are suggestions; the pattern works with any chat shell.
