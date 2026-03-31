---
name: ui-potion-consumer
description: "Fetch a UI Potion JSON guide, detect the project's framework and styling system, and generate a production-ready component adapted to the local stack. Use when the user requests a UI component, layout, or feature, mentions UI Potion, or provides a uipotion.com URL."
license: MIT
metadata:
  author: ui-potion
  version: "1.0"
compatibility: Requires network access to fetch https://uipotion.com manifests and guides.
---

# UI Potion Consumer

Fetch a UI Potion guide and implement the specified component using the project's existing framework and styling system.

## Workflow

### 1. Resolve the guide URL

- If the user provides a direct URL (e.g. `https://uipotion.com/potions/components/modal.json`), use it.
- Otherwise load the potions index at `https://uipotion.com/potions-index.json` and match by name, category, or tags.

The index returns entries shaped like:

```json
{
  "id": "modal",
  "name": "Modal Dialog",
  "category": "components",
  "tags": ["components", "dialog", "overlay"],
  "agentGuideUrl": "https://uipotion.com/potions/components/modal.json"
}
```

Use the `agentGuideUrl` field to fetch the full guide.

### 2. Fetch and parse the guide

Fetch the JSON guide. The key section is `aiAgentInstructions`:

```json
{
  "aiAgentInstructions": {
    "summary": "...",
    "keyFeatures": ["..."],
    "implementationSteps": ["..."]
  },
  "frameworkPatterns": { "react": {}, "vue": {}, "svelte": {} },
  "stylingApproaches": { "tailwind": {}, "cssModules": {}, "styledComponents": {} },
  "accessibility": { "aria": [], "keyboard": [] },
  "testingChecklist": ["..."]
}
```

Read `aiAgentInstructions.implementationSteps` for the build sequence, `accessibility` for ARIA and keyboard requirements, and `outputConstraints` (if present) for any guardrails.

**If the fetch fails:** Tell the user the guide could not be loaded and suggest checking the URL or trying the human-readable page at `https://uipotion.com/potions/[category]/[id].html`.

### 3. Detect the project's framework and styling

Inspect the repo to determine the stack:

- **Framework:** Check `package.json` dependencies for `react`, `vue`, `svelte`, `@angular/core`, or `next`. Fall back to file extensions (`.jsx`/`.tsx` → React, `.vue` → Vue, `.svelte` → Svelte).
- **Styling:** Check for `tailwind.config.*` (Tailwind), `*.module.css` files (CSS Modules), `styled-components` or `@emotion` in dependencies, or `*.scss` files (SCSS).

**If detection is ambiguous:** List what was found and ask the user to confirm before generating code.

### 4. Map guide specs to project conventions

- Select the matching entry from `frameworkPatterns` and `stylingApproaches` in the guide.
- Adopt the project's existing naming conventions, directory structure, and import patterns.
- Apply all requirements from the guide's `accessibility` section (ARIA roles, keyboard navigation, focus management).

### 5. Implement the component

Generate the component files following `aiAgentInstructions.implementationSteps`. Adhere to these constraints:

- Use **only** the project's existing framework and styling — do not introduce new UI libraries.
- If vanilla CSS is used, define classes in a stylesheet (no inline styles).
- If React is used, split concerns into single-purpose hooks where appropriate.
- Include responsive behaviour from the guide's `responsiveBreakpoints` if present.
- Run through the guide's `testingChecklist` items and note any that need manual verification.

### 6. Report

Provide:
- The generated files and their locations.
- Which framework pattern and styling approach were used.
- Any assumptions made or ambiguities encountered.
- Testing checklist items the user should verify.
