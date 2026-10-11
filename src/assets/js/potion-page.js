// Potion pages: a reading progress line under the header, and links to sections.
(function () {
  const article = document.querySelector('.potion-article');
  const header = document.querySelector('.main-header');
  if (!article || !header) return;

  // Reading progress: how far through the guide the reader is, as a thin line under the header
  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  header.appendChild(bar);
  let pending = false;

  function update() {
    pending = false;
    const box = article.getBoundingClientRect();
    const top = header.offsetHeight;
    const progress = (top - box.top) / Math.max(1, box.height - (window.innerHeight - top));
    bar.style.setProperty('--progress', Math.min(1, Math.max(0, progress)).toFixed(4));
  }

  window.addEventListener('scroll', function () {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Section links: each h2 and h3 gets an id and a "#" link. The heading a link points to is
  // marked with a highlighter stroke (CSS :target).
  const used = new Set();
  article.querySelectorAll('h2, h3').forEach(function (heading) {
    const base = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    let id = heading.id || base;
    for (let n = 2; !heading.id && (used.has(id) || document.getElementById(id)); n++) {
      id = base + '-' + n;
    }
    used.add(id);
    heading.id = id;

    const text = document.createElement('span');
    text.className = 'section-heading-text';
    while (heading.firstChild) text.appendChild(heading.firstChild);
    heading.appendChild(text);

    const link = document.createElement('a');
    link.className = 'section-anchor';
    link.href = '#' + id;
    link.setAttribute('aria-label', 'Link to this section');
    link.textContent = '#';
    heading.appendChild(link);
  });

  // A link to a section opened the page before the ids existed: go there now
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
})();
