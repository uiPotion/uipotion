---
layout: 'potion'
title: 'AI Agent Chat Layout'
publicationDate: '2026-02-01'
excerpt: 'A responsive AI agent chat interface layout with message history, input area, typing indicators, and conversation management. Perfect for AI assistants, chatbots, and conversational interfaces.'
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
---

# AI Agent Chat Layout

A responsive AI agent chat interface layout with message history, input area, typing indicators, and conversation management. Perfect for AI assistants, chatbots, and conversational interfaces.

## Structure Specification

### Layout Hierarchy

The layout consists of an optional Sidebar (conversation list and agent selector) and a Main Chat Area. The Main Chat Area contains a fixed Header (agent info and actions), a scrollable Message List (conversation history), and a fixed Input Area (message composition with send button and quick actions).

## Detailed Component Specifications

### 1. Sidebar Component (Optional)

**Dimensions:**
- Desktop: 280-320px width
- Mobile: Full screen overlay or hidden
- Collapsed state: 0px (completely hidden)

**States:**
- `expanded` (default on desktop)
- `hidden` (mobile default)
- `overlay` (mobile when open)

**Elements:**

#### Conversation List
- Scrollable list of past conversations
- Each item: Title, timestamp, last message preview
- Height: 64-72px per conversation item
- Active conversation: Highlighted background or left border indicator
- New conversation button: Fixed at top or bottom

#### Agent Selector
- Dropdown or list of available AI agents
- Shows agent name, avatar, and status
- Status indicators: Online, offline, busy

**Behavior:**
- Mobile: Overlay with backdrop, dismissible
- Backdrop click closes sidebar (prevent event bubbling)
- Smooth transition animation (250ms ease-out)
- Persist open/closed state in localStorage (optional)

**Closing the sidebar:** When the sidebar is open, users must always have a visible way to close it at every viewport size. Provide at least one: a dedicated close control in the sidebar (e.g. in the header), or a header control that both opens and closes the sidebar. Do not hide or remove the close option on desktop. The close action should be keyboard-accessible and have an accessible name for screen readers.

**Layout space (critical):** When the sidebar is visible on desktop, the main chat area must have left margin (or margin-inline-start) equal to the sidebar width (280-320px) so the sidebar never overlaps the main content. Do not rely on z-index alone; reserve layout space. When the sidebar is closed or in overlay mode (mobile/tablet), use zero margin. Sidebar visibility must be tied to open/closed state on all breakpoints.

### 2. Header Component

**Dimensions:**
- Height: 56-64px (fixed)
- Width: 100% of chat area
- Position: Fixed or sticky at top

**Layout:**

The header contains a Menu Toggle button (visible when sidebar is collapsible), Agent Info section (avatar, name, status), and Header Actions (settings, clear chat, etc.) on the right.

**Elements:**

#### Menu Toggle Button (Optional)
- Size: 40px x 40px
- Icon: Hamburger or sidebar toggle icon
- Visibility: Hidden when sidebar is always visible
- Position: Left-most

#### Agent Info Section
- Avatar: 36-40px circle
- Agent Name: 16-18px, medium weight
- Status Indicator: 8-10px colored dot (green for online, gray for offline)
- Status Text: 12-14px, muted color (optional)

#### Header Actions
- Settings/Options button: 40px icon button
- Clear conversation button: 40px icon button (with confirmation)
- Additional actions as needed

**Behavior:**
- Shadow or border-bottom for depth
- Remains fixed at top during scroll
- Dropdowns close on outside click or escape key
- Accessible via keyboard

### 3. Message List Component

**Dimensions:**
- Padding: 16-24px horizontal, 16-24px vertical
- Padding-bottom: At least 24-32px so the last message or welcome content does not sit directly under the input area
- Max-width: 768-900px (centered for readability)
- Spacing between messages: 16-24px

**Layout:**
- Vertical stack of messages
- User messages: Right-aligned or right side
- Agent messages: Left-aligned or left side
- Timestamps: Below each message or grouped by date

**Elements:**

#### Message Bubble
- Border radius: 16-20px (user: 16-20px, 16-20px, 4-8px, 16-20px; agent: 16-20px, 16-20px, 16-20px, 4-8px)
- Max-width: 75-85% of container
- Padding: 12-16px
- Font size: 14-16px
- Line height: 1.5-1.6

