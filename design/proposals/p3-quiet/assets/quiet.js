/* p3 "Quiet craft" mockup behaviour. Static mockups only; the Astro islands reimplement this. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || root.hasAttribute('data-still');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage blocked */ } },
  };

  const SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
  <symbol id="i-play" viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-pause" viewBox="0 0 24 24"><path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-prev" viewBox="0 0 24 24"><path d="M18 5v14L8 12z" fill="currentColor" stroke="none"/><path d="M6 5v14"/></symbol>
  <symbol id="i-next" viewBox="0 0 24 24"><path d="M6 5v14l10-7z" fill="currentColor" stroke="none"/><path d="M18 5v14"/></symbol>
  <symbol id="i-shuffle" viewBox="0 0 24 24"><path d="M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5"/></symbol>
  <symbol id="i-repeat" viewBox="0 0 24 24"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></symbol>
  <symbol id="i-vol" viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></symbol>
  <symbol id="i-mute" viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></symbol>
  <symbol id="i-expand" viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></symbol>
  <symbol id="i-collapse" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
  <symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></symbol>
  <symbol id="i-share" viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></symbol>
  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-linkedin" viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3zM9.5 9.5h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V21h-4z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-github" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4A8 8 0 1 1 20 12z"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
  <symbol id="i-send" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></symbol>
  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>
  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></symbol>
  <symbol id="i-system" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></symbol>
  <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
  <symbol id="i-reply" viewBox="0 0 24 24"><path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v5"/></symbol>
  <symbol id="i-left" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></symbol>
  <symbol id="i-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></symbol>
  <symbol id="i-alert" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></symbol>
  <symbol id="i-inbox" viewBox="0 0 24 24"><path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6H3v-6z"/></symbol>
