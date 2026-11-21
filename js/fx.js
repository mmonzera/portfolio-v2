/* Motion & micro-interactions for the home page. Everything is skipped for prefers-reduced-motion. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const COLORS = ['#ff5a1f', '#2147d8', '#ffb800', '#18b34a', '#7b4dff'];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- scroll progress bar ---------- */
  const bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);

  /* ---------- nav scroll-spy ---------- */
  const navLinks = [...document.querySelectorAll('nav a[href^="#"]')].filter(a => a.getAttribute('href').length > 1);
  const spy = navLinks.map(a => ({ a, el: document.querySelector(a.getAttribute('href')) })).filter(x => x.el);

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      bar.style.width = Math.min(100, h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1) * 100) + '%';
      let cur = null;
      spy.forEach(s => { if (s.el.getBoundingClientRect().top < innerHeight * 0.4) cur = s.a; });
      navLinks.forEach(a => a.classList.toggle('on', a === cur));
      if (!reduce) {
        const y = Math.min(scrollY, innerHeight * 1.2);
        document.querySelectorAll('.dot').forEach((d, i) => { d.style.translate = `0 ${(y * (i ? 0.18 : 0.3)).toFixed(1)}px`; });
        const w = document.getElementById('waves');
        if (w) w.style.translate = `0 ${(y * 0.12).toFixed(1)}px`;
      }
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (reduce) return;

  /* ---------- hero title: letters drop in ---------- */
  const title = document.querySelector('.title');
  if (title) {
    const label = [...title.querySelectorAll('.a, .b')].map(p => p.textContent.trim()).join(' ');
    title.setAttribute('role', 'heading');
    title.setAttribute('aria-level', '1');
    title.setAttribute('aria-label', label);
    let n = 0;
    title.querySelectorAll('.a, .b').forEach(part => {
      const text = part.textContent;
      part.textContent = '';
      part.setAttribute('aria-hidden', 'true');
      [...text].forEach(ch => {
        const i = document.createElement('i');
        i.textContent = ch;
        i.style.setProperty('--i', n++);
        part.append(i);
      });
    });
    title.classList.add('split');
  }

  /* ---------- scroll reveal ---------- */
  const groups = [
    '.section .eyebrow', '.section-title', '.section-lead', '.work-card', '.app-feature', '.status', '.clink', '.marquee',
  ];
  const seen = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  groups.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      const sibs = [...el.parentElement.children].filter(c => c.matches(sel));
      el.style.setProperty('--d', (Math.max(0, sibs.indexOf(el)) * 0.09).toFixed(2) + 's');
      el.classList.add('reveal');
      io.observe(el);
    });
  });

  /* ---------- particles ---------- */
  function burst(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'fx-p' + (i % 2 ? ' star' : '');
      const a = rand(0, Math.PI * 2), d = rand(40, 110);
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.background = pick(COLORS);
      p.style.setProperty('--dx', Math.cos(a) * d + 'px');
      p.style.setProperty('--dy', Math.sin(a) * d - 20 + 'px');
      p.addEventListener('animationend', () => p.remove());
      document.body.append(p);
    }
  }

  /* ---------- character: click to wave + speech bubble ---------- */
  const stage = document.querySelector('.stage');
  const portrait = document.getElementById('portrait');
  if (stage && portrait) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.setAttribute('role', 'status');
    stage.append(bubble);
    const lines = [
      'Hi! I\'m Moses.', 'Psst… check my works below.', 'Move your mouse. I\'m watching.', 'Yes, those are my real glasses.',
      'Try the prototypes in the case studies!', 'Ouch! Ok ok, hello.', 'Coffee first, pixels later.', 'Scroll down, there\'s more.',
    ];
    let hideT, last = -1, spoke = false;
    const say = text => {
      bubble.textContent = text;
      bubble.classList.add('show');
      clearTimeout(hideT);
      hideT = setTimeout(() => bubble.classList.remove('show'), 2600);
    };
    portrait.addEventListener('click', e => {
      portrait.classList.remove('wiggle'); void portrait.getBoundingClientRect(); portrait.classList.add('wiggle');
      let i; do { i = Math.floor(Math.random() * lines.length); } while (i === last);
      last = i; spoke = true; say(lines[i]);
      burst(e.clientX, e.clientY, 12);
    });
    portrait.addEventListener('animationend', () => portrait.classList.remove('wiggle'));
    // greet the first time the intro is done, unless the visitor already interacted
    setTimeout(() => { if (!spoke && scrollY < 80) say('Hi! Click me.'); }, 2600);
  }

  /* ---------- click sparkles anywhere (not on the character, it has its own) ---------- */
  addEventListener('pointerdown', e => {
    if (e.target.closest('#portrait') || e.button !== 0) return;
    burst(e.clientX, e.clientY, 6);
  }, { passive: true });

  if (!fine) return;

  /* ---------- cursor trail over the hero ---------- */
  const hero = document.querySelector('.hero');
  let lastT = 0;
  hero && hero.addEventListener('pointermove', e => {
    const now = performance.now();
    if (now - lastT < 45) return;
    lastT = now;
    const t = document.createElement('span');
    t.className = 'fx-t';
    t.style.left = e.clientX + 'px'; t.style.top = e.clientY + 'px';
    t.style.background = pick(COLORS);
    t.addEventListener('animationend', () => t.remove());
    document.body.append(t);
  }, { passive: true });

  /* ---------- 3D tilt on work cards ---------- */
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      card.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
      card.style.setProperty('--rx', (-py * 9).toFixed(2) + 'deg');
      card.classList.add('tilting');
    });
    card.addEventListener('pointerleave', () => { card.classList.remove('tilting'); card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); });
  });
})();
