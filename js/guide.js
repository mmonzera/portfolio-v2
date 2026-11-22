/* Tour guide: a small copy of the hero character that tags along once the hero scrolls away.
   It watches the cursor, comments on the section you are in, and explains a case study when you hover/focus its card. */
(() => {
  'use strict';
  const portrait = document.getElementById('portrait');
  if (!portrait) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- context lines (taken from each case study's own summary) ---------- */
  const WORK = {
    'works/loan-collection-hub.html': 'One 360° workspace for Collection PICs: customer profiles, billing histories and action logging in one place. Has a clickable prototype.',
    'works/loan-collection-mobile.html': 'A mobile app to manage and track loans on the go, day to day. Try the prototype inside.',
    'works/gen-ai-companion.html': 'Gen AI that simplifies complex data analysis and changes how users read and interpret information. Prototype inside.',
    'works/drag-and-drop-interface.html': 'A manual process turned into drag-and-drop, as part of a visual overhaul to the new design system. Prototype inside.',
    'works/idecision-visual-identity.html': 'A brand philosophy turned into a scalable design system for banking-grade risk management.',
  };
  const SECTION = {
    works: 'These are my case studies. Hover one and I\'ll tell you what it\'s about.',
    apps: 'Side projects: two apps I designed and built for myself.',
    contact: 'Want to work together, or just say hi? Pick any link.',
  };

  /* ---------- build: clone the hero portrait, cropped to the head ---------- */
  const guide = document.createElement('div');
  guide.className = 'guide';
  guide.innerHTML = '<div class="guide-bubble" role="status" aria-live="polite"></div>' +
                    '<button class="guide-av" type="button" aria-label="Tour guide. Activate to hear the tip again."><span class="guide-ring"></span></button>';
  const svg = portrait.cloneNode(true);
  let markup = svg.outerHTML
    .replace(/\bid="([^"]+)"/g, 'id="$1-g"')
    .replace(/url\(#([^)]+)\)/g, 'url(#$1-g)')
    .replace(/href="#([^"]+)"/g, 'href="#$1-g"');
  const holder = document.createElement('div'); holder.innerHTML = markup;
  const gsvg = holder.firstElementChild;
  gsvg.setAttribute('viewBox', '120 110 360 380');
  gsvg.setAttribute('aria-hidden', 'true'); gsvg.removeAttribute('role'); gsvg.removeAttribute('aria-label');
  gsvg.removeAttribute('class');
  const av = guide.querySelector('.guide-av'), bubble = guide.querySelector('.guide-bubble');
  av.prepend(gsvg);
  document.body.append(guide);

  const eyes = [
    { g: gsvg.querySelector('#eyeL-g'), iris: gsvg.querySelector('#irisL-g'), cx: 242, cy: 320, x: 0, y: 0 },
    { g: gsvg.querySelector('#eyeR-g'), iris: gsvg.querySelector('#irisR-g'), cx: 358, cy: 320, x: 0, y: 0 },
  ];
  const MAX_X = 13, MAX_Y = 11;

  /* ---------- speech ---------- */
  let hideT, current = '', pinned = false, spokeIntro = false;
  const say = (text, ms = 4800) => {
    clearTimeout(hideT);
    if (text !== current) {
      current = text; bubble.textContent = text;
      if (!reduce) { guide.classList.remove('talk'); void guide.offsetWidth; guide.classList.add('talk'); }
    }
    bubble.classList.add('show');
    if (ms) hideT = setTimeout(() => { if (!pinned) bubble.classList.remove('show'); }, ms);
  };
  const hush = (delay = 700) => { clearTimeout(hideT); hideT = setTimeout(() => { if (!pinned) bubble.classList.remove('show'); }, delay); };

  /* ---------- show once the hero character has scrolled away ---------- */
  let shown = false, activeSection = null, lookAt = null;
  new IntersectionObserver(en => {
    const away = en[0].intersectionRatio < 0.22;
    if (away === shown) return;
    shown = away;
    guide.classList.toggle('on', shown);
    if (shown && !spokeIntro) { spokeIntro = true; setTimeout(() => say('I\'ll tag along. Hover a case study and I\'ll explain it.', 5200), 500); }
    if (!shown) { bubble.classList.remove('show'); pinned = false; }
  }, { threshold: [0, 0.22, 1] }).observe(portrait);

  /* ---------- section commentary ---------- */
  const spy = new IntersectionObserver(en => {
    en.forEach(e => {
      if (!e.isIntersecting || !shown || pinned) return;
      const id = e.target.id;
      if (id === activeSection) return;
      activeSection = id;
      if (SECTION[id]) say(SECTION[id]);
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  Object.keys(SECTION).forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* ---------- work cards: hover / focus (mouse & keyboard), or "centred in view" on touch ---------- */
  const cards = [...document.querySelectorAll('.work-card')];
  const explain = card => {
    const t = WORK[card.getAttribute('href')];
    if (!t || !shown) return;
    pinned = true; lookAt = card; say(t, 0);
  };
  const release = () => { pinned = false; lookAt = null; hush(900); };
  cards.forEach(c => {
    if (canHover) {
      c.addEventListener('pointerenter', () => explain(c));
      c.addEventListener('pointerleave', release);
    }
    c.addEventListener('focus', () => explain(c));
    c.addEventListener('blur', release);
  });
  if (!canHover) {
    cards.forEach(c => {
      new IntersectionObserver(en => en.forEach(e => {
        if (e.isIntersecting && shown) { lookAt = c; say(WORK[c.getAttribute('href')] || '', 6000); }
      }), { rootMargin: '-40% 0px -40% 0px' }).observe(c);
    });
  }
  av.addEventListener('click', () => say(current || SECTION[activeSection] || 'Hi!', 4200));

  /* ---------- eyes follow the cursor (or the card being explained) ---------- */
  let mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function frame() {
    if (shown) {
      const m = gsvg.getScreenCTM();
      if (m) {
        let tx = mx, ty = my;
        if (lookAt) { const r = lookAt.getBoundingClientRect(); tx = r.left + r.width / 2; ty = r.top + r.height / 2; }
        const reach = Math.max(260, Math.min(innerWidth, innerHeight) * .45);
        eyes.forEach(e => {
          if (!e.iris) return;
          const sx = m.a * e.cx + m.e, sy = m.d * e.cy + m.f;
          const dx = tx - sx, dy = ty - sy, dist = Math.hypot(dx, dy) || 1, k = Math.min(1, dist / reach);
          e.x = lerp(e.x, (dx / dist) * k * MAX_X, .14);
          e.y = lerp(e.y, (dy / dist) * k * MAX_Y, .14);
          e.iris.setAttribute('transform', `translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})`);
        });
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---------- blink ---------- */
  eyes.forEach(e => { if (e.g) e.g.style.transition = 'transform .08s ease-in-out'; });
  const blink = () => { eyes.forEach(e => e.g && (e.g.style.transform = 'scaleY(.08)')); setTimeout(() => eyes.forEach(e => e.g && (e.g.style.transform = '')), 120); };
  if (!reduce) (function loop() { setTimeout(() => { if (shown) blink(); loop(); }, 2400 + Math.random() * 3200); })();
})();
