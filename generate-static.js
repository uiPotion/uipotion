#!/usr/bin/env node
/**
 * Generate sitemap.xml, _redirects, and copy potion markdown to statics.
 * Run: node generate-static.js
 * Or: npm run static
 *
 * Markdown copies: src/potions/[category]/[slug].md to src/statics/potions/
 * Harold then copies statics to build/. Generated .md files are gitignored.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Configuration
const POTIONS_DIR = 'src/potions';
const STATICS_POTIONS_DIR = 'src/statics/potions';
const POTIONS_INDEX_FILE = 'src/statics/potions-index.json';
const OUTPUT_FILE = 'src/statics/sitemap.xml';
const REDIRECTS_FILE = 'src/statics/_redirects';
const BASE_URL = 'https://uipotion.com';

// Static pages with their priorities (pretty URLs, no .html).
// lastmod derives from the source file's git history (dirty files use
// today's date). Full-history git is required; the build fails on missing
// git or shallow clones rather than silently emitting wrong dates.
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly', source: 'src/pages/index.hbs' },
  { path: '/about', priority: '0.8', changefreq: 'monthly', source: 'src/pages/about.hbs' },
  { path: '/potion-kit', priority: '0.8', changefreq: 'monthly', source: 'src/pages/potion-kit.hbs' },
  { path: '/potions', priority: '0.9', changefreq: 'weekly', source: 'src/pages/potions.hbs' },
  { path: '/contribute', priority: '0.7', changefreq: 'monthly', source: 'src/pages/contribute.hbs' },
  { path: '/validator', priority: '0.6', changefreq: 'monthly', source: 'src/pages/validator.hbs' },
  { path: '/legal', priority: '0.3', changefreq: 'yearly', source: 'src/pages/legal.hbs' },
];

// API/Discovery endpoints
const API_ENDPOINTS = [
  { path: '/uipotion-manifest.json', priority: '0.9', changefreq: 'weekly', source: 'src/statics/uipotion-manifest.json' },
  { path: '/potions-index.json', priority: '0.9', changefreq: 'weekly', source: 'src/statics/potions-index.json' },
];

function todayDate() {
  return new Date().toISOString().split('T')[0];
}

function requireGit() {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    console.error(
      'Error: sitemap lastmod dates are derived from git history, but git is\n' +
      'unavailable or this is not a git checkout. File mtimes are not a reliable\n' +
      'substitute (archive extraction rewrites them), so the build stops here.\n' +
      'Run this from a git clone with git installed.'
    );
    process.exit(1);
  }

  // In a shallow clone, `git log -1 -- <file>` reports the truncation
  // boundary commit as every file's last change, silently producing wrong
  // dates. Refuse to run until full history is available.
  const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], { encoding: 'utf-8' }).trim();
  if (shallow === 'true') {
    console.error(
      'Error: this is a shallow git clone, so file history is truncated and\n' +
      'sitemap lastmod dates would be wrong (every file would appear last\n' +
      'modified at the shallow boundary commit). Fetch full history first:\n' +
      '  git fetch --unshallow\n' +
      'or configure your CI checkout with full depth (e.g. fetch-depth: 0).'
    );
    process.exit(1);
  }
}

function getGitLastModified(filepath) {
  // Git commit dates are deterministic across checkouts, unlike file mtimes.
  // Files with uncommitted changes (including untracked) use today's date,
  // since their content genuinely changed now. Uses execFileSync argument
  // arrays (no shell), so file paths cannot inject commands.
  const dirty = execFileSync('git', ['status', '--porcelain', '--', filepath], { encoding: 'utf-8' }).trim();
  if (dirty) return todayDate();
  const committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', filepath], { encoding: 'utf-8' }).trim();
  if (!committed) {
    throw new Error(`No git history found for ${filepath}; cannot derive a lastmod date`);
  }
  return committed;
}

function loadPotionUpdatedDates() {
  // The potions index carries a maintained per-potion `updated` date
  // (repo rules require bumping it on every content change), which is the
  // most accurate lastmod source for potion URLs.
  try {
    const index = JSON.parse(fs.readFileSync(POTIONS_INDEX_FILE, 'utf-8'));
    const map = {};
    (index.potions || []).forEach(p => {
      if (p.id && p.category && p.updated) {
        map[`${p.category}/${p.id}`] = p.updated;
      }
    });
    return map;
  } catch (err) {
    return {};
  }
}

function getApiEndpointLastModified(endpoint) {
  // Both discovery files carry their own tracked date fields.
  try {
    const data = JSON.parse(fs.readFileSync(endpoint.source, 'utf-8'));
    const tracked = endpoint.path === '/uipotion-manifest.json'
      ? data.meta && data.meta.updated
      : data.lastUpdated;
    if (tracked) return tracked;
  } catch (err) {
    // fall through to git history
  }
  return getGitLastModified(endpoint.source);
}

function findPotions() {
  const potions = [];
  const categories = ['components', 'features', 'layouts', 'patterns', 'tooling'];
  const updatedDates = loadPotionUpdatedDates();

  categories.forEach(category => {
    const categoryDir = path.join(POTIONS_DIR, category);
    if (!fs.existsSync(categoryDir)) return;

    const files = fs.readdirSync(categoryDir);
    files.forEach(filename => {
      if (filename.endsWith('.md')) {
        const filepath = path.join(categoryDir, filename);
        const slug = filename.replace('.md', '');

        potions.push({
          category,
          slug,
          path: `/potions/${category}/${slug}`,
          priority: '0.8',
          changefreq: 'monthly',
          lastmod: updatedDates[`${category}/${slug}`] || getGitLastModified(filepath)
        });
      }
    });
  });

  return potions.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.slug.localeCompare(b.slug);
  });
}

function generateSitemap() {
  const potions = findPotions();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

  <!-- Static Pages -->
`;

  // Add static pages
  STATIC_PAGES.forEach(page => {
    xml += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${getGitLastModified(page.source)}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>

`;
  });

  // Add potions
  xml += `  <!-- Individual Potions -->
`;

  potions.forEach(potion => {
    xml += `  <url>
    <loc>${BASE_URL}${potion.path}</loc>
    <lastmod>${potion.lastmod}</lastmod>
    <changefreq>${potion.changefreq}</changefreq>
    <priority>${potion.priority}</priority>
  </url>

`;
  });

  // Add API/Discovery endpoints
  xml += `  <!-- API/Discovery Endpoints for AI Agents -->
`;

  API_ENDPOINTS.forEach(endpoint => {
    xml += `  <url>
    <loc>${BASE_URL}${endpoint.path}</loc>
    <lastmod>${getApiEndpointLastModified(endpoint)}</lastmod>
    <changefreq>${endpoint.changefreq}</changefreq>
    <priority>${endpoint.priority}</priority>
  </url>

`;
  });

  xml += `</urlset>
`;

  return { xml, potions };
}

function copyPotionMarkdown(potions) {
  // Copy source markdown to statics so Harold includes it in build.
  // Generated files are gitignored; no duplicates committed.
  let copied = 0;
  for (const { category, slug } of potions) {
    const srcPath = path.join(POTIONS_DIR, category, `${slug}.md`);
    const destDir = path.join(STATICS_POTIONS_DIR, category);
    const destPath = path.join(destDir, `${slug}.md`);
    if (!fs.existsSync(srcPath)) continue;
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(srcPath, destPath);
    copied++;
  }
  return copied;
}

function generateRedirects(potions) {
  // Netlify _redirects: from to status (whitespace-separated). See https://docs.netlify.com/routing/redirects/
  // Use 301! (force) so redirect runs even when the .html file exists; otherwise Netlify serves the file.
  const force = '301!';
  const lines = [
    '# Netlify Pretty URLs: .html → pretty (301). Auto-generated — do not edit by hand.',
    `/index.html / ${force}`,
  ];
  STATIC_PAGES.forEach(page => {
    if (page.path === '/') return;
    lines.push(`${page.path}.html ${page.path} ${force}`);
  });
  lines.push(`/404.html /404 ${force}`);
  potions.forEach(potion => {
    lines.push(`${potion.path}.html ${potion.path} ${force}`);
  });
  lines.push('');
  lines.push('# Serve 404 for missing URLs');
  lines.push('/* /404.html 404');
  return lines.join('\n') + '\n';
}

function main() {
  console.log('Generating sitemap.xml, _redirects, and copying potion markdown...\n');

  requireGit();

  const { xml, potions } = generateSitemap();

  const copiedMd = copyPotionMarkdown(potions);
  if (copiedMd > 0) {
    console.log(`Copied ${copiedMd} potion markdown files to ${STATICS_POTIONS_DIR}/`);
  }

  // Show summary
  console.log(`\nFound ${potions.length} potions:`);
  ['components', 'features', 'layouts', 'patterns', 'tooling'].forEach(category => {
    const count = potions.filter(p => p.category === category).length;
    if (count > 0) {
      console.log(`  - ${category}: ${count}`);
    }
  });

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, xml, 'utf-8');
  const redirects = generateRedirects(potions);
  fs.writeFileSync(REDIRECTS_FILE, redirects, 'utf-8');

  console.log(`\nSitemap generated: ${OUTPUT_FILE}`);
  console.log(`Redirects generated: ${REDIRECTS_FILE}`);
  console.log(`Total URLs: ${STATIC_PAGES.length + potions.length + API_ENDPOINTS.length}`);
}

main();