**User Message Styling:**
- Background: Primary brand color or dark neutral
- Text: White or high contrast
- Alignment: Flex-end (right side)

**Agent Message Styling:**
- Background: Light gray or subtle color
- Text: Dark text on light background
- Alignment: Flex-start (left side)
- May include agent avatar

#### Message Content
- Text content with proper formatting
- Code blocks: Monospace font, darker background, rounded corners
- Links: Underlined or colored text
- Lists: Proper indentation and bullets

#### Timestamp
- Font size: 11-12px
- Color: Muted gray
- Format: Relative time ("2 min ago") or absolute time
- Position: Below message or in tooltip

#### Date Dividers
- Show date between messages from different days
- Centered text: 12-14px, uppercase, letter-spacing
- Optional horizontal lines on sides

**Behavior:**
- Auto-scroll to bottom on new messages
- Smooth scroll animation when scrolling to specific message
- Infinite scroll or pagination for loading older messages
- Message selection and actions (copy, delete)
- Empty state: Welcome message or prompt suggestions

### 4. Typing Indicator Component

**Dimensions:**
- Height: 32-40px
- Width: auto (fits content)
- Margin: 8-12px from last message

**Elements:**

#### Animated Dots
- Three dots in a row
- Size: 8-10px each
- Animation: Sequential bounce or fade (1.4s cycle)
- Color: Muted text color

#### Typing Text (Optional)
- "Agent is typing..." or similar
- Font size: 12-14px
- Color: Muted gray
- Position: Below or beside dots

**Behavior:**
- Appears when agent is generating response
- Disappears when message arrives
- Smooth fade in/out animation (200ms)
- Cancel animation if typing stops abruptly

### 5. Input Area Component

**Dimensions:**
- Min-height: 56-72px
- Max-height: 200-256px (for multiline expansion)
- Padding: 12-16px on all sides (minimum 16px recommended)
- Position: Fixed at bottom

**Spacing (critical):** Provide clear white space on all sides so the input is not flush with the viewport. Bottom padding must include env(safe-area-inset-bottom) on mobile (e.g. calc(16px + env(safe-area-inset-bottom))). Use at least 12px gap between the text input and the send button. Ensure the message list above has sufficient padding-bottom so content does not appear to sit under the input area.

**Layout:**

The input area contains Quick Action Chips (optional, above input), the Text Input field (expandable textarea), Attachment Button (left of input), and Send Button (right of input).

**Elements:**

#### Quick Action Chips (Optional)
- Position: Above text input, horizontal scroll
- Chip height: 32-36px
- Padding: 8-16px horizontal
- Border radius: 16-18px (pill shape)
- Background: Light or transparent with border
- Text: 13-14px
- Behavior: Click to insert text into input
- Examples: "Summarize this", "Explain like I'm 5", "Make it shorter"

#### Text Input Field
- Type: Auto-expanding textarea
- Min rows: 1
- Max rows: 6-8
- Font size: 14-16px
- Line height: 1.5
- Placeholder: "Type a message..." or similar
- Padding: 12-16px
- Border radius: 20-24px
- Border: 1-2px solid or none (flat design)

**Input States:**
- Default: Subtle border or background
- Focus: Highlighted border, no outline or custom outline
- Disabled: Reduced opacity, no interactions
- Error: Red border or background (if validation fails)

#### Attachment Button (Optional)
- Size: 40px icon button
- Icon: Paperclip or plus
- Position: Left side of input
- Behavior: Opens file picker or attachment menu
- Supports: Images, documents, audio

#### Send Button
- Size: 40-44px circular button
- Icon: Send arrow or paper plane
- Position: Right side of input
- States:
  - Default: Muted color or disabled when input empty
  - Active: Primary brand color when input has text
  - Loading: Spinner or disabled state while sending

**Behavior:**
- Auto-focus on input when chat opens
- Enter key sends message (Shift+Enter for new line)
- Input expands as user types multiple lines
- Smooth height transition (150ms)
- Send button enabled only when input not empty
- Clear input after sending
- Maintain input value if sending fails (show error)

### 6. Welcome Screen / Empty State

**Dimensions:**
- Full height of message list area
- Centered content
- Max-width: 600px

**Elements:**

#### Welcome Message
- Large icon or illustration (optional)
- Heading: "How can I help you today?" or similar
- Font size: 24-32px
- Subtext: Brief description of agent capabilities

