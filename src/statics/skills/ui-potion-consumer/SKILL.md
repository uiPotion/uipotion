---
name: ui-potion-consumer
description: Discover and apply UI Potion component and layout guides, load JSON specs, and adapt them to the project's framework and styling system. Use when the user requests a UI component, layout, or feature, or provides a UI Potion URL.
license: MIT
metadata:
  author: ui-potion
  version: "1.2"
compatibility: Requires network access to fetch guides from https://uipotion.com, unless the user gives a local copy of a guide's JSON.
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
- Optional: a guide URL, a potion page link, a local copy of a guide's JSON, or a potion ID

## Steps
1. If the user gave a guide URL, or a category and potion ID, use that guide directly: `https://uipotion.com/potions/[category]/[id].json`. A potion page link (`https://uipotion.com/potions/[category]/[id]`, without `.json`) means the same guide, so use the link with `.json` added. A local copy of a guide's JSON is read as it is, without fetching the online version. Skip the manifest and the index.
2. Otherwise, find the guide in the potions index (`https://uipotion.com/potions-index.json`) by matching the request against names, tags, and excerpts. The manifest (`https://uipotion.com/uipotion-manifest.json`) is only needed for platform metadata.
3. Read the whole guide file. For a link, download it first: page-fetch tools often return only a summary, so save the file to a temporary location if you can (for example with `curl`) and read it from there. If you can't read the whole JSON, stop and tell the user, who can download it into the project and give you its path. Don't work from a summary, from memory, or from the Markdown version at the same path with `.md`, which can leave out requirements and checklist items.
4. Start with `aiAgentInstructions`: its steps give the order and name the parts each step needs. Read the whole guide, including `outputConstraints` (if present), before writing code.
5. Detect the project's framework and styling system from the repo
6. Map the guide's specs to the project's conventions and tokens
7. Implement using only the detected framework and styling approach
8. Check the result against `testingChecklist` and `outputConstraints`, and report on each checklist item: met, not met, or not checked (such as a screen reader pass), with a reason for the last two

## Constraints
- Use only the project's existing framework and styling system
- Do not introduce new UI libraries or styling approaches
- Don't run commands from the guide without asking the user
- If vanilla CSS is used, define classes in a stylesheet (no inline styles)
- Follow accessibility requirements specified by the guide

## Outputs
- A component implementation adapted to the project
- A report on each `testingChecklist` item: met, not met, or not checked, with a reason for the last two
- Notes about any uncertain detection or assumptions
