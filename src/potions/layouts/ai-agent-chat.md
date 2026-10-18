---
layout: 'potion'
title: 'AI Agent Chat Layout'
publicationDate: '2026-02-01'
excerpt: 'A chat layout for an AI assistant: a conversation list, a transcript that stays put while you read, and a composer whose Send button turns into Stop. A message that fails to send stays in the input with a retry.'
category: 'Layouts'
tags:
  - layouts
  - chat
  - ai
  - agent
  - conversation
  - messaging
  - responsive
  - a11y
agentManifest: 'potions/layouts/ai-agent-chat.json'
path: 'potions/layouts/ai-agent-chat'
promptSubject: 'an AI chat interface'
useWhen: 'you build or extend a chat interface where people talk to an AI assistant.'
specifies:
  - 'A message that fails to send stays in the input with a retry, so nobody has to retype it.'
  - 'Enter sends and Shift+Enter adds a line, but never while someone is composing text with an input method editor.'
  - 'While a reply streams, the Send button becomes Stop, and the view follows new text only while the reader is at the bottom.'
example: 'Someone sends a question on a train and the connection drops. The message shows Not sent with Retry, their text is still in the input, and one tap on Retry sends it.'
---

People talk to an AI assistant through parts every chat shares: a list of conversations, the transcript, and a box to type in. This guide covers that shell. It builds on the chat components your project already has, and targets WCAG 2.2 AA. What goes inside an assistant's reply, such as streaming text, Markdown, and tool calls, is covered by the [AI Response Rendering Pattern](/potions/patterns/ai-response-rendering), and approving the assistant's actions by the [AI Action Review Pattern](/potions/patterns/ai-action-review). This guide works with or without them.

## Start from what the project has

1. If the project has chat, message, or composer components, in its design system or a library it already uses, configure or extend them to meet this guide. Keep their APIs.
2. Otherwise use plain HTML: a `<form>` with a labelled `<textarea>` and one submit button, a list for the transcript, and a `<nav>` for the conversation list.
3. Choose what the task needs: the conversation list, attachments, quick actions, and the optional capabilities at the end. Leave out the rest.

Add no dependency, such as a chat UI kit or an autosize library, without asking. The project's conventions win for styling and visual defaults. If one conflicts with an accessibility or correctness requirement here, ask instead of choosing.

## Layout

- The page is a full-height grid, `100dvh` tall with `100vh` as the fallback: the conversation list's column, when it's docked, and the chat column.
- The chat column has three rows: the header, the transcript, and the composer. In the chat column only the transcript scrolls (`overflow-y: auto`, `overscroll-behavior: contain`); a docked conversation list scrolls inside its own column.
- Grid and flex items default to `min-height: auto`, so give the page grid's columns `min-height: 0`. Without it, a long conversation list or conversation stretches the page and pushes the composer off screen.
- The header and the composer stay visible because they're outside the transcript's scrolling area, not because of `position: fixed`. So they never cover the focused element (WCAG 2.4.11), and the composer stays above mobile browser toolbars.
- A docked conversation list takes its own column and never covers the chat.
- The transcript is centered and at most 768 px wide. Sizes in this guide are suggested defaults; the project's design wins.
- At 320 px wide nothing scrolls sideways, apart from code blocks, which scroll inside themselves.

## The composer

- A labelled `<textarea>` and one submit button. The label can be visually hidden. If a placeholder shows a prompt such as "Message Acme Assistant", the label uses the same words, so voice control users can say what they see.
- Text is at least 16 px, so iOS Safari doesn't zoom the page when the field gets focus.
- It grows with its content up to about 8 lines, then scrolls inside: `field-sizing: content` where the browser supports it, otherwise set the height from `scrollHeight` on input.
- Problems with the draft, such as a message that's too long or a rejected file, show as text under the composer, linked to the textarea with `aria-describedby`.

### Enter

Enter sends and Shift+Enter adds a line. Enter that confirms an input method editor (IME) composition never sends, so people typing Japanese, Chinese, or Korean can confirm characters: check `isComposing`, and `keyCode` 229, which is how Safari reports that Enter.

