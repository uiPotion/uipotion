// Homepage hero demo: plays the markup in partials/hero-demo.hbs as three short scenes.
// Loaded on the homepage only. Starts when the demo is on screen, pauses in background tabs and
// off screen, and never autoplays under reduced motion. It stops when keyboard focus enters it or
// reduced motion is turned on. ?demo=0|1|2 shows one scene's end state.
(function () {
  var fig = document.querySelector('.hero-demo');
  if (!fig) return;
  var params = new URLSearchParams(location.search);

  var DUR = [7400, 10200, 8000];
  var TYPED = 'Can you add the rollback steps too?';
  var PAUSE_ICON = '<svg class="demo-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg>';
  var PLAY_ICON = '<svg class="demo-i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" class="demo-fill"/></svg>';

  function $(sel, el) { return (el || fig).querySelector(sel); }
  function $$(sel) { return [].slice.call(fig.querySelectorAll(sel)); }
  var viewport = $('.demo-viewport');
  var title = $('.demo-title');
  var inspector = $('.demo-inspect');
  var inspectorLabel = $('.demo-inspect-label');
  var keys = $('.demo-keys');
  var ripple = $('.demo-ripple');
  var cursorX = $('.demo-cursor');
  var cursorY = $('.demo-cursor-y');
  var toggle = $('.hero-demo-toggle');
  var tabs = $$('.demo-tab');
  var captions = $$('.demo-caption');
  var scenes = $$('.demo-scene');
  var motion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = !!(motion && motion.matches);
  var current = 0;
  var runId = 0;
  var running = false;
  var userPaused = reduce;
  var inView = false;

  // A wait that ends a stale run (after pause, a tab jump, or leaving the screen)
  function sleep(ms, id) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () { id === runId ? resolve() : reject(new Error('stale')); }, ms);
    });
  }
  function rect(el) {
    var v = viewport.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    return { x: r.left - v.left, y: r.top - v.top, w: r.width, h: r.height };
  }
  function instant(el, fn) {
    el.classList.add('demo-no-anim');
    fn();
    void el.offsetWidth;
    el.classList.remove('demo-no-anim');
  }

  // Cursor: x and y ease differently, so it travels in a slight curve
  function cursorAt(x, y, now) {
    var set = function () {
      cursorX.style.setProperty('--x', x + 'px');
      cursorY.style.setProperty('--y', y + 'px');
    };
    if (now) instant(cursorX, function () { instant(cursorY, set); });
    else set();
  }
  function cursorRest(now) {
    cursorAt(viewport.clientWidth - 34, viewport.clientHeight - 18, now);
  }
  function moveTo(el, id) {
    var r = rect(el);
    cursorAt(r.x + r.w * 0.55, r.y + r.h * 0.55);
    return sleep(820, id);
  }
  async function click(el, id) {
    var r = rect(el);
    ripple.style.left = r.x + r.w * 0.55 + 'px';
    ripple.style.top = r.y + r.h * 0.55 + 'px';
    ripple.classList.remove('is-on');
    void ripple.offsetWidth;
    ripple.classList.add('is-on');
    fig.classList.add('is-clicking');
    el.classList.add('is-pressed');
    await sleep(170, id);
    fig.classList.remove('is-clicking');
    el.classList.remove('is-pressed');
  }

  // Inspector: a labeled frame that glides between elements. It remembers what it marks,
  // so it can find the element again when the layout changes.
  var inspected = null;
  function inspect(el, label, opts) {
    opts = opts || {};
    inspected = { el: el, label: label, opts: opts };
    var r = rect(el);
    var pad = opts.pad == null ? 5 : opts.pad;
    var place = function () {
      inspector.style.setProperty('--ix', r.x - pad + 'px');
      inspector.style.setProperty('--iy', r.y - pad + 'px');
      inspector.style.setProperty('--iw', r.w + pad * 2 + 'px');
      inspector.style.setProperty('--ih', r.h + pad * 2 + 'px');
      inspector.style.setProperty('--ir', (opts.radius || 8) + pad + 'px');
      inspector.classList.toggle('is-below', r.y - pad < 26);
    };
    if (!inspector.classList.contains('is-on') || opts.now) instant(inspector, place);
    else place();
    inspectorLabel.textContent = label;
    inspector.classList.add('is-on');
    if (opts.pulse) {
      inspector.classList.remove('is-pulse');
      void inspector.offsetWidth;
      inspector.classList.add('is-pulse');
    }
  }
  function uninspect() {
    inspected = null;
    inspector.classList.remove('is-on', 'is-pulse');
  }
  function press(label) {
    keys.textContent = label;
    keys.classList.remove('is-on');
    void keys.offsetWidth;
    keys.classList.add('is-on');
  }
  function mark() {
    $('.demo-caption-text', captions[current]).classList.add('is-marked');
  }

  // ----- Scene 0: streaming reply -----
  var s0 = scenes[0];
  var stream = $('.demo-stream', s0);
  var replyText = $('.demo-reply-text', s0);
  var send0 = $('.demo-send', s0);
  var WORDS = stream.textContent.split(' ');
  function reset0() {
    stream.textContent = '';
    s0.classList.remove('is-stopped');
    send0.classList.add('is-stop');
  }
  function end0() {
    stream.textContent = WORDS.join(' ');
    s0.classList.add('is-stopped');
    send0.classList.remove('is-stop');
    inspect(replyText, 'Text kept', { now: true, radius: 6 });
  }
  async function play0(id) {
    cursorRest(true);
    fig.dataset.cursor = 'on';
    await sleep(450, id);
    for (var w = 0; w < WORDS.length; w++) {
      var span = document.createElement('span');
      span.className = 'demo-w';
      span.textContent = (w ? ' ' : '') + WORDS[w];
      stream.appendChild(span);
      if (w === 11) moveTo(send0, id).catch(function () {});
      await sleep(80, id);
    }
    await sleep(120, id);
    await click(send0, id);
    s0.classList.add('is-stopped');
    send0.classList.remove('is-stop');
    await sleep(260, id);
    inspect(replyText, 'Text kept', { radius: 6 });
    mark();
    await sleep(500, id);
    cursorRest();
  }

  // ----- Scene 1: failed send -----
  var s1 = scenes[1];
  var typed = $('.demo-typed', s1);
  var send1 = $('.demo-send', s1);
  var out = $('.demo-outgoing', s1);
  var outText = $('.demo-out-text', s1);
  var composer1 = $('.demo-composer', s1);
  var retry = $('.demo-retry', s1);
  // Full class names, so a search for them finds this code
  var OUT_STATE = { sending: 'is-sending', failed: 'is-failed', sent: 'is-sent' };
  function outState(state) {
    out.className = 'demo-bubble demo-outgoing' + (state ? ' is-on ' + OUT_STATE[state] : '');
  }
  function reset1() {
    typed.textContent = '';
    typed.classList.add('is-empty');
    composer1.classList.remove('is-busy');
    outState('');
    outText.textContent = '';
  }
  function end1() {
    typed.textContent = TYPED;
    typed.classList.remove('is-empty');
    outText.textContent = TYPED;
    outState('failed');
    inspect(composer1, 'Draft kept', { now: true, radius: 12 });
  }
  async function play1(id) {
    cursorRest(true);
    fig.dataset.cursor = 'on';
    await sleep(350, id);
    typed.classList.remove('is-empty');
    for (var c = 0; c < TYPED.length; c++) {
      typed.textContent = TYPED.slice(0, c + 1);
      if (c === 16) moveTo(send1, id).catch(function () {});
      await sleep(42, id);
    }
    await sleep(260, id);
    await click(send1, id);
    outText.textContent = TYPED;
    outState('sending');
    composer1.classList.add('is-busy');
    await sleep(1350, id);
    composer1.classList.remove('is-busy');
    outState('failed');
    await sleep(200, id);
    inspect(composer1, 'Draft kept', { radius: 12 });
    mark();
    await sleep(1500, id);
    await moveTo(retry, id);
    await click(retry, id);
    inspect(out, 'Retrying', { radius: 14 });
    outState('sending');
    await sleep(900, id);
    outState('sent');
    typed.textContent = '';
    typed.classList.add('is-empty');
    inspect(out, 'Sent', { radius: 14 });
    await sleep(250, id);
    cursorRest();
  }

  // ----- Scene 2: dialog, keyboard only -----
  var s2 = scenes[2];
  var trigger = $('.demo-trigger', s2);
  var cancel = $('.demo-cancel', s2);
  function reset2() {
    s2.classList.remove('is-open');
  }
  function end2() {
    s2.classList.remove('is-open');
    inspect(trigger, 'Focus returned', { now: true, radius: 8 });
    keys.textContent = 'Esc';
    keys.classList.add('is-on', 'is-held');
  }
  async function play2(id) {
    fig.dataset.cursor = 'off';
    await sleep(250, id);
    inspect(trigger, 'Focus', { radius: 8 });
    await sleep(900, id);
    press('Enter');
    await sleep(220, id);
    s2.classList.add('is-open');
    await sleep(320, id);
    inspect(cancel, 'Focus', { radius: 8 });
    await sleep(2000, id);
    press('Esc');
    await sleep(200, id);
    s2.classList.remove('is-open');
    await sleep(260, id);
    inspect(trigger, 'Focus returned', { radius: 8, pulse: true });
    mark();
  }

  var RESET = [reset0, reset1, reset2];
  var END = [end0, end1, end2];
  var PLAY = [play0, play1, play2];

  function setScene(i) {
    current = i;
    fig.dataset.scene = String(i);
    title.textContent = scenes[i].dataset.title;
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-pressed', String(k === i));
      t.style.setProperty('--dur', DUR[k] + 'ms');
    });
    captions.forEach(function (c, k) {
      c.hidden = k !== i;
      $('.demo-caption-text', c).classList.remove('is-marked');
    });
    RESET.forEach(function (r) { r(); });
    uninspect();
    keys.classList.remove('is-on', 'is-held');
    // A click cut short by Pause or a tab jump leaves its pressed state behind
    fig.classList.remove('is-clicking');
    $$('.is-pressed').forEach(function (el) { el.classList.remove('is-pressed'); });
  }
  function showStill(i) {
    setScene(i);
    fig.dataset.cursor = 'off';
    END[i]();
    mark();
  }
  async function loop(i, id) {
    for (;;) {
      setScene(i);
      var started = Date.now();
      await PLAY[i](id);
      await sleep(Math.max(0, DUR[i] - (Date.now() - started)), id);
      i = (i + 1) % scenes.length;
    }
  }
  function start(i) {
    running = true;
    fig.classList.add('is-playing');
    var id = ++runId;
    loop(i, id).catch(function () {});
  }
  function halt() {
    running = false;
    runId++;
    fig.classList.remove('is-playing');
  }
  function update() {
    var run = !userPaused && inView && !document.hidden;
    if (run && !running) start(current);
    if (!run && running) halt();
    $('.demo-toggle-icon').innerHTML = userPaused ? PLAY_ICON : PAUSE_ICON;
    $('.demo-toggle-text').textContent = userPaused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', (userPaused ? 'Play' : 'Pause') + ' the demo');
  }

  // Keyboard focus in the demo stops it, so a focused tab or caption link never disappears
  // with its scene (the WAI carousel pattern); Play starts it again. A mouse click on a tab
  // still jumps to that scene and keeps playing.
  fig.addEventListener('focusin', function (e) {
    if (userPaused || e.target === toggle) return;
    var keyboard = true;
    try { keyboard = e.target.matches(':focus-visible'); } catch (err) {}
    if (keyboard) {
      userPaused = true;
      update();
    }
  });

  // Positions are measured from real layout, so start after the fonts are in
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    $$('.demo-needs-js').forEach(function (el) { el.classList.remove('demo-needs-js'); });
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () {
        halt();
        if (userPaused) showStill(k);
        else start(k);
      });
    });
    toggle.addEventListener('click', function () {
      userPaused = !userPaused;
      update();
    });
    // The frame is placed in pixels: when the layout changes (a resized window, a turned
    // phone), it moves to its element again
    if ('ResizeObserver' in window) {
      new ResizeObserver(function () {
        if (inspected) inspect(inspected.el, inspected.label, { pad: inspected.opts.pad, radius: inspected.opts.radius, now: true });
      }).observe(viewport);
    }

    var forced = params.get('demo');
    if (forced !== null) {
      showStill(Number(forced));
      return;
    }
    // Reduced motion: no autoplay; the first scene's outcome stays as a still
    if (reduce) showStill(0);
    // Reduced motion turned on while the page is open: stop on the current scene's outcome
    if (motion && motion.addEventListener) {
      motion.addEventListener('change', function (e) {
        if (e.matches && !userPaused) {
          userPaused = true;
          update();
          showStill(current);
        }
      });
    }
    document.addEventListener('visibilitychange', update);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        update();
      }).observe(fig);
    } else {
      inView = true;
      update();
    }
  });
})();