#### Suggested Prompts
- Grid or list of suggested starting prompts
- 3-6 suggestions
- Styled as clickable cards or buttons
- Examples: "Help me write...", "Explain...", "Summarize..."

**Behavior:**
- Displayed when no messages in conversation
- Dismissed after first message sent
- Can be recalled via button in header

## Responsive Breakpoints

### Desktop (>= 1024px)
- Sidebar: Visible by default (if enabled)
- Message max-width: 768-900px (centered)
- Input area: Full width with comfortable padding
- Quick actions: Visible above input

### Tablet (768px - 1023px)
- Sidebar: Collapsible, overlay mode when open
- Message max-width: 100% with 16-24px margins
- Input area: Full width, reduced padding
- Quick actions: Horizontal scroll or hidden

### Mobile (< 768px)
- Sidebar: Hidden by default, fullscreen overlay when open
- Message max-width: 100% with 12-16px margins
- Input area: Full width, minimal padding (12px)
- Quick actions: Horizontal scroll, compact
- Header: Simplified (avatar and name only)
- Touch-friendly tap targets (min 44px)

### Window Resize Handling
- Debounce: 200ms
- Behavior: Re-evaluate breakpoint on resize
- Close mobile sidebar if switching to desktop

## Interaction Patterns

### Sending a Message
1. User types message in input field
2. Send button becomes active
3. User clicks send or presses Enter
4. Message appears in message list immediately (optimistic UI)
5. Typing indicator appears
6. Agent response appears when ready
7. Auto-scroll to show new message

### Receiving a Response
1. Typing indicator animates
2. Response streams in (optional: word-by-word or chunk-by-chunk)
3. Message bubble grows to accommodate content
4. Code blocks and formatting render
5. Auto-scroll follows streaming content
6. Typing indicator disappears

### Sidebar Toggle (if applicable)
1. User clicks menu toggle button
2. Sidebar slides in from left (mobile) or expands (desktop)
3. Backdrop appears on mobile
4. User can select different conversation
5. Current conversation switches with smooth transition

### Message Actions
1. Long press or right-click on message
2. Context menu appears with options:
   - Copy text
   - Delete message (if allowed)
   - Retry (for failed messages)
   - Quote/reply
3. Action executes on selection

### File Attachment (if enabled)
1. User clicks attachment button
2. File picker opens
3. User selects file(s)
4. File preview appears above input
5. User types optional message
6. Send button submits message with attachment

## Accessibility Requirements

### WCAG 2.1 Compliance (Level AA Target)

This chat layout should meet WCAG 2.1 Level AA standards. Key requirements:

- 1.1.1 Non-text Content: All icons have text or aria-label
- 1.3.1 Info and Relationships: Semantic HTML structure with proper roles
- 1.4.3 Contrast Minimum: 4.5:1 for normal text, 3:1 for large text
- 2.1.1 Keyboard: All interactive elements keyboard accessible
- 2.1.2 No Keyboard Trap: Focus doesn't get trapped
- 2.4.2 Page Titled: Descriptive page title
- 2.4.3 Focus Order: Logical tab order throughout
- 2.4.4 Link Purpose: Clear button labels
- 2.4.7 Focus Visible: Clear focus indicators on all interactive elements
- 4.1.2 Name, Role, Value: All elements have accessible names and roles
- 4.1.3 Status Messages: Use aria-live for new messages and typing indicator

### Keyboard Navigation

**Tab Order:**
- Header actions → Message list (if navigating history) → Input area → Send button

**Implementation:**
- Enter to send message (from input)
- Shift+Enter for new line in input
- Escape to close sidebar or dropdowns
- Arrow keys to navigate message history (optional)
- Ctrl/Cmd + C to copy selected message text

**Focus Management:**
- Focus remains in input after sending message
- Focus moves to new message when it arrives (optional, use carefully)
- Focus trap in sidebar when open on mobile
- Focus restored to toggle button when sidebar closes

### ARIA Attributes

**Required ARIA Attributes:**

1. Message List Container:
   ```html
   <div role="log" aria-live="polite" aria-label="Chat messages">
   ```

2. User Message:
   ```html
   <div class="message user-message" aria-label="You said: [message content]">
   ```

3. Agent Message:
   ```html
   <div class="message agent-message" aria-label="Agent said: [message content]">
   ```

