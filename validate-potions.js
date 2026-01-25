#!/usr/bin/env node
/**
 * Validate all UI Potion JSON files against their category schemas
 * Run: node validate-potions.js
 * Or add to package.json scripts: "validate": "node validate-potions.js"
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

// Configuration
const POTIONS_DIR = 'src/statics/potions';
const SCHEMAS_DIR = 'src/statics/schemas';

// Schema file mapping
const SCHEMA_FILES = {
  components: path.join(SCHEMAS_DIR, 'categories', 'components.schema.json'),
  layouts: path.join(SCHEMAS_DIR, 'categories', 'layouts.schema.json'),
  features: path.join(SCHEMAS_DIR, 'categories', 'features.schema.json'),
  patterns: path.join(SCHEMAS_DIR, 'categories', 'patterns.schema.json'),
  tooling: path.join(SCHEMAS_DIR, 'categories', 'tooling.schema.json')
};

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
  } else if (ref.startsWith('schemas/')) {
    // Handle relative paths starting with schemas/
    const relativePath = ref.replace('schemas/', '');
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
 * Find all potion JSON files
 */
function findPotions() {
  const potions = [];
  const categories = ['components', 'features', 'layouts', 'patterns', 'tooling'];

  categories.forEach(category => {
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
  const categorySchemaPath = SCHEMA_FILES[detectedCategory];
  if (!categorySchemaPath) {
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

/**
 * Main function
 */
function main() {
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
  main();
}

module.exports = { validatePotion, findPotions };
