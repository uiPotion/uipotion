/**
 * Tests for validate-potions.js. Each test copies the validator, the potions, the schemas, the
 * index, and the manifest into a temporary folder, breaks something there, and runs the validator
 * on that copy the way `npm run validate` does. Run them with `npm test` after changing the
 * validator.
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFile } = require('node:child_process');

const REPO = path.resolve(__dirname, '..');
const COPIED = [
  'validate-potions.js',
  'src/potions',
  'src/statics/potions',
  'src/statics/schema',
  'src/statics/potions-index.json',
  'src/statics/uipotion-manifest.json'
];
const GUIDES_DIR = path.join(REPO, 'src/statics/potions'); // `npm run static` also writes Markdown copies here
const INDEX = 'src/statics/potions-index.json';
const MANIFEST = 'src/statics/uipotion-manifest.json';
const BUTTON = 'components/button'; // a potion the tests break
const BUTTON_URL = 'https://uipotion.com/potions/components/button';
const DIALOG = 'components/dialog'; // a potion with an acceptance checklist
const TABLE = '| a | b |\n| --- | --- |\n| 1 | 2 |';
// A run takes about 2 seconds and 300 MB, so only a few run at once
const CONCURRENCY = Math.max(1, Math.min(8, os.availableParallelism() - 1));

const markdown = key => `src/potions/${key}.md`;
const guide = key => `src/statics/potions/${key}.json`;

/**
 * Replace a front matter field, with its indented lines such as list items, by `field: yaml`.
 * A missing field is added, and an undefined yaml removes the field.
 */
function setField(text, field, yaml) {
  const end = text.indexOf('\n---\n', 4);
  const lines = text.slice(4, end).split('\n');
  const start = lines.findIndex(line => line.startsWith(`${field}:`));
  const replacement = yaml === undefined ? [] : [`${field}: ${yaml}`];
  if (start === -1) {
    lines.push(...replacement);
  } else {
    let count = 1;
    while (start + count < lines.length && /^\s/.test(lines[start + count])) count += 1;
    lines.splice(start, count, ...replacement);
  }
  return `---\n${lines.join('\n')}${text.slice(end)}`;
}

function runValidator(root) {
  return new Promise(resolve => {
    const options = { cwd: root, timeout: 60000, maxBuffer: 16 * 1024 * 1024 };
    execFile(process.execPath, ['validate-potions.js'], options, (error, stdout, stderr) => {
      const output = `${stdout}${stderr}`;
      const lines = output.split('\n');
      resolve({
        status: error ? error.code : 0,
        output,
        // Numbered lines are failures
        errors: lines.filter(line => /^ {2}\d+\. /.test(line)).map(line => line.replace(/^ {2}\d+\. /, ''))
      });
    });
  });
}

/**
 * A copy of the repo's potions for one test to change, deleted after the test. node_modules is
 * linked, so the copied validator finds its own packages and Harold's.
 */
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'uipotion-validate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  COPIED.forEach(item => fs.cpSync(path.join(REPO, item), path.join(root, item), {
    recursive: true,
    filter: source => !(source.startsWith(GUIDES_DIR) && source.endsWith('.md'))
  }));
  fs.symlinkSync(path.join(REPO, 'node_modules'), path.join(root, 'node_modules'), 'junction');

  const file = name => path.join(root, name);
  const f = {
    read: name => fs.readFileSync(file(name), 'utf-8'),
    write: (name, text) => {
      fs.mkdirSync(path.dirname(file(name)), { recursive: true });
      fs.writeFileSync(file(name), text);
    },
    remove: name => fs.rmSync(file(name)),
    edit: (name, change) => f.write(name, change(f.read(name))),
    editJson: (name, change) => f.edit(name, text => {
      const data = JSON.parse(text);
      change(data);
      return `${JSON.stringify(data, null, 2)}\n`;
    }),
    // Front matter fields as raw YAML values
    editFrontMatter: (key, fields) => f.edit(markdown(key), text => (
      Object.entries(fields).reduce((changed, [field, yaml]) => setField(changed, field, yaml), text)
    )),
    editIndexEntry: (id, change) => f.editJson(INDEX, index => change(index.potions.find(entry => entry.id === id))),
    run: () => runValidator(root)
  };
  return f;
}

