# UI Potion

> AI-agent-optimized UI component guides for any framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with Harold](https://img.shields.io/badge/Built%20with-Harold-deeppink)](https://haroldjs.com)

## What is UI Potion?

UI Potion is a different approach to UI component libraries. Instead of providing ready-to-use code that requires constant maintenance, we provide **comprehensive specifications** that AI coding assistants can understand and implement in any framework.

Think of it as "recipes for AI" - detailed guides that your AI assistant reads and adapts to your exact technology stack.

## Why UI Potion?

### The Problem with Traditional Component Libraries

- **Maintenance burden**: Every framework update breaks things
- **Framework lock-in**: Built for one specific framework/version
- **Adaptation needed**: Code still needs to be modified for your project
- **Version conflicts**: Library version vs your project version
- **Bundle bloat**: Shipping code you might not use

### The UI Potion Approach

- ✅ **Zero maintenance**: Specifications don't break when frameworks update
- ✅ **Framework agnostic**: Works with React, Vue, Angular, Svelte, or anything else
- ✅ **Styling agnostic**: Use Tailwind, CSS Modules, Chakra UI, or whatever you prefer
- ✅ **AI-powered**: Your coding assistant adapts specs to your exact stack
- ✅ **Always current**: AI generates code using latest framework patterns
- ✅ **No bundle overhead**: Generates fresh code for your project

## How It Works

You don't need to install anything or fetch anything in your code. Use your AI coding assistant (e.g. Cursor, Copilot) and give it a link to a potion. Iterate from there.

### Simple workflow

1. **Browse potions** at [uipotion.com](https://uipotion.com)
2. **Pick what you need** (e.g. dashboard layout, pricing table)
3. **Copy the potion link** (the page URL or the JSON guide URL)
4. **Paste the link in your AI chat** and say what you want, e.g.:  
   *"Implement this dashboard layout for my app. I use React and Tailwind. Guide: https://uipotion.com/potions/layouts/dashboard.json"*
5. **Review the generated code** and ask for tweaks (layout, styling, behavior) until it fits your project

Your assistant uses the guide at that URL to generate code for your stack. You never fetch potions in your own code; you just share the link and iterate in the chat.

**Example**:
```
You: "I need a dashboard with collapsible sidebar. React + Tailwind.
     Use this guide: https://uipotion.com/potions/layouts/dashboard.json"

Your AI assistant uses the guide and adapts it to your stack (e.g. React and Tailwind only if you have them; otherwise it follows your current framework and styling). You paste it, run it, then ask for changes
(e.g. "make the sidebar 240px" or "add a dark theme") and iterate.
```

### For AI assistants

When a user gives you a UI Potion link (e.g. `https://uipotion.com/potions/layouts/dashboard.json`):

1. Open or fetch that URL to read the specification.
2. Use the spec to generate implementation code in the user's framework and styling (React/Vue/Svelte, Tailwind/CSS Modules, etc.).
3. Follow the guide's structure, accessibility, and behavior; don't invent details that aren't in the spec.

No need to fetch the main manifest or potions index unless you're building discovery/search. For normal use, the user provides the potion link and you implement from that single guide.

## Available Potions

See [uipotion.com](https://uipotion.com) for the full list of potions (layouts, components, features, patterns, tooling).

## What Makes UI Potion Different?

### Traditional component library

You install a package, import components, and hope versions match:

- **Install**: `npm install some-ui-lib@2.3.4`
- **Use**: `import { Dashboard } from 'some-ui-lib'`
- **Downsides**: Locked to one framework and styling, breaks on upgrades, still needs customization, adds to bundle size

### UI Potion

You give your AI assistant a link to a potion and iterate in chat:

- **You**: Paste the potion URL in your AI chat (e.g. `https://uipotion.com/potions/layouts/dashboard.json`) and say: "Implement this for my React + Tailwind app."
- **Your assistant**: Uses the guide and generates code for your stack (your framework, your styling, your conventions).
- **You**: Paste the code, run it, then ask for changes ("wider sidebar", "add dark mode") and iterate.

No install in your code, no version lock-in. You get code that fits your project and you refine it in conversation.

## Development

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/uiPotion/uipotion.git
cd uipotion

# Install dependencies
npm install
```

### Development Commands

```bash
# Start dev server with hot reload (http://localhost:3000)
npm start

# Build for production
npm run build

# Validate all potions against their schemas
npm run validate

# Generate sitemap.xml and _redirects
npm run static

# The build output will be in the `build/` directory
```

### Dev Server Features

- **Live reload**: Auto-refreshes on file changes
- **Watch mode**: Watches all source files
- **Fast rebuilds**: Only rebuilds changed files
- **Port 3000**: Serves on http://localhost:3000

## Contributing

We welcome contributions! UI Potion grows with community input.

**Step-by-step and full guide:** See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the contribution workflow, or the **[Contribute page on the website](https://uipotion.com/contribute)** for schemas, Schema Validator, AI prompts, and best practices. We keep the same narrative in both so you can follow either; the web version is more extended. You can also try contributing with your AI assistant — both guides explain how.

## What Makes a Good Potion?

### Human Documentation (Markdown)
- ✅ Clear visual representation (ASCII art if helpful)
- ✅ Component hierarchy and structure
- ✅ Exact dimensions and measurements
- ✅ State descriptions and behavior
- ✅ Interaction patterns
- ✅ Responsive behavior at each breakpoint
- ✅ Accessibility requirements
- ✅ Animation specifications
- ✅ Testing checklist
- ✅ Framework-agnostic examples

### AI Guide (JSON)
- ✅ Structured, parseable data
- ✅ Complete specifications (no ambiguity)
- ✅ Framework-specific patterns for React, Vue, Angular, Svelte
- ✅ Styling approach examples for Tailwind, CSS Modules, etc.
- ✅ State management guidance
- ✅ Accessibility implementation details
- ✅ Animation timing values (exact ms, easing functions)
- ✅ Testing verification steps
- ✅ Complexity level and time estimate

## Programmatic access (optional)

Most users only need to share a potion link with their AI assistant. If you're building discovery or search (e.g. "find all dashboard-related potions"), you can use:

- **Main manifest**: `https://uipotion.com/uipotion-manifest.json` — service metadata, categories, link to potions index
- **Potions index**: `https://uipotion.com/potions-index.json` — catalog of all potions (id, name, category, tags, excerpt, webUrl, agentGuideUrl, dates)
- **Individual guide**: `https://uipotion.com/potions/[category]/[id].json` — full implementation spec for one component

For normal use, the user provides the potion URL; no need to fetch the manifest or index.

## Example: Dashboard Layout

- **Docs (human)**: https://uipotion.com/potions/layouts/dashboard  
- **Guide (for your AI)**: https://uipotion.com/potions/layouts/dashboard.json

Give your assistant the guide URL and say e.g. "Implement this dashboard for my React + Tailwind app." The guide covers collapsible sidebar, fixed header, responsive content, mobile overlay, keyboard nav, animations, and accessibility — your assistant adapts it to your stack and you iterate from there.

## License

MIT License

**Copyright (c) 2026 Julian Ćwirko**

This license applies to the **UI Potion specifications, documentation, website content, and source code**. It does NOT apply to any code generated by AI agents based on these specifications.

The copyright covers:
- ✅ UI Potion specifications (JSON and Markdown files)
- ✅ UI Potion website content and design
- ✅ UI Potion documentation
- ✅ UI Potion source code (Harold templates, scripts, etc.)

The copyright does NOT cover:
- ❌ Any code generated by AI agents based on these specifications
- ❌ Implementations created by users or AI using these specifications
- ❌ Derivative works created by AI agents

**Julian Ćwirko and UI Potion make NO copyright claims over AI-generated code.** The copyright and ownership of AI-generated code is determined by applicable law and the terms of service of the AI provider used.

---

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**IMPORTANT DISCLAIMER:** UI Potion provides specifications and guidelines for UI components. We do NOT provide or generate code. Any code generated by AI agents or assistants based on our specifications is the sole responsibility of the AI agent, the developer who requested the generation, and the developer who deploys the code. Julian Ćwirko and UI Potion are NOT liable for any damages, security vulnerabilities, bugs, harmful code, copyright infringement, or any other issues arising from AI-generated code based on these specifications.

## Links

- **Website**: [uipotion.com](https://uipotion.com)
- **Contribute**: [uipotion.com/contribute](https://uipotion.com/contribute)
- **AI Manifest**: [uipotion.com/uipotion-manifest.json](https://uipotion.com/uipotion-manifest.json)
- **GitHub**: [github.com/uiPotion/uipotion](https://github.com/uiPotion/uipotion)
- **Harold SSG**: [haroldjs.com](https://haroldjs.com)
- **Legal**: [uipotion.com/legal](https://uipotion.com/legal)

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/uiPotion/uipotion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/uiPotion/uipotion/discussions)
- **Email**: julian.cwirko@gmail.com

## Acknowledgments

- Built with [Harold](https://haroldjs.com) by [Julian Ćwirko](https://github.com/juliancwirko)
- Inspired by the rise of AI-assisted development
- Thanks to all contributors

---

**Built with ❤️ for AI-powered development**

*Making UI implementation faster, easier, and more flexible for everyone.*
