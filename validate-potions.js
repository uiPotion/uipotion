#!/usr/bin/env node
/**
 * Validate all UI Potion guides: the JSON files against their category schemas, the potions
 * index against the guides, and the AGENTS.md authoring rules, including each guide's Markdown
 * Run: node validate-potions.js
 * Or add to package.json scripts: "validate": "node validate-potions.js"
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

// Configuration
const POTIONS_DIR = 'src/statics/potions';
const MARKDOWN_DIR = 'src/potions';
const SCHEMAS_DIR = 'src/statics/schema';
const POTIONS_INDEX_FILE = 'src/statics/potions-index.json';
const MANIFEST_FILE = 'src/statics/uipotion-manifest.json';
const SITE_URL = 'https://uipotion.com';

// Authoring rules from AGENTS.md that these potions broke when the checks were added (2026-10-11).
// Each line is one finding exactly as the validator prints it, so a potion with a known break
// still fails on any new break, including another break of the same rule. The lines print as
// warnings until each potion's pass fixes them and deletes them here. A line that no longer
// matches a finding fails validation. Never add a line: fix a new break instead.
const KNOWN_RULE_BREAKS = [
  'components/data-table [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'components/data-table [urls]: meta.webUrl is "https://uipotion.com/potions/components/data-table.html", expected https://uipotion.com/potions/components/data-table',
  'components/dropdown-select [title-length]: the title has 74 characters (at most 60)',
  'components/dropdown-select [name-mismatch]: Markdown title "Dropdown/Select Component - Accessible Select with Search and Multi-Select", JSON name "Dropdown/Select Component (Accessible) with Search and Multi-Select", index name "Dropdown/Select Component (Accessible) with Search and Multi-Select"',
  'components/dropdown-select [text-diagram]: 78 box-drawing characters (text diagrams) in the Markdown',
  'components/dropdown-select [urls]: meta.webUrl is "https://uipotion.com/potions/components/dropdown-select.html", expected https://uipotion.com/potions/components/dropdown-select',
  'components/file-upload [urls]: meta.webUrl is "https://uipotion.com/potions/components/file-upload.html", expected https://uipotion.com/potions/components/file-upload',
  'components/navbar [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'components/navbar [placeholder]: placeholders left in the Markdown: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'components/navbar [urls]: meta.webUrl is "https://uipotion.com/potions/components/navbar.html", expected https://uipotion.com/potions/components/navbar',
  'components/sidebar-navigation [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'components/sidebar-navigation [urls]: meta.webUrl is "https://uipotion.com/potions/components/sidebar-navigation.html", expected https://uipotion.com/potions/components/sidebar-navigation',
  'components/tabs [urls]: meta.webUrl is "https://uipotion.com/potions/components/tabs.html", expected https://uipotion.com/potions/components/tabs',
  'components/text-input [title-length]: the title has 78 characters (at most 60)',
  'components/text-input [name-mismatch]: Markdown title "Text Input Field - Accessible Form Input with Label, Error, and Success States", JSON name "Text Input Field (Accessible) with Label, Error, and Success States", index name "Text Input Field (Accessible) with Label, Error, and Success States"',
  'components/text-input [text-diagram]: 39 box-drawing characters (text diagrams) in the Markdown',
  'components/text-input [urls]: meta.webUrl is "https://uipotion.com/potions/components/text-input.html", expected https://uipotion.com/potions/components/text-input',
  'components/toast-notifications [urls]: meta.webUrl is "https://uipotion.com/potions/components/toast-notifications.html", expected https://uipotion.com/potions/components/toast-notifications',
  'features/form-login-register [urls]: meta.webUrl is "https://uipotion.com/potions/features/form-login-register.html", expected https://uipotion.com/potions/features/form-login-register',
  'features/pricing-table [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'features/pricing-table [urls]: meta.webUrl is "https://uipotion.com/potions/features/pricing-table.html", expected https://uipotion.com/potions/features/pricing-table',
  'layouts/dashboard [emoji]: 1 emoji in the Markdown: 🔔',
  'layouts/dashboard [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'layouts/dashboard [urls]: meta.webUrl is "https://uipotion.com/potions/layouts/dashboard.html", expected https://uipotion.com/potions/layouts/dashboard',
  'layouts/documentation [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'layouts/documentation [urls]: meta.webUrl is "https://uipotion.com/potions/layouts/documentation.html", expected https://uipotion.com/potions/layouts/documentation',
  'layouts/documentation [related-potions]: related potion components/command-palette has required: true (use false)',
  'layouts/ecommerce-product-page [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'layouts/landing-page [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}',
  'layouts/landing-page [urls]: meta.webUrl is "https://uipotion.com/potions/layouts/landing-page.html", expected https://uipotion.com/potions/layouts/landing-page',
  'patterns/dark-light-mode [urls]: meta.webUrl is "https://uipotion.com/potions/patterns/dark-light-mode.html", expected https://uipotion.com/potions/patterns/dark-light-mode',
  'patterns/form-validation [first-tag]: the first tag is "validation", expected "patterns"',
  'patterns/form-validation [urls]: meta.webUrl is "https://uipotion.com/potions/patterns/form-validation.html", expected https://uipotion.com/potions/patterns/form-validation',
  'tooling/eslint-config [first-tag]: the first tag is "eslint", expected "tooling"',
  'tooling/eslint-config [urls]: meta.webUrl is "https://uipotion.com/potions/tooling/eslint-config.html", expected https://uipotion.com/potions/tooling/eslint-config'
];

// Each category folder has its schema at categories/[category].schema.json
function categorySchemaFile(category) {
  return path.join(SCHEMAS_DIR, 'categories', `${category}.schema.json`);
}

// Required schemas for resolution
const REQUIRED_SCHEMAS = [
  path.join(SCHEMAS_DIR, 'potion.base.schema.json'),
  path.join(SCHEMAS_DIR, 'contracts', 'accessibility.contract.schema.json'),
  path.join(SCHEMAS_DIR, 'contracts', 'state.contract.schema.json'),
  path.join(SCHEMAS_DIR, 'contracts', 'interactions.contract.schema.json')
];

// Initialize Ajv
const ajv = new Ajv({
  strict: false,
  allErrors: true,
  verbose: true,
  validateSchema: false // Don't validate schemas themselves
});

// Add format support (date, email, etc.)
addFormats(ajv);

// Schema cache
const schemaCache = new Map();

/**
 * Load a schema file
 */
