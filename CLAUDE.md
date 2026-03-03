# UI Potion + Harold - Claude Code Rules

You are working on **UI Potion**, a service that provides AI-agent-optimized UI component guides, built with **Harold** static site generator.

**IMPORTANT**: Always use "UI Potion" (with space) in all human-readable text. Use "UIPotion" or "uipotion" only for technical identifiers (file names, URLs, JSON keys, code references).

## Project Philosophy

UI Potion is NOT a component library with copy-paste code. Instead:
- We provide **detailed specifications** for UI components ("potions")
- Specifications are **framework-agnostic** and **styling-agnostic**
- AI agents read specs and **generate code** adapted to the user's stack
- **Zero maintenance burden** — specs don't break when frameworks update

## Technology Stack

- **Static Site Generator**: Harold (Markdown + Handlebars + SCSS)
- **Content**: Potions as Markdown in `src/potions/`
- **AI Discovery**: JSON manifests for programmatic access
- **Styling**: SCSS with modular approach

## Project Structure

```
src/
├── potions/              # Markdown potion files (by category)
│   ├── layouts/          # Layout patterns
│   ├── components/       # Reusable components
│   ├── features/         # (create when needed)
│   ├── patterns/         # (create when needed)
│   └── tooling/          # (create when needed)
├── statics/              # Static files → copied to build root
│   ├── uipotion-manifest.json
│   ├── potions-index.json
│   ├── potions/          # JSON guides (by category)
│   ├── schemas/
│   └── skills/
├── potion-layouts/       # Handlebars layouts (potion.hbs)
├── pages/                # Site pages (.hbs)
├── partials/             # Reusable Handlebars partials
├── styles/               # SCSS files
├── assets/               # Images, fonts, JS
└── build/                # Output (auto-generated, NEVER edit)
```

## Commands

```bash
npm run build    # Full build (always use this, not harold-scripts directly)
npm run start    # Build + dev server (localhost:3000) + watch
```

## Categories

1. **Layouts** — Full-page layouts (dashboards, landing pages, app shells)
2. **Components** — Reusable UI blocks (buttons, dialogs, cards, navigation)
3. **Features** — Complete user-facing flows (auth, pricing, onboarding)
4. **Patterns** — Design/interaction patterns (drag-and-drop, infinite scroll)
5. **Tooling** — Developer tools and infrastructure

## Creating a Potion

Each potion consists of 3 parts:

### 1. Markdown File (`src/potions/[category]/slug.md`)

Required front matter:
```yaml
---
layout: 'potion'
title: 'Component Name'              # Keep concise, 2-6 words, <= 60 chars
publicationDate: 'YYYY-MM-DD'
excerpt: 'Brief 1-2 sentence description'
category: 'Layouts'                  # Layouts|Components|Features|Patterns|Tooling
tags: [category-lowercase, tag2]     # First tag MUST be the category. Do NOT include other category names as tags.
agentManifest: 'potions/[category]/slug.json'
---
```

Content sections: Overview, Structure, Components, Responsive Design, Accessibility, Framework Patterns, Testing Checklist.

### 2. JSON Guide (`src/statics/potions/[category]/slug.json`)

Use `src/statics/potions/layouts/dashboard.json` or a same-category guide as template. Must include: `aiAgentInstructions`, `structure`, `components`, `responsiveBreakpoints`, `stateManagement`, `frameworkPatterns`, `stylingApproaches`, `accessibility`, `animations`, `testingChecklist`.

### 3. Update Index and Manifest

- Add entry to `src/statics/potions-index.json` (update `totalCount` and `lastUpdated`)
- Update `src/statics/uipotion-manifest.json` `meta.updated`

### When Editing an Existing Potion

Update all dates to stay in sync:
- Potion JSON `meta.updated`
- That potion's `updated` in `potions-index.json` + top-level `lastUpdated`
- `uipotion-manifest.json` `meta.updated`

## Content Rules

- NEVER use ASCII art or text-based diagrams in Markdown potion files
- NEVER use emojis in Markdown potion files
- NEVER use Markdown tables in potion files (rendering unreliable)
- Use clear prose descriptions instead
- For key/action mappings, use bullet lists not tables
- In JSON files, minimal text structure is acceptable

## Cross-References

After creating a potion, add optional "See Also" sections linking to 2-3 related potions. Use suggestive language ("works well with", "consider using") — never "requires" or "depends on". Each potion must work independently.

In JSON, use optional `meta.relatedPotions` array with `"required": false`.

## Harold Rules

- Use `layout: 'potion'` for all potions
- Use **absolute paths** for links (`/about`, `/potions`, `/potion-kit`). Do NOT use the `relativePath` helper.
- SCSS: partials start with `_`, main files don't. Import order: variables → mixins → base → components.
- Pages: use `{{> head}}` and `{{> footer}}` partials, no DOCTYPE tags.
- Date format in front matter must be `YYYY-MM-DD` string.
- Line endings: use LF (Harold normalizes CRLF → LF).

## Handlebars Helpers

- `{{formatDate date=publicationDate format='dd mmmm yyyy'}}`
- `{{responsiveImg src="..." alt="..." width="..." height="..." loading="lazy"}}`
- `{{postsList perPageLimit=6 currentPage=1 byTagName="tag" className="..." dateFormat="..."}}`

## URL Structure

- Potion page: `/potions/[category]/[name].html`
- Potion JSON: `/potions/[category]/[id].json`
- Manifest: `/uipotion-manifest.json`
- Index: `/potions-index.json`

## Testing Checklist

Before a potion is complete:
- Markdown has correct front matter (all required fields)
- First tag matches category; no other category names in tags
- JSON guide is comprehensive and follows template
- Added to potions-index.json with correct totalCount/lastUpdated
- `npm run build` succeeds
- Links use absolute paths
- JSON validates properly
- Accessibility, responsive, and animation specs included
- Framework patterns for React, Vue, Angular, Svelte
- Styling approaches for Tailwind, CSS Modules, styled-components, Chakra

## Key Principle

UI Potion provides **specifications, not code**. AI agents transform these specs into production-ready implementations adapted to each developer's stack.
