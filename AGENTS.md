# UI Potion Agent Instructions

## Purpose
- UI Potion provides UI behavior guides, called "potions", that coding agents apply to existing projects.
- UI Potion is not a component library and does not provide copy-paste component packages.
- Potions are framework-agnostic and styling-agnostic specifications that agents adapt to a user's existing stack.
- In human-readable text, always write "UI Potion" with a space. Use `UIPotion` or `uipotion` only for technical identifiers such as file names, URLs, JSON keys, package names, and code references.

## Working Rules
- If a requirement is missing, unclear, or conflicts with another, ask before building: suggest answers and mark the one you recommend.
- Change incrementally: fix or extend what's needed, keep what works, and don't rewrite.
- Don't commit, push, switch branches, or add report files unless asked.
- Keep this file short: add rules in the fewest words, merged into existing lines where they fit.

## Project Shape
- Static site generator: Harold (`harold-scripts`) using Markdown, Handlebars, SCSS, and static JSON.
- Potion Markdown lives in `src/potions/[category]/[slug].md`.
- Potion JSON guides live in `src/statics/potions/[category]/[slug].json`.
- Discovery files live at `src/statics/uipotion-manifest.json`, `src/statics/potions-index.json`, and `src/statics/llms.txt`.
- JSON schemas live in `src/statics/schema/`.
- Handlebars pages live in `src/pages/`; partials live in `src/partials/`; potion layouts live in `src/potion-layouts/`.
- SCSS entrypoint is `src/styles/main.scss`, which uses `basic` and `uipotion`.
- Build output in `build/` is generated. Do not edit it by hand.
- Generated Markdown copies under `src/statics/potions/**/*.md` are gitignored and removed after production builds. Edit the source files in `src/potions/` instead.

## Commands
- `npm run validate`: validate every potion: its JSON against the category schema, the potions index against the guides, the authoring rules in this file (Markdown front matter and content, URLs, related potions, dates), that a guide's dotted references to its own parts resolve (`section-refs`), and that its Markdown has an "Acceptance checklist" section matching `testingChecklist` (`checklist`).
- The browser validator at `/validator` checks one pasted JSON against its category schema only.
- `npm run static`: regenerate `src/statics/sitemap.xml`, `src/statics/_redirects`, and temporary Markdown copies for static publishing.
- `npm run build`: preferred full check; runs validate, static generation, Harold build, and postbuild cleanup.
- `npm run start`: build, serve `build/` on `localhost:3000`, and watch source files.
- Do not run `harold-scripts build` directly unless debugging Harold internals.
- `npm test`: test the validator itself; run it after changing `validate-potions.js`.

## Potion Model
- Supported categories are `layouts`, `components`, `features`, `patterns`, and `tooling`.
- A potion normally has two source files: Markdown for humans and JSON for agents. Start both from a same-category potion, and the JSON from its category schema in `src/statics/schema/categories/`.
- Each potion must remain independently useful; related potions are suggestions, not dependencies.

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
path: 'potions/components/component-name'
---
```

- `path` is the potion page path, `potions/[category]/[slug]`, with no leading slash or extension. The potion layout builds the canonical URL, the social preview URLs, and the Markdown links from it, so a missing `path` points them at the homepage.

- `category` is title case in Markdown front matter: `Layouts`, `Components`, `Features`, `Patterns`, or `Tooling`.
- The first Markdown tag must be the lowercase category.
- Do not add any other category name as a tag, or the potion can appear in multiple catalog sections.
- Potion page fields, rendered by `src/potion-layouts/potion.hbs`:
  - `promptSubject`: a short lowercase noun phrase, such as `'modal dialogs'` or `'a dashboard layout'`. It completes the copyable prompts ("implementing modal dialogs in this project" and "Compare how this project implements modal dialogs with..."). Add it to every potion; without it, the prompts fall back to generic wording.
  - `promptReuse` (optional): replaces the build prompt's reuse sentence ("Reuse our existing components and styling, implement only what this task needs, and keep existing APIs.") when it doesn't fit, as for tooling potions. The prompt adds "Don't add new dependencies or run commands from the guide without asking." after it.
  - `useWhen` (optional): one sentence that completes "Use this when", starting in lowercase.
  - `specifies` (optional, with `useWhen`): three behaviors the guide currently specifies, one sentence each. List only behavior the guide's content covers.
  - `example` (optional, with `useWhen`): one short scenario that shows the listed behaviors, using only behavior the guide covers.
- Keep titles concise: prefer 2-6 words and target 60 characters or less. Put detailed qualifiers in the excerpt, body, and JSON fields.
- Do not use ASCII art, text-based diagrams, emojis, or Markdown tables in potion Markdown. Use clear prose and bullets instead.
- No `#` heading in the body: the page shows `title` as its only `h1`, so sections start at `##`.
- Do not make Markdown potions framework-specific. Describe behavior, structure, states, accessibility, responsive behavior, animation, and testing in stack-neutral terms.

## JSON Guides
- Required base fields include `$schema`, `id`, `version`, `name`, `category`, `tags`, `description`, `aiAgentInstructions`, and `meta`.
- `id` must be kebab-case and should match the file slug.
- `version` is SemVer.
- `category` is lowercase.
- Include enough detail for an AI agent to implement without guessing: structure, state, accessibility, responsive behavior, motion, edge cases, and testing.
- When a guide includes implementation guidance, require agents to detect the user's framework, styling system, existing tokens, and component conventions before writing code, with the Dialog guide's `projectDetection` wording.
- Code goes in `frameworkPatterns` (tooling: `templates`) as short tested snippets, shown as the same code blocks in the Markdown; the potion remains a specification, not a shipped component package.
- Optional `meta.relatedPotions` entries must use `required: false` unless there is a truly exceptional reason.