4. Typing Indicator:
   ```html
   <div class="typing-indicator" aria-live="polite" aria-label="Agent is typing">
     <span class="sr-only">Agent is typing</span>
     <span class="dots" aria-hidden="true">...</span>
   </div>
   ```

5. Input Field:
   ```html
   <textarea aria-label="Message input" placeholder="Type a message..." rows="1"></textarea>
   ```

6. Send Button:
   ```html
   <button aria-label="Send message" disabled="true/false">
     <span class="sr-only">Send</span>
   </button>
   ```

7. Sidebar:
   ```html
   <aside role="complementary" aria-label="Conversation list" aria-hidden="false/true">
   ```

**Dynamic ARIA Updates:**
- Announce new messages with aria-live region
- Update aria-hidden when sidebar opens/closes
- Update disabled state on send button
- Announce when agent starts/stops typing

### Screen Reader Support

**Announcements:**
- New messages: "Agent said: [content]" or "You said: [content]"
- Typing status: "Agent is typing" when indicator appears
- Send confirmation: "Message sent" (optional, brief)
- Error states: "Failed to send message" with retry option

**Labels:**
- All icon buttons must have aria-label
- Message bubbles should have descriptive aria-label
- Input field must have accessible name

**Screen Reader Only Text:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Color Contrast

**Requirements:**
- WCAG AA: 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt+ bold)
- WCAG AAA (Recommended): 7:1 for important text

**Verification:**
- User message text on bubble background
- Agent message text on bubble background
- Input text on input background
- Button text on button background
- Timestamp text on background
- Placeholder text (must meet contrast requirements)

### Focus Visible Styles

