// Schema Validator - Client-side JSON Schema validation for UI Potion
(function() {
  'use strict';

  // Wait for DOM and Ajv to be ready
  function init() {
    // Get Ajv from window (set by waitForAjv)
    const Ajv = window.Ajv;
    
    // Check if Ajv is loaded
    if (!Ajv) {
      console.error('Ajv is not loaded. Make sure the Ajv script is included before this script.');
      return;
    }

    // Check if DOM elements exist
    const schemaSelect = document.getElementById('schema-select');
    const jsonInput = document.getElementById('json-input');
    const validateBtn = document.getElementById('validate-btn');
    const validationResults = document.getElementById('validation-results');
    const validationStatus = document.getElementById('validation-status');

    if (!schemaSelect || !jsonInput || !validateBtn || !validationResults || !validationStatus) {
      console.error('Required DOM elements not found');
      return;
    }

    // Initialize Ajv with JSON Schema Draft 2020-12
    const ajv = new Ajv({
      strict: false,
      allErrors: true,
      verbose: true,
      validateSchema: false // Don't validate schemas themselves
    });

    // Note: ajv-formats is optional and not included for simplicity
    // Format validation (date, email, etc.) will use basic type checking

    // Schema cache
    const schemaCache = new Map();

    const statusIcon = validationStatus.querySelector('.validator-status-icon');
    const statusText = validationStatus.querySelector('.validator-status-text');

    // Schema file mapping
    const schemaFiles = {
      components: 'schemas/categories/components.schema.json',
      layouts: 'schemas/categories/layouts.schema.json',
      features: 'schemas/categories/features.schema.json',
      patterns: 'schemas/categories/patterns.schema.json',
      tooling: 'schemas/categories/tooling.schema.json'
    };

    // Required schemas for resolution
    const requiredSchemas = [
      'schemas/potion.base.schema.json',
      'schemas/contracts/accessibility.contract.schema.json',
      'schemas/contracts/state.contract.schema.json',
      'schemas/contracts/interactions.contract.schema.json'
    ];

    // Enable/disable validate button
    function updateValidateButton() {
      if (!schemaSelect || !jsonInput || !validateBtn) {
        console.error('Elements not available for button update');
        return;
      }
      
      const hasSchema = schemaSelect.value !== '';
      const hasJson = jsonInput.value.trim() !== '';
      const shouldEnable = hasSchema && hasJson;
      
      // Set disabled state
      if (shouldEnable) {
        validateBtn.disabled = false;
        validateBtn.removeAttribute('disabled'); // Also remove attribute to be sure
      } else {
        validateBtn.disabled = true;
      }
    }

    // Set initial button state
    updateValidateButton();

    // Track schema value changes - use multiple methods to ensure we catch it
    let lastSchemaValue = schemaSelect.value;
    
    function checkSchemaChange() {
      const currentValue = schemaSelect.value;
      if (currentValue !== lastSchemaValue) {
        lastSchemaValue = currentValue;
        updateValidateButton();
        return true;
      }
      return false;
    }
    
    // Standard change event
    schemaSelect.addEventListener('change', checkSchemaChange);
    
    // Input event (some browsers/events)
    schemaSelect.addEventListener('input', checkSchemaChange);
    
    // Blur event (when dropdown closes - most reliable for select elements)
    schemaSelect.addEventListener('blur', function() {
      setTimeout(checkSchemaChange, 50);
    });
    
    // Also poll the value as a reliable fallback (every 200ms)
    setInterval(function() {
      checkSchemaChange();
    }, 200);
    
    jsonInput.addEventListener('input', updateValidateButton);
    
    // Also listen for paste events
    jsonInput.addEventListener('paste', function() {
      setTimeout(updateValidateButton, 10);
    });
    
    // Check if schema is already selected (in case user selected before script loaded)
    if (schemaSelect.value) {
      updateValidateButton();
    }

    // Load a schema file
    async function loadSchema(path) {
      if (schemaCache.has(path)) {
        return schemaCache.get(path);
      }

      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to load schema: ${response.statusText}`);
        }
        const schema = await response.json();
        schemaCache.set(path, schema);
        return schema;
      } catch (error) {
        console.error(`Error loading schema ${path}:`, error);
        throw error;
      }
    }

    // Resolve schema references by loading all referenced schemas
    async function resolveSchemaReferences(schema, loadedSchemas = new Set()) {
      const schemaId = schema.$id || schema.id;
      
      if (schemaId && !loadedSchemas.has(schemaId)) {
        loadedSchemas.add(schemaId);
        
        // Merge $defs from allOf into root if needed
        // This ensures internal references like #/$defs/breakpointSpec work
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
        // This allows $ref to work even if they point to uipotion.com URLs
        ajv.addSchema(schema, schemaId);
      }

      // Recursively resolve references in allOf, anyOf, oneOf
      if (schema.allOf) {
        for (const subSchema of schema.allOf) {
          if (subSchema.$ref) {
            await resolveReference(subSchema.$ref, loadedSchemas);
          } else {
            await resolveSchemaReferences(subSchema, loadedSchemas);
          }
        }
      }

      if (schema.anyOf) {
        for (const subSchema of schema.anyOf) {
          if (subSchema.$ref) {
            await resolveReference(subSchema.$ref, loadedSchemas);
          } else {
            await resolveSchemaReferences(subSchema, loadedSchemas);
          }
        }
      }

      if (schema.oneOf) {
        for (const subSchema of schema.oneOf) {
          if (subSchema.$ref) {
            await resolveReference(subSchema.$ref, loadedSchemas);
          } else {
            await resolveSchemaReferences(subSchema, loadedSchemas);
          }
        }
      }

      // Resolve properties that might have $ref
      if (schema.properties) {
        for (const prop of Object.values(schema.properties)) {
          if (prop.$ref) {
            await resolveReference(prop.$ref, loadedSchemas);
          } else if (typeof prop === 'object') {
            await resolveSchemaReferences(prop, loadedSchemas);
          }
        }
      }

      // Resolve items that might have $ref
      if (schema.items) {
        if (schema.items.$ref) {
          await resolveReference(schema.items.$ref, loadedSchemas);
        } else if (typeof schema.items === 'object') {
          await resolveSchemaReferences(schema.items, loadedSchemas);
        }
      }

      // Resolve additionalProperties that might have $ref
      if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
        if (schema.additionalProperties.$ref) {
          await resolveReference(schema.additionalProperties.$ref, loadedSchemas);
        } else {
          await resolveSchemaReferences(schema.additionalProperties, loadedSchemas);
        }
      }
    }

    // Resolve a single $ref
    async function resolveReference(ref, loadedSchemas) {
      // Skip external references (like json-schema.org)
      if (ref.startsWith('https://json-schema.org/')) {
        return;
      }

      // First check if schema is already registered in Ajv (by its $id)
      if (ajv.getSchema(ref)) {
        // Schema already loaded and registered
        return;
      }

      // Extract path from UI Potion schema URLs
      // Support both production (uipotion.com) and localhost
      let schemaPath = null;
      
      if (ref.startsWith('https://uipotion.com/schema/')) {
        // Convert production URL to local path for loading
        // The schema file will still have $id pointing to uipotion.com, which is fine
        schemaPath = ref.replace('https://uipotion.com/schema/', 'schemas/');
      } else if (ref.startsWith('http://localhost:') || ref.startsWith('http://127.0.0.1:')) {
        // Handle localhost URLs (extract path after /schema/)
        const match = ref.match(/http:\/\/[^/]+\/schema\/(.+)/);
        if (match) {
          schemaPath = 'schemas/' + match[1];
        }
      } else if (ref.startsWith('/schema/')) {
        schemaPath = ref.replace('/schema/', 'schemas/');
      } else if (ref.startsWith('schemas/')) {
        schemaPath = ref;
      }

      if (schemaPath && !loadedSchemas.has(ref)) {
        try {
          const schema = await loadSchema(schemaPath);
          // Mark this reference as loaded (using the original ref URL, not the file path)
          loadedSchemas.add(ref);
          // Recursively resolve references in the loaded schema
          await resolveSchemaReferences(schema, loadedSchemas);
        } catch (error) {
          console.warn(`Could not resolve reference ${ref} (tried path: ${schemaPath}):`, error);
        }
      }
    }

    // Format error message
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

    // Display validation results
    function displayResults(valid, errors = []) {
      validationStatus.style.display = 'flex';
      
      if (valid) {
        statusIcon.textContent = '✓';
        statusIcon.className = 'validator-status-icon validator-status-success';
        statusText.textContent = 'Valid! JSON matches the schema.';
        statusText.className = 'validator-status-text validator-status-success';
        
        validationResults.innerHTML = `
          <div class="validator-success">
            <p><strong>✓ Validation Successful</strong></p>
            <p>Your JSON is valid according to the selected schema.</p>
          </div>
        `;
      } else {
        statusIcon.textContent = '✗';
        statusIcon.className = 'validator-status-icon validator-status-error';
        statusText.textContent = `Invalid: ${errors.length} error(s) found`;
        statusText.className = 'validator-status-text validator-status-error';
        
        const errorsHtml = errors.map(error => {
          const formatted = formatError(error);
          return `
            <div class="validator-error">
              <div class="validator-error-path">
                <strong>Path:</strong> <code>${formatted.path || '/'}</code>
              </div>
              <div class="validator-error-message">
                <strong>Error:</strong> ${formatted.message}
              </div>
              ${formatted.schemaPath ? `
                <div class="validator-error-schema">
                  <strong>Schema:</strong> <code>${formatted.schemaPath}</code>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');
        
        validationResults.innerHTML = `
          <div class="validator-errors">
            <p><strong>✗ Validation Failed</strong></p>
            <p>Found ${errors.length} error(s):</p>
            <div class="validator-errors-list">
              ${errorsHtml}
            </div>
          </div>
        `;
      }
    }

    // Main validation function
    async function validate() {
      const selectedCategory = schemaSelect.value;
      if (!selectedCategory) {
        alert('Please select a schema category');
        return;
      }

      const jsonText = jsonInput.value.trim();
      if (!jsonText) {
        alert('Please paste JSON to validate');
        return;
      }

      // Parse JSON
      let data;
      try {
        data = JSON.parse(jsonText);
      } catch (error) {
        validationStatus.style.display = 'flex';
        statusIcon.textContent = '✗';
        statusIcon.className = 'validator-status-icon validator-status-error';
        statusText.textContent = 'Invalid JSON syntax';
        statusText.className = 'validator-status-text validator-status-error';
        validationResults.innerHTML = `
          <div class="validator-error">
            <p><strong>JSON Parse Error:</strong></p>
            <p>${error.message}</p>
          </div>
        `;
        return;
      }

      // Show loading state
      validationStatus.style.display = 'flex';
      statusIcon.textContent = '⏳';
      statusIcon.className = 'validator-status-icon validator-status-loading';
      statusText.textContent = 'Loading schemas...';
      statusText.className = 'validator-status-text validator-status-loading';
      validationResults.innerHTML = '<div class="validator-loading">Loading schemas and resolving references...</div>';

      try {
        // Clear previous schemas
        ajv.removeSchema();
        schemaCache.clear();

        // Load required base schemas first
        for (const schemaPath of requiredSchemas) {
          try {
            const schema = await loadSchema(schemaPath);
            await resolveSchemaReferences(schema);
          } catch (error) {
            console.warn(`Could not load required schema ${schemaPath}:`, error);
          }
        }

        // Load the selected category schema
        const categorySchemaPath = schemaFiles[selectedCategory];
        const categorySchema = await loadSchema(categorySchemaPath);
        
        // Resolve all references
        await resolveSchemaReferences(categorySchema);

        // Compile and validate
        const validateFn = ajv.compile(categorySchema);
        const valid = validateFn(data);

        if (valid) {
          displayResults(true);
        } else {
          displayResults(false, validateFn.errors || []);
        }
      } catch (error) {
        validationStatus.style.display = 'flex';
        statusIcon.textContent = '✗';
        statusIcon.className = 'validator-status-icon validator-status-error';
        statusText.textContent = 'Validation error';
        statusText.className = 'validator-status-text validator-status-error';
        validationResults.innerHTML = `
          <div class="validator-error">
            <p><strong>Validation Error:</strong></p>
            <p>${error.message}</p>
            <p>Please check the browser console for more details.</p>
          </div>
        `;
        console.error('Validation error:', error);
      }
    }

    // Attach event listener
    validateBtn.addEventListener('click', validate);

    // Allow Enter+Ctrl/Cmd to validate
    jsonInput.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!validateBtn.disabled) {
          validate();
        }
      }
    });
  }

  // Wait for both DOM and Ajv to be ready
  let waitStartTime = Date.now();
  const maxWaitTime = 10000; // 10 seconds max wait
  
  function waitForAjv() {
    // Check for Ajv in various possible global locations
    // cdnjs ajv2020.min.js exposes it as window.ajv2020
    const AjvConstructor = window.ajv2020 || window.Ajv || window.ajv || (typeof Ajv !== 'undefined' ? Ajv : null);
    
    if (AjvConstructor) {
      // Make Ajv available globally for the init function
      window.Ajv = AjvConstructor;
      
      // Ajv is loaded, now wait for DOM
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    } else {
      // Check if we've waited too long
      if (Date.now() - waitStartTime > maxWaitTime) {
        console.error('Ajv failed to load after 10 seconds. Please check the CDN link.');
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'padding: 20px; background: #dc2626; color: white; margin: 20px; border-radius: 8px;';
        errorDiv.innerHTML = '<strong>Error:</strong> Failed to load Ajv library. Please refresh the page or check your internet connection.';
        if (document.body) {
          document.body.appendChild(errorDiv);
        }
        return;
      }
      
      // Ajv not loaded yet, try again in 100ms
      setTimeout(waitForAjv, 100);
    }
  }

  // Start waiting for Ajv
  waitForAjv();
})();