When the primary input is touch (`(hover: none) and (pointer: coarse)`), assume an on-screen keyboard, which has no Shift+Enter, so Enter adds a line and the button sends. That's a heuristic: a tablet with a keyboard may get the new-line default, and touchscreen laptops usually keep Enter to send. An existing Enter-to-send setting overrides it, and the button always sends.

The snippets in this guide are plain JavaScript; adapt them to the project's framework and its version. `form`, `textarea`, `button`, `transcript`, and `jumpButton` stand for the composer's and the transcript's elements, and `conversation` for the app's state.

```js
// Enter sends, and Shift+Enter adds a line. enterSends is the product's Enter-to-send
// setting, or undefined to use the touch heuristic.
const touchPrimary = matchMedia('(hover: none) and (pointer: coarse)');

textarea.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.shiftKey) return;
  // Enter that confirms an IME composition; Safari reports it as keyCode 229
  if (event.isComposing || event.keyCode === 229) return;
  // On-screen keyboards have no Shift+Enter, so there Enter adds a line by default
  if (!(enterSends ?? !touchPrimary.matches)) return;
  event.preventDefault();
  // While a reply streams, Enter keeps the draft: the button is Stop
  if (!conversation.replyInProgress) form.requestSubmit();
});
```

### Send and Stop

One button sends, and turns into Stop while a reply streams. Stop stops the reply and keeps its text. The textarea stays editable, so the next message can be drafted, but Enter doesn't send until the reply ends or is stopped.

The button never gets the `disabled` attribute, which would drop focus to the page when its state changes. With nothing to send, it has `aria-disabled="true"` and does nothing. Its name follows its state: "Send message" or "Stop response". In Stop mode it has `formnovalidate`, so a `required` field or other form validation never blocks Stop. It's at least 24 by 24 px; 40 to 44 px is comfortable.

```js
// One submit button that sends, or stops the reply while one streams. It never gets the
// disabled attribute, which would drop focus to the page: with nothing to send it's
// aria-disabled, and the submit handler ignores it. Call this when a reply starts and ends.
function updateComposerButton() {
  const stop = conversation.replyInProgress;
  button.dataset.mode = stop ? 'stop' : 'send';
  button.setAttribute('aria-label', stop ? 'Stop response' : 'Send message');
  button.formNoValidate = stop; // form validation, such as a required field, never blocks Stop
  const nothingToSend = !stop && textarea.value.trim() === '';
  button.setAttribute('aria-disabled', String(nothingToSend));
}

textarea.addEventListener('input', updateComposerButton);
```

### Sending, and failed sends

When the person sends, the message appears in the transcript as sending, and the draft stays in the composer until the server accepts the message. It leaves only if the composer still holds the sent text, so anything typed meanwhile stays. The button is ignored while a message is being sent, so a double press sends once.

If sending fails, the message shows "Not sent" with a Retry button, the draft is still in the composer, and the status region says "Message not sent". Retry sends the message again with the same id, so the server can drop a copy it already has, as when a dropped connection hid that the first attempt arrived. Sending a changed draft instead replaces the failed message.

```js
// The draft leaves the composer only once the server has accepted the message, so a failed
// send loses nothing. showMessage() adds the message to the transcript with a new id;
// sendMessage() sends it with that id, which Retry reuses, so the server can drop a copy it
// already has. announce() writes to the conversation's status region.
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (conversation.replyInProgress) return conversation.stop(); // the button is Stop
  const text = textarea.value;
  if (!text.trim() || form.dataset.sending === 'true') return;
  form.dataset.sending = 'true';
  const message = showMessage(text, 'sending');
  try {
    await sendMessage(message); // resolves once the server has accepted the message
    message.setStatus('sent');
    if (textarea.value === text) textarea.value = ''; // keep a draft typed meanwhile
  } catch {
    message.setStatus('failed'); // "Not sent" with Retry; the draft is still in the composer
    announce('Message not sent.');
  }
  form.dataset.sending = 'false';
  updateComposerButton();
});
```

Sending doesn't move focus: after Enter it stays in the textarea, and after a press of the button it stays on the button. Don't focus the composer when the page loads on touch devices, where that opens the on-screen keyboard; focus it when the person starts a new conversation or picks a suggested prompt.

Optional parts of the composer:

