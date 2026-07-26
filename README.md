# UI Potion

> AI-agent-optimized UI specifications for any framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with Harold](https://img.shields.io/badge/Built%20with-Harold-deeppink)](https://haroldjs.com)

## What is UI Potion?

UI Potion is a catalog of framework-agnostic, styling-agnostic UI specifications for AI coding assistants. It is not a component library and does not ship ready-to-use component packages. Each "potion" describes the structure, behavior, accessibility, responsive rules, and testing guidance an agent needs to create an implementation that fits an existing project.

Think of it as "recipes for AI" - detailed guides that your AI assistant reads and adapts to your existing technology stack.

## Why UI Potion?

### The Problem with Traditional Component Libraries

- **Maintenance burden**: Framework updates can require library upgrades or migrations
- **Stack constraints**: Libraries support a defined set of frameworks and versions
- **Adaptation needed**: Code still needs to be modified for your project
- **Version conflicts**: Library version vs your project version
- **Bundle bloat**: Shipping code you might not use

### The UI Potion Approach

- ✅ **No UI Potion runtime dependency**: Nothing from UI Potion is installed or executed in your application
- ✅ **Framework agnostic**: Core guidance is stack-neutral and can be adapted to React, Vue, Angular, Svelte, or other frameworks
- ✅ **Styling agnostic**: Agents should reuse the styling system and design tokens already present in the project
- ✅ **Project-aware**: Your coding assistant adapts the specification to the versions, tokens, and conventions already in your project
- ✅ **Version-compatible guidance**: Agents should use patterns compatible with the framework versions detected in your project
- ✅ **Independently useful**: Each potion stands on its own; related potions are optional suggestions

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

Each potion is also available as Markdown source at the same path with `.md` (for example, `https://uipotion.com/potions/layouts/dashboard.md`).

If your assistant cannot open public URLs, download or copy the JSON guide into the chat, attach the file, or provide the Markdown source instead.

**Example**:
```
You: "I need a dashboard with collapsible sidebar. React + Tailwind.
     Use this guide: https://uipotion.com/potions/layouts/dashboard.json"

Your AI assistant uses the guide and adapts it to your stack (e.g. React and Tailwind only if you have them; otherwise it follows your current framework and styling). You review the project changes, run the relevant checks, then ask for refinements
(e.g. "make the sidebar 240px" or "add a dark theme") and iterate.
```

### For AI assistants

When a user gives you a UI Potion link (e.g. `https://uipotion.com/potions/layouts/dashboard.json`):

1. Open or fetch that URL to read the specification.
2. Use the spec to generate implementation code in the user's framework and styling (React/Vue/Svelte, Tailwind/CSS Modules, etc.).
3. Follow the guide's structure, accessibility, and behavior; follow existing project conventions and ask about material ambiguities instead of silently guessing.

If the assistant prefers text-first context, use the potion Markdown source at the same path with `.md`.

No need to fetch the main manifest or potions index unless you're building discovery/search. For normal use, the user provides the potion link and you implement from that single guide.

## Potion Kit (optional)

UI Potion also provides `potion-kit`, a CLI to scaffold and build Harold + UI Potion websites via AI chat.

Run it without installing with `npx potion-kit --help`, or install it globally. The Potion Kit repository remains the source of truth for providers, models, configuration, security behavior, and release-specific details.

- **Scaffold a project**: `npx potion-kit init <directory>`
- **Interactive chat**: `npx potion-kit chat`
- **One-shot**: `npx potion-kit chat "your request"`
- **Doctor/config check**: `npx potion-kit doctor`
- **Clear history**: `npx potion-kit clear`
- **Help/usage**: `npx potion-kit` or `npx potion-kit --help` (unknown commands also show help and do not call the API)

`potion-kit init` creates a starter static site with pages, partials, SCSS, a sample post, and package scripts. `npx potion-kit doctor` validates provider configuration, connectivity, project structure, and required remote dependencies before you start chatting.

Links:

- npm: https://www.npmjs.com/package/potion-kit
- GitHub: https://github.com/uiPotion/potion-kit

## Available Potions

See [the potion catalog](https://uipotion.com/potions) for the full list of potions (layouts, components, features, patterns, tooling).

## Development

### Prerequisites

- Node.js 24 or newer
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/uiPotion/uipotion.git
cd uipotion

# Install locked dependencies
npm ci
```

### Development Commands

```bash
# Start the dev server with source watching (http://localhost:3000)
npm start

# Build for production (runs validation automatically)
npm run build

# Validate all potions against their schemas (optional; also runs on build)
npm run validate

# Generate sitemap.xml, _redirects, and temporary Markdown publishing copies
npm run static

# The build output will be in the `build/` directory
```

### Dev Server Features

- **Watch mode**: Watches project source files
- **Automatic rebuilds**: Rebuilds the site when source files change; refresh the browser to see updates
- **Port 3000**: Serves on http://localhost:3000

## Contributing

We welcome contributions! UI Potion grows with community input.

**Step-by-step and full guide:** See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the contribution workflow, or the **[Contribute page on the website](https://uipotion.com/contribute)** for schemas, Schema Validator, AI prompts, and best practices. We keep the same narrative in both so you can follow either; the web version is more extended. You can also try contributing with your AI assistant — both guides explain how.

## What Makes a Good Potion?

### Human Documentation (Markdown)

- ✅ Clear prose descriptions (no ASCII art in website potion markdown)
- ✅ Structure and hierarchy
- ✅ Exact dimensions and measurements where relevant
- ✅ State descriptions and behavior
- ✅ Interaction patterns
- ✅ Responsive behavior at relevant breakpoints
- ✅ Accessibility requirements
- ✅ Animation specifications where relevant
- ✅ Testing checklist
- ✅ Framework-agnostic examples

### AI Guide (JSON)

- ✅ Structured, parseable data
- ✅ Complete specifications that minimize ambiguity
- ✅ Framework-specific patterns where they help agents adapt the specification
- ✅ Styling approach examples where useful
- ✅ State management guidance where relevant
- ✅ Accessibility implementation details
- ✅ Animation timing values where relevant
- ✅ Testing verification steps

## Programmatic access (optional)

Most users only need to share a potion link with their AI assistant. If you're building discovery or search (e.g. "find all dashboard-related potions"), you can use:

- **Main manifest**: `https://uipotion.com/uipotion-manifest.json` — service metadata, categories, link to potions index
- **Potions index**: `https://uipotion.com/potions-index.json` — catalog of all potions (`id`, `name`, `category`, `tags`, `excerpt`, `webUrl`, `agentGuideUrl`, `markdownUrl`, dates)
- **Base schema**: `https://uipotion.com/schema/potion.base.schema.json` — shared contract for every potion guide
- **Category schema**: `https://uipotion.com/schema/categories/[category].schema.json` — category-specific contract referenced by each guide
- **Schema validator**: `https://uipotion.com/validator` — browser-based validation for potion JSON
- **Individual guide**: `https://uipotion.com/potions/[category]/[id].json` — full implementation specification for one potion
- **Markdown source**: `https://uipotion.com/potions/[category]/[id].md` — human-readable source for text/markdown-friendly agents
- **LLM discovery file**: `https://uipotion.com/llms.txt` — curated entrypoint for LLM/agent discovery

For normal use, the user provides the potion URL; no need to fetch the manifest or index.

## Example: Dashboard Layout

- **Docs (human)**: https://uipotion.com/potions/layouts/dashboard  
- **Guide (for your AI)**: https://uipotion.com/potions/layouts/dashboard.json

Give your assistant the guide URL and say e.g. "Implement this dashboard for my React + Tailwind app." The guide covers collapsible sidebar, fixed header, responsive content, mobile overlay, keyboard nav, animations, and accessibility — your assistant adapts it to your stack and you iterate from there.

## License

UI Potion specifications, documentation, website content, and source code are available under the MIT License. See [LICENSE](LICENSE) for the full license text and scope.

UI Potion provides specifications and guidelines, not generated implementation code. Review, test, secure, and validate all AI-generated code before deployment. See [Legal information](https://uipotion.com/legal) for the complete disclaimer and privacy policy.

## Links

- **Website**: [uipotion.com](https://uipotion.com)
- **Contribute**: [uipotion.com/contribute](https://uipotion.com/contribute)
- **AI Manifest**: [uipotion.com/uipotion-manifest.json](https://uipotion.com/uipotion-manifest.json)
- **Potions Index**: [uipotion.com/potions-index.json](https://uipotion.com/potions-index.json)
- **LLM Discovery**: [uipotion.com/llms.txt](https://uipotion.com/llms.txt)
- **GitHub**: [github.com/uiPotion/uipotion](https://github.com/uiPotion/uipotion)
- **Harold SSG**: [haroldjs.com](https://haroldjs.com)
- **Legal**: [uipotion.com/legal](https://uipotion.com/legal)

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/uiPotion/uipotion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/uiPotion/uipotion/discussions)
- **X**: [@uipotion](https://x.com/uipotion) · [@thejulianio](https://x.com/thejulianio)

## Acknowledgments

- Built with [Harold](https://haroldjs.com) by [Julian Ćwirko](https://github.com/juliancwirko)
- Inspired by the rise of AI-assisted development
- Thanks to all contributors

---

**Built with ❤️ for AI-powered development**

*Making UI implementation faster, easier, and more flexible for everyone.*