**Implementation:**
```css
input:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Accessibility Implementation Checklist

When implementing this chat layout, ensure:

- All buttons have aria-label or visible text
- All icons have aria-label or sr-only text
- Message list has role="log" and aria-live="polite"
- Typing indicator announces to screen readers
- Input field has accessible name
- Send button has disabled state communicated
- Color contrast verified with contrast checker tool
- Keyboard navigation works throughout
- Focus visible on all interactive elements
- Focus managed properly in sidebar
- Screen reader tested with NVDA, VoiceOver, or JAWS
- Touch targets minimum 44px on mobile

## Design System Specifications

**Important**: The design specifications below are tool-agnostic and should be implemented using your project's chosen styling approach (Tailwind, CSS Modules, styled-components, Chakra UI, Material-UI, SCSS, etc.).

### Color Guidelines

#### User Message Bubble
- Background (Light): Primary brand color (e.g., #3b82f6, #10b981) or dark neutral (#1f2937)
- Background (Dark): Primary color or lighter shade (#60a5fa, #34d399)
- Text: White (#ffffff) or very light (#f3f4f6)
- Links: Light blue or underlined white
- Code blocks: Darker background within bubble (#1f2937), light text

#### Agent Message Bubble
- Background (Light): Light gray (#f3f4f6, #e5e7eb) or white with border
- Background (Dark): Dark gray (#374151, #4b5563)
- Text: Dark gray (#1f2937, #111827) for light, light gray (#e5e7eb) for dark
- Links: Primary brand color
- Code blocks: Dark background (#1f2937), light text, rounded corners

#### Input Area
- Background (Light): White (#ffffff) or very light gray (#f9fafb)
- Background (Dark): Dark gray (#1f2937, #374151)
- Border: 1px solid light gray (#e5e7eb) or transparent
- Focus Border: Primary brand color
- Text: Match body text color
- Placeholder: Muted gray (#9ca3af)

#### Send Button
- Default: Muted gray or disabled state
- Active: Primary brand color
- Icon: White or contrast color
- Disabled: Light gray (#d1d5db)

#### Header
- Background (Light): White (#ffffff) or very light gray (#f9fafb)
- Background (Dark): Dark gray (#1f2937)
- Border: 1px solid light gray (#e5e7eb) or subtle shadow
- Text: Dark gray (#1f2937) for light, light gray (#e5e7eb) for dark

#### Sidebar
- Background (Light): White (#ffffff) or light gray (#f9fafb)
- Background (Dark): Dark gray (#1f2937)
- Active Conversation: Primary color at 10% opacity or left border
- Text: Match body text color

### Typography

- Font Family: Use project's font stack (system-ui, -apple-system, sans-serif or custom)
- Message Text: 14-16px, regular weight (400), line-height 1.5-1.6
- Code Blocks: Monospace font (Consolas, Monaco, 'Courier New'), 13-14px
- Timestamps: 11-12px, regular weight, muted color
- Agent Name (Header): 16-18px, medium weight (500-600)
- Status Text: 12-14px, regular weight
- Input Text: 14-16px, regular weight
- Quick Actions: 13-14px, regular weight
- Welcome Heading: 24-32px, bold (700)

### Spacing System

- Message List Padding: 16-24px horizontal, 16-24px vertical
- Message Bubble Padding: 12-16px
- Message Gap: 16-24px between messages
- Input Area Padding: 12-16px
- Header Padding: 12-16px horizontal, 12-16px vertical
- Sidebar Item Padding: 12-16px
- Quick Action Gap: 8-12px between chips

### Shadows & Elevation

- Header Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Input Area Shadow (if floating): 0 -2px 10px rgba(0, 0, 0, 0.05)
- Message Bubbles: No shadow or very subtle (0 1px 2px rgba(0, 0, 0, 0.05))
- Sidebar Shadow (when overlay): 4px 0 15px rgba(0, 0, 0, 0.1)

### Border Radius

- Message Bubbles: 16-20px (asymmetric for speech bubble effect)
- Input Field: 20-24px (pill shape if single line)
- Send Button: 50% (circle) or 8-12px
- Quick Action Chips: 16-18px (pill shape)
- Avatars: 50% (circle)
- Header Buttons: 6-8px

### Visual Hierarchy Principles

1. Messages should be clearly distinguishable (user vs agent)
2. Input area should be prominent and always accessible
3. Header should provide context without dominating
4. Timestamps should be subtle but readable
5. Active conversation should be clearly highlighted
6. Quick actions should be discoverable but not distracting
7. Code blocks should stand out within messages

## State Management Considerations

### For AI Agents to Implement

**State to Track:**
1. `messages: array` - List of all messages in conversation
   - Structure: `{ id, role: 'user'|'agent', content, timestamp, status: 'sent'|'delivering'|'error' }`
2. `inputValue: string` - Current text in input field
3. `isTyping: boolean` - Whether agent is generating response
4. `sidebarOpen: boolean` - Whether sidebar is visible (mobile)
5. `conversations: array` - List of available conversations (if sidebar enabled)
6. `activeConversationId: string` - Currently selected conversation
7. `isSending: boolean` - Whether message is being sent
8. `hasMoreMessages: boolean` - For pagination/infinite scroll

**State Persistence:**
- `sidebarOpen` → localStorage (optional)
- `activeConversationId` → localStorage or URL param
- Message history → Server/database (not localStorage for privacy)
- Draft message (inputValue) → localStorage (optional, auto-save)

### SSR/Hydration Considerations
- localStorage access: Only in onMounted/useEffect
- Default state: Empty messages, closed sidebar
- Prevent hydration mismatches by initializing state after mount
- Loading states for initial message fetch

## Critical Implementation Guidelines

### Vanilla CSS Detection
**CRITICAL**: When detecting vanilla CSS in the project, ALWAYS create CSS classes in a stylesheet. NEVER use inline style attributes on HTML elements.

- Define classes like `.message`, `.message--user`, `.message--agent`, `.input-area`, etc.
- Apply classes via className/class attributes: `<div class="message message--user">`
- Do NOT use: `<div style="background: blue">`

### React Hook Patterns
**CRITICAL**: When detecting React, extract logic from useEffect hooks into separate custom hooks that do ONE thing each.

- `useChatMessages()` - Manages message list state and operations
- `useAutoScroll(messageListRef, messages)` - Handles auto-scrolling behavior
- `useTypingIndicator(isTyping)` - Manages typing animation state
- `useConversation()` - Manages conversation switching
- Each hook should have a single responsibility

### Message Streaming (Optional)
For real-time message streaming:
- Update message content as chunks arrive
- Use requestAnimationFrame for smooth DOM updates
- Throttle rapid updates to prevent layout thrashing
- Show streaming cursor or typing indicator during stream

### Performance Considerations
- Virtualize long message lists (react-window, @tanstack/virtual)
- Debounce input changes if doing heavy processing
- Lazy load images and attachments
- Optimize re-renders with proper React keys or Vue memoization

## Code Implementation Patterns

### React Example Pattern
```jsx
// Suggested component structure
<ChatLayout>
  {hasSidebar && (
    <Sidebar
      conversations={conversations}
      activeId={activeConversationId}
      isOpen={sidebarOpen}
      onSelect={handleConversationSelect}
    />
  )}
  <ChatContainer>
    <Header
      agent={currentAgent}
      onMenuToggle={handleSidebarToggle}
      actions={headerActions}
    />
    <MessageList
      messages={messages}
      isTyping={isTyping}
      onMessageAction={handleMessageAction}
    />
    <InputArea
      value={inputValue}
      onChange={setInputValue}
      onSend={handleSend}
      quickActions={quickActions}
      disabled={isSending}
    />
  </ChatContainer>
