---
layout: 'potion'
title: 'ESLint Config Generator for UI Projects'
publicationDate: '2026-01-24'
excerpt: 'A comprehensive ESLint configuration generator supporting React, Vue, Angular, and Svelte with accessibility linting, TypeScript support, and Prettier integration.'
category: 'Tooling'
tags:
  - eslint
  - linting
  - config
  - code-quality
  - developer-experience
  - tooling
  - typescript
  - accessibility
  - formatting
agentManifest: 'potions/tooling/eslint-config.json'
path: 'potions/tooling/eslint-config'
---

# ESLint Config Generator for UI Projects

A comprehensive ESLint configuration generator for modern UI projects. Supports React, Vue, Angular, and Svelte with accessibility linting, TypeScript support, and Prettier integration.

## Config Format Selection

ESLint has two configuration formats. The right one to use is determined by the **installed ESLint version**, not by a hardcoded rule in this guide. Before generating any file, detect the format the project needs.

### Flat Config (current default)

- **Config file**: `eslint.config.js`, `eslint.config.mjs`, or `eslint.config.cjs`
- **Module system** (this is the part that trips agents up):
  - `eslint.config.js` follows the host project's module system — ES Module only when `package.json` declares `"type": "module"`, otherwise CommonJS
  - `eslint.config.mjs` is always ES Module (`export default [...]`)
  - `eslint.config.cjs` is always CommonJS (`module.exports = [...]`)
- **Ignore patterns**: integrated into the config via an `ignores` array
- **Status**: the standard, forward-compatible format. Used by current ESLint releases and all future versions.

### Legacy Config (older projects)

- **Config file**: `.eslintrc.js` / `.eslintrc.cjs` / `.eslintrc.json` / `.eslintrc.yml`
- **Format**: CommonJS with `module.exports = {...}` (or JSON / YAML equivalents)
- **Ignore patterns**: separate `.eslintignore` file
- **Status**: deprecated. ESLint v9.x no longer auto-searches for eslintrc but can still load it via `ESLINT_USE_FLAT_CONFIG=false`. **ESLint v10+ removed both the auto-search and the `ESLINT_USE_FLAT_CONFIG` env var** — eslintrc files and `.eslintignore` are no longer honored at all. Treat this format as usable only when the project is pinned to an ESLint release that still supports it.

### How to Detect the Required Format

Do not hardcode a version number. Instead:

1. Read the installed ESLint version from the project: `npx eslint --version` or inspect `package.json`.
2. Consult the ESLint documentation **for that major version** — the docs site has a version switcher, and URLs follow `https://eslint.org/docs/v{N}/use/configure/`. Reading `/docs/latest/` to reason about an older installed release can give the wrong answer.
3. If ESLint is not installed yet, install the latest version and use flat config.
4. If migrating an existing project, prefer flat config unless pinned dependencies require otherwise.

### How to Pick the Module System for `eslint.config.js`

Before writing the file, read `package.json`:

- `"type": "module"` present → emit ES Module (`import … from …; export default [...]`)
- no `type` field, or `"type": "commonjs"` → emit CommonJS (`const … = require(…); module.exports = [...]`)
- If you need to force one system regardless of `package.json`, use `eslint.config.mjs` (ESM) or `eslint.config.cjs` (CJS)

**Rule of thumb**: default to flat config for all new work. Generate legacy config only when the project is locked to an older ESLint release that does not support flat config, or when the user has intentionally opted into eslintrc via `ESLINT_USE_FLAT_CONFIG=false`.

---

## Overview

This tooling potion provides ESLint configurations tailored to different JavaScript frameworks and TypeScript usage. It includes accessibility linting rules, import/export management, and best practices for code quality.

## Supported Frameworks

- **React** (with React Hooks and JSX-A11y)
- **Vue 3** (with Vue.js Accessibility)
- **Angular** (with Angular ESLint)
- **Svelte**
- **Vanilla JavaScript**

## Key Features

- Framework-specific ESLint configurations
- TypeScript support with `@typescript-eslint`
- Accessibility linting rules (jsx-a11y, vuejs-accessibility)
- Prettier integration to avoid conflicts
- Import/export linting with eslint-plugin-import
- Best practices and code quality rules
- Configurable rule severity levels
- Format detection: flat config (default) or legacy config
- Auto-detection of project framework and TypeScript usage

