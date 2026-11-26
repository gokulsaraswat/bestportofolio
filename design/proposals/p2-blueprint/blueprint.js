/* Mockup behaviour only. ?theme=light|dark|system forces a theme for screenshots; default follows the system. */
(function () {
  const root = document.documentElement;
  const params = new URLSearchParams(location.search);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || params.get('motion') === 'reduce';

  function setTheme(t) {
    root.setAttribute('data-gk-theme', t);
    document.querySelectorAll('[data-theme-set]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.themeSet === t)));
  }
  let stored = null;
  try { stored = localStorage.getItem('pf-theme'); } catch (e) {}
  setTheme(params.get('theme') || stored || 'system');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-theme-set]');
    if (!b) return;
    setTheme(b.dataset.themeSet);
    try { localStorage.setItem('pf-theme', b.dataset.themeSet); } catch (err) {}
  });

  // rotating role line
  const slot = document.querySelector('[data-roles]');
  if (slot) {
    const items = [...slot.children];
    const live = document.querySelector('[data-role-live]');
    let i = 0;
    items[0].classList.add('is-on');
    if (!reduce && items.length > 1 && params.get('still') === null) {
      setInterval(() => {
        const cur = items[i];
        i = (i + 1) % items.length;
        cur.classList.remove('is-on'); cur.classList.add('is-off');
        setTimeout(() => cur.classList.remove('is-off'), 450);
        items[i].classList.add('is-on');
        if (live) live.textContent = '"' + items[i].textContent + '"';
      }, 2800);
    }
  }

  // count-up once in view
  const nums = document.querySelectorAll('[data-count]');
  const fmt = (n) => n.toLocaleString('en-IN');
  function run(el) {
    const end = Number(el.dataset.count);
    if (reduce || params.has("still")) { el.firstChild.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1100;
    (function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.firstChild.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  if (params.has('still')) nums.forEach(run);
  else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    }), { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  } else nums.forEach(run);

  // rail prev/next
  document.querySelectorAll('[data-rail-ctl]').forEach((ctl) => {
    const rail = document.getElementById(ctl.dataset.railCtl);
    ctl.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => {
      rail.scrollBy({ left: Number(b.dataset.dir) * rail.clientWidth * 0.5, behavior: reduce ? 'auto' : 'smooth' });
    }));
  });

  // toggles: like, shuffle, play
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toggle]');
    if (!t) return;
    const on = t.getAttribute('aria-pressed') !== 'true';
    t.setAttribute('aria-pressed', String(on));
    const c = t.querySelector('[data-n]');
    if (c) c.textContent = Number(c.textContent) + (on ? 1 : -1);
  });

  // loop: off -> all -> one
  document.querySelectorAll('[data-loop]').forEach((b) => b.addEventListener('click', () => {
    const order = ['off', 'all', 'one'];
    const next = order[(order.indexOf(b.dataset.loop) + 1) % 3];
    b.dataset.loop = next;
    b.setAttribute('aria-pressed', String(next !== 'off'));
    b.setAttribute('aria-label', 'Loop: ' + next);
    b.querySelector('.badge1').hidden = next !== 'one';
  }));

  // tabs in request card / file tabs
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    list.addEventListener('click', (e) => {
      const tab = e.target.closest('[role="tab"]');
      if (!tab) return;
      list.querySelectorAll('[role="tab"]').forEach((t) => {
        const sel = t === tab;
        t.setAttribute('aria-selected', String(sel));
        const p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !sel;
      });
    });
  });
})();
