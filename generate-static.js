#!/usr/bin/env node
/**
 * Generate sitemap.xml and _redirects from potions and static pages.
 * Run: node generate-static.js
 * Or: npm run static
 */

const fs = require('fs');
const path = require('path');

// Configuration
const POTIONS_DIR = 'src/potions';
const OUTPUT_FILE = 'src/statics/sitemap.xml';
const REDIRECTS_FILE = 'src/statics/_redirects';
const BASE_URL = 'https://uipotion.com';

// Static pages with their priorities (pretty URLs, no .html)
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/potions', priority: '0.9', changefreq: 'weekly' },
  { path: '/contribute', priority: '0.7', changefreq: 'monthly' },
  { path: '/validator', priority: '0.6', changefreq: 'monthly' },
  { path: '/legal', priority: '0.3', changefreq: 'yearly' },
];

// API/Discovery endpoints
const API_ENDPOINTS = [
  { path: '/uipotion-manifest.json', priority: '0.9', changefreq: 'weekly' },
  { path: '/potions-index.json', priority: '0.9', changefreq: 'weekly' },
];

function getFileLastModified(filepath) {
  try {
    const stats = fs.statSync(filepath);
    return stats.mtime.toISOString().split('T')[0];
  } catch (err) {
    return new Date().toISOString().split('T')[0];
  }
}

function findPotions() {
  const potions = [];
  const categories = ['components', 'features', 'layouts', 'patterns', 'tooling'];

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
          lastmod: getFileLastModified(filepath)
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
  const today = new Date().toISOString().split('T')[0];
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
    <lastmod>${today}</lastmod>
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
    <lastmod>${today}</lastmod>
    <changefreq>${endpoint.changefreq}</changefreq>
    <priority>${endpoint.priority}</priority>
  </url>

`;
  });

  xml += `</urlset>
`;

  return { xml, potions };
}

function generateRedirects(potions) {
  // Netlify _redirects: from to status (whitespace-separated). See https://docs.netlify.com/routing/redirects/
  const lines = [
    '# Netlify Pretty URLs: .html → pretty (301). Auto-generated — do not edit by hand.',
    '/index.html / 301',
  ];
  STATIC_PAGES.forEach(page => {
    if (page.path === '/') return;
    lines.push(`${page.path}.html ${page.path} 301`);
  });
  lines.push('/404.html /404 301');
  potions.forEach(potion => {
    lines.push(`${potion.path}.html ${potion.path} 301`);
  });
  lines.push('');
  lines.push('# Serve 404 for missing URLs');
  lines.push('/* /404.html 404');
  return lines.join('\n') + '\n';
}

function main() {
  console.log('Generating sitemap.xml and _redirects...\n');

  const { xml, potions } = generateSitemap();

  // Show summary
  console.log(`Found ${potions.length} potions:`);
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
