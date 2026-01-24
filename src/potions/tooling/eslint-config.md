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
---

# ESLint Config Generator for UI Projects

A comprehensive ESLint configuration generator for modern UI projects. Supports React, Vue, Angular, and Svelte with accessibility linting, TypeScript support, and Prettier integration.

## CRITICAL: ESLint Version and Config Format

**Before implementing, you MUST detect the ESLint version to use the correct configuration format:**

### ESLint v9.0.0+ (Current)
- **Config file**: `eslint.config.js` (flat config format) - **REQUIRED**
- **Ignore patterns**: Integrated into `eslint.config.js` using `ignores` array
- **Legacy files**: `.eslintrc.*` and `.eslintignore` **will NOT work**
- **Format**: ES Module with `export default [...]`

### ESLint v8.x.x and Earlier (Legacy)
- **Config file**: `.eslintrc.js` (or `.eslintrc.json`)
- **Ignore patterns**: Separate `.eslintignore` file required
- **Format**: CommonJS with `module.exports = {...}`
- **Status**: Deprecated - consider upgrading to v9+

### How to Detect ESLint Version

```bash
# Check installed version
npx eslint --version

# Or check package.json
cat package.json | grep '"eslint"'
```

**Detection steps for AI agents:**
1. Check `package.json` devDependencies for eslint version
2. If no ESLint installed, install latest (will be v9+)
3. Generate config in the appropriate format based on detected version

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
- Support for multiple config formats (JS, JSON, YAML)
- Auto-detection of project framework and TypeScript usage

## What This Provides

When an AI agent implements this configuration generator, it will:

1. **Detect your project setup** - Framework, TypeScript, Prettier
2. **Generate appropriate ESLint config** - Tailored to your stack
3. **Provide installation commands** - For all required dependencies
4. **Create .eslintignore file** - With common ignore patterns
5. **Add npm scripts** - For easy linting (lint, lint:fix)
6. **Include VS Code integration** - For auto-fix on save

## Configuration Examples

### ESLint v9+ Flat Config (REQUIRED for v9+)

#### Vanilla JavaScript

**File**: `eslint.config.js`

```javascript
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';

export default [
  // Ignore patterns (replaces .eslintignore)
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
  
  // Main configuration
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

#### React with Flat Config

**File**: `eslint.config.js`

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

---

## Legacy Config Examples (ESLint v8 and Earlier)

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

## .eslintignore File

Create a `.eslintignore` file in your project root with common ignore patterns:

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

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
  }
}
```

For Vue:
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.vue,.ts",
    "lint:fix": "eslint . --ext .js,.vue,.ts --fix"
  }
}
```

For Svelte:
```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.svelte,.ts",
    "lint:fix": "eslint . --ext .js,.svelte,.ts --fix"
  }
}
```

## Prettier Integration

If you're using Prettier, add these dependencies to avoid conflicts:

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

Then add `'prettier'` as the **LAST** item in your `extends` array:

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
          node-version: '18'
      - run: npm ci
      - run: npm run lint
```

## Troubleshooting

### Wrong Config Format Error (ESLint v9+)

**Problem**: Error message: `ESLint couldn't find an eslint.config.(js|mjs|cjs) file`

**Solution**: You're using ESLint v9+ which requires flat config format. Delete all `.eslintrc.*` files and create `eslint.config.js` instead:

```bash
# Remove legacy files
rm .eslintrc.js .eslintrc.json .eslintignore

# Create flat config
touch eslint.config.js
```

### .eslintignore Deprecation Warning

**Problem**: Warning: `The ".eslintignore" file is no longer supported`

**Solution**: ESLint v9+ integrates ignore patterns into the config file:

