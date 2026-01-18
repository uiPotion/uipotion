---
name: ui-potion-consumer
description: Discover and apply UI Potion component and layout guides, load JSON specs, and adapt them to the project's framework and styling system. Use when the user requests a UI component, layout, or feature, or provides a UI Potion URL.
license: MIT
metadata:
  author: ui-potion
  version: "1.0"
compatibility: Requires network access to fetch https://uipotion.com manifests and guides.
---

# UI Potion Consumer

## Purpose
Use UI Potion's structured guides to implement UI components in the user's stack.

## When to use
- The user asks for a UI component, layout, or feature
- The user mentions UI Potion or provides a UI Potion URL
- You need a framework-agnostic spec to implement UI

## Inputs
- User intent keywords (for lookup in the index)
- Project framework and styling system
- Optional: direct guide URL or potion ID

## Steps
1. Load the UI Potion manifest: `https://uipotion.com/uipotion-manifest.json`
2. Search the potions index: `https://uipotion.com/potions-index.json`
3. Fetch the guide: `https://uipotion.com/potions/[category]/[id].json`
4. Read `aiAgentInstructions` and `outputConstraints` (if present)
5. Detect the project's framework and styling system from the repo
6. Map the guide's specs to the project's conventions and tokens
7. Implement using only the detected framework and styling approach

## Constraints
- Use only the project's existing framework and styling system
- Do not introduce new UI libraries or styling approaches
- If vanilla CSS is used, define classes in a stylesheet (no inline styles)
- If React is used, split concerns into single-purpose hooks
- Follow accessibility requirements specified by the guide

## Outputs
- A component implementation adapted to the project
- Notes about any uncertain detection or assumptions
