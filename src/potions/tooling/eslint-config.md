---
layout: 'potion'
title: 'ESLint Config'
publicationDate: '2026-01-24'
excerpt: 'ESLint for UI projects: build on the lint setup the project has, flat config for ESLint 10, the framework''s accessibility rules, TypeScript and Prettier, and plugins checked against the installed ESLint.'
category: 'Tooling'
tags:
  - tooling
  - eslint
  - linting
  - config
  - code-quality
  - developer-experience
  - typescript
  - accessibility
  - formatting
agentManifest: 'potions/tooling/eslint-config.json'
path: 'potions/tooling/eslint-config'
promptSubject: 'linting with ESLint'
promptReuse: 'Build on our existing lint and formatting setup if there is one, change only what this task needs, and don''t remove or replace config files without asking.'
useWhen: 'a project needs ESLint set up, moved to flat config, or given its framework''s accessibility rules.'
specifies:
  - 'It extends the lint setup the project has, and asks before adding ESLint next to Biome or oxlint.'
  - 'Each plugin is checked against the installed ESLint before it''s added, and the user decides when one lags.'
  - 'The framework''s accessibility rules are on, including the Svelte compiler''s warnings, which its recommended config leaves out.'
example: 'In a Svelte project with TypeScript, the agent adds a flat config with typescript-eslint and eslint-plugin-svelte, turns on svelte/valid-compile, and the lint script reports an image without alt text.'
---

Setting up ESLint in a UI project means picking plugins that work with the installed ESLint, turning on the accessibility rules for the framework, and fitting in with TypeScript and Prettier, without replacing what the project already has. Plugins and versions change quickly, so this guide says how to check them, and dates its facts (October 2026).

## Start from what the project has

- An ESLint config is already there (`eslint.config.*`, or `.eslintrc*`): extend it, keep its rules, and change only what the task needs.
- Biome or oxlint already lints the project: adding ESLint duplicates it, so ask first. Both have accessibility rules of their own (Biome's `a11y` group, oxlint's jsx-a11y rules).
- No linter yet: propose ESLint with the packages below, and install nothing without the user's OK.

Implement only what the task needs. Add no dependency and run no command, such as an install, the migrator, or `--fix`, without the user's OK, and use the project's package manager. The project's own rules win; if one conflicts with an accessibility rule here, ask instead of choosing.

## Versions

- ESLint 10 (February 2026) is the only supported line: ESLint 9 reached its end of life on 2026-08-06. ESLint 10 needs Node 20.19, 22.13, or 24 and later.
- It reads flat config only (`eslint.config.*`): `.eslintrc*` and `.eslintignore` do nothing, and `/* eslint-env */` comments are errors. It looks for the config from each linted file's folder up, so a monorepo can have one per package.
- In a project on ESLint 9 or older, an upgrade is its own task; ask, since its plugins may hold it back (below).

## Plugins and the installed ESLint

- Before adding a plugin, check that its peer range includes the project's ESLint major (`npm view <plugin> peerDependencies`). npm refuses a plugin whose range doesn't (an ERESOLVE error); `--force` and `--legacy-peer-deps` install it anyway, so ask the user instead of using them.
- As of October 2026, eslint-plugin-jsx-a11y 6.10.2, eslint-plugin-react 7.37.5, and eslint-plugin-import 2.32.0 list ESLint 9 at most, so npm refuses them next to ESLint 10 (checked). Installed with `--legacy-peer-deps`, their recommended rules ran on ESLint 10.13 on a sample (checked), which isn't support. For React's accessibility rules the user chooses between that, the fork eslint-plugin-jsx-a11y-x (it supports ESLint 10, is at version 0.x, and renames its rules `jsx-a11y-x/…`), and waiting.
- These support ESLint 10 and installed cleanly (October 2026): eslint-plugin-react-hooks 7, eslint-plugin-vue 10, eslint-plugin-vuejs-accessibility 2.6, @vue/eslint-config-typescript 14, eslint-plugin-svelte 3, angular-eslint 22, typescript-eslint 8, eslint-config-prettier 10, and eslint-plugin-import-x, the fork for import rules, which are optional.

