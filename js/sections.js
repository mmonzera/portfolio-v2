/* Works grid on the home page — each card links to its own case study page (works/*.html). */
(() => {
  'use strict';
  const grid = document.getElementById('worksGrid');
  const works = Array.isArray(window.WORKS) ? window.WORKS : [];
  if (!grid) return;

  works.forEach(w => {
    const a = document.createElement('a');
    a.className = 'work-card';
    a.href = w.href;

    const thumb = document.createElement('div');
    thumb.className = 'work-thumb';
    if (w.thumbnail) thumb.style.backgroundImage = `url("${w.thumbnail}")`;
    const year = document.createElement('span');
    year.className = 'work-year';
    year.textContent = w.year;
    thumb.append(year);

    const body = document.createElement('div');
    body.className = 'work-body';
    const h = document.createElement('h3'); h.textContent = w.title;
    const p = document.createElement('p'); p.textContent = w.subtitle;
    const more = document.createElement('span'); more.className = 'work-more'; more.textContent = 'read case study →';
    body.append(h, p, more);

    a.append(thumb, body);
    grid.append(a);
  });
})();

/* Mobile menu */
(() => {
  const nav = document.getElementById('siteNav');
  if (!nav) return;
  const btn = nav.querySelector('.nav-toggle'), panel = nav.querySelector('.nav-links');
  const set = open => {
    panel.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  panel.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { set(false); btn.focus(); } });
  document.addEventListener('click', e => { if (!nav.contains(e.target)) set(false); });
  matchMedia('(min-width: 641px)').addEventListener('change', e => { if (e.matches) set(false); });
})();