</ChatLayout>
```

### Vue Example Pattern
```vue
<!-- Suggested component structure -->
<template>
  <ChatLayout>
    <Sidebar
      v-if="hasSidebar"
      :conversations="conversations"
      :active-id="activeConversationId"
      :is-open="sidebarOpen"
      @select="handleConversationSelect"
    />
    <ChatContainer>
      <Header
        :agent="currentAgent"
        @menu-toggle="handleSidebarToggle"
        :actions="headerActions"
      />
      <MessageList
        :messages="messages"
        :is-typing="isTyping"
        @message-action="handleMessageAction"
      />
      <InputArea
        v-model="inputValue"
        @send="handleSend"
        :quick-actions="quickActions"
        :disabled="isSending"
      />
    </ChatContainer>
  </ChatLayout>
</template>
```

### Angular Example Pattern
```html
<!-- Suggested template structure -->
<app-chat-layout>
  <app-sidebar *ngIf="hasSidebar"
    [conversations]="conversations"
    [activeId]="activeConversationId"
    [isOpen]="sidebarOpen"
    (select)="handleConversationSelect($event)"
  />
  <div class="chat-container">
    <app-header
      [agent]="currentAgent"
      (menuToggle)="handleSidebarToggle()"
      [actions]="headerActions"
    />
    <app-message-list
      [messages]="messages"
      [isTyping]="isTyping"
      (messageAction)="handleMessageAction($event)"
    />
    <app-input-area
      [(value)]="inputValue"
      (send)="handleSend()"
      [quickActions]="quickActions"
      [disabled]="isSending"
    />
  </div>
</app-chat-layout>
```

### CSS/Styling Approaches

#### Tailwind CSS Pattern
```html
<!-- Message List -->
<div class="flex-1 overflow-y-auto p-4 space-y-4">
  <div class="flex flex-col max-w-3xl mx-auto space-y-4">
    <!-- User Message -->
    <div class="flex justify-end">
      <div class="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
        <p>Hello, AI assistant!</p>
      </div>
    </div>
    <!-- Agent Message -->
    <div class="flex justify-start">
      <div class="bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
        <p>Hello! How can I help you today?</p>
      </div>
    </div>
  </div>
</div>

<!-- Input Area -->
<div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
  <div class="flex items-end gap-2 max-w-3xl mx-auto">
    <textarea 
      class="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
      rows="1"
      placeholder="Type a message..."
    ></textarea>
    <button class="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center">
      Send
    </button>
  </div>
</div>
```

#### Vanilla CSS Pattern
```css
/* CRITICAL: Always create CSS classes, never use inline styles */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.message {
  display: flex;
  margin-bottom: 16px;
}

.message--user {
  justify-content: flex-end;
}

.message--agent {
  justify-content: flex-start;
}

.message__bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.message--user .message__bubble {
  background: #3b82f6;
  color: white;
  border-radius: 16px 16px 4px 16px;
}

.message--agent .message__bubble {
  background: #f3f4f6;
  color: #1f2937;
  border-radius: 16px 16px 16px 4px;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}