function loadSchema(schemaPath) {
  // Normalize path - if it's already absolute, use it; otherwise join with cwd
  const normalizedPath = path.isAbsolute(schemaPath) 
    ? schemaPath 
    : path.join(process.cwd(), schemaPath);
  
  if (schemaCache.has(normalizedPath)) {
    return schemaCache.get(normalizedPath);
  }

  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`Schema file not found: ${normalizedPath}`);
  }

  try {
    const content = fs.readFileSync(normalizedPath, 'utf-8');
    const schema = JSON.parse(content);
    schemaCache.set(normalizedPath, schema);
    return schema;
  } catch (error) {
    throw new Error(`Failed to load schema ${normalizedPath}: ${error.message}`);
  }
}

/**
 * Resolve schema references by loading all referenced schemas
 */
function resolveSchemaReferences(schema, loadedSchemas = new Set()) {
  const schemaId = schema.$id || schema.id;
  
  if (schemaId && !loadedSchemas.has(schemaId)) {
    loadedSchemas.add(schemaId);
    
    // Merge $defs from allOf into root if needed
    if (schema.allOf && Array.isArray(schema.allOf)) {
      const mergedDefs = schema.$defs || {};
      schema.allOf.forEach(item => {
        if (item.$defs && typeof item.$defs === 'object') {
          Object.assign(mergedDefs, item.$defs);
        }
      });
      if (Object.keys(mergedDefs).length > 0) {
        schema.$defs = mergedDefs;
      }
    }
    
    // Add schema to Ajv with its original $id
    ajv.addSchema(schema, schemaId);
  }

  // Recursively resolve references
  if (schema.allOf) {
    for (const subSchema of schema.allOf) {
      if (subSchema.$ref) {
        resolveReference(subSchema.$ref, loadedSchemas);
      } else {
        resolveSchemaReferences(subSchema, loadedSchemas);
      }
    }
  }

  if (schema.anyOf) {
    for (const subSchema of schema.anyOf) {
      if (subSchema.$ref) {
        resolveReference(subSchema.$ref, loadedSchemas);
      } else {
        resolveSchemaReferences(subSchema, loadedSchemas);
      }
    }
  }

  if (schema.oneOf) {
    for (const subSchema of schema.oneOf) {
      if (subSchema.$ref) {
        resolveReference(subSchema.$ref, loadedSchemas);
      } else {
        resolveSchemaReferences(subSchema, loadedSchemas);
      }
    }
  }

  // Resolve properties that might have $ref
  if (schema.properties) {
    for (const prop of Object.values(schema.properties)) {
      if (prop && typeof prop === 'object') {
        if (prop.$ref) {
          resolveReference(prop.$ref, loadedSchemas);
        } else {
          resolveSchemaReferences(prop, loadedSchemas);
        }
      }
    }
  }

  // Resolve items that might have $ref
  if (schema.items) {
    if (schema.items.$ref) {
      resolveReference(schema.items.$ref, loadedSchemas);
    } else if (typeof schema.items === 'object') {
      resolveSchemaReferences(schema.items, loadedSchemas);
    }
  }

  // Resolve additionalProperties that might have $ref
  if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
    if (schema.additionalProperties.$ref) {
      resolveReference(schema.additionalProperties.$ref, loadedSchemas);
    } else {
      resolveSchemaReferences(schema.additionalProperties, loadedSchemas);
    }
  }
}