## What This Provides

When an AI agent implements this configuration generator, it will:

1. **Detect the project setup** — framework, TypeScript, Prettier, installed ESLint version
2. **Choose the correct config format** — flat or legacy, based on what the installed ESLint supports
3. **Generate the config file** — in the appropriate format
4. **Provide installation commands** — for all required dependencies
5. **Handle ignore patterns** — inline (flat) or separate `.eslintignore` (legacy)
6. **Add npm scripts** — `lint` and `lint:fix`
7. **Include editor integration** — VS Code auto-fix on save

## Configuration Examples

### Flat Config (default — use unless the project pins an older ESLint)

The examples below show the ES Module form. Use this shape directly in `eslint.config.mjs`, or in `eslint.config.js` when `package.json` has `"type": "module"`. For a CommonJS project (no `"type": "module"` in `package.json`, or using `eslint.config.cjs`), convert the imports/exports as shown in the **CommonJS variant** note below each example.

#### Vanilla JavaScript

**File**: `eslint.config.js` (ESM form — `package.json` has `"type": "module"`, or file is `eslint.config.mjs`)

```javascript
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.cache/',
      '*.min.js',
      '*.bundle.js',
      'coverage/',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        setTimeout: 'readonly',
        fetch: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
```

**CommonJS variant** (no `"type": "module"` in `package.json`, or using `eslint.config.cjs`) — replace the imports and export:

```javascript
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  // ...same config objects as above
];
```

#### React with Flat Config

**File**: `eslint.config.js` (ESM form — `package.json` has `"type": "module"`, or file is `eslint.config.mjs`)

```javascript
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '.next/', 'coverage/'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/alt-text': 'error',
      'no-console': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];
```

**CommonJS variant** — replace the imports and export with `require(...)` / `module.exports = [...]`, keeping the config objects identical.

> For framework-specific plugin APIs (Vue, Angular, Svelte) in flat config, consult the plugin's current docs — their flat-config exports evolve across plugin releases and the example above shows the shape to follow.

---

## Legacy Config Examples (for projects on older ESLint)

Use these only when the project pins an ESLint release that does not support flat config.

### React with TypeScript

**Installation:**
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-import eslint-import-resolver-typescript
```

**Configuration (.eslintrc.js):**
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', 'jsx-a11y', '@typescript-eslint', 'import'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/alt-text': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
```

### Vue 3 with TypeScript

**Installation:**
```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-vue vue-eslint-parser eslint-plugin-vuejs-accessibility eslint-plugin-import
```

**Configuration (.eslintrc.js):**
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:vuejs-accessibility/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
  ],
  parser: 'vue-eslint-parser',
  plugins: ['vue', 'vuejs-accessibility', '@typescript-eslint', 'import'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.vue', '.ts'],
      },
    },
  },
  rules: {
    'vue/multi-word-component-names': 'warn',
    'vue/no-unused-vars': 'warn',
    'vuejs-accessibility/alt-text': 'error',
    'vuejs-accessibility/form-control-has-label': 'error',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
```

### Svelte

**Installation:**
```bash
npm install --save-dev eslint eslint-plugin-svelte svelte-eslint-parser eslint-plugin-import
```

**Configuration (.eslintrc.js):**
```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    'plugin:import/recommended',
  ],
  parser: 'svelte-eslint-parser',
  plugins: ['svelte', 'import'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.svelte'],
      },
    },
  },
  rules: {
    'svelte/no-at-html-tags': 'error',
    'svelte/valid-compile': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
```

## Ignore Patterns

### Flat Config

Add an `ignores` array as the first config object in `eslint.config.js`.

ESM form (file is `.mjs`, or `package.json` has `"type": "module"`):

```javascript
export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  },
  // ... rest of config
];
```

CommonJS form (file is `.cjs`, or no `"type": "module"` in `package.json`):

```javascript
module.exports = [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  },
  // ... rest of config
];
```

### Legacy Config

Create a `.eslintignore` file in your project root:

```
node_modules/
dist/
build/
.next/
.nuxt/
coverage/
.cache/
*.min.js
*.bundle.js
public/
.env
.env.local
.DS_Store
```

## npm Scripts

Add these scripts to your `package.json`. With flat config, ESLint infers file extensions from `files` globs in the config, so `--ext` is typically not needed. With legacy config, pass `--ext` explicitly.

**Flat config (default):**
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**Legacy config:**
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
  }
}
```