```javascript
// eslint.config.js
export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  },
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

**Solution**: Add `eslint-config-prettier` as LAST item in extends array:

```javascript
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  'prettier' // MUST be last
]
```

## Usage Instructions

**STEP 0 (CRITICAL)**: Check ESLint version to determine correct config format
```bash
npx eslint --version
# v9.x.x = use eslint.config.js (flat config)
# v8.x.x or lower = use .eslintrc.js (legacy config)
```

**STEP 1**: Install ESLint and plugins using the appropriate command for your framework

**STEP 2**: Create config file in correct format based on version:
- **ESLint v9+**: Create `eslint.config.js` with flat config format (see examples above)
- **ESLint v8 or earlier**: Create `.eslintrc.js` with legacy format (see legacy examples above)

**STEP 3**: Handle ignore patterns:
- **ESLint v9+**: Add `ignores` array to `eslint.config.js`
- **ESLint v8 or earlier**: Create separate `.eslintignore` file

**STEP 4**: Add lint scripts to package.json

**STEP 5**: Run linting: `npm run lint`

**STEP 6**: Auto-fix issues: `npm run lint:fix`

**STEP 7** (Optional): Install ESLint VS Code extension for auto-fix on save

**STEP 8** (Optional): Add ESLint check to CI/CD pipeline

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
- JSX runtime support (`plugin:react/jsx-runtime`) removes need for `import React`
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

CRITICAL REQUIREMENTS:
1. FIRST: Detect installed ESLint version (check package.json or run npx eslint --version)
2. Use CORRECT config format:
   - ESLint v9+ = eslint.config.js (flat config, REQUIRED)
   - ESLint v8 or earlier = .eslintrc.js (legacy config)
3. Detect my project framework and TypeScript usage
4. Install all required ESLint dependencies
5. Generate configuration with:
   - Framework-specific rules
   - TypeScript support
   - Accessibility linting (jsx-a11y or vuejs-accessibility)
   - Import/export organization
   - Best practices rules
6. Handle ignore patterns correctly for detected version
7. Add npm scripts for linting (lint, lint:fix)
8. Include Prettier integration if Prettier is detected
9. Provide VS Code settings for auto-fix on save

Reference: UI Potion ESLint Config Generator
```

## Additional Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [eslint-plugin-vue](https://eslint.vuejs.org/)
- [eslint-plugin-vuejs-accessibility](https://github.com/vue-a11y/eslint-plugin-vuejs-accessibility)
- [@typescript-eslint](https://typescript-eslint.io/)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)

---

## Summary for AI Agents

This ESLint configuration generator provides production-ready linting setups for React, Vue, Angular, Svelte, and vanilla JavaScript projects. Key implementation points:

**CRITICAL FIRST STEP**: Always detect ESLint version before generating config
- ESLint v9.0.0+ requires flat config (`eslint.config.js`) - **NOT OPTIONAL**
- ESLint v8.x.x and earlier use legacy config (`.eslintrc.js`)
- Check version with `npx eslint --version` or examine `package.json`

**Implementation Steps**:
1. **Version Detection**: Check ESLint version to determine config format
2. **Framework Detection**: Examine package.json for framework and TypeScript
3. **Config Generation**: Use appropriate format (flat or legacy) for detected version
4. **Ignore Patterns**: Integrate into config (v9+) or separate file (v8 or earlier)
5. **Dependencies**: Provide installation commands for all required packages
6. **Accessibility**: Include a11y linting rules (jsx-a11y, vuejs-accessibility)
7. **Best Practices**: Include code quality, import organization, and TypeScript rules
8. **Integration**: Provide VS Code settings and CI/CD workflow examples
9. **Documentation**: Note which ESLint version and format was used

**Config Format Rules**:
- **v9+**: Must use `eslint.config.js` with `export default [...]` format
- **v9+**: Ignores are array objects in config, not separate `.eslintignore` file
- **v8 or earlier**: Use `.eslintrc.js` with `module.exports = {}` format
- **v8 or earlier**: Require separate `.eslintignore` file

Generate clean, well-organized ESLint configurations that match both the project's framework AND the installed ESLint version. Prioritize code quality, accessibility, and developer experience.