/**
 * Resolve a single $ref
 */
function resolveReference(ref, loadedSchemas) {
  // Skip external references (like json-schema.org)
  if (ref.startsWith('https://json-schema.org/')) {
    return;
  }

  // First check if schema is already registered in Ajv
  if (ajv.getSchema(ref)) {
    return;
  }

  // Extract path from UI Potion schema URLs
  let schemaPath = null;
  
  if (ref.startsWith('https://uipotion.com/schema/')) {
    // Convert URL to local path
    const relativePath = ref.replace('https://uipotion.com/schema/', '');
    schemaPath = path.join(SCHEMAS_DIR, relativePath);
  } else if (ref.startsWith('/schema/')) {
    const relativePath = ref.replace('/schema/', '');
    schemaPath = path.join(SCHEMAS_DIR, relativePath);
  } else if (ref.startsWith('schema/')) {
    // Handle relative paths starting with schema/
    const relativePath = ref.replace('schema/', '');
    schemaPath = path.join(SCHEMAS_DIR, relativePath);
  }

  if (schemaPath && !loadedSchemas.has(ref)) {
    try {
      const schema = loadSchema(schemaPath);
      loadedSchemas.add(ref);
      resolveSchemaReferences(schema, loadedSchemas);
    } catch (error) {
      console.warn(`Could not resolve reference ${ref} (tried path: ${schemaPath}):`, error.message);
    }
  }
}

/**
 * Format error message
 */