Adapt the extensions list (`.vue`, `.svelte`, etc.) to the project framework when using legacy config.

## Prettier Integration

If you're using Prettier, add these dependencies to avoid conflicts:

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

**Flat config**: import (ESM) or `require` (CommonJS) `eslint-config-prettier` and spread it as the **last** entry in the exported config array.

**Legacy config**: add `'prettier'` as the **last** item in your `extends` array:

```javascript
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  // ... other configs
  'prettier', // MUST be last
],
```

## Accessibility Rules

### React (jsx-a11y)

The configuration includes essential accessibility rules:

- `jsx-a11y/alt-text` - Enforce alt text on images
- `jsx-a11y/aria-props` - Validate ARIA props
- `jsx-a11y/aria-proptypes` - Validate ARIA prop types
- `jsx-a11y/aria-unsupported-elements` - Disallow ARIA on unsupported elements
- `jsx-a11y/role-has-required-aria-props` - Enforce required ARIA props for roles
- `jsx-a11y/role-supports-aria-props` - Enforce supported ARIA props for roles

### Vue (vuejs-accessibility)

- `vuejs-accessibility/alt-text` - Enforce alt text on images
- `vuejs-accessibility/anchor-has-content` - Enforce anchor elements have content
- `vuejs-accessibility/aria-props` - Validate ARIA props
- `vuejs-accessibility/click-events-have-key-events` - Enforce keyboard events with click
- `vuejs-accessibility/form-control-has-label` - Enforce form controls have labels
- `vuejs-accessibility/heading-has-content` - Enforce headings have content
- `vuejs-accessibility/label-has-for` - Enforce labels have associated controls

## TypeScript Rules

When TypeScript is detected, the configuration includes:

- `@typescript-eslint/no-unused-vars` - Warn on unused variables (with `_` prefix exception)
- `@typescript-eslint/no-explicit-any` - Warn on explicit any types
- `@typescript-eslint/no-floating-promises` - Error on unhandled promises
- `@typescript-eslint/await-thenable` - Enforce await on promises
- `@typescript-eslint/no-misused-promises` - Prevent promise misuse

## Import/Export Rules

The configuration enforces organized imports:

```javascript
'import/order': [
  'warn',
  {
    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
],
```

This ensures:
- Imports are grouped by type (builtin, external, internal, etc.)
- Blank lines separate import groups
- Imports are alphabetically sorted

Example result:
```javascript
// Built-in modules
import fs from 'fs';
import path from 'path';

// External dependencies
import React from 'react';
import { useEffect, useState } from 'react';

// Internal modules
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

// Relative imports
import { helper } from './utils';
import styles from './styles.module.css';
```

## Best Practices Rules

The configuration includes code quality rules:

- `no-unused-vars` - Warn on unused variables
- `no-console` - Warn on console statements
- `no-debugger` - Error on debugger statements
- `prefer-const` - Prefer const over let
- `no-var` - Disallow var (use let/const)
- `eqeqeq` - Enforce strict equality (=== instead of ==)
- `curly` - Enforce curly braces for all control statements

## VS Code Integration

For automatic linting and fixing in VS Code:

1. Install the ESLint extension: `dbaeumer.vscode-eslint`

2. Add to your `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "svelte"
  ]
}
```

This will automatically fix ESLint issues on file save.

## CI/CD Integration

Add ESLint to your CI/CD pipeline to catch issues early.

### GitHub Actions

Create `.github/workflows/lint.yml`:

```yaml
name: Lint

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
```

## Troubleshooting

### "ESLint couldn't find an eslint.config.(js|mjs|cjs) file"

**Cause**: The installed ESLint no longer auto-searches for eslintrc files and expected a flat config, but only legacy `.eslintrc.*` files exist.

**Two valid fixes**, depending on intent:

1. **Migrate to flat config** (recommended). Create `eslint.config.js` (or `.mjs` / `.cjs`), port rules over, then remove the legacy files:

   ```bash
   rm .eslintrc.js .eslintrc.cjs .eslintrc.json .eslintrc.yml .eslintignore
   touch eslint.config.js
   ```

   Only delete files you've actually replaced — check first, don't run this blindly.