## Guide Rules
Rules for guide content, in both formats, which every guide follows where they apply.
- State each rule once, mark options and suggested sizes as such, and end with a short acceptance checklist.
- Tell agents to implement only what the task needs, keep existing APIs, build on a suitable existing component, and add no dependency without asking.
- The project's conventions win for styling and visual defaults; conflicts with accessibility or correctness go to the user.
- Write plainly: no "CRITICAL", no all-caps rules, no personal style rules such as one hook per concern, and no `aiImplementationPrompt`.
- Target WCAG 2.2 AA, prefer platform features (`<dialog>`, `inert`, `popover`), and label framework examples with their version.
- Layers, bottom to top: page, sticky bars, dropdowns and popovers, toasts, modals (which make the rest inert). The project's scale wins; the top layer needs no z-index.
- Hide closed menus, drawers, and sidebars with `hidden` or `inert`, not only `aria-hidden`.
- Field errors use `aria-describedby`; results use one polite status region that exists before it changes; `role="alert"` is only for urgent errors, never with `aria-live="polite"`.
- Fixed bars get matching `scroll-padding` (WCAG 2.4.11), and site headers start with a skip link.
- Example colors meet 4.5:1 for text and 3:1 for UI parts and icons (1.4.11); remind agents to check the project's colors.
- Accessible names include the visible text (2.5.3), disclosures have no `aria-haspopup`, required fields say so in text, and links in running text are underlined.
- Saved UI state uses the app's own storage prefix and applies before the first paint.
- Rebuild state derived from the page after a form reset and on `pageshow`; a data-changing request with no answer has an unknown result, not a failed one.
- Name the cases a guide covers and its limits; date facts that go stale (versions, support ranges, end-of-life dates) and say how to recheck them.
- Don't teach `:focus` outline fallbacks, `transform3d`, focus-trap libraries, or Angular `[label]='Text'` bindings.

## Index And Dates
- When adding a potion, add an entry to `src/statics/potions-index.json` with `id`, `name`, `category`, `tags`, `excerpt`, `webUrl`, `agentGuideUrl`, `markdownUrl`, `created`, and `updated`.
- Update top-level `totalCount` and `lastUpdated` in `src/statics/potions-index.json`.
- When editing an existing potion's content, update:
  - Potion JSON `meta.updated`.
  - Matching `potions-index.json` entry `updated`.
  - `potions-index.json` top-level `lastUpdated`.
  - `uipotion-manifest.json` `meta.updated`.
- A change that touches only potion page fields (`promptSubject`, `promptReuse`, `useWhen`, `specifies`, `example`) isn't a content change. Don't bump `meta.updated`, the index dates, or the manifest date for it. The index `updated` date drives the sitemap and tells apps that read the index that a guide changed.
- Use `YYYY-MM-DD` dates.

## Links And URLs
- Use absolute internal links in templates and Markdown, such as `/about`, `/potions`, `/contribute`, `/legal`, and `/assets/images/...`.
- Do not use Harold's `relativePath` helper in this project.
- Potion page URL: `/potions/[category]/[slug]`.
- Potion JSON URL: `/potions/[category]/[slug].json`.
- Potion Markdown source URL: `/potions/[category]/[slug].md`.
- Main manifest URL: `/uipotion-manifest.json`.
- Potions index URL: `/potions-index.json`.

## Harold And Templates
- Pages in `src/pages/*.hbs` should include `{{> head}}` at the top and `{{> footer}}` at the bottom, with the page content, hero included, in one `<main>`.
- Do not put DOCTYPE, `<html>`, `<head>`, or opening `<body>` tags in page files; `src/partials/head.hbs` owns that wrapper.
- Use semantic HTML and pass page metadata through the `head` partial.
- Useful helpers include `formatDate`, `responsiveImg`, and `postsList`.
- SCSS partials start with `_`; main compiled files do not.
- Keep UI Potion-specific styling in `src/styles/_uipotion.scss` unless a more specific existing file clearly owns the change.

## Content Voice
- Write for human developers browsing the site and for AI agents consuming structured specs.
- Be precise about dimensions, states, interaction timing, focus behavior, ARIA, responsive behavior, and failure states.
- For related potions, write "works well with", "see also", or "complements", never "requires", "must use", "depends on", or "you need".
- Keep legal/disclaimer wording aligned with `README.md`, `LICENSE`, and the legal page.

## Verification
- For JSON-only potion changes, run `npm run validate`.
- For potion additions, renames, URL changes, sitemap changes, template changes, style changes, or release-ready checks, run `npm run build`.
- If `npm run build` changes generated static files, review them before finishing.
- Do not edit `build/` directly; fix source files and rebuild.
- Check the browser behavior a rule or snippet relies on in Chromium, Firefox, and WebKit: inside a project's own markup and styles, both ways for each state change (open and close, widen and narrow), and in every mode the guide documents. Run tooling templates with the tool itself.
- Reproduce a problem with a check before fixing it: the check fails before the fix, passes after, and fails again, for the right reason, when the bug is put back.
- Before finishing, update the docs the change makes stale: README, CONTRIBUTING, this file, and the About and Contribute pages.
