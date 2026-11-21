/* Lightbox: click any case-study image to view it large. Esc closes, ←/→ browse, click image to zoom to full size. */
(() => {
  'use strict';
  const ZOOMABLE = '.story img, .frame img, .metrics img';
  let list = [], idx = 0, zoomed = false, lastFocus = null;

  const root = document.createElement('div');
  root.className = 'lb';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Image viewer');
  root.hidden = true;
  root.innerHTML = `
    <div class="lb-top">
      <span class="lb-count" aria-live="polite"></span>
      <span class="lb-hint">click image to zoom · ← → to browse · esc to close</span>
      <button type="button" class="lb-btn lb-zoom" aria-label="Toggle zoom">⤢</button>
      <button type="button" class="lb-btn lb-close" aria-label="Close">✕</button>
    </div>
    <button type="button" class="lb-nav lb-prev" aria-label="Previous image">‹</button>
    <div class="lb-stage"><img alt=""></div>
    <button type="button" class="lb-nav lb-next" aria-label="Next image">›</button>
    <p class="lb-cap"></p>`;
  document.body.append(root);
  const img = root.querySelector('img');
  const stage = root.querySelector('.lb-stage');
  const count = root.querySelector('.lb-count');
  const cap = root.querySelector('.lb-cap');

  function paint() {
    const it = list[idx];
    img.src = it.src;
    img.alt = it.alt || '';
    cap.textContent = it.alt || '';
    count.textContent = list.length > 1 ? `${idx + 1} / ${list.length}` : '';
    root.classList.toggle('single', list.length < 2);
    setZoom(false);
  }
  function setZoom(on) {
    zoomed = on;
    root.classList.toggle('zoomed', on);
    img.style.width = on ? Math.min(img.naturalWidth || 2400, 2600) + 'px' : '';
    if (on) { stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2; stage.scrollTop = 0; }
  }
  function open(items, i) {
    list = items; idx = i;
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    paint();
    root.querySelector('.lb-close').focus();
  }
  function close() {
    root.hidden = true;
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  const step = d => { idx = (idx + d + list.length) % list.length; paint(); };

  root.querySelector('.lb-close').addEventListener('click', close);
  root.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  root.querySelector('.lb-next').addEventListener('click', () => step(1));
  root.querySelector('.lb-zoom').addEventListener('click', () => setZoom(!zoomed));
  img.addEventListener('click', () => { img.naturalWidth && setZoom(!zoomed); });
  img.addEventListener('load', () => { if (zoomed) setZoom(true); });
  stage.addEventListener('click', e => { if (e.target === stage && !zoomed) close(); });
  addEventListener('keydown', e => {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && list.length > 1) step(-1);
    else if (e.key === 'ArrowRight' && list.length > 1) step(1);
    else if (e.key === 'Tab') { // keep focus inside the viewer
      const f = [...root.querySelectorAll('button')].filter(b => b.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // wire up page images
  const imgs = [...document.querySelectorAll(ZOOMABLE)];
  const items = imgs.map(i => ({ src: i.currentSrc || i.src, alt: i.alt }));
  imgs.forEach((el, i) => {
    el.classList.add('zoomable');
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', (el.alt || 'Image') + ' — open larger');
    el.addEventListener('click', () => open(items, i));
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(items, i); } });
  });

  window.PortfolioLightbox = { open };
})();