## The config file

- A new config is `eslint.config.mjs`, or `eslint.config.js` when `package.json` has `"type": "module"`. An ESM `eslint.config.js` in a package without it still loads on Node 22 and 24, but Node warns (`MODULE_TYPELESS_PACKAGE_JSON`) and parses it twice (checked). An existing CommonJS config stays CommonJS: `require()` and `module.exports`.
- `defineConfig` and `globalIgnores` come from `eslint/config`. `extends` takes each plugin's config whole, with its parser and settings, which spreading only its `rules` into another object leaves out.
- Ignore the build output (`dist/`, `build/`, `coverage/`); ESLint already ignores `node_modules` and `.git`. Browser code gets `globals.browser`, or `no-undef` flags `window` and `document`.
- Rules: the recommended configs, plus what the project already enforces. A long list of style rules is a separate decision for the team.

## Templates

Each template ran with ESLint 10.13 on a small sample project and reported exactly the problems planted in it (checked).

### Browser JavaScript

```js
// eslint.config.mjs: JavaScript that runs in the browser
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist/', 'build/', 'coverage/']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.browser },
  },
]);
```

### React

```js
// eslint.config.mjs: React with TypeScript. Without TypeScript, leave out typescript-eslint.
// eslint-plugin-jsx-a11y doesn't list ESLint 10 yet: see "Plugins and the installed ESLint".
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/', 'build/', 'coverage/']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: { globals: globals.browser },
  },
]);
```

Without TypeScript, leave out typescript-eslint; jsx-a11y's config turns on JSX parsing. The Rules of Hooks and the React Compiler's checks come from eslint-plugin-react-hooks' `configs.flat.recommended`; its `configs.recommended` is still the old format (checked).

### Vue

```js
// eslint.config.mjs: Vue 3 with TypeScript, as create-vue sets it up
import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility';

export default defineConfigWithVueTs(
  { files: ['**/*.{ts,mts,tsx,vue}'] },
  globalIgnores(['dist/', 'coverage/']),
  pluginVue.configs['flat/recommended'],
  pluginVueA11y.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    // By default it wants the control inside the label and linked by id; either one is enough
    rules: { 'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }] },
  },
);
```

As create-vue sets it up. Without TypeScript, use `defineConfig` from `eslint/config` with `js.configs.recommended`, the two plugin configs, and `globals.browser`. vuejs-accessibility's `label-has-for` wants a control both inside its label and linked by id unless told otherwise, which flags a correct `<label for>`; the template accepts either (checked).

### Svelte

```js
// eslint.config.mjs: Svelte 5 with TypeScript. Without TypeScript, leave out typescript-eslint
// and the last block.
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['build/', '.svelte-kit/', 'dist/']),
  js.configs.recommended,
  tseslint.configs.recommended,
  svelte.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    // The compiler's warnings, its accessibility checks among them; recommended leaves it out
    rules: { 'svelte/valid-compile': 'error' },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
]);
```

eslint-plugin-svelte 3's recommended config leaves out `svelte/valid-compile`, which brings the Svelte compiler's warnings, its accessibility checks among them, into ESLint; the template turns it on (checked).

### Angular

```js
// eslint.config.mjs: Angular, as `ng add angular-eslint` writes it, without the selector
// prefix rules it adds for the app's prefix
import js from '@eslint/js';
import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended, angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },
]);
```

`ng add angular-eslint` writes this config, plus selector prefix rules for the app's prefix, and adds the lint builder; ask before running it. Its template accessibility rules are included.

## TypeScript