2. **Keep legacy config for now — only works on ESLint v9.x**. Set `ESLINT_USE_FLAT_CONFIG=false` in the environment (or in the lint script) and leave the `.eslintrc.*` files in place. This escape hatch was removed in ESLint v10.0.0; on v10+ both the env var and eslintrc auto-loading are gone. Check `npx eslint --version` before recommending this — if the installed ESLint is v10 or newer, the only fix is option 1.

### ".eslintignore" deprecation warning

**Cause**: The installed ESLint no longer honors `.eslintignore` under flat config.

**Solution**: Move ignore patterns into the flat config file (`eslint.config.js` / `.mjs` / `.cjs`). Use `export default` for ESM (`.mjs`, or `.js` when `package.json` has `"type": "module"`) and `module.exports` for CommonJS (`.cjs`, or `.js` otherwise):

```javascript
// ESM
export default [
  { ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'] },
  // ... rest of config
];

// CommonJS
module.exports = [
  { ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'] },
  // ... rest of config
];
```

### Parser Conflicts

**Problem**: Multiple parsers conflicting (e.g., `@typescript-eslint/parser` and `vue-eslint-parser`)

**Solution**: Use `vue-eslint-parser` as the main parser and specify `@typescript-eslint/parser` in `parserOptions`:

```javascript
parser: 'vue-eslint-parser',
parserOptions: {
  parser: '@typescript-eslint/parser',
  project: './tsconfig.json'
}
```

### Import Resolution Issues

**Problem**: ESLint can't resolve imports (`import/no-unresolved` errors)

**Solution**: Configure import resolver in settings section:

```javascript
settings: {
  'import/resolver': {
    typescript: {},
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  }
}
```

### Prettier Conflicts

**Problem**: ESLint formatting rules conflict with Prettier

**Solution**: Add `eslint-config-prettier` as the LAST item in the config chain (last in `extends` for legacy, last in the exported array for flat).

## Usage Instructions

**STEP 0**: Determine the required config format and module system
- Run `npx eslint --version` or read `package.json`.
- Check the ESLint docs for that major version (`https://eslint.org/docs/v{N}/use/configure/`) to confirm which formats it supports. Do not rely on `/docs/latest/` when the installed ESLint is older.
- Default to flat config for new projects and when the version supports it.
- Read `package.json` `type` to decide the module system for `eslint.config.js` (`"module"` → ESM, otherwise CJS). Use `.mjs` / `.cjs` to force a specific system.

**STEP 1**: Install ESLint and plugins using the appropriate command for your framework.

**STEP 2**: Create the config file in the selected format:
- Flat config → `eslint.config.js` (ESM or CJS depending on `package.json` `type`), or `eslint.config.mjs` / `.cjs` to force a system
- Legacy config → `.eslintrc.js` / `.eslintrc.cjs` with `module.exports = {...}`

**STEP 3**: Handle ignore patterns:
- Flat config → `ignores` array inside `eslint.config.js`
- Legacy config → separate `.eslintignore` file

**STEP 4**: Add lint scripts to `package.json`.

**STEP 5**: Run linting: `npm run lint`.

**STEP 6**: Auto-fix issues: `npm run lint:fix`.

**STEP 7** (optional): Install the ESLint VS Code extension for auto-fix on save.

**STEP 8** (optional): Add ESLint to the CI/CD pipeline.

## Common Rule Severity Levels

- **error** (2) - Violation will cause build to fail
- **warn** (1) - Violation will show warning but won't fail build
- **off** (0) - Rule is disabled

You can customize any rule in your configuration:

```javascript
rules: {
  'no-console': 'warn',           // Warn on console.log
  'no-debugger': 'error',         // Error on debugger statements
  'react/prop-types': 'off',      // Disable prop-types rule
  '@typescript-eslint/no-explicit-any': 'warn', // Warn on any type
}
```

## Framework-Specific Notes

### React
- JSX runtime support removes the need for `import React`
- React Hooks rules enforce hooks best practices
- JSX-A11y provides accessibility linting

