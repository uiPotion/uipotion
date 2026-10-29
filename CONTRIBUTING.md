# Contributing to UI Potion

Thank you for your interest in contributing to UI Potion! This guide will help you add new UI specifications to our collection.

**Want the full guide?** The **[Contribute page on the website](https://uipotion.com/contribute)** has schemas, the Schema Validator, example AI prompts, and best practices.

**Try contributing with your AI assistant.** Point your AI at this repo (or the [uipotion-manifest](https://uipotion.com/uipotion-manifest.json) and [potions-index](https://uipotion.com/potions-index.json)), give it the **schemas** in `src/statics/schema/` and **existing potions** in the same category as references, and ask it to draft a new potion (Markdown + JSON + index entry). Then run `npm run build`, refine the result, and open a PR. Many contributors use AI for the first draft and refine from there.

## Quick Start

1. Fork this repository at https://github.com/uiPotion/uipotion
2. Create your potion (Markdown + JSON + index entry) — see Creating a Potion below
3. Validate with `npm run validate`, which checks the JSON, the Markdown, and the index entry. The [Schema Validator](https://uipotion.com/validator) checks only the JSON, in your browser.
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

Use the **category schema** in `src/statics/schema/categories/` and an existing potion as template (e.g., `dialog.json` for components, `ai-agent-chat.json` for layouts, `ai-action-review.json` for patterns, `form-login-register.json` for features). Write it the way those guides are written: they follow the [Guide Rules](AGENTS.md#guide-rules), which not every older guide follows yet.

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
path: 'potions/components/your-potion'
---
```

`path` is the page path without a leading slash or extension. The page's canonical URL and Markdown links are built from it.

Also add `promptSubject`, a short lowercase noun phrase such as `'modal dialogs'` or `'a dashboard layout'`. The potion page uses it in the prompts visitors copy. If the prompt's default reuse sentence doesn't fit your potion, as with tooling, add `promptReuse` with a replacement sentence. Optionally, add `useWhen` (one sentence that completes "Use this when"), `specifies` (three behaviors your guide specifies), and `example` (one short scenario that shows them) to show a short summary under the excerpt.

Then write comprehensive specifications in the body (see the Dialog potion, `dialog.md`, for format). Don't start it with a `#` title: the page shows `title` as its heading, so sections start at `##`.

### Step 3: Validate

Check your JSON in the [Schema Validator](https://uipotion.com/validator), which compares it with its category schema. Fix any errors before continuing. The full check, `npm run validate`, also covers your Markdown and the index entry from Step 4, so run it after that step (`npm run build` runs it too).

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

The build validates every potion (its JSON, its Markdown, and the index), regenerates the sitemap and redirects, creates the Harold site, and cleans temporary Markdown publishing copies.

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
- `npm run validate` passes with no errors (the web validator checks only the JSON)
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

- **Be comprehensive** — Include all necessary details for AI to implement, and say each rule once
- **Be framework-agnostic** — Avoid framework-specific code in descriptions
- **Include accessibility where relevant** — WCAG 2.2 AA, ARIA, keyboard navigation
- **Follow the Guide Rules** — In [AGENTS.md](AGENTS.md#guide-rules), which every guide follows
- **Include responsive specs where relevant** — Mobile, tablet, desktop breakpoints
- **Keep code to short snippets** — Plain HTML, CSS, and JavaScript for the parts that are easiest to get wrong, the same in the Markdown and the JSON, and checked in a browser
- **End with a short acceptance checklist** — What to verify after implementation, the same in the Markdown and the JSON (`testingChecklist`)

## Questions?

- Check existing potions for examples
- Review [AGENTS.md](AGENTS.md) for detailed project guidelines
- Ask in your pull request if unsure

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to UI Potion!**