- typescript-eslint 8 (October 2026) supports TypeScript below 6.1. npm refuses it next to TypeScript 7, which has been `latest` since July 2026 (checked), and Angular 22 needs TypeScript 6.0. In a project on TypeScript 7, ask the user: stay on TypeScript 6.0 for now, or wait for typescript-eslint's support.
- Rules that need type information, such as `no-floating-promises`, come with `tseslint.configs.recommendedTypeChecked` instead of `recommended`, and `languageOptions.parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname }` (checked). They make linting slower; `tseslint.configs.disableTypeChecked` turns them off for JavaScript files.
- TypeScript already checks that imports resolve, so with eslint-plugin-import-x, its `named`, `namespace`, `default`, and `no-unresolved` rules are off for TypeScript files.

## Prettier

Add `eslintConfigPrettier`, from `eslint-config-prettier/flat`, as the last entry: it turns off the rules that fight Prettier, such as `curly` and Vue's `max-attributes-per-line` (checked). Prettier runs on its own (`prettier --check .`), not through eslint-plugin-prettier, which Prettier's docs advise against.

## Moving from .eslintrc

On ESLint 10, an `.eslintrc*` config does nothing. ESLint's migrator, `npx @eslint/migrate-config .eslintrc.json`, writes an `eslint.config.mjs` and takes in `.eslintignore`, using `FlatCompat` from `@eslint/eslintrc` for configs it can't convert (checked). Ask before running it, install what it lists, then replace each `compat.extends(…)` with the plugin's flat config where it has one, and check that the old rules still report.

## Scripts, editors, and CI

- Scripts: `"lint": "eslint ."` and `"lint:fix": "eslint . --fix"`. Flat config finds the file types from `files`, so `--ext` is needed only for extensions no `files` pattern covers.
- Problems that already exist: list them for the user first. Fixing a whole codebase at once (`--fix`) is the user's call.
- VS Code: the ESLint extension finds the flat config, and `"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" }` fixes on save. It lints JavaScript, TypeScript, and Vue files without more settings; Svelte files need `"svelte"` in `eslint.validate`, which then lists every language to lint.
- CI: if the project has CI, run the lint script there with the project's Node version. Don't add a CI service it doesn't have.

## Troubleshooting

- A parsing error in `.vue` or `.svelte` files with TypeScript: the TypeScript parser isn't set for them (the templates set it).
- A rule that throws "context.getSourceCode is not a function" or similar: the plugin uses APIs ESLint 10 removed. Check its peer range; `fixupPluginRules()` from `@eslint/compat` can bridge it, after asking.
- Slow linting: rules with type information. Turn them off for JavaScript files, and lint only changed files before a commit.

## Acceptance checklist

- [ ] The project's lint setup was checked first: an existing ESLint config is extended and keeps its rules, and with Biome or oxlint in place the user was asked before ESLint was added
- [ ] Every package added was agreed with the user and added with the project's package manager
- [ ] Each plugin's peer range includes the installed ESLint major, or the user chose what to do about it
- [ ] The config is flat config, in eslint.config.mjs unless package.json has "type": "module" (then eslint.config.js)
- [ ] An .eslintrc config was moved with the migrator, keeps its rules, and uses the plugins' flat configs where they have them
- [ ] Browser globals are set, and build output is ignored
- [ ] The framework's accessibility rules are on: jsx-a11y for React, vuejs-accessibility for Vue, the Svelte compiler's warnings through svelte/valid-compile, and Angular's template accessibility config
- [ ] With TypeScript, typescript-eslint's configs are used, and rules that need type information have projectService
- [ ] With Prettier, eslint-config-prettier is the last config, and Prettier runs on its own
- [ ] The lint script runs on every file type the project has, without crashes or parsing errors
- [ ] Problems that already exist were listed for the user, and nothing was fixed in bulk without the user's OK
- [ ] The lint script runs in the project's existing CI, if it has one
- [ ] Editor settings, if any, use "source.fixAll.eslint": "explicit"
