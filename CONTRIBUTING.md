# Contributing to UI Potion

Thank you for your interest in contributing to UI Potion! This guide will help you add new UI specifications to our collection.

**Want the full guide?** The **[Contribute page on the website](https://uipotion.com/contribute)** has schemas, the Schema Validator, example AI prompts, and best practices.

**Try contributing with your AI assistant.** Point your AI at this repo (or the [uipotion-manifest](https://uipotion.com/uipotion-manifest.json) and [potions-index](https://uipotion.com/potions-index.json)), give it the **schemas** in `src/statics/schema/` and **existing potions** in the same category as references, and ask it to draft a new potion (Markdown + JSON + index entry). Then run `npm run build`, refine the result, and open a PR. Many contributors use AI for the first draft and refine from there.

## Quick Start

1. Fork this repository at https://github.com/uiPotion/uipotion
2. Create your potion (Markdown + JSON + index entry) — see Creating a Potion below
3. Validate using the [Schema Validator](https://uipotion.com/validator) or `npm run validate`
4. Run `npm run build` to validate and generate the production site
5. Submit a pull request

We'll review your potion for schema compliance and best practices, then merge and publish when ready.

## Creating a Potion

Each potion consists of **two files**:

1. **Markdown file** (`src/potions/[category]/your-potion.md`) — human-readable web version
2. **JSON file** (`src/statics/potions/[category]/your-potion.json`) — AI-readable guide

### Categories

Choose the appropriate category:
- **layouts** — Full-page layouts (dashboards, landing pages, app shells)
- **components** — Reusable UI elements (buttons, dialogs, forms, cards)
- **features** — Complete user flows (authentication, onboarding, checkout)
- **patterns** — Design patterns and guidelines
- **tooling** — Developer tools and infrastructure

### Step 1: Create JSON File

Create `src/statics/potions/[category]/your-potion.json`

Use the **category schema** in `src/statics/schema/categories/` and an existing potion as template (e.g., `navbar.json` for components, `dashboard.json` for layouts).

Every guide begins with the required base fields below. This excerpt is not a complete category guide; each category schema adds required structures of its own. Start from an existing potion in the same category and validate the result.

```json
{
  "$schema": "https://uipotion.com/schema/categories/components.schema.json",
  "id": "your-potion-id",
  "version": "1.0.0",
  "name": "Your Potion Name",
  "category": "components",
  "tags": ["tag1", "tag2"],
  "description": "Brief description",
  "aiAgentInstructions": {
    "summary": "Implementation goal",
    "keyFeatures": ["Primary behavior"],
    "implementationSteps": ["Detect the project framework and styling system before writing code"]
  },
  "meta": {
    "created": "YYYY-MM-DD",
    "updated": "YYYY-MM-DD",
    "webUrl": "https://uipotion.com/potions/components/your-potion",
    "agentGuideUrl": "https://uipotion.com/potions/components/your-potion.json",
    "markdownUrl": "https://uipotion.com/potions/components/your-potion.md"
  }
}
```

### Step 2: Create Markdown File

Create `src/potions/[category]/your-potion.md`

Required front matter:
```yaml
---
layout: 'potion'
title: 'Your Potion Name'
publicationDate: 'YYYY-MM-DD'
excerpt: 'Brief description (1-2 sentences)'
category: 'Components'
tags:
  - components
  - tag1
  - tag2
agentManifest: 'potions/components/your-potion.json'
---
```

Then write comprehensive specifications in the body (see existing potions for format).

### Step 3: Validate

Visit https://uipotion.com/validator and validate your JSON file.

### Step 4: Update Potions Index and Dates

Add the matching entry to `src/statics/potions-index.json`:

```json
{
  "id": "your-potion-id",
  "name": "Your Potion Name",
  "category": "components",
  "tags": ["tag1", "tag2"],
  "excerpt": "Brief description",
  "webUrl": "https://uipotion.com/potions/components/your-potion",
  "agentGuideUrl": "https://uipotion.com/potions/components/your-potion.json",
  "markdownUrl": "https://uipotion.com/potions/components/your-potion.md",
  "created": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD"
}
```

Update `totalCount` and top-level `lastUpdated`. Keep the index dates synchronized with the guide `meta.created` and `meta.updated`, and update `src/statics/uipotion-manifest.json` `meta.updated`.

### Step 5: Build and Verify

Run the full production check:

```bash
npm run build
```

The build validates every potion, checks index metadata consistency, regenerates the sitemap and redirects, creates the Harold site, and cleans temporary Markdown publishing copies.

## Testing Locally

```bash
# Install locked dependencies
npm ci

# Start dev server
npm start

# Build for production
npm run build
```

Visit http://localhost:3000 to preview your changes.

## Pull Request Guidelines

**Before submitting:**
- JSON validates with no errors (web validator or `npm run validate`)
- Markdown has correct front matter
- Ran `npm run build`
- Updated `potions-index.json`
- Tested locally with `npm start`
- Followed existing potion format

**PR Description should include:**
- Category and potion name
- Brief description of what it provides
- Confirmation that it passes validation
- Example use case

We'll review your potion for schema compliance and best practices, suggest improvements if needed, then merge and publish when ready.

## Content Guidelines

- **Be comprehensive** — Include all necessary details for AI to implement
- **Be framework-agnostic** — Avoid framework-specific code in descriptions
- **Include accessibility where relevant** — WCAG compliance, ARIA, keyboard navigation
- **Include responsive specs where relevant** — Mobile, tablet, desktop breakpoints
- **Include testing checklist** — What to verify after implementation

## Questions?

- Check existing potions for examples
- Review [AGENTS.md](AGENTS.md) for detailed project guidelines
- Ask in your pull request if unsure

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to UI Potion!** 🧪✨
