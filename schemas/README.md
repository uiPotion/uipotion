# UI Potion Schemas

This bundle contains **connected JSON Schema files** (Draft 2020-12) for validating UI Potion JSON guides.

## Structure

- `potion.base.schema.json` — base schema shared by all categories
- `contracts/`
  - `accessibility.contract.schema.json` — WCAG/ARIA/keyboard/focus contract (reused across categories)
  - `state.contract.schema.json` — reusable state definition contract
  - `interactions.contract.schema.json` — reusable interaction rule contract
- `categories/`
  - `layouts.schema.json`
  - `components.schema.json`
  - `features.schema.json`
  - `patterns.schema.json`
  - `tooling.schema.json`

## Validation approach

1. Read `category` from a potion.
2. Validate with the matching schema in `categories/`.
3. Those schemas reference:
   - the base schema (`potion.base.schema.json`)
   - and contracts (`contracts/*`) via `$ref` to their `$id` URLs.

## Notes

- The dashboard layout potion you prepared (v1.0.0) is compatible with `categories/layouts.schema.json`.
- The schemas are intentionally strict on required top-level sections, but flexible on internal details so you can evolve potions without breaking validation.

Generated: 2026-01-11
