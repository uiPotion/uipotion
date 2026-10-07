---
name: ui-potion-discovery
description: Identify the best UI Potion guide for a requested component, layout, or feature by searching the index and returning relevant JSON guide URLs and human-readable pages. Use when the user is unsure which potion to use or asks for recommendations.
license: MIT
metadata:
  author: ui-potion
  version: "1.1"
compatibility: Requires network access to fetch https://uipotion.com/potions-index.json, except when working inside the UI Potion repository.
---

# UI Potion Discovery

## Purpose
Help agents find the most relevant UI Potion guides for a user request.

## When to use
- The user asks for a UI component/layout/feature but does not name a specific potion
- The user asks for recommendations or alternatives
- You need to map intent to available UI Potion guides

## Inputs
- User intent keywords (e.g., "dashboard", "navbar", "modal")
- Optional category preference (layouts, components, features, patterns, tooling)

## Steps
1. Load the potions index. Inside the UI Potion repository itself, use the local file at `src/statics/potions-index.json`; in any other project, load `https://uipotion.com/potions-index.json`.
2. Filter by category and tags that match the intent
3. Rank by tag overlap and relevance to the request
4. Return the top 1-3 matches with both URLs

## Output format
- Name
- Category
- JSON guide URL
- Human-readable page URL

## Constraints
- Prefer JSON guide URLs for implementation
- Provide the human page for review and context
- If no strong match exists, say so and propose the closest option