- **Attachments**: a button that opens the file picker. Attached files show as chips with a remove button named for the file ("Remove report.csv"). Type and size checks in the browser are a convenience; the server checks them again. Show file names as text.
- **Quick actions and suggested prompts**: buttons that fill the composer and move focus to it, so the person can edit before sending. Suggested prompts in an empty conversation may send at once when they need no editing.
- **Escape**: Escape in the composer can stop a streaming reply, unless the chat sits in a dialog or panel that Escape closes.

## The transcript

- Messages appear oldest first, in a list or a series of articles. The transcript isn't a live region.
- Each message starts with a visually hidden heading that names the speaker, such as "You said:" or "Acme Assistant said:", one level below the conversation's heading. Screen reader users move between messages with the heading key. Don't put `aria-label` on a message: it would replace the content.
- The person's messages sit on the end side (right in left-to-right languages) and the assistant's on the start side. Logical properties, such as `margin-inline-start`, mirror the layout for right-to-left languages, and `dir="auto"` on the person's messages shows mixed-direction text correctly.
- The person's messages are plain text with their line breaks (`white-space: pre-wrap`). Assistant messages go through the project's renderer. Links in messages are underlined.
- Long text wraps (`overflow-wrap: anywhere`). A code block scrolls inside itself; one that scrolls and has nothing focusable gets `tabindex="0"` and a name.
- Avatars are optional and decorative (`alt=""`), since the heading names the speaker. Timestamps are optional, in a `<time datetime>` element.
- The person's messages can have Edit, which lets them change the message and send it again (see branching), and Copy. Every icon button has a name and is at least 24 by 24 px.

### Waiting for a reply

From the moment the message is accepted until the reply's first content appears, show a waiting indicator, such as three dots. The dots are decorative (`aria-hidden="true"`) and static under reduced motion. Hide the indicator as soon as content appears, or when the reply's streaming cursor appears, if the project follows the AI Response Rendering Pattern.

### Announcements

One element with `role="status"` per conversation, visually hidden and present before anything changes, announces one short sentence at a time:

- "Acme Assistant is responding", once, when a reply starts
- "Response complete", "Response stopped", or the failure, when it ends
- "Message not sent", when a send fails

It never reads the streamed text, or the person's own message. After "Response complete", screen reader users find the reply by its heading.

A modal over the chat, such as the conversation overlay, makes this region inert, which hides it from screen readers. Anything that must be heard while a modal is open goes through a status region inside it.

### Following new content

The transcript follows new content only while the reader is at the bottom, within about 48 px. Only scrolling up stops following; content that grows below the view never does. It follows instantly, never with smooth scrolling. While the reader is scrolled up, a Jump to latest button shows. It scrolls to the bottom, follows again, and puts focus in the composer, since it hides itself. Sending a message also scrolls to the bottom and follows again.

```js
// The transcript follows new content only while the reader is at the bottom.
let pinned = true;
let lastTop = 0;

transcript.addEventListener('scroll', () => {
  const nearBottom = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight < 48;
  // Only scrolling up unpins, so content that grows below the view never does
  pinned = transcript.scrollTop < lastTop ? nearBottom : pinned || nearBottom;
  lastTop = transcript.scrollTop;
  jumpButton.hidden = pinned;
});

// Call after each update, and with true when the person sends a message
function followIfPinned(pin = false) {
  if (pin) pinned = true;
  if (pinned) transcript.scrollTop = transcript.scrollHeight; // instant, never smooth
}

jumpButton.addEventListener('click', () => {
  textarea.focus(); // the button is about to hide, so focus goes to the composer
  followIfPinned(true);
});
```

A conversation opens at its latest message, and loading older messages at the top keeps what's on screen where it is.

## The conversation list

The list is navigation: a `<nav>` labelled "Conversations", with a link for each conversation, since each has its own URL. The open one has `aria-current="page"`. A New chat button at the top starts a conversation and puts focus in the composer.

