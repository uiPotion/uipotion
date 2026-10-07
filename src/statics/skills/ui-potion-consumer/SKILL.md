---
name: ui-potion-consumer
description: Discover and apply UI Potion component and layout guides, load JSON specs, and adapt them to the project's framework and styling system. Use when the user requests a UI component, layout, or feature, or provides a UI Potion URL.
license: MIT
metadata:
  author: ui-potion
  version: "1.1"
compatibility: Requires network access to fetch guides from https://uipotion.com.
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
1. If the user gave a guide URL, or a category and potion ID, fetch that guide directly: `https://uipotion.com/potions/[category]/[id].json`. Skip the manifest and the index.
2. Otherwise, find the guide in the potions index (`https://uipotion.com/potions-index.json`) by matching the request against names, tags, and excerpts. The manifest (`https://uipotion.com/uipotion-manifest.json`) is only needed for platform metadata.
3. Make sure you have the full guide. If your fetch tool returned a summary or a truncated file, read it another way you're allowed to use (for example downloading the file, or the Markdown version at the same path with `.md`), and ask the user if it's still incomplete.
4. Read `aiAgentInstructions` and `outputConstraints` (if present)
5. Detect the project's framework and styling system from the repo
6. Map the guide's specs to the project's conventions and tokens
7. Implement using only the detected framework and styling approach

## Constraints
- Use only the project's existing framework and styling system
- Do not introduce new UI libraries or styling approaches
- If vanilla CSS is used, define classes in a stylesheet (no inline styles)
- Follow accessibility requirements specified by the guide

## Outputs
- A component implementation adapted to the project
- Notes about any uncertain detection or assumptions
