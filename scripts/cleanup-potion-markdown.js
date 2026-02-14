#!/usr/bin/env node
/**
 * Remove generated potion markdown from src/statics/potions/ after Harold has copied them to build/.
 * Run: node scripts/cleanup-potion-markdown.js
 * Or: npm run postbuild (runs automatically after npm run build)
 */

const fs = require('fs');
const path = require('path');

const STATICS_POTIONS_DIR = path.join(process.cwd(), 'src/statics/potions');

function cleanup() {
  if (!fs.existsSync(STATICS_POTIONS_DIR)) return 0;

  let removed = 0;
  const categories = fs.readdirSync(STATICS_POTIONS_DIR);

  for (const category of categories) {
    const categoryPath = path.join(STATICS_POTIONS_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath);
    for (const file of files) {
      if (file.endsWith('.md')) {
        // Only remove generated markdown that maps to a real source potion file.
        // This avoids deleting intentionally committed static markdown files.
        const sourcePath = path.join(process.cwd(), 'src/potions', category, file);
        if (!fs.existsSync(sourcePath)) continue;

        const filePath = path.join(categoryPath, file);
        fs.unlinkSync(filePath);
        removed++;
      }
    }
  }

  return removed;
}

const removed = cleanup();
if (removed > 0) {
  console.log(`Cleaned up ${removed} temporary potion markdown files from src/statics/potions/`);
}
