# UI Potion Agent Instructions

## Purpose
- UI Potion provides AI-agent-optimized UI specifications called "potions".
- UI Potion is not a component library and does not provide copy-paste component packages.
- Potions are framework-agnostic and styling-agnostic specifications that agents adapt to a user's existing stack.
- In human-readable text, always write "UI Potion" with a space. Use `UIPotion` or `uipotion` only for technical identifiers such as file names, URLs, JSON keys, package names, and code references.

## Project Shape
- Static site generator: Harold (`harold-scripts`) using Markdown, Handlebars, SCSS, and static JSON.
- Potion Markdown lives in `src/potions/[category]/[slug].md`.
- Potion JSON guides live in `src/statics/potions/[category]/[slug].json`.
- Discovery files live at `src/statics/uipotion-manifest.json`, `src/statics/potions-index.json`, and `src/statics/llms.txt`.
- JSON schemas live in `src/statics/schemas/`.
- Handlebars pages live in `src/pages/`; partials live in `src/partials/`; potion layouts live in `src/potion-layouts/`.
- SCSS entrypoint is `src/styles/main.scss`, which uses `basic`, `page`, and `uipotion`.
- Build output in `build/` is generated. Do not edit it by hand.
- Generated Markdown copies under `src/statics/potions/**/*.md` are gitignored and removed after production builds. Edit the source files in `src/potions/` instead.

## Commands
- `npm run validate`: validate all potion JSON files against category schemas.
- `npm run static`: regenerate `src/statics/sitemap.xml`, `src/statics/_redirects`, and temporary Markdown copies for static publishing.
- `npm run build`: preferred full check; runs validate, static generation, Harold build, and postbuild cleanup.
- `npm run start`: build, serve `build/` on `localhost:3000`, and watch source files.
- Do not run `harold-scripts build` directly unless debugging Harold internals.
- There is no `npm test` script in this repo at the moment; use `npm run validate` or `npm run build` depending on the change.

## Potion Model
- Supported categories are `layouts`, `components`, `features`, `patterns`, and `tooling`.
- A potion normally has two source files: Markdown for humans and JSON for agents.
- Add or update the index entry in `src/statics/potions-index.json` whenever adding, renaming, or materially changing a potion.
- Keep `src/statics/uipotion-manifest.json` `meta.updated` in sync when potion content changes.
- Each potion must remain independently useful. Cross-references are suggestions, not dependencies.

## Markdown Potions
- Required front matter:

```yaml
---
layout: 'potion'
title: 'Component Name'
publicationDate: 'YYYY-MM-DD'
excerpt: 'Brief 1-2 sentence description'
category: 'Components'
tags:
  - components
  - tag
agentManifest: 'potions/components/component-name.json'
---
```

- `category` is title case in Markdown front matter: `Layouts`, `Components`, `Features`, `Patterns`, or `Tooling`.
- The first Markdown tag must be the lowercase category.
- Do not add any other category name as a tag, or the potion can appear in multiple catalog sections.
- Keep titles concise: prefer 2-6 words and target 60 characters or less. Put detailed qualifiers in the excerpt, body, and JSON fields.
- Do not use ASCII art, text-based diagrams, emojis, or Markdown tables in potion Markdown. Use clear prose and bullets instead.
- Do not make Markdown potions framework-specific. Describe behavior, structure, states, accessibility, responsive behavior, animation, and testing in stack-neutral terms.
- Use same-category existing potions as templates before inventing a new structure.

## JSON Guides
- Required base fields include `$schema`, `id`, `version`, `name`, `category`, `tags`, `description`, `aiAgentInstructions`, and `meta`.
- Use the category schema in `src/statics/schemas/categories/` and a same-category existing guide as the template.
- `id` must be kebab-case and should match the file slug.
- `version` is SemVer.
- `category` is lowercase.
- Include enough detail for an AI agent to implement without guessing: structure, components, responsive breakpoints, state, accessibility, animations, framework patterns, styling approaches, edge cases, and testing.
- When a guide includes implementation guidance, require agents to detect the user's framework, styling system, existing tokens, and component conventions before writing code.
- JSON may include code-like examples in `frameworkPatterns` or `stylingApproaches`, but the potion remains a specification, not a shipped component package.
- Optional `meta.relatedPotions` entries must use `required: false` unless there is a truly exceptional reason.

## Index And Dates
- When adding a potion, add an entry to `src/statics/potions-index.json` with `id`, `name`, `category`, `tags`, `excerpt`, `webUrl`, `agentGuideUrl`, `markdownUrl`, `created`, and `updated`.
- Update top-level `totalCount` and `lastUpdated` in `src/statics/potions-index.json`.
- When editing an existing potion's content, update:
  - Potion JSON `meta.updated`.
  - Matching `potions-index.json` entry `updated`.
  - `potions-index.json` top-level `lastUpdated`.
  - `uipotion-manifest.json` `meta.updated`.
- Use `YYYY-MM-DD` dates.

## Links And URLs
- Use absolute internal links in templates and Markdown, such as `/about`, `/potions`, `/potion-kit`, `/contribute`, `/legal`, and `/assets/images/...`.
- Do not use Harold's `relativePath` helper in this project.
- Potion page URL: `/potions/[category]/[slug]`.
- Potion JSON URL: `/potions/[category]/[slug].json`.
- Potion Markdown source URL: `/potions/[category]/[slug].md`.
- Main manifest URL: `/uipotion-manifest.json`.
- Potions index URL: `/potions-index.json`.

## Harold And Templates
- Pages in `src/pages/*.hbs` should include `{{> head}}` at the top and `{{> footer}}` at the bottom.
- Do not put DOCTYPE, `<html>`, `<head>`, or opening `<body>` tags in page files; `src/partials/head.hbs` owns that wrapper.
- Use semantic HTML and pass page metadata through the `head` partial.
- Useful helpers include `formatDate`, `responsiveImg`, and `postsList`.
- SCSS partials start with `_`; main compiled files do not.
- Keep UI Potion-specific styling in `src/styles/_uipotion.scss` unless a more specific existing file clearly owns the change.

## Content Voice
- Write for human developers browsing the site and for AI agents consuming structured specs.
- Be precise about dimensions, states, interaction timing, focus behavior, ARIA, responsive behavior, and failure states.
- Prefer neutral wording: "works well with", "consider using", "see also", "complements", and "commonly paired with".
- Avoid dependency language for related potions: do not say "requires", "must use", "depends on", or "you need".
- Keep legal/disclaimer wording aligned with `README.md`, `LICENSE`, and the legal page.

## Verification
- For JSON-only potion changes, run `npm run validate`.
- For potion additions, renames, URL changes, sitemap changes, template changes, style changes, or release-ready checks, run `npm run build`.
- If `npm run build` changes generated static files, review them before finishing.
- Do not edit `build/` directly; fix source files and rebuild.