```

## Animation Specifications

### Message Entrance Animation
- Duration: 300ms
- Easing: ease-out
- Transform: translateY(10px) to translateY(0)
- Opacity: 0 to 1
- Stagger: 50-100ms between messages on initial load

### Typing Indicator Animation
- Duration: 1.4s (continuous loop)
- Animation: Sequential dot bounce or fade
- Dot 1: 0ms delay
- Dot 2: 200ms delay
- Dot 3: 400ms delay

### Input Area Height Transition
- Duration: 150ms
- Easing: ease-in-out
- Property: height

### Sidebar Slide Animation
- Duration: 250ms
- Easing: ease-out
- Transform: translateX(-100%) to translateX(0) for open

### Send Button Press
- Duration: 100ms
- Transform: scale(0.95) on press, scale(1) on release

### New Message Auto-Scroll
- Duration: 300ms
- Easing: ease-out
- Behavior: Smooth scroll to bottom

## Z-Index Layer System

- Base content: 0
- Message bubbles: 1
- Input area: 10
- Header: 20
- Sidebar (desktop): 30
- Dropdowns/Popovers: 40
- Mobile sidebar overlay: 50
- Backdrop: 60
- Modals/Dialogs: 70

## Implementation Details

### Auto-Scroll Behavior
- Scroll to bottom on new message arrival
- Don't scroll if user has manually scrolled up (check scroll position)
- Resume auto-scroll when user scrolls back to bottom
- Smooth scroll animation

### Message Alignment
- User messages: Right-aligned (flex-end) or left with offset
- Agent messages: Left-aligned (flex-start) or right with offset
- Consider RTL language support (flip alignment)

### Input Multi-line Handling
- Auto-expand textarea as user types
- Max height: 200-256px (6-8 rows)
- Show scrollbar when max height reached
- Enter sends, Shift+Enter adds new line

### Mobile Considerations
- Ensure input stays above virtual keyboard
- Use visual viewport API if needed
- Prevent body scroll when keyboard opens (optional)
- Full-screen message list on mobile

### Edge Cases

#### Very Long Messages
- Message bubble expands vertically
- Code blocks scroll horizontally if too wide
- Consider max-height with "Read more" for extremely long messages

#### Rapid Message Sending
- Queue messages if sending too quickly
- Show loading state per message
- Prevent duplicate sends

#### Empty Input
- Disable send button when input is empty or only whitespace
- Visual indication of disabled state

#### Failed Message Send
- Show error state on message bubble
- Provide retry button
- Keep message text in input as fallback

#### Slow Connection
- Show loading indicator on send button
- Optimistic UI: Show message immediately, update status on confirmation
- Timeout handling with retry option

## Common Variations

### Without Sidebar
- Full-width chat interface
- Header contains conversation switcher dropdown
- Simpler layout, good for embedded chat widgets

### Compact Mode
- Reduced padding and spacing
- Smaller avatars and bubbles
- Good for sidebar chat widgets

### Embedded/Widget Mode
- Floating button to open chat
- Modal overlay when open
- Smaller dimensions (400-500px width)
- Can be positioned bottom-right or bottom-left

### Multi-Agent Mode
- Agent switcher in header
- Different avatars/colors per agent
- Agent name displayed on each message

### Rich Content Support
- Image previews in messages
- File download links
- Interactive cards/components in agent responses
- Button actions within messages

## Testing Checklist

When implementing this chat layout, test:

### Visual
- Message bubbles display correctly (user vs agent styling)
- Input area stays fixed at bottom
- Header remains fixed at top
- Messages scroll smoothly in list
- Timestamps display correctly
- Quick action chips render properly
- Typing indicator animates smoothly
- Sidebar opens/closes smoothly (if applicable)
- Responsive at all breakpoints (mobile, tablet, desktop)

### Functional
- Send button sends message
- Enter key sends message
- Shift+Enter adds new line
- Input clears after sending
- Auto-scroll works on new messages
- Manual scroll pauses auto-scroll
- Sidebar toggle works (if applicable)
- Conversation switching works (if applicable)
- File attachment works (if enabled)
- Quick actions insert text into input

### Accessibility
- Keyboard navigation works (Tab, Enter, Escape)
- Focus indicators visible on all interactive elements
- Screen reader announces new messages
- Typing indicator announced to screen readers
- Input field has accessible name
- Send button has accessible name
- Color contrast verified (4.5:1 minimum)
- Touch targets minimum 44px on mobile

### Responsive
- Layout adapts correctly at all breakpoints
- Text is readable on all screen sizes
- Input area accessible on mobile (above keyboard)
- Sidebar becomes overlay on mobile (if applicable)
- No horizontal scroll

### Performance
- Smooth scrolling with many messages
- No layout shift when sending messages
- Typing animation doesn't cause jank
- Auto-resize input performs well

### Edge Cases
- Empty input handling
- Very long message handling
- Rapid send handling
- Failed send handling
- Slow connection handling
- Message overflow/scrolling

## AI Agent Implementation Prompt Template

Use this template when asking an AI agent to implement this chat layout:

```
Create a responsive AI agent chat layout with the following specifications:

