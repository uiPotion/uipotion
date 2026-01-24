# UI Potion

> AI-agent-optimized UI component guides for any framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with Harold](https://img.shields.io/badge/Built%20with-Harold-orange)](https://haroldjs.com)

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

### For Developers

1. **Browse potions** at [uipotion.com](https://uipotion.com)
2. **Find what you need** (dashboard layout, pricing table, etc.)
3. **Copy the potion URL** or JSON guide link
4. **Tell your AI assistant**: "Implement this component from UI Potion" + paste link
5. **Specify your stack**: "Use React with Tailwind CSS"
6. **Get generated code** perfectly adapted to your project

**Example**:
```
Developer: "I need a dashboard layout with collapsible sidebar. 
I'm using React and Tailwind. Use this guide: 
https://uipotion.com/potions/layouts/dashboard.json"

AI Assistant:
- Loads dashboard.json
- Understands specifications
- Adapts to React (useState, useEffect, etc.)
- Uses Tailwind utility classes
- Generates production-ready code

Result: Complete dashboard layout in minutes, perfectly adapted to your stack.
```

### For AI Agents

AI agents can automatically discover and load potions:

```javascript
// 1. Load main manifest
const manifest = await fetch('https://uipotion.com/uipotion-manifest.json');

// 2. Browse available potions
const potionsIndex = await fetch('https://uipotion.com/potions-index.json');

// 3. Load specific guide
const guide = await fetch('https://uipotion.com/potions/layouts/dashboard.json');

// 4. Parse specifications
// 5. Generate implementation adapted to user's stack
```

**Workflow**:
1. Agent loads manifest to discover available potions
2. Agent browses potions-index.json to find relevant component
3. Agent loads specific potion JSON guide
4. Agent adapts the guide to user's framework and styling preferences
5. Agent implements the component based on detailed specifications

## Available Potions

### Layouts
- ✅ **Dashboard Layout with Collapsible Sidebar** - Responsive admin dashboard with sidebar navigation and fixed header

### Coming Soon
- Pricing Tables
- Hero Sections
- Authentication Flows
- Dialog/Modal Components
- Navigation Components (Navbar, Sidebar, Breadcrumbs)
- Form Components (Multi-step forms, Validation patterns)
- Data Display (Tables, Cards, Lists)
- And many more...

## What Makes UI Potion Different?

### Traditional Component Library
```javascript
// Install specific version
npm install some-ui-lib@2.3.4

// Use pre-built component
import { Dashboard } from 'some-ui-lib'

// Problems:
// - Locked to React (or Vue, or Angular)
// - Locked to specific styling approach
// - Breaks when you upgrade
// - Still needs customization
// - Adds to bundle size
```

### UI Potion Approach
```javascript
// AI reads specification
const spec = await fetch('uipotion.com/potions/layouts/dashboard.json')

// AI generates code adapted to YOUR stack:
// - Your framework (React, Vue, Angular, Svelte, etc.)
// - Your styling (Tailwind, CSS Modules, Chakra, etc.)
// - Your patterns and conventions
// - Latest framework features
// - No external dependencies

// Result: Fresh, custom code that fits your project
```

## Technology

This site is built with [Harold](https://haroldjs.com) - a static site generator using Markdown + Handlebars + SCSS.

### Why Harold?

- **Simple**: Markdown for content, Handlebars for templates, SCSS for styling
- **Fast**: Static output is blazing fast
- **Flexible**: Easy to customize and extend
- **Zero runtime**: Pure HTML/CSS output

## Development

### Prerequisites

- Node.js (v14 or higher)
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

# The build output will be in the `build/` directory
```

### Dev Server Features

- **Live reload**: Auto-refreshes on file changes
- **Watch mode**: Watches all source files
- **Fast rebuilds**: Only rebuilds changed files
- **Port 3000**: Serves on http://localhost:3000

## Project Structure

```
src/
├── potions/           # Markdown files (human-readable documentation)
│   ├── layouts/       # Layout patterns (dashboards, landing pages)
│   ├── components/    # Reusable components (buttons, dialogs, cards)
│   └── features/      # Complete features (pricing, auth flows)
│
├── statics/            # Static files copied to root (Harold)
│   ├── uipotion-manifest.json    # Main entry point for AI agents
│   ├── potions-index.json        # Searchable catalog of potions
│   └── potions/                  # Individual component guides
│       └── dashboard.json
│
├── pages/             # Site pages (Handlebars templates)
│   ├── index.hbs      # Homepage
│   └── about.hbs      # About page
│
├── potion-layouts/    # Handlebars layouts for potion pages
│   └── potion.hbs     # Layout template
│
├── partials/          # Reusable Handlebars components
│   ├── head.hbs       # HTML head with meta tags
│   └── footer.hbs     # Site footer
│
├── styles/            # SCSS stylesheets
│   ├── main.scss      # Main stylesheet (compiled)
│   ├── _basic.scss    # Basic/reset styles
│   ├── _page.scss     # Page-level styles
│   └── _uipotion.scss # UI Potion-specific styles
│
└── assets/            # Static assets
    └── images/        # Images and icons
        └── favicon.png

build/                 # Generated output (don't edit!)
├── index.html
├── about.html
├── potions/           # Generated potion pages
├── potions/           # Generated potion pages
├── styles/            # Compiled CSS
└── assets/            # Copied assets
```

## Contributing

We welcome contributions! UI Potion grows with community input.

### How to Contribute

1. **Add a new potion** (component guide)
2. **Improve existing potions** (add details, fix issues)
3. **Enhance documentation**
4. **Report issues** or suggest features

### Adding a New Potion

#### Step 1: Create Markdown File

Create `src/potions/[category]/your-component.md`:

```yaml
---
layout: 'potion'
title: 'Your Component Name'
publicationDate: '2026-01-10'
excerpt: 'Brief description (1-2 sentences)'
category: 'Components'  # Layouts, Components, Features, Patterns, or Tooling
tags:
  - relevant
  - tags
agentManifest: 'potions/components/your-component.json'
---

# Your Component Name

Detailed human-readable documentation...
```

#### Step 2: Create JSON Guide

Create `src/statics/potions/components/your-component.json`:

Use `dashboard.json` as a template. Include:
- `aiAgentInstructions` - Summary and implementation steps
- `structure` - Component hierarchy
- `components` - Detailed specifications
- `responsiveBreakpoints` - Mobile, tablet, desktop behavior
- `stateManagement` - Required state variables
- `frameworkPatterns` - React, Vue, Angular, Svelte examples
- `stylingApproaches` - Tailwind, CSS Modules, etc.
- `accessibility` - Complete a11y requirements
- `animations` - Timing and easing specifications
- `testingChecklist` - Verification steps

#### Step 3: Update Potions Index

Add entry to `src/statics/potions-index.json`:

```json
{
  "id": "your-component",
  "name": "Your Component Name",
  "category": "components",
  "tags": ["tag1", "tag2"],
  "excerpt": "Brief description",
  "complexity": "intermediate",
  "estimatedImplementationTime": "2-3 hours",
  "webUrl": "https://uipotion.com/potions/components/your-component.html",
  "agentGuideUrl": "https://uipotion.com/potions/components/your-component.json",
  "created": "2026-01-10",
  "updated": "2026-01-10"
}
```

Don't forget to update `totalCount` and `lastUpdated`!

#### Step 4: Test

```bash
npm run build    # Build the site
npm start        # Test in dev server
```

Visit http://localhost:3000 to verify everything works.

#### Step 5: Submit Pull Request

Once tested, submit a pull request with:
- Clear description of the potion
- Why it's useful
- Any special considerations

### Guidelines

See `.cursorrules` for detailed guidelines on:
- Potion structure
- JSON guide requirements
- Content standards
- Best practices

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

## API for AI Agents

### Main Manifest

**URL**: `https://uipotion.com/uipotion-manifest.json`

Entry point for AI agent discovery. Contains:
- Service metadata
- Categories
- URLs for potions index
- Usage instructions

### Potions Index

**URL**: `https://uipotion.com/potions-index.json`

Searchable catalog of all potions. Each entry includes:
- `id` - Unique identifier
- `name` - Human-readable name
- `category` - layouts|components|features|patterns|tooling
- `tags` - Array of tags for filtering
- `excerpt` - Brief description
- `complexity` - beginner|intermediate|advanced
- `estimatedImplementationTime` - Time estimate
- `webUrl` - Human-readable documentation
- `agentGuideUrl` - JSON guide for AI implementation
- `created` - Creation date
- `updated` - Last update date

### Individual Guides

**URL**: `https://uipotion.com/potions/[category]/[id].json`

Detailed implementation guide for specific component. Contains complete specifications for AI to generate implementation.

## Examples

### Example: Dashboard Layout

**Human URL**: https://uipotion.com/potions/layouts/dashboard.html  
**AI Guide URL**: https://uipotion.com/potions/layouts/dashboard.json

The dashboard layout includes:
- Collapsible sidebar (280px expanded, 80px collapsed)
- Fixed header with navigation
- Responsive content area
- Mobile overlay behavior
- Keyboard navigation support
- Smooth animations (300ms)
- localStorage persistence
- Complete accessibility

AI agents can implement this in any framework with any styling approach.

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
- **AI Manifest**: [uipotion.com/uipotion-manifest.json](https://uipotion.com/uipotion-manifest.json)
- **GitHub**: [github.com/uiPotion/uipotion](https://github.com/uiPotion/uipotion)
- **Harold SSG**: [haroldjs.com](https://haroldjs.com)
- **Legal**: [uipotion.com/legal.html](https://uipotion.com/legal.html)

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