- **From 1024 px wide**, the list is docked: its own grid column, open by default. A toggle in the header opens and closes it, with `aria-expanded` and `aria-controls`. When closed, the column is hidden (the `hidden` attribute or `display: none`), not only moved off screen.
- **Below 1024 px**, it opens as a modal: native `<dialog>` opened with `showModal()`, or the Dialog guide's model. It has a visible Close button, closes on Escape, on a backdrop click, and when a conversation is chosen, and returns focus to the toggle.
- The list scrolls inside its column while docked (`overflow-y: auto`), and inside the dialog below 1024 px, so a long list never stretches the page.
- If the docked list comes before the chat in the page, the page starts with a skip link to the chat (WCAG 2.4.1).
- When the window crosses 1024 px, react to a `matchMedia` change, not to resize events. If the overlay is open when the window gets wider, close it and move focus to the same item in the docked list.
- In a single-page app, opening a conversation moves focus to its heading (`tabindex="-1"`) and updates `document.title`. A reply that's still running keeps going on the server, and shows when the person returns, never in the conversation they switched to. Drafts are kept per conversation.

Optional: groups such as Today and Previous 7 days, under headings; rename, pin, and delete in a More actions menu per item, with delete asking first or offering undo; and a filter field whose number of matches is announced politely.

## The header

- The conversation's title, as the page's main heading or a visually hidden heading such as "Chat", and in `document.title`.
- The list toggle, New chat, and other actions, such as an assistant or model picker and a More actions menu. Clearing a conversation asks first or offers undo.
- On phones: the toggle, the title, and New chat; the rest goes in the More actions menu.

## Saved state

- Messages and conversations live on the server, not in the browser's storage, and the open conversation is in the URL.
- Whether the docked list is open can be saved under the app's own storage prefix, for example `acme.chat.sidebar`, where `acme` stands for that prefix. Apply it before the first paint, with a cookie the server reads or a small inline script, so the layout doesn't jump.
- Drafts can be saved per conversation, in `sessionStorage` or where the app keeps drafts, and cleared once the message is sent.
- With server rendering, render the conversation on the server, so it shows before scripts run.

## Phones

- Pad the header's top and the composer's bottom with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`, and add `viewport-fit=cover` to the viewport meta tag.
- Add `interactive-widget=resizes-content` to the same tag, so browsers that support it, such as Chrome on Android, shrink the layout when the on-screen keyboard opens and the composer stays above it. iOS Safari keeps the layout size and scrolls the focused field into view.
- Targets are at least 24 by 24 px; 44 px is comfortable for touch.

## Motion

Motion is optional. New messages fade in over 200 ms with `cubic-bezier(0.2, 0, 0, 1)`, only when they arrive while the page is open, never for the history on load. The docked list slides in over 250 ms. Following new content never animates. Under `prefers-reduced-motion: reduce`, nothing slides or fades, and the waiting dots are static.

## Colors

Suggested defaults for projects without a design. The project's tokens win; check its colors meet the same contrast, including in dark mode.

- The person's messages: white text on `#2563eb` (5.2:1), or on `#1d4ed8` in dark mode (6.7:1). Links in them are underlined in the text color.
- The assistant's text: `#111827` on white (17.7:1), or `#f3f4f6` on `#111827` in dark mode (16.1:1). Assistant messages can do without a bubble.
- Muted text, such as timestamps, statuses, and the placeholder: `#6b7280` (4.8:1), or `#9ca3af` in dark mode (7.0:1).
- Links: `#1d4ed8` (6.7:1), or `#93c5fd` in dark mode (9.8:1), always underlined.
- The composer's edge: `#6b7280` (4.8:1, and 3.7:1 on the dark page). Focus indicators: `#2563eb`, or `#60a5fa` in dark mode.
- Errors: `#b91c1c` (6.5:1), or `#fca5a5` in dark mode (9.4:1).

Bubble tails and shadows are optional decoration; the side and the speaker heading tell messages apart.

## Optional capabilities

Add these only when the product needs them.

- **Branching** helps when people edit an earlier question and expect the original answer kept. Editing creates a new version of the message, which shows "2 of 3" with Previous and Next version buttons; the transcript below follows the chosen version. Announce the change.
- **Pinning** helps when people return to a few conversations often. Pinned conversations sit in their own group at the top of the list.
- **History search** helps when people ask where an earlier conversation went. A search over all conversations, with results that link to the conversation and its matching message. Announce the number of results.
- **Keyboard shortcuts** help people who chat all day, for example a shortcut for New chat and one to the composer. Avoid keys the browser and screen readers use, list the shortcuts in the interface, and let people turn off single-key shortcuts (WCAG 2.1.4).
- **Embedded chat**: a launcher button opens the chat in a modal dialog (see the Dialog guide) or a side panel. A panel moves focus in when it opens, closes with Escape, returns focus to the launcher, and leaves the page usable.