function assertPasses(result) {
  assert.equal(result.status, 0, result.output);
  assert.deepEqual(result.errors, []);
}

// Fails with exactly these errors
function assertErrors(result, expected) {
  assert.equal(result.status, 1, result.output);
  assert.deepEqual(result.errors, expected);
}

// Fails with at least these errors, and doesn't crash
function assertIncludesErrors(result, expected) {
  assert.equal(result.status, 1, result.output);
  expected.forEach(line => assert.ok(result.errors.includes(line), `missing error: ${line}\n\n${result.output}`));
  assert.doesNotMatch(result.output, /TypeError|ReferenceError/);
}

// The first error starts with this text, and it's the only one
function assertOneErrorStarting(result, start) {
  assert.equal(result.status, 1, result.output);
  assert.equal(result.errors.length, 1, result.output);
  assert.ok(result.errors[0].startsWith(start), result.errors[0]);
}

// A widgets category with its own schema, and a copy of the button potion in it
function addWidgetsCategory(f) {
  const url = 'https://uipotion.com/potions/widgets/button';
  const schema = 'src/statics/schema/categories/widgets.schema.json';
  f.editJson('src/statics/schema/potion.base.schema.json', base => base.properties.category.enum.push('widgets'));
  f.write(schema, f.read('src/statics/schema/categories/components.schema.json'));
  f.editJson(schema, data => {
    data.$id = data.$id.replace('components', 'widgets');
    data.allOf[1].properties.category.const = 'widgets';
  });
  f.write(guide('widgets/button'), f.read(guide(BUTTON)));
  f.editJson(guide('widgets/button'), data => {
    data.category = 'widgets';
    data.$schema = data.$schema.replace('components', 'widgets');
    Object.assign(data.meta, { webUrl: url, agentGuideUrl: `${url}.json`, markdownUrl: `${url}.md` });
  });
  f.write(markdown('widgets/button'), f.read(markdown(BUTTON)));
  f.editFrontMatter('widgets/button', {
    category: "'Widgets'",
    tags: '[widgets, button]',
    agentManifest: "'potions/widgets/button.json'",
    path: "'potions/widgets/button'"
  });
  f.editJson(INDEX, index => {
    const button = index.potions.find(entry => entry.id === 'button');
    index.potions.push({ ...button, category: 'widgets', webUrl: url, agentGuideUrl: `${url}.json`, markdownUrl: `${url}.md` });
    index.totalCount = index.potions.length;
  });
}