### Vue
- Vue 3 recommended rules included
- Vue.js Accessibility plugin for a11y checking
- Single File Component (SFC) support

### Angular
- Angular ESLint replaces deprecated TSLint
- Component and directive selector rules included
- Template linting support

### Svelte
- Svelte-specific compilation checks
- HTML validation in Svelte templates
- Reactive statement linting

## AI Agent Implementation Prompt

Use this template when asking an AI agent to set up ESLint:

```
Set up ESLint for my [Framework] project with TypeScript support and accessibility linting.

REQUIREMENTS:
1. Detect the installed ESLint version (check package.json or run npx eslint --version).
2. Choose the config format. Default to flat config. Legacy (.eslintrc.*) is only viable if the installed version still honors it — ESLint v10+ removed eslintrc and the ESLINT_USE_FLAT_CONFIG=false escape hatch entirely, so on v10+ flat config is the only option. For uncertainty, consult the ESLint docs for that specific major at https://eslint.org/docs/v{N}/use/configure/ (not /docs/latest/).
3. For flat config, decide the module system:
   - Read package.json "type". If "module", emit ESM (import / export default). Otherwise emit CommonJS (require / module.exports).
   - Or use eslint.config.mjs (always ESM) / eslint.config.cjs (always CJS) to bypass package.json.
   - Do NOT emit ESM into eslint.config.js of a CommonJS project — it throws "Cannot use import statement outside a module".
4. Detect my project framework and TypeScript usage.
5. Install all required ESLint dependencies.
6. Generate configuration with:
   - Framework-specific rules
   - TypeScript support
   - Accessibility linting (jsx-a11y or vuejs-accessibility)
   - Import/export organization
   - Best practices rules
7. Handle ignore patterns using the approach appropriate to the selected format.
8. Add npm scripts for linting (lint, lint:fix).
9. Include Prettier integration if Prettier is detected.
10. Provide VS Code settings for auto-fix on save.

Reference: UI Potion ESLint Config Generator
```

## Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [ESLint Configuration Guide](https://eslint.org/docs/latest/use/configure/)
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [eslint-plugin-vue](https://eslint.vuejs.org/)
- [eslint-plugin-vuejs-accessibility](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility)
- [@typescript-eslint](https://typescript-eslint.io/)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)

---

## Summary for AI Agents

This ESLint configuration generator provides production-ready linting setups for React, Vue, Angular, Svelte, and vanilla JavaScript projects.

**Key rules**:
- Do not hardcode ESLint version numbers in the decision logic. Detect the installed version and consult the docs for that specific major (`https://eslint.org/docs/v{N}/use/configure/`) — not `/docs/latest/`.
- Default to flat config. Legacy (`.eslintrc.*`) is only valid when the installed ESLint still honors it. ESLint v10+ removed eslintrc support and the `ESLINT_USE_FLAT_CONFIG=false` escape hatch — on v10+ flat config is mandatory.
- For `eslint.config.js`, the module system follows `package.json` `type`: `"module"` → ESM, otherwise CommonJS. Use `.mjs` / `.cjs` to force one. Do NOT emit ESM into an `eslint.config.js` of a CommonJS project.

**Implementation steps**:
1. **Version detection** — read `package.json` / run `npx eslint --version`.
2. **Format selection** — flat config (`eslint.config.js` / `.mjs` / `.cjs`) unless the installed version is old enough to only support `.eslintrc.*`.
3. **Module system selection (flat config only)** — read `package.json` `type` to pick ESM vs CommonJS for `eslint.config.js`, or use `.mjs` / `.cjs` for an unambiguous choice.
4. **Framework detection** — examine `package.json` for React, Vue, Angular, or Svelte.
5. **TypeScript detection** — check for `typescript` dependency and `tsconfig.json`.
6. **Config generation** — use the selected format and module system with framework plugins, TS parser, a11y plugins, and import ordering.
7. **Ignore patterns** — `ignores` array (flat) or `.eslintignore` (legacy, only on ESLint releases that still honor it).
8. **Dependencies** — provide install commands for the selected framework and format.
9. **Integration** — npm scripts, VS Code settings, CI/CD workflow.

Generate clean, well-organized ESLint configurations that match both the project's framework and the format the installed ESLint version supports. Prioritize code quality, accessibility, and developer experience.
