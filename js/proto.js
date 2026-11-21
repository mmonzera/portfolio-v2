/* Interactive prototype viewer — slices a screenshot into a clickable walkthrough. Data lives in proto-data.js */
(() => {
  'use strict';
  const DATA = window.PROTOS || {};
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const pct = (v, total) => (v / total * 100).toFixed(3) + '%';
  // image paths in proto-data.js are relative to the site root (js/ is one level down)
  const siteRoot = new URL('../', document.currentScript.src);

  document.querySelectorAll('[data-proto]').forEach(root => {
    const cfg = DATA[root.dataset.proto];
    if (!cfg) return;
    const order = Object.keys(cfg.screens);
    let screenId = cfg.start || order[0];
    let active = 0;

    // ---------- markup ----------
    root.classList.add('px', 'px-' + (cfg.kind || 'desktop'));
    const stage = el('div', 'px-stage');
    const view = el('div', 'px-view');
    const img = el('img', 'px-img'); img.alt = ''; img.draggable = false;
    const layer = el('div', 'px-layer');
    view.append(img, layer);
    const badge = el('span', 'px-badge', 'interactive');
    stage.append(badge, view);

    const side = el('aside', 'px-side');
    const eyebrow = el('p', 'px-eyebrow', 'interactive prototype');
    const h = el('h3', 'px-title', cfg.title);
    const hint = el('p', 'px-hint', cfg.hint);
    const tabs = el('div', 'px-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Screens');
    const steps = el('ol', 'px-steps');
    const detail = el('div', 'px-detail'); detail.setAttribute('aria-live', 'polite');
    const full = el('button', 'px-full', 'open this screen full size ⤢'); full.type = 'button';
    side.append(eyebrow, h, hint, tabs, steps, detail, full);
    root.replaceChildren(stage, side);

    // ---------- screens ----------
    function drawScreen(opts = {}) {
      const s = cfg.screens[screenId], c = s.crop;
      stage.dataset.screen = screenId;
      view.style.aspectRatio = `${c.w} / ${c.h}`;
      img.src = new URL(s.img, siteRoot).href;
      img.style.width = pct(s.w, c.w);
      img.style.height = pct(s.h, c.h);
      img.style.left = '-' + pct(c.x, c.w);
      img.style.top = '-' + pct(c.y, c.h);
      view.classList.remove('swap'); void view.offsetWidth; if (!opts.silent) view.classList.add('swap');

      const place = (node, r) => {
        node.style.left = pct(r[0] - c.x, c.w);
        node.style.top = pct(r[1] - c.y, c.h);
        node.style.width = pct(r[2], c.w);
        node.style.height = pct(r[3], c.h);
      };

      layer.replaceChildren();
      (s.nav || []).forEach(n => {
        const b = el('button', 'px-nav'); b.type = 'button';
        b.setAttribute('aria-label', 'Go to ' + n.label);
        b.title = 'Go to ' + n.label;
        place(b, n.rect);
        b.addEventListener('click', () => { screenId = n.goto; active = 0; render(); });
        layer.append(b);
      });
      s.notes.forEach((n, i) => {
        const z = el('button', 'px-note'); z.type = 'button';
        z.dataset.i = i;
        z.setAttribute('aria-label', `Note ${i + 1}: ${n.title}`);
        place(z, n.rect);
        z.append(el('span', 'px-pin', String(i + 1)));
        z.addEventListener('click', () => select(i));
        layer.append(z);
      });
    }

    function renderSide() {
      const s = cfg.screens[screenId];
      tabs.replaceChildren(...order.map(id => {
        const b = el('button', 'px-tab', cfg.screens[id].label); b.type = 'button';
        b.setAttribute('aria-pressed', String(id === screenId));
        b.addEventListener('click', () => { screenId = id; active = 0; render(); });
        return b;
      }));
      steps.replaceChildren(...s.notes.map((n, i) => {
        const li = el('li'); const b = el('button', 'px-step'); b.type = 'button';
        b.append(el('span', 'px-n', String(i + 1)), el('span', '', n.title));
        b.addEventListener('click', () => select(i));
        li.append(b); return li;
      }));
    }

    function select(i) {
      active = i;
      const s = cfg.screens[screenId], n = s.notes[i];
      layer.querySelectorAll('.px-note').forEach(z => z.classList.toggle('on', Number(z.dataset.i) === i));
      steps.querySelectorAll('.px-step').forEach((b, k) => b.classList.toggle('on', k === i));
      detail.replaceChildren(el('h4', '', n.title), el('p', '', n.text),
        el('p', 'px-count', `${i + 1} of ${s.notes.length}`));
    }

    function render() { drawScreen(); renderSide(); select(active); }

    full.addEventListener('click', () => {
      const s = cfg.screens[screenId];
      const src = new URL(s.img, siteRoot).href;
      if (window.PortfolioLightbox) window.PortfolioLightbox.open([{ src, alt: cfg.title + ' — ' + s.label }], 0);
      else window.open(src, '_blank', 'noopener');
    });

    render();
  });
})();
