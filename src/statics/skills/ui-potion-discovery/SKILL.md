---
name: ui-potion-discovery
description: "Search the UI Potion index to find the best component, layout, or feature guide for a user request, returning ranked matches with JSON guide URLs and human-readable page links. Use when the user asks which UI Potion to use, wants component recommendations, says 'find a guide', or names a UI element like button, modal, navbar, or dashboard."
license: MIT
metadata:
  author: ui-potion
  version: "1.0"
compatibility: Requires network access to fetch https://uipotion.com indexes when local files are unavailable.
---

# UI Potion Discovery

Search the UI Potion catalog and return the most relevant guides for a user's UI request.

## Workflow

### 1. Load the potions index

Prefer the local copy first, then fall back to the remote URL:

1. Check for `src/statics/potions-index.json` in the repo.
2. If not found, fetch `https://uipotion.com/potions-index.json`.

**If both fail:** Tell the user the index is unavailable and suggest visiting `https://uipotion.com` directly to browse guides.

The index contains an array of entries:

```json
{
  "id": "navbar",
  "name": "Navigation Bar",
  "category": "components",
  "tags": ["components", "navigation", "header"],
  "excerpt": "Responsive navigation bar with mobile menu...",
  "agentGuideUrl": "https://uipotion.com/potions/components/navbar.json",
  "webUrl": "https://uipotion.com/potions/components/navbar.html"
}
```

### 2. Filter and rank matches

Given the user's intent keywords (e.g. "dashboard sidebar"):

1. **Category filter:** If the user specifies a category (layouts, components, features, patterns, tooling), narrow to that subset.
2. **Keyword match:** Score each entry by counting matches against `name`, `tags`, `excerpt`, and `id`. Exact `id` match ranks highest.
3. **Tag overlap:** For broader queries, count how many of the user's keywords appear in the entry's `tags` array.

Select the top 1–3 results by combined score.

**Example:** User asks "I need a modal dialog"

- `id: "modal"` matches keyword "modal" exactly → top result
- `id: "dialog-drawer"` matches "dialog" in name/tags → secondary result

### 3. Return results

For each match, present:

- **Name** — the potion's display name
- **Category** — layouts, components, features, patterns, or tooling
- **JSON guide URL** (`agentGuideUrl`) — for agent consumption and implementation
- **Web page URL** (`webUrl`) — for the user to review specs and examples

Prefer the JSON guide URL when the next step is implementation. Provide the web page URL so the user can review details and examples visually.

### 4. Handle no matches

If no entry scores well against the user's query:

- State that no strong match was found.
- Propose the closest option with an explanation of why it partially fits.
- Suggest the user browse the full catalog at `https://uipotion.com` or refine their request.