function formatError(error) {
  const path = error.instancePath || error.schemaPath || '/';
  const message = error.message || 'Validation error';
  const params = error.params || {};
  
  let formattedMessage = message;
  
  // Add parameter details
  if (Object.keys(params).length > 0) {
    const paramDetails = Object.entries(params)
      .map(([key, value]) => {
        if (key === 'allowedValues') {
          return `allowed values: ${JSON.stringify(value)}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ');
    formattedMessage += ` (${paramDetails})`;
  }
  
  return {
    path: path || '/',
    message: formattedMessage,
    schemaPath: error.schemaPath || ''
  };
}

/**
 * The category folders in the guide and Markdown directories
 */
function findCategoryFolders() {
  return [POTIONS_DIR, MARKDOWN_DIR].flatMap(dir => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => ({ dir: path.join(dir, entry.name), category: entry.name }));
  });
}

/**
 * Every file under dir, as paths relative to it
 */
function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory()) return listFiles(path.join(dir, entry.name)).map(file => path.join(entry.name, file));
    return entry.isFile() ? [entry.name] : [];
  });
}

/**
 * The categories: the folder names that have a category schema. checkAuthoringRules reports
 * the folders that have none.
 */
function findCategories() {
  const names = new Set(findCategoryFolders().map(folder => folder.category));
  return [...names].filter(category => fs.existsSync(categorySchemaFile(category))).sort();
}

/**
 * Find all potion JSON files
 */
function findPotions() {
  const potions = [];

  findCategories().forEach(category => {
    const categoryDir = path.join(POTIONS_DIR, category);
    if (!fs.existsSync(categoryDir)) return;

    const files = fs.readdirSync(categoryDir);
    files.forEach(filename => {
      if (filename.endsWith('.json')) {
        const filepath = path.join(categoryDir, filename);
        potions.push({
          category,
          filepath,
          filename
        });
      }
    });
  });

  return potions;
}

/**
 * Determine category from potion JSON
 */
function getCategoryFromPotion(potionData) {
  // First try to get from $schema field
  if (potionData.$schema) {
    const match = potionData.$schema.match(/categories\/(\w+)\.schema\.json/);
    if (match) {
      return match[1];
    }
  }
  
  // Fallback to category field
  if (potionData.category) {
    return potionData.category;
  }
  
  return null;
}

/**
 * Validate a single potion
 */
function validatePotion(potion) {
  const { category, filepath, filename } = potion;
  
  // Read and parse JSON
  let data;
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    data = JSON.parse(content);
  } catch (error) {
    return {
      valid: false,
      errors: [{
        path: '/',
        message: `JSON parse error: ${error.message}`,
        schemaPath: ''
      }]
    };
  }

  // Determine category (prefer from file path, fallback to JSON)
  const detectedCategory = category || getCategoryFromPotion(data);
  if (!detectedCategory) {
    return {
      valid: false,
      errors: [{
        path: '/',
        message: 'Could not determine category. Missing $schema or category field.',
        schemaPath: ''
      }]
    };
  }

  // Check if category schema exists
  const categorySchemaPath = categorySchemaFile(detectedCategory);
  if (!fs.existsSync(categorySchemaPath)) {
    return {
      valid: false,
      errors: [{
        path: '/',
        message: `Unknown category: ${detectedCategory}`,
        schemaPath: ''
      }]
    };
  }

  try {
    // Clear previous schemas for this validation
    ajv.removeSchema();
    schemaCache.clear();

    // Load required base schemas first
    for (const schemaPath of REQUIRED_SCHEMAS) {
      try {
        const schema = loadSchema(schemaPath);
        resolveSchemaReferences(schema);
      } catch (error) {
        console.warn(`Warning: Could not load required schema ${schemaPath}:`, error.message);
      }
    }

    // Load the category schema
    const categorySchema = loadSchema(categorySchemaPath);
    
    // Resolve all references
    resolveSchemaReferences(categorySchema);

    // Compile and validate
    const validateFn = ajv.compile(categorySchema);
    const valid = validateFn(data);

    if (valid) {
      return { valid: true, errors: [] };
    } else {
      return {
        valid: false,
        errors: (validateFn.errors || []).map(formatError)
      };
    }
  } catch (error) {
    return {
      valid: false,
      errors: [{
        path: '/',
        message: `Validation error: ${error.message}`,
        schemaPath: ''
      }]
    };
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function describeValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'an array';
  const type = typeof value;
  return type === 'object' ? 'an object' : `a ${type}`;
}

// A real calendar date written as YYYY-MM-DD
function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * Check that potions-index.json entries agree with guide metadata.
 * The sitemap generator trusts index dates, so drift here silently
 * produces stale lastmod values.
 */
function checkIndexConsistency(potions) {
  let index;
  try {
    index = JSON.parse(fs.readFileSync(POTIONS_INDEX_FILE, 'utf-8'));
  } catch (error) {
    return [`Could not read ${POTIONS_INDEX_FILE}: ${error.message}`];
  }

  // Guard structure before touching properties: valid JSON is not
  // necessarily the expected shape, and a TypeError here would replace the
  // validation report with a crash.
  if (!isPlainObject(index)) {
    return [`${POTIONS_INDEX_FILE}: expected a top-level object, got ${describeValue(index)}`];
  }

  const errors = [];
  const entries = new Map();
  const indexEntries = Array.isArray(index.potions) ? index.potions : null;
  if (!indexEntries) {
    errors.push(`${POTIONS_INDEX_FILE}: "potions" must be an array, got ${describeValue(index.potions)}`);
  }

  // Key by category/id: the sitemap generator identifies potions the same
  // way, and id alone could collide across categories or mask a wrong
  // category on an index entry.
  (indexEntries || []).forEach((entry, i) => {
    if (!isPlainObject(entry)) {
      errors.push(`${POTIONS_INDEX_FILE}: entry at position ${i} is not an object, got ${describeValue(entry)}`);
      return;
    }
    if (!entry.id || !entry.category) {
      errors.push(`${POTIONS_INDEX_FILE}: entry at position ${i} ("${entry.name || entry.id || 'unnamed'}") is missing id or category`);
      return;
    }
    const key = `${entry.category}/${entry.id}`;
    if (entries.has(key)) {
      errors.push(`${POTIONS_INDEX_FILE}: duplicate entry for "${key}"`);
      return;
    }
    entries.set(key, entry);
  });

  const guideKeys = new Map(); // category/id -> first guide file claiming it
  potions.forEach(({ category, filepath, filename }) => {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    } catch (error) {
      return; // parse failures are already reported by schema validation
    }
    if (!isPlainObject(data)) {
      return; // non-object guides already fail schema validation
    }

    const relativePath = path.relative(process.cwd(), filepath);

    // The guide's identity must agree with its location on disk, since
    // discovery URLs are derived from the directory and filename.
    const slug = filename.replace(/\.json$/, '');
    if (data.id !== slug) {
      errors.push(`${relativePath}: id "${data.id}" does not match the filename slug "${slug}"`);
    }
    if (data.category !== category) {
      errors.push(`${relativePath}: category "${data.category}" does not match its directory "${category}"`);
    }

    const key = `${data.category}/${data.id}`;
    if (guideKeys.has(key)) {
      errors.push(`${relativePath}: duplicate guide identity "${key}" (already defined by ${guideKeys.get(key)})`);
    } else {
      guideKeys.set(key, relativePath);
    }

    const entry = entries.get(key);
    if (!entry) {
      errors.push(`${relativePath}: no potions-index.json entry for "${key}"`);
      return;
    }

    ['created', 'updated'].forEach(field => {
      const guideValue = data.meta && data.meta[field];
      if (guideValue && entry[field] !== guideValue) {
        errors.push(`${relativePath}: meta.${field} is ${guideValue} but the potions-index.json entry says ${entry[field]}`);
      }
    });
  });

  // Reverse check: an index entry without a guide file is an orphan left
  // behind by a rename or removal and would expose broken discovery URLs.
  entries.forEach((entry, key) => {
    if (!guideKeys.has(key)) {
      errors.push(`${POTIONS_INDEX_FILE}: entry "${key}" has no matching guide file (orphan after a rename or removal?)`);
    }
  });

  if (indexEntries && index.totalCount !== indexEntries.length) {
    errors.push(`${POTIONS_INDEX_FILE}: totalCount is ${index.totalCount} but there are ${indexEntries.length} entries`);
  }

  return errors;
}

/**
 * The yaml package that Harold's front matter parser (vfile-matter) uses, resolved through
 * harold-scripts, so the validator reads front matter exactly as the build does.
 */
function loadBuildYaml() {
  const harold = path.dirname(require.resolve('harold-scripts/package.json'));
  const vfileMatter = path.dirname(require.resolve('vfile-matter', { paths: [harold] }));
  return require(require.resolve('yaml', { paths: [vfileMatter] }));
}

/**
 * Harold's Markdown parser (unified with remark-parse, resolved through harold-scripts), so code
 * and HTML blocks are found exactly as the build finds them. Both packages are ES modules.
 */
async function loadBuildMarkdownParser() {
  const harold = path.dirname(require.resolve('harold-scripts/package.json'));
  const load = name => import(pathToFileURL(require.resolve(name, { paths: [harold] })).href);
  const [{ unified }, { default: remarkParse }] = await Promise.all([load('unified'), load('remark-parse')]);
  const processor = unified().use(remarkParse);
  return text => processor.parse(text);
}

/**
 * The lines of a Markdown body outside its code blocks (fenced or indented) and HTML blocks.
 */
function linesOutsideCode(tree, text) {
  const skipped = [];
  (function walk(node, parentType) {
    const isBlockHtml = node.type === 'html' && ['root', 'blockquote', 'listItem'].includes(parentType);
    if ((node.type === 'code' || isBlockHtml) && node.position) {
      skipped.push([node.position.start.offset, node.position.end.offset]);
    } else {
      (node.children || []).forEach(child => walk(child, node.type));
    }
  })(tree, null);
  let outside = '';
  let from = 0;
  skipped.sort((a, b) => a[0] - b[0]).forEach(([start, end]) => {
    outside += `${text.slice(from, start)}\n`;
    from = end;
  });
  return `${outside}${text.slice(from)}`.split('\n');
}

const FRONT_MATTER = /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/; // vfile-matter's pattern
let buildYaml = null;

/**
 * Read the front matter of a potion's Markdown the way Harold does: CRLF normalized to LF,
 * vfile-matter's block pattern, and its YAML parser. Returns { data, body }, { error }, or null.
 */
function parseFrontMatter(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  const match = FRONT_MATTER.exec(normalized);
  if (!match) return null;
  buildYaml = buildYaml || loadBuildYaml();
  try {
    return { data: buildYaml.parse(match[1] || '') || {}, body: normalized.slice(match[0].length) };
  } catch (error) {
    return { error: error.message.split('\n')[0] };
  }
}

function readJsonFile(file) {
  try {
    return { value: JSON.parse(fs.readFileSync(file, 'utf-8')) };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Check the authoring rules in AGENTS.md: each potion's Markdown and JSON in a category folder
 * with a schema, front matter, tags, titles and names, the potion page fields, no emoji, text
 * diagrams, Markdown tables, or level-1 headings, no template placeholders, the guide URLs,
 * related potions, and the dates. Each finding names the exact break, so a known break can't
 * hide a new one.
 */
async function checkAuthoringRules(potions) {
  const findings = []; // { key, rule, message }
  const add = (key, rule, message) => findings.push({ key, rule, message });
  const shown = value => (value === undefined ? 'missing' : JSON.stringify(value));
  const isText = value => typeof value === 'string' && value.trim() !== '';
  const parseMarkdown = await loadBuildMarkdownParser();
  const categories = findCategories();

  // A missing or malformed index is reported by checkIndexConsistency; here it only skips the
  // comparisons that need it. Nothing else reads the manifest, so its problems are reported here.
  const index = readJsonFile(POTIONS_INDEX_FILE).value;
  const indexEntries = isPlainObject(index) && Array.isArray(index.potions) ? index.potions.filter(isPlainObject) : null;
  const entries = new Map((indexEntries || []).map(entry => [`${entry.category}/${entry.id}`, entry]));
  const manifest = readJsonFile(MANIFEST_FILE);
  if (manifest.error) add('site', 'dates', `could not read ${MANIFEST_FILE}: ${manifest.error}`);
  else if (!isPlainObject(manifest.value)) add('site', 'dates', `${MANIFEST_FILE} is ${describeValue(manifest.value)}, not an object`);
  const guideKeys = new Set(potions.map(({ category, filename }) => `${category}/${filename.replace(/\.json$/, '')}`));

  potions.forEach(({ category, filepath, filename }) => {
    const slug = filename.replace(/\.json$/, '');
    const key = `${category}/${slug}`;
    let jsonText;
    let data;
    try {
      jsonText = fs.readFileSync(filepath, 'utf-8');
      data = JSON.parse(jsonText);
    } catch (error) {
      return; // parse failures are already reported by schema validation
    }
    if (!isPlainObject(data)) return;

    const mdPath = path.join(MARKDOWN_DIR, category, `${slug}.md`);
    if (!fs.existsSync(mdPath)) {
      add(key, 'markdown-missing', `no Markdown source at ${mdPath}`);
      return;
    }
    const markdown = fs.readFileSync(mdPath, 'utf-8');
    const parsed = parseFrontMatter(markdown);
    if (!parsed) {
      add(key, 'front-matter', `${mdPath} has no front matter`);
      return;
    }
    if (parsed.error) {
      add(key, 'front-matter', `the front matter isn't valid YAML: ${parsed.error}`);
      return;
    }
    if (!isPlainObject(parsed.data)) {
      add(key, 'front-matter', `the front matter is ${describeValue(parsed.data)}, not a set of fields`);
      return;
    }
    const fm = parsed.data;
    const body = parsed.body;

    // Front matter fields the potion layout and the catalog rely on
    const expected = {
      layout: 'potion',
      category: category.charAt(0).toUpperCase() + category.slice(1),
      agentManifest: `potions/${category}/${slug}.json`,
      path: `potions/${category}/${slug}`
    };
    Object.entries(expected).forEach(([field, value]) => {
      if (fm[field] !== value) add(key, 'front-matter', `${field} is ${shown(fm[field])}, expected ${JSON.stringify(value)}`);
    });
    ['title', 'excerpt', 'promptSubject'].forEach(field => {
      if (!isText(fm[field])) add(key, 'front-matter', `${field} is ${shown(fm[field])}, expected text`);
    });
    if (!isCalendarDate(fm.publicationDate)) {
      add(key, 'front-matter', `publicationDate is ${shown(fm.publicationDate)}, expected a real date as YYYY-MM-DD`);
    }
    if (!Array.isArray(fm.tags) || !fm.tags.every(isText)) add(key, 'front-matter', `tags is ${shown(fm.tags)}, expected a list of tags`);

    // The first tag is the category; another category's name as a tag would list the potion twice
    const tags = Array.isArray(fm.tags) ? fm.tags : [];
    if (tags[0] !== category) add(key, 'first-tag', `the first tag is ${shown(tags[0])}, expected "${category}"`);
    const otherCategories = tags.filter(tag => categories.includes(tag) && tag !== category);
    if (otherCategories.length) add(key, 'category-tag', `tags include other categories: ${otherCategories.join(', ')}`);

    // Titles: at most 60 characters, and the same name in the Markdown, the JSON, and the index
    const title = typeof fm.title === 'string' ? fm.title : '';
    if (title.length > 60) add(key, 'title-length', `the title has ${title.length} characters (at most 60)`);
    const indexName = (entries.get(key) || {}).name;
    if (title !== data.name || (indexEntries && data.name !== indexName)) {
      add(key, 'name-mismatch', `Markdown title ${JSON.stringify(title)}, JSON name ${shown(data.name)}, index name ${shown(indexName)}`);
    }

    // Potion page fields: text when present, and specifies (three behaviors) and example come with useWhen
    ['promptReuse', 'useWhen', 'example'].forEach(field => {
      if (fm[field] !== undefined && !isText(fm[field])) add(key, 'page-fields', `${field} is ${shown(fm[field])}, expected text`);
    });
    if (fm.specifies !== undefined && (!Array.isArray(fm.specifies) || fm.specifies.length !== 3 || !fm.specifies.every(isText))) {
      add(key, 'page-fields', `specifies is ${shown(fm.specifies)}, expected a list of three behaviors`);
    }
    if ((fm.specifies !== undefined || fm.example !== undefined) && fm.useWhen === undefined) {
      add(key, 'page-fields', 'specifies and example need useWhen');
    }

    // No emoji, text diagrams, or Markdown tables in the Markdown
    const emoji = body.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu) || [];
    if (emoji.length) add(key, 'emoji', `${emoji.length} emoji in the Markdown: ${emoji.join(' ')}`);
    const boxDrawing = body.match(/[─-╿]/g) || [];
    if (boxDrawing.length) add(key, 'text-diagram', `${boxDrawing.length} box-drawing characters (text diagrams) in the Markdown`);
    const tree = parseMarkdown(body);
    const tableRows = linesOutsideCode(tree, body).filter(line => /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line));
    if (tableRows.length) add(key, 'markdown-table', `${tableRows.length} Markdown table(s)`);

    // No level-1 heading in the body: the potion page shows the title as its only h1
    const h1s = [];
    const textOf = node => node.value || (node.children || []).map(textOf).join('');
    (function walk(node) {
      if (node.type === 'heading' && node.depth === 1) h1s.push(JSON.stringify(textOf(node)));
      else (node.children || []).forEach(walk);
    })(tree);
    if (h1s.length) add(key, 'markdown-h1', `${h1s.length} level-1 heading(s) in the Markdown: ${h1s.join(', ')} (the page shows the title as its h1, so headings start at ##)`);

    // Template placeholders that nothing fills in, listed one by one
    [['JSON', jsonText], ['Markdown', markdown]].forEach(([where, text]) => {
      const placeholders = text.match(/\{\{USER_[^}\s]*\}{0,2}/g) || [];
      if (placeholders.length) add(key, 'placeholder', `placeholders left in the ${where}: ${placeholders.join(', ')}`);
    });

    // The guide's URLs follow its path, without .html
    const base = `${SITE_URL}/potions/${category}/${slug}`;
    const urls = { webUrl: base, agentGuideUrl: `${base}.json`, markdownUrl: `${base}.md` };
    const meta = isPlainObject(data.meta) ? data.meta : {};
    Object.entries(urls).forEach(([field, value]) => {
      if (meta[field] !== value) add(key, 'urls', `meta.${field} is ${shown(meta[field])}, expected ${value}`);
      const entry = entries.get(key);
      if (entry && entry[field] !== value) add(key, 'urls', `the index entry's ${field} is ${shown(entry[field])}, expected ${value}`);
    });

    // Related potions exist and stay optional
    (Array.isArray(meta.relatedPotions) ? meta.relatedPotions : []).forEach((related, i) => {
      if (!isPlainObject(related)) {
        add(key, 'related-potions', `related potion ${i + 1} is ${describeValue(related)}, not an object`);
        return;
      }
      const target = `${related.category}/${related.id}`;
      if (!guideKeys.has(target)) add(key, 'related-potions', `related potion ${target} doesn't exist`);
      if (related.required !== false) add(key, 'related-potions', `related potion ${target} has required: ${JSON.stringify(related.required)} (use false)`);
    });

    if (meta.created && meta.updated && meta.updated < meta.created) add(key, 'dates', `meta.updated ${meta.updated} is before meta.created ${meta.created}`);
  });

  // Potion files sit directly in a category folder that has a schema, and each Markdown potion
  // has its JSON guide (a guide without Markdown is reported above). Harold builds every Markdown
  // file under src/potions and publishes every file under src/statics/potions, so a potion file
  // anywhere else would go live unchecked.
  findCategoryFolders().forEach(({ dir, category }) => {
    if (!categories.includes(category)) add(dir, 'category-folder', `no category schema at ${categorySchemaFile(category)}`);
  });
  [[POTIONS_DIR, /\.json$/i, '.json'], [MARKDOWN_DIR, /\.(md|markdown)$/i, '.md']].forEach(([dir, pattern, extension]) => {
    listFiles(dir).filter(file => pattern.test(file)).forEach(file => {
      if (file.split(path.sep).length !== 2 || path.extname(file) !== extension) {
        add(path.join(dir, file), 'file-location', `expected ${path.join(dir, '[category]', `[slug]${extension}`)}`);
      }
    });
  });
  categories.forEach(category => {
    const markdownDir = path.join(MARKDOWN_DIR, category);
    if (!fs.existsSync(markdownDir)) return;
    fs.readdirSync(markdownDir, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
      .forEach(entry => {
        const slug = entry.name.replace(/\.md$/, '');
        const key = `${category}/${slug}`;
        if (!guideKeys.has(key)) add(key, 'json-missing', `no JSON guide at ${path.join(POTIONS_DIR, category, `${slug}.json`)}`);
      });
  });

  // The index's lastUpdated and the manifest's meta.updated are real dates (the sitemap uses them
  // as lastmod), and they move with every potion change
  const latest = [...entries.values()].map(entry => entry.updated).filter(isCalendarDate).sort().pop();
  const siteDates = [];
  if (indexEntries) siteDates.push(['potions-index.json lastUpdated', index.lastUpdated]);
  if (isPlainObject(manifest.value)) {
    siteDates.push(['uipotion-manifest.json meta.updated', isPlainObject(manifest.value.meta) ? manifest.value.meta.updated : undefined]);
  }
  siteDates.forEach(([field, value]) => {
    if (!isCalendarDate(value)) add('site', 'dates', `${field} is ${shown(value)}, expected a real date as YYYY-MM-DD`);
    else if (latest && value < latest) add('site', 'dates', `${field} is ${shown(value)}, before the latest potion update ${latest}`);
  });

  return findings;
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Validating all potions...\n');

  const potions = findPotions();
  
  if (potions.length === 0) {
    console.log('❌ No potions found to validate.');
    process.exit(1);
  }

  console.log(`Found ${potions.length} potion(s) to validate:\n`);

  let totalErrors = 0;
  const results = [];

  // Validate each potion
  potions.forEach(potion => {
    const result = validatePotion(potion);
    results.push({ potion, result });
    
    if (!result.valid) {
      totalErrors += result.errors.length;
    }
  });

  // Display results
  results.forEach(({ potion, result }) => {
    const { category, filename } = potion;
    const relativePath = path.relative(process.cwd(), potion.filepath);
    
    if (result.valid) {
      console.log(`✓ ${relativePath}`);
    } else {
      console.log(`\n✗ ${relativePath}`);
      console.log(`  Validation Failed`);
      console.log(`  Found ${result.errors.length} error(s):\n`);
      
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. Path: ${error.path}`);
        console.log(`     Error: ${error.message}`);
        if (error.schemaPath) {
          console.log(`     Schema: ${error.schemaPath}`);
        }
        console.log('');
      });
    }
  });

  // Cross-check guide metadata against the potions index
  const indexErrors = checkIndexConsistency(potions);
  if (indexErrors.length > 0) {
    console.log('\n✗ potions-index.json consistency check failed:\n');
    indexErrors.forEach((message, i) => {
      console.log(`  ${i + 1}. ${message}`);
    });
    totalErrors += indexErrors.length;
  } else {
    console.log('\n✓ potions-index.json entries match guide metadata');
  }

  // AGENTS.md authoring rules: findings listed in KNOWN_RULE_BREAKS warn, anything else fails
  const expectedBreaks = new Map(); // known finding -> how many times it's still expected
  KNOWN_RULE_BREAKS.forEach(line => expectedBreaks.set(line, (expectedBreaks.get(line) || 0) + 1));
  const ruleErrors = [];
  const ruleWarnings = [];
  (await checkAuthoringRules(potions)).forEach(({ key, rule, message }) => {
    const line = `${key} [${rule}]: ${message}`;
    if (expectedBreaks.get(line)) {
      expectedBreaks.set(line, expectedBreaks.get(line) - 1);
      ruleWarnings.push(line);
    } else {
      ruleErrors.push(line);
    }
  });
  expectedBreaks.forEach((count, line) => {
    if (count > 0) ruleErrors.push(`no longer found, so delete it from KNOWN_RULE_BREAKS in validate-potions.js: ${line}`);
  });
  if (ruleErrors.length > 0) {
    console.log('\n✗ AGENTS.md authoring rules failed:\n');
    ruleErrors.forEach((line, i) => console.log(`  ${i + 1}. ${line}`));
    totalErrors += ruleErrors.length;
  } else {
    console.log('✓ AGENTS.md authoring rules hold, apart from the known breaks below');
  }
  if (ruleWarnings.length > 0) {
    console.log(`\n⚠ Known authoring-rule breaks, to be fixed in the potion passes (${ruleWarnings.length}):\n`);
    ruleWarnings.forEach(line => console.log(`  - ${line}`));
  }

  // Summary
  const validCount = results.filter(r => r.result.valid).length;
  const invalidCount = results.length - validCount;

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  Total potions: ${potions.length}`);
  console.log(`  ✓ Valid: ${validCount}`);
  console.log(`  ✗ Invalid: ${invalidCount}`);
  console.log(`  Total errors: ${totalErrors}`);
  console.log('='.repeat(60));

  // Exit with error code if any validation failed
  if (totalErrors > 0) {
    console.log('\n❌ Validation failed. Please fix the errors above.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All potions are valid!\n');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { validatePotion, findPotions };