1. Layout Structure:
   - Optional sidebar for conversation list (280-320px on desktop, overlay on mobile)
   - Fixed header with agent info (56-64px height)
   - Scrollable message list (centered, max-width 768-900px)
   - Fixed input area at bottom with auto-expanding textarea

2. Message Display:
   - User messages: Right-aligned, primary color background, white text
   - Agent messages: Left-aligned, light gray background, dark text
   - Message bubbles with asymmetric border-radius for speech bubble effect
   - Timestamps below messages
   - Support for code blocks, links, and formatting

3. Input Area:
   - Auto-expanding textarea (1-8 rows)
   - Send button (active when input not empty)
   - Optional quick action chips above input
   - Enter to send, Shift+Enter for new line
   - Optional file attachment button

4. Additional Features:
   - Typing indicator with animated dots
   - Welcome screen when no messages
   - Empty state with suggested prompts
   - Smooth animations for all interactions

5. Use [Framework: React/Vue/Angular/Svelte] with [Styling: Tailwind/Chakra/CSS Modules]

6. Include:
   - Smooth animations (300ms ease-out)
   - Keyboard accessibility (Tab, Enter, Escape)
   - ARIA labels and live regions for screen readers
   - Auto-scroll to new messages
   - Responsive breakpoints (mobile, tablet, desktop)
   - Color contrast compliance (WCAG AA)

Reference: UI Potion AI Agent Chat Layout
```

## Additional Resources

### Message Data Structure
```javascript
const message = {
  id: 'msg_123',
  role: 'user', // 'user' | 'agent'
  content: 'Hello, how are you?',
  timestamp: '2026-02-01T10:30:00Z',
  status: 'sent', // 'sent' | 'delivering' | 'error'
  attachments: [], // optional
  metadata: {} // optional
};
```

### Conversation Data Structure
```javascript
const conversation = {
  id: 'conv_456',
  title: 'Project Discussion',
  lastMessage: 'Let me review that...',
  timestamp: '2026-02-01T10:30:00Z',
  unreadCount: 0,
  agentId: 'agent_1'
};
```

### Quick Actions Example
```javascript
const quickActions = [
  { id: 'summarize', label: 'Summarize this', prompt: 'Please summarize the above conversation.' },
  { id: 'explain', label: 'Explain like I am 5', prompt: 'Explain this like I am 5 years old.' },
  { id: 'shorter', label: 'Make it shorter', prompt: 'Please make your response shorter and more concise.' },
  { id: 'code', label: 'Show me code', prompt: 'Can you provide code examples for this?' }
];
```

---

## See Also

This AI agent chat layout commonly uses these components:

- **[Command Palette](/potions/components/command-palette)** - Add quick prompt, tool, and conversation-switch actions with keyboard-first access
- **[Text Input Component](/potions/components/text-input)** - For the message input field
- **[Button](/potions/components/button)** - For send button, toolbar actions, and dialog action footers
- **[Dialog Component](/potions/components/dialog)** - For confirmation dialogs (clear chat, delete message)
- **[Toast Notifications](/potions/components/toast-notifications)** - For success/error feedback
- **[Dropdown/Select Component](/potions/components/dropdown-select)** - For agent selector or conversation actions
- **[Navbar Component](/potions/components/navbar)** - For the header navigation patterns

These are examples of components that pair well with AI chat interfaces. The layout works with any content you choose.

---

## Summary for AI Agents

This AI agent chat layout is a conversational interface optimized for human-AI interaction. Key implementation points:

1. **Layout**: Flexbox or grid with fixed header, scrollable message list, fixed input area
2. **Messages**: Clear visual distinction between user (right/primary color) and agent (left/gray)
3. **Input**: Auto-expanding textarea with send button and optional quick actions
4. **Accessibility**: ARIA live regions for new messages, keyboard navigation, focus management
5. **Responsive**: Sidebar becomes overlay on mobile, full-width chat, touch-friendly targets
6. **Animations**: Smooth entrance for messages, typing indicator, input height transitions
7. **Framework-agnostic**: Adapt patterns to any framework's component model

Generate clean, semantic HTML with proper component separation. Use framework-specific state management patterns and CSS methodology as specified by the user. Ensure all interactive elements are accessible and the chat interface works smoothly across all devices.