## Working with the other AI guides

- With the AI Response Rendering Pattern, this layout owns the shell, the Send and Stop button, Edit on the person's messages, following new content, and the conversation's status region. The pattern owns the inside of each assistant message, including Copy, Regenerate, and feedback, and announces through this layout's status region.
- With the AI Action Review Pattern, this layout places the review: a card in the transcript for low-risk actions, or a side panel, drawer, or dialog for the rest.

## Edge cases

- **A reply that doesn't start**: give the request a time limit, for example 30 seconds, and show the failure with Retry when it runs out. Tell a timeout from other failures by the signal's reason, as the Dialog guide does.
- **Offline**: a send while offline fails like any other, with Not sent and Retry. Optionally, retry once the browser is back online, and say so.
- **Long drafts**: if the product limits message length, show the count near the limit and explain an over-limit draft under the composer. Never cut the draft.
- **Reloads**: after a reload during a reply, show what the server saved, and continue the stream if the backend supports it.
- **Long conversations**: virtualize the transcript only when conversations get long (several hundred messages), and keep the newest messages and any focused element rendered.

## Acceptance checklist

- [ ] Enter sends and Shift+Enter adds a line; Enter that confirms an IME composition (Japanese, Chinese, Korean) doesn't send, including in Safari
- [ ] With a phone's on-screen keyboard, Enter adds a line and the button sends; an Enter-to-send setting overrides that on every device
- [ ] While a reply streams, the button is Stop and keeps focus, form validation never blocks it, Stop keeps the reply's text, and Enter in the composer keeps the draft without sending
- [ ] With nothing to send, the button is aria-disabled, stays focusable, and does nothing
- [ ] A message that fails to send shows Not sent with Retry, the draft is still in the composer, and a screen reader hears that it wasn't sent
- [ ] A draft typed while a message is being sent stays in the composer, and a double press sends once
- [ ] The transcript follows new content only at the bottom; scrolled up, it stays put, and Jump to latest scrolls down and puts focus in the composer
- [ ] A screen reader can move between messages by heading, hears that a reply started and ended, and never hears the streamed text
- [ ] The header and the composer never cover the focused element, and on phones the composer stays above the browser's toolbars and the on-screen keyboard
- [ ] With a long conversation list and a long conversation, each scrolls on its own, and the composer stays on screen
- [ ] Below 1024 px the conversation list opens as a modal with a Close button, Escape closes it, and focus returns to the toggle; a closed list can't be reached with Tab
- [ ] The open conversation has aria-current and is named in the page title, and a skip link moves past a long conversation list
- [ ] At 320 px wide and at 400% zoom nothing scrolls sideways, and right-to-left languages mirror the layout
- [ ] With reduced motion, nothing slides or fades, and following new content never animates
- [ ] Styles come from the project's styling system and tokens, and text, the composer's edge, and focus indicators meet the contrast minimums

## See also

- **[AI Response Rendering Pattern](/potions/patterns/ai-response-rendering)**: what goes inside an assistant message.
- **[AI Action Review Pattern](/potions/patterns/ai-action-review)**: approving the actions the assistant proposes.
- **[Modal Dialog](/potions/components/dialog)**: for the conversation overlay and for confirmations.
- **[Sidebar Navigation](/potions/components/sidebar-navigation)**: when the conversation list sits next to the app's own navigation.
- **[Command Palette](/potions/components/command-palette)**: quick prompts, commands, and switching conversations from the keyboard.
- **[Text Input](/potions/components/text-input)**: label, hint, and error conventions for the composer.
- **[Toast Notifications](/potions/components/toast-notifications)**: feedback outside the conversation, such as a deleted conversation with Undo.
- **[Dropdown/Select](/potions/components/dropdown-select)**: an assistant or model picker.
- **[Navigation Bar](/potions/components/navbar)**: when the chat sits under the site's own header.
- **[Button](/potions/components/button)**: the composer's button and the header's actions.

These are suggestions; the layout works with any components you choose.