</svg>`;
  document.body.insertAdjacentHTML('afterbegin', SPRITE);

  /* Theme: ?theme= (for screenshots) > saved choice > system */
  const applyTheme = (t) => { root.dataset.gkTheme = t; };
  const qp = new URLSearchParams(location.search).get('theme');
  applyTheme(qp || store.get('q-theme') || 'system');
  document.querySelectorAll('.q-theme input').forEach((inp) => {
    inp.checked = inp.value === root.dataset.gkTheme;
    inp.addEventListener('change', () => { applyTheme(inp.value); store.set('q-theme', inp.value); });
  });

  /* Sticky nav hairline once the page scrolls */
  const nav = document.querySelector('.q-nav');
  if (nav) {
    const onScroll = () => nav.toggleAttribute('data-scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* Rotating role line: fade + slide, paused for reduced motion and while hovered/focused */
  document.querySelectorAll('.q-rotor').forEach((rotor) => {
    const items = [...rotor.children];
    if (items.length < 2 || reduce) return;
    let i = 0, paused = false;
    const host = rotor.closest('.q-role') || rotor;
    host.addEventListener('mouseenter', () => { paused = true; });
    host.addEventListener('mouseleave', () => { paused = false; });
    setInterval(() => {
      if (paused || document.hidden) return;
      const cur = items[i]; i = (i + 1) % items.length; const nxt = items[i];
      cur.removeAttribute('data-on'); cur.setAttribute('data-off', '');
      nxt.removeAttribute('data-off'); nxt.setAttribute('data-on', '');
      setTimeout(() => cur.removeAttribute('data-off'), 450);
    }, 2800);
  });

  /* Count-up once in view. Markup holds the final number, so no-JS and reduced motion show it as is. */
  const counters = document.querySelectorAll('[data-count]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target, end = Number(el.dataset.count), t0 = performance.now(), dur = 1100;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(end * eased).toLocaleString('en-IN');
          if (p < 1) requestAnimationFrame(tick);
        };
        el.textContent = '0'; requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }

  /* Stats rail: overflow + end detection drives the edge fade and the prev/next buttons */
  document.querySelectorAll('.q-rail').forEach((rail) => {
    const track = rail.querySelector('.q-stats');
    const sync = () => {
      rail.toggleAttribute('data-overflow', track.scrollWidth > track.clientWidth + 2);
      rail.toggleAttribute('data-end', track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
    };
    track.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
    rail.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => {
      track.scrollBy({ left: Number(b.dataset.dir) * track.clientWidth * 0.5, behavior: reduce ? 'auto' : 'smooth' });
    }));
  });

  /* Section index + TOC: mark the section in view */
  const spy = (links, attr) => {
    const map = new Map();
    links.forEach((a) => { const t = document.querySelector(a.getAttribute('href')); if (t) map.set(t, a); });
    if (!map.size) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.removeAttribute(attr));
        map.get(e.target).setAttribute(attr, 'true');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, t) => io.observe(t));
  };
  spy([...document.querySelectorAll('.q-index a')], 'aria-current');
  spy([...document.querySelectorAll('.q-toc a')], 'aria-current');

  /* Toast */
  const toast = document.querySelector('.q-toast');
  const say = (msg) => { if (!toast) return; toast.textContent = msg; toast.hidden = false; clearTimeout(say.t); say.t = setTimeout(() => { toast.hidden = true; }, 2200); };

  /* Like: one per device */
  document.querySelectorAll('.q-like').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    const n = b.querySelector('[data-n]'); if (n) n.textContent = Number(n.textContent) + (on ? 1 : -1);
    b.removeAttribute('data-pop'); void b.offsetWidth; if (on) b.setAttribute('data-pop', '');
  }));

  /* Share: Web Share API where it exists (mobile), menu otherwise */
  document.querySelectorAll('.q-share').forEach((wrap) => {
    const btn = wrap.querySelector('[aria-haspopup]'), menu = wrap.querySelector('.q-menu');
    const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', async () => {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) {
        try { await navigator.share({ title: document.title, url: location.href }); return; } catch { /* cancelled */ }
      }
      const open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      if (open) menu.querySelector('button, a').focus();
    });
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); btn.focus(); } });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
    menu.querySelector('[data-copy]')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); } catch { /* file:// */ }
      close(); say('Link copied');
    });
  });

  /* Player: UI state only (the mockup has no audio file) */
  document.querySelectorAll('[data-player]').forEach((p) => {
    const play = p.querySelectorAll('[data-play]');
    const setPlay = (on) => {
      p.toggleAttribute('data-playing', on);
      play.forEach((b) => {
        b.setAttribute('aria-label', on ? 'Pause' : 'Play');
        b.querySelector('use').setAttribute('href', on ? '#i-pause' : '#i-play');
      });
    };
    play.forEach((b) => b.addEventListener('click', () => setPlay(!p.hasAttribute('data-playing'))));
    const loop = p.querySelector('[data-loop]');
    if (loop) loop.addEventListener('click', () => {
      const order = ['off', 'all', 'one'], next = order[(order.indexOf(loop.dataset.mode) + 1) % 3];
      loop.dataset.mode = next;
      loop.setAttribute('aria-label', { off: 'Loop off', all: 'Loop playlist', one: 'Loop this track' }[next]);
      const badge = loop.querySelector('.q-ib__badge'); if (badge) badge.textContent = next === 'one' ? '1' : '';
    });
    const shuf = p.querySelector('[data-shuffle]');
    if (shuf) shuf.addEventListener('click', () => shuf.setAttribute('aria-pressed', String(shuf.getAttribute('aria-pressed') !== 'true')));
    p.querySelectorAll('.q-range').forEach((r) => {
      const s = () => r.style.setProperty('--v', `${((r.value - r.min) / (r.max - r.min)) * 100}%`);
      r.addEventListener('input', s); s();
    });
  });

  /* Chat chips: sending hides the starters (decision 10) */
  document.querySelectorAll('[data-chat]').forEach((c) => {
    c.querySelectorAll('[data-starter]').forEach((chip) => chip.addEventListener('click', () => {
      const starters = chip.closest('.q-chips'); if (starters) starters.hidden = true;
    }));
  });
})();