describe('validate-potions.js', { concurrency: CONCURRENCY }, () => {
  it('passes on the potions as they are', async t => {
    assertPasses(await fixture(t).run());
  });

  // Guide files and the potions index

  it('fails on a guide that is not valid JSON', async t => {
    const f = fixture(t);
    f.write(guide(BUTTON), '{');
    const result = await f.run();
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, /✗ src\/statics\/potions\/components\/button\.json[\s\S]*JSON parse error/);
  });

  it('fails on a guide missing a field that the base schema or its category schema requires', async t => {
    const f = fixture(t);
    f.editJson(guide(BUTTON), data => {
      delete data.description; // the base schema requires it
      delete data.componentSpec; // only the components schema requires it
    });
    const result = await f.run();
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, /✗ src\/statics\/potions\/components\/button\.json[\s\S]*must have required property 'description'/);
    assert.match(result.output, /✗ src\/statics\/potions\/components\/button\.json[\s\S]*must have required property 'componentSpec'/);
  });

  it('fails on a guide whose id or category disagrees with its file', async t => {
    const f = fixture(t);
    f.editJson(guide(BUTTON), data => Object.assign(data, { id: 'buttons', category: 'layouts' }));
    assertIncludesErrors(await f.run(), [
      'src/statics/potions/components/button.json: id "buttons" does not match the filename slug "button"',
      'src/statics/potions/components/button.json: category "layouts" does not match its directory "components"'
    ]);
  });

  it('fails on two guides with the same identity', async t => {
    const f = fixture(t);
    f.write(guide('components/button-copy'), f.read(guide(BUTTON)));
    assertIncludesErrors(await f.run(), [
      'src/statics/potions/components/button.json: duplicate guide identity "components/button" (already defined by src/statics/potions/components/button-copy.json)'
    ]);
  });

  it('fails on a guide without an index entry, and on an index entry without a guide', async t => {
    const f = fixture(t);
    f.editIndexEntry('button', entry => { entry.id = 'ghost'; });
    assertIncludesErrors(await f.run(), [
      'src/statics/potions/components/button.json: no potions-index.json entry for "components/button"',
      'src/statics/potions-index.json: entry "components/ghost" has no matching guide file (orphan after a rename or removal?)'
    ]);
  });

  it('fails on a duplicate index entry and a wrong totalCount', async t => {
    const f = fixture(t);
    let count;
    f.editJson(INDEX, index => {
      count = index.potions.length;
      index.potions.push({ ...index.potions.find(entry => entry.id === 'button') });
    });
    assertErrors(await f.run(), [
      'src/statics/potions-index.json: duplicate entry for "components/button"',
      `src/statics/potions-index.json: totalCount is ${count} but there are ${count + 1} entries`
    ]);
  });

  it('fails on index entries that are not objects or lack an id', async t => {
    const f = fixture(t);
    let count;
    f.editJson(INDEX, index => {
      count = index.potions.length;
      index.potions.push(null, { name: 'Nameless' });
      index.totalCount = index.potions.length;
    });
    assertErrors(await f.run(), [
      `src/statics/potions-index.json: entry at position ${count} is not an object, got null`,
      `src/statics/potions-index.json: entry at position ${count + 1} ("Nameless") is missing id or category`
    ]);
  });

  it('fails when an index entry and its guide disagree on a date', async t => {
    const f = fixture(t);
    const { updated } = JSON.parse(f.read(guide(BUTTON))).meta;
    f.editIndexEntry('button', entry => { entry.updated = '2000-01-01'; });
    assertErrors(await f.run(), [
      `src/statics/potions/components/button.json: meta.updated is ${updated} but the potions-index.json entry says 2000-01-01`
    ]);
  });

  it('reports an index that is null instead of crashing', async t => {
    const f = fixture(t);
    f.write(INDEX, 'null');
    assertIncludesErrors(await f.run(), ['src/statics/potions-index.json: expected a top-level object, got null']);
  });

  it('reports an index whose potions are not a list instead of crashing', async t => {
    const f = fixture(t);
    f.editJson(INDEX, index => { index.potions = {}; });
    assertIncludesErrors(await f.run(), ['src/statics/potions-index.json: "potions" must be an array, got an object']);
  });

  // Category folders and file pairs

  it('fails on a guide without its Markdown', async t => {
    const f = fixture(t);
    f.remove(markdown(BUTTON));
    assertErrors(await f.run(), ['components/button [markdown-missing]: no Markdown source at src/potions/components/button.md']);
  });

  it('fails on a Markdown potion without its guide', async t => {
    const f = fixture(t);
    f.write(markdown('components/ghost'), f.read(markdown(BUTTON)));
    assertErrors(await f.run(), ['components/ghost [json-missing]: no JSON guide at src/statics/potions/components/ghost.json']);
  });

  it('fails on category folders without a category schema', async t => {
    const f = fixture(t);
    f.write(guide('widgets/button'), f.read(guide(BUTTON)));
    f.write(markdown('widgets/button'), f.read(markdown(BUTTON)));
    assertErrors(await f.run(), [
      'src/statics/potions/widgets [category-folder]: no category schema at src/statics/schema/categories/widgets.schema.json',
      'src/potions/widgets [category-folder]: no category schema at src/statics/schema/categories/widgets.schema.json'
    ]);
  });

  it('fails on potion files that are not directly in a category folder', async t => {
    const f = fixture(t);
    f.write('src/statics/potions/button.json', f.read(guide(BUTTON)));
    f.write('src/statics/potions/components/nested/ghost.json', '{');
    f.write('src/potions/button.md', f.read(markdown(BUTTON)));
    f.write('src/potions/components/ghost.markdown', f.read(markdown(BUTTON)));
    f.write('src/potions/components/nested/ghost.md', f.read(markdown(BUTTON)));
    assertErrors(await f.run(), [
      'src/statics/potions/button.json [file-location]: expected src/statics/potions/[category]/[slug].json',
      'src/statics/potions/components/nested/ghost.json [file-location]: expected src/statics/potions/[category]/[slug].json',
      'src/potions/button.md [file-location]: expected src/potions/[category]/[slug].md',
      'src/potions/components/ghost.markdown [file-location]: expected src/potions/[category]/[slug].md',
      'src/potions/components/nested/ghost.md [file-location]: expected src/potions/[category]/[slug].md'
    ]);
  });

  it('finds the categories from the folders', async t => {
    const f = fixture(t);
    addWidgetsCategory(f);
    const result = await f.run();
    assertPasses(result);
    assert.match(result.output, /✓ src\/statics\/potions\/widgets\/button\.json/);
  });

  it("fails on a new category's name as a tag", async t => {
    const f = fixture(t);
    addWidgetsCategory(f);
    f.editFrontMatter(BUTTON, { tags: '[components, button, widgets]' });
    assertErrors(await f.run(), ['components/button [category-tag]: tags include other categories: widgets']);
  });

  // Front matter

  it('fails on Markdown without front matter', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => text.slice(text.indexOf('\n---\n', 4) + 5));
    assertErrors(await f.run(), ['components/button [front-matter]: src/potions/components/button.md has no front matter']);
  });

  it('fails on front matter that is not valid YAML', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { excerpt: "'an unclosed quote" });
    assertOneErrorStarting(await f.run(), "components/button [front-matter]: the front matter isn't valid YAML: ");
  });

  it('fails on front matter that is not a set of fields', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => `---\n- one\n- two${text.slice(text.indexOf('\n---\n', 4))}`);
    assertErrors(await f.run(), ['components/button [front-matter]: the front matter is an array, not a set of fields']);
  });

  it('accepts a YAML comment after a front matter value', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { layout: "'potion' # the potion page layout" });
    assertPasses(await f.run());
  });

  it('fails on front matter fields with the wrong value', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, {
      layout: "'post'",
      category: "'components'",
      agentManifest: "'potions/components/button'",
      path: undefined
    });
    assertErrors(await f.run(), [
      'components/button [front-matter]: layout is "post", expected "potion"',
      'components/button [front-matter]: category is "components", expected "Components"',
      'components/button [front-matter]: agentManifest is "potions/components/button", expected "potions/components/button.json"',
      'components/button [front-matter]: path is missing, expected "potions/components/button"'
    ]);
  });

  it('fails on an excerpt or promptSubject that is not text', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { excerpt: 'null', promptSubject: 'null' });
    assertErrors(await f.run(), [
      'components/button [front-matter]: excerpt is null, expected text',
      'components/button [front-matter]: promptSubject is null, expected text'
    ]);
  });

  it('fails on a publicationDate that is not a real date', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { publicationDate: "'2026-99-99'" });
    assertErrors(await f.run(), [
      'components/button [front-matter]: publicationDate is "2026-99-99", expected a real date as YYYY-MM-DD'
    ]);
  });

  it('fails on tags that are not a list', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { tags: 'components' });
    assertErrors(await f.run(), [
      'components/button [front-matter]: tags is "components", expected a list of tags',
      'components/button [first-tag]: the first tag is missing, expected "components"'
    ]);
  });

  // Tags, names, and the potion page fields

  it('fails when the first tag is not the category', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { tags: '[button, components]' });
    assertErrors(await f.run(), ['components/button [first-tag]: the first tag is "button", expected "components"']);
  });

  it("fails on another category's name as a tag", async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { tags: '[components, button, layouts]' });
    assertErrors(await f.run(), ['components/button [category-tag]: tags include other categories: layouts']);
  });

  it('fails on a title over 60 characters', async t => {
    const f = fixture(t);
    const title = `Button ${'x'.repeat(54)}`;
    f.editFrontMatter(BUTTON, { title: `'${title}'` });
    f.editJson(guide(BUTTON), data => { data.name = title; });
    f.editIndexEntry('button', entry => { entry.name = title; });
    assertErrors(await f.run(), ['components/button [title-length]: the title has 61 characters (at most 60)']);
  });

  it('fails when the Markdown title, the JSON name, and the index name differ', async t => {
    const f = fixture(t);
    const { name } = JSON.parse(f.read(guide(BUTTON)));
    const renamed = `${name} renamed`;
    f.editJson(guide(BUTTON), data => { data.name = renamed; });
    assertErrors(await f.run(), [
      `components/button [name-mismatch]: Markdown title ${JSON.stringify(name)}, JSON name ${JSON.stringify(renamed)}, index name ${JSON.stringify(name)}`
    ]);
  });

  it('fails on potion page fields that are not text, or not three behaviors', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { promptReuse: "''", useWhen: "'you need a button.'", specifies: '[one, two]' });
    assertErrors(await f.run(), [
      'components/button [page-fields]: promptReuse is "", expected text',
      'components/button [page-fields]: specifies is ["one","two"], expected a list of three behaviors'
    ]);
  });

  it('fails on specifies or example without useWhen', async t => {
    const f = fixture(t);
    f.editFrontMatter(BUTTON, { useWhen: undefined, example: "'Someone presses it.'" });
    assertErrors(await f.run(), ['components/button [page-fields]: specifies and example need useWhen']);
  });

  // The Markdown body

  it('fails on emoji in the Markdown', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => `${text}\n🎉\n`);
    assertErrors(await f.run(), ['components/button [emoji]: 1 emoji in the Markdown: 🎉']);
  });

  it('fails on box-drawing characters in the Markdown', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => `${text}\n┌──┐\n`);
    assertErrors(await f.run(), ['components/button [text-diagram]: 4 box-drawing characters (text diagrams) in the Markdown']);
  });

  it('fails on a Markdown table', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => `${text}\n${TABLE}\n`);
    assertErrors(await f.run(), ['components/button [markdown-table]: 1 Markdown table(s)']);
  });

  [
    ['a backtick fence', `\`\`\`text\n${TABLE}\n\`\`\``],
    ['a tilde fence', `~~~\n${TABLE}\n~~~`],
    ['indented code', TABLE.split('\n').map(line => `    ${line}`).join('\n')],
    ['an HTML block', `<div>\n${TABLE}\n</div>`],
    ['a fence that is never closed', `\`\`\`\n${TABLE}`]
  ].forEach(([name, block]) => {
    it(`accepts table-like text in ${name}`, async t => {
      const f = fixture(t);
      f.edit(markdown(BUTTON), text => `${text}\nExample:\n\n${block}\n`);
      assertPasses(await f.run());
    });
  });

  it('fails on a table after a code block', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => `${text}\nExample:\n\n\`\`\`\ncode\n\`\`\`\n\n${TABLE}\n`);
    assertErrors(await f.run(), ['components/button [markdown-table]: 1 Markdown table(s)']);
  });

  it('fails on level-1 headings in the Markdown body, in either syntax', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => text.replace(/\n---\n/, '\n---\n\n# Button\n') + '\nAnother title\n=============\n');
    assertErrors(await f.run(), [
      'components/button [markdown-h1]: 2 level-1 heading(s) in the Markdown: "Button", "Another title" (the page shows the title as its h1, so headings start at ##)'
    ]);
  });

  it('accepts # lines in code blocks and deeper headings', async t => {
    const f = fixture(t);
    f.edit(markdown(BUTTON), text => `${text}\n## Install\n\n\`\`\`sh\n# install the package\nnpm install\n\`\`\`\n\n    # indented code\n`);
    assertPasses(await f.run());
  });

  it('fails on template placeholders, listed one by one', async t => {
    const f = fixture(t);
    f.editJson(guide(BUTTON), data => { data.description += ' {{USER_FRAMEWORK}}'; });
    f.edit(markdown(BUTTON), text => `${text}\n{{USER_FRAMEWORK}} and {{USER_STYLING_LIBRARY}}\n`);
    assertErrors(await f.run(), [
      'components/button [placeholder]: placeholders left in the JSON: {{USER_FRAMEWORK}}',
      'components/button [placeholder]: placeholders left in the Markdown: {{USER_FRAMEWORK}}, {{USER_STYLING_LIBRARY}}'
    ]);
  });

  // URLs, related potions, and dates

  it('fails on guide URLs that end in .html or point elsewhere', async t => {
    const f = fixture(t);
    f.editJson(guide(BUTTON), data => Object.assign(data.meta, {
      webUrl: `${BUTTON_URL}.html`,
      agentGuideUrl: 'https://uipotion.com/potions/button.json'
    }));
    f.editIndexEntry('button', entry => { entry.markdownUrl = `${BUTTON_URL}.html.md`; });
    assertErrors(await f.run(), [
      `components/button [urls]: meta.webUrl is "${BUTTON_URL}.html", expected ${BUTTON_URL}`,
      `components/button [urls]: meta.agentGuideUrl is "https://uipotion.com/potions/button.json", expected ${BUTTON_URL}.json`,
      `components/button [urls]: the index entry's markdownUrl is "${BUTTON_URL}.html.md", expected ${BUTTON_URL}.md`
    ]);
  });

  it('fails on related potions that do not exist, are required, or are not objects', async t => {
    const f = fixture(t);
    f.editJson(guide(BUTTON), data => {
      const related = { category: 'components', relationship: 'used-in', description: 'A related potion.' };
      data.meta.relatedPotions = [{ ...related, id: 'ghost', required: false }, { ...related, id: 'dialog', required: true }, null];
    });
    assertIncludesErrors(await f.run(), [
      "components/button [related-potions]: related potion components/ghost doesn't exist",
      'components/button [related-potions]: related potion components/dialog has required: true (use false)',
      'components/button [related-potions]: related potion 3 is null, not an object'
    ]);
  });

  it('fails on meta.updated before meta.created', async t => {
    const f = fixture(t);
    const { created } = JSON.parse(f.read(guide(BUTTON))).meta;
    f.editJson(guide(BUTTON), data => { data.meta.updated = '2000-01-01'; });
    f.editIndexEntry('button', entry => { entry.updated = '2000-01-01'; });
    assertErrors(await f.run(), [`components/button [dates]: meta.updated 2000-01-01 is before meta.created ${created}`]);
  });

  it('fails on site dates that are not real dates', async t => {
    const f = fixture(t);
    let updated;
    f.editJson(INDEX, index => { index.lastUpdated = 'tomorrow'; });
    f.editJson(MANIFEST, manifest => {
      updated = manifest.meta.updated;
      manifest.meta.updated = [updated];
    });
    assertErrors(await f.run(), [
      'site [dates]: potions-index.json lastUpdated is "tomorrow", expected a real date as YYYY-MM-DD',
      `site [dates]: uipotion-manifest.json meta.updated is ${JSON.stringify([updated])}, expected a real date as YYYY-MM-DD`
    ]);
  });

  it('fails on a site date before the latest potion update', async t => {
    const f = fixture(t);
    const latest = JSON.parse(f.read(INDEX)).potions.map(entry => entry.updated).sort().pop();
    f.editJson(INDEX, index => { index.lastUpdated = '2000-01-01'; });
    assertErrors(await f.run(), [
      `site [dates]: potions-index.json lastUpdated is "2000-01-01", before the latest potion update ${latest}`
    ]);
  });

  it('reports a manifest that is null instead of crashing', async t => {
    const f = fixture(t);
    f.write(MANIFEST, 'null');
    assertErrors(await f.run(), ['site [dates]: src/statics/uipotion-manifest.json is null, not an object']);
  });

  it('reports a manifest that is not valid JSON', async t => {
    const f = fixture(t);
    f.write(MANIFEST, '{');
    assertOneErrorStarting(await f.run(), 'site [dates]: could not read src/statics/uipotion-manifest.json: ');
  });

  // References to the guide's own parts, and the acceptance checklist

  it("fails on a guide's references to parts it doesn't have", async t => {
    const f = fixture(t);
    let step;
    f.editJson(guide(BUTTON), data => {
      step = data.aiAgentInstructions.implementationSteps.length;
      data.aiAgentInstructions.implementationSteps.push('Check accessibility.noSuchPart and componentSpec.interactions.noSuchEvent.');
    });
    assertErrors(await f.run(), [
      `components/button [section-refs]: aiAgentInstructions.implementationSteps[${step}] cites accessibility.noSuchPart, which isn't in the guide`,
      `components/button [section-refs]: aiAgentInstructions.implementationSteps[${step}] cites componentSpec.interactions.noSuchEvent, which isn't in the guide`
    ]);
  });

  it('accepts references that resolve, array items by their event, and skips code and file names', async t => {
    const f = fixture(t);
    f.editJson(guide(BUTTON), data => {
      data.aiAgentInstructions.implementationSteps.push('Follow componentSpec.interactions.press and accessibility.focusManagement, with values from tokens.json.');
      data.frameworkPatterns.snippet = 'accessibility.noSuchPart();';
      data.stylingApproaches = { snippet: 'componentSpec.noSuchPart' };
    });
    assertPasses(await f.run());
  });

  it('fails when the acceptance checklist differs from testingChecklist', async t => {
    const f = fixture(t);
    const items = JSON.parse(f.read(guide(DIALOG))).testingChecklist;
    f.edit(markdown(DIALOG), text => text.replace(`- [ ] ${items[1]}\n`, () => `- [ ] ${items[1]} (changed)\n`));
    assertErrors(await f.run(), [
      `components/dialog [checklist]: the acceptance checklist differs from testingChecklist at item 2: ${JSON.stringify(`${items[1]} (changed)`)} in the Markdown, ${JSON.stringify(items[1])} in the JSON`
    ]);
  });

  it('fails when the acceptance checklist and testingChecklist have different counts', async t => {
    const f = fixture(t);
    let items;
    f.editJson(guide(DIALOG), data => {
      items = [...data.testingChecklist];
      data.testingChecklist.pop();
    });
    assertErrors(await f.run(), [
      `components/dialog [checklist]: the acceptance checklist differs from testingChecklist at item ${items.length}: ${JSON.stringify(items.at(-1))} in the Markdown, missing in the JSON (${items.length} items in the Markdown, ${items.length - 1} in testingChecklist)`
    ]);
  });

  it('reads the acceptance checklist up to the next heading, with the heading in any case, outside code', async t => {
    const f = fixture(t);
    const items = JSON.parse(f.read(guide(BUTTON))).testingChecklist;
    const section = list => `## Acceptance Checklist\n\n${list.map(item => `- [ ] ${item}`).join('\n')}\n\n`;
    const changed = [...items.slice(0, -1), 'A different last item'];
    // The section after it has "- [ ] " items too
    f.edit(markdown(BUTTON), text => text.replace(/## Acceptance checklist\n[\s\S]*?(?=## See also\n)/, () => (
      `\`\`\`md\n${section(['Not an item'])}\`\`\`\n\n${section(changed)}## Notes\n\n- [ ] Not an item either\n\n`
    )));
    assertErrors(await f.run(), [
      `components/button [checklist]: the acceptance checklist differs from testingChecklist at item ${items.length}: "A different last item" in the Markdown, ${JSON.stringify(items.at(-1))} in the JSON`
    ]);
  });

  // Any Markdown syntax for the checklist's heading and items (chunk 14 review round 1)

  const changedItem = items => `components/dialog [checklist]: the acceptance checklist differs from testingChecklist at item 2: ${JSON.stringify(`${items[1]} (changed)`)} in the Markdown, ${JSON.stringify(items[1])} in the JSON`;

  [
    ['with closing hashes', '## Acceptance checklist ##'],
    ['in Setext syntax', 'Acceptance checklist\n--------------------'],
    ['indented by three spaces', '   ## Acceptance checklist'],
    ['at level 3', '### Acceptance checklist']
  ].forEach(([name, heading]) => {
    it(`checks an acceptance checklist under a heading ${name}`, async t => {
      const f = fixture(t);
      const items = JSON.parse(f.read(guide(DIALOG))).testingChecklist;
      f.edit(markdown(DIALOG), text => text
        .replace('## Acceptance checklist\n', () => `${heading}\n`)
        .replace(`- [ ] ${items[1]}\n`, () => `- [ ] ${items[1]} (changed)\n`));
      assertErrors(await f.run(), [changedItem(items)]);
    });
  });

  it('fails on a continuation line added to a checklist item', async t => {
    const f = fixture(t);
    const items = JSON.parse(f.read(guide(DIALOG))).testingChecklist;
    f.edit(markdown(DIALOG), text => text.replace(`- [ ] ${items[1]}\n`, () => `- [ ] ${items[1]}\n  (changed)\n`));
    assertErrors(await f.run(), [changedItem(items)]);
  });

  it('accepts a checklist item wrapped over two lines', async t => {
    const f = fixture(t);
    const items = JSON.parse(f.read(guide(DIALOG))).testingChecklist;
    const wrapped = items[1].replace(/(.{30,}?) /, '$1\n  ');
    assert.notEqual(wrapped, items[1]);
    f.edit(markdown(DIALOG), text => text.replace(`- [ ] ${items[1]}\n`, () => `- [ ] ${wrapped}\n`));
    assertPasses(await f.run());
  });

  it('fails on a checklist item without a box', async t => {
    const f = fixture(t);
    const items = JSON.parse(f.read(guide(DIALOG))).testingChecklist;
    f.edit(markdown(DIALOG), text => text.replace(`- [ ] ${items[1]}\n`, () => `- ${items[1]}\n`));
    assertErrors(await f.run(), [
      `components/dialog [checklist]: the acceptance checklist differs from testingChecklist at item 2: ${JSON.stringify(items[1])} (without a "[ ] " box) in the Markdown, ${JSON.stringify(items[1])} in the JSON`
    ]);
  });

  it('reads the acceptance checklist past lower headings, up to the next heading of its level in any syntax', async t => {
    const f = fixture(t);
    const items = JSON.parse(f.read(guide(DIALOG))).testingChecklist;
    f.edit(markdown(DIALOG), text => text
      .replace(`- [ ] ${items[6]}\n`, () => `- [ ] ${items[6]}\n\n### When it closes\n\n`)
      .replace('## See also\n', 'See also\n--------\n'));
    assertPasses(await f.run());
  });

  it('fails on a guide without an acceptance checklist section', async t => {
    const f = fixture(t);
    f.edit(markdown(DIALOG), text => text.replace('## Acceptance checklist\n', '## Checks\n'));
    assertErrors(await f.run(), ['components/dialog [checklist]: the Markdown has no "Acceptance checklist" section listing testingChecklist']);
  });
});
