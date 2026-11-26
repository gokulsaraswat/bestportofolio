/* p1 "Signal" mockup behaviour: shared chrome, theme, hero, stats, tabs, share, chat, player. Static demo, no network. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked: state stays in memory */ } },
  };

  const I = {
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/></svg>',
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="1.2"/><rect x="14" y="4" width="4.5" height="16" rx="1.2"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 5.5v13a1 1 0 0 1-1.5.86L7 13.7V18a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v4.3l9.5-5.66A1 1 0 0 1 18 5.5Z"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5.5v13a1 1 0 0 0 1.5.86L17 13.7V18a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v4.3L7.5 4.64A1 1 0 0 0 6 5.5Z"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h4v4M4 20 20 4M20 16v4h-4M15 15l5 5M4 4l5 5"/></svg>',
    loop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
    vol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
    mute: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',
    collapse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 10h8M8 13h5"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    rss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 11a8 8 0 0 1 8 8M5 5a14 14 0 0 1 14 14"/><circle cx="6" cy="18" r="1.3" fill="currentColor"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
  };
  window.PF_ICONS = I;

  /* Theme */
  const root = document.documentElement;
  const setTheme = (t, persist = true) => {
    root.setAttribute('data-gk-theme', t);
    if (persist) store.set('pf-theme', t);
    $$('input[name="pf-theme"]').forEach((r) => { r.checked = r.value === t; });
  };

  /* Shared chrome */
  const NAV = [['Work', 'projects.html', 'work'], ['Writing', 'post.html', 'writing'], ['Courses', '#', 'courses'], ['Snippets', '#', 'snippets'], ['About', '#', 'about'], ['Contact', '#', 'contact']];
  const navHost = $('[data-pf="nav"]');
  if (navHost) {
    const cur = navHost.dataset.current;
    navHost.outerHTML = `<header class="pf-nav"><div class="pf-wrap pf-nav__in">
      <a class="pf-brand" href="index.html" aria-label="Gokul Saraswat, home"><span>Gokul</span><span class="pf-brand__last">Saraswat</span></a>
      <nav aria-label="Primary"><ul class="pf-nav__links">${NAV.map(([l, h, k]) => `<li><a href="${h}"${k === cur ? ' aria-current="page"' : ''}>${l}</a></li>`).join('')}</ul></nav>
      <div class="pf-nav__end"><a class="gk-btn gk-btn--sm pf-nav__resume" href="#">Résumé (PDF)</a>
      <button class="gk-btn gk-btn--ghost gk-btn--icon pf-nav__menu" type="button" aria-label="Open menu" aria-expanded="false"><span class="pf-icon">${I.menu}</span></button></div>
    </div></header>`;
  }

  const TRACKS = [
    { t: 'Background music', a: 'Site default', d: 192 },
    { t: 'Monsoon commit', a: 'Low Tide', d: 168 },
    { t: 'Cold start', a: 'Field Notes', d: 215 },
    { t: 'Green build', a: 'Studio Ambient', d: 242 },
    { t: 'Late deploy', a: 'Low Tide', d: 177 },
  ];
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const P = Object.assign({ i: 0, playing: false, loop: 'off', shuffle: false, vol: 70, muted: false, pos: 0, open: false }, store.get('pf-player', {}));
  const forced = new URLSearchParams(location.search);
  if (forced.has('playing')) { P.playing = true; P.pos = 74; P.i = 2; P.loop = 'all'; P.shuffle = true; }

  const footHost = $('[data-pf="footer"]');
  if (footHost) {
    const g = (title, links) => `<div class="pf-footer__group"><h2>${title}</h2><ul>${links.map(([l, h, x]) => `<li><a href="${h}">${l}${x ? `<span class="gk-sr-only"> (opens in a new tab)</span>${I.ext}` : ''}</a></li>`).join('')}</ul></div>`;
    footHost.outerHTML = `<footer class="pf-footer"><div class="pf-wrap">
      <div class="pf-footer__top">
        ${g('Work', [['Projects', 'projects.html'], ['Snippets', '#'], ['Résumé (PDF)', '#']])}
        ${g('Writing', [['Blog', '#'], ['Courses', '#'], ['RSS feed', '#']])}
        ${g('About', [['About me', '#'], ['Contact', '#'], ['Gallery', '#']])}
        ${g('Elsewhere', [['GitHub', 'https://github.com/gokulsaraswat', 1], ['LinkedIn', 'https://www.linkedin.com/in/gokulsaraswat', 1], ['X', 'https://twitter.com/gokulsaraswat', 1], ['Email', 'mailto:gokulsaraswat07@gmail.com']])}
        <div class="pf-footer__side">
          <fieldset style="border:0;margin:0;padding:0"><legend class="pf-footer__label">Theme</legend>
            <div class="pf-seg">${[['system', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => `<label><input type="radio" name="pf-theme" value="${v}"><span class="pf-icon" aria-hidden="true" style="width:15px;height:15px">${I[v === 'light' ? 'sun' : v === 'dark' ? 'moon' : 'system']}</span>${l}</label>`).join('')}</div>
          </fieldset>
          <div><span class="pf-footer__label" id="pf-np-l">Now playing</span>
            <div class="pf-np" aria-labelledby="pf-np-l"><button class="pf-np__btn" type="button" data-p="toggle" aria-label="Play"></button>
            <div><span class="pf-np__title" data-p="title"></span><span class="pf-np__artist" data-p="artist"></span></div></div></div>
          <p class="pf-footer__copy">© 2026 Gokul Saraswat. Built in Bangalore.</p>
        </div>
      </div>
      <div class="pf-footer__bottom">
        <ul class="pf-footer__legal">${['Privacy', 'Terms', 'Cookies', 'Accessibility', 'Sitemap'].map((l) => `<li><a href="#">${l}</a></li>`).join('')}<li><a href="#"><span class="pf-icon" aria-hidden="true" style="width:14px;height:14px">${I.rss}</span>RSS</a></li></ul>
        <p class="pf-footer__stamp">Content updated Aug 5, 2026</p>
      </div></div></footer>`;
  }

  const dockHost = $('[data-pf="dock"]');
  if (dockHost) {
    dockHost.outerHTML = `<div class="pf-dock" role="region" aria-label="Music player"><div class="pf-mini" data-p="mini">
      <button class="pf-play" type="button" data-p="toggle" aria-label="Play"></button>
      <div class="pf-mini__text"><b data-p="title"></b><span data-p="artist"></span></div>
      <button class="pf-ibtn" type="button" data-p="next" aria-label="Next track">${I.next}</button>
      <a class="pf-ibtn" href="player.html" aria-label="Open player">${I.expand}</a>
      <div class="pf-mini__bar" aria-hidden="true"><i data-p="bar"></i></div></div></div>`;
  }
  const chatHost = $('[data-pf="launcher"]');
  if (chatHost) chatHost.outerHTML = `<a class="pf-launch" href="chat.html"><span class="pf-icon" aria-hidden="true">${I.chat}</span><span>Ask about my work</span></a>`;

  setTheme(root.getAttribute('data-gk-theme') || 'system', false);
  $$('input[name="pf-theme"]').forEach((r) => r.addEventListener('change', () => setTheme(r.value)));

  /* Player state, rendered everywhere it appears */
  const renderPlayer = () => {
    const tr = TRACKS[P.i];
    $$('[data-p="title"]').forEach((e) => { e.textContent = tr.t; });
    $$('[data-p="artist"]').forEach((e) => { e.textContent = tr.a; });
    $$('[data-p="toggle"]').forEach((b) => { b.innerHTML = P.playing ? I.pause : I.play; b.setAttribute('aria-label', P.playing ? `Pause ${tr.t}` : `Play ${tr.t}`); });
    $$('[data-p="bar"]').forEach((e) => e.style.setProperty('--p', `${(P.pos / tr.d) * 100}%`));
    $$('[data-p="seek"]').forEach((e) => { e.max = tr.d; e.value = P.pos; e.style.setProperty('--p', `${(P.pos / tr.d) * 100}%`); e.setAttribute('aria-valuetext', `${fmt(P.pos)} of ${fmt(tr.d)}`); });
    $$('[data-p="cur"]').forEach((e) => { e.textContent = fmt(P.pos); });
    $$('[data-p="dur"]').forEach((e) => { e.textContent = fmt(tr.d); });
    $$('[data-p="shuffle"]').forEach((b) => b.setAttribute('aria-pressed', String(P.shuffle)));
    $$('[data-p="loop"]').forEach((b) => {
      b.dataset.mode = P.loop;
      b.setAttribute('aria-label', { off: 'Loop: off', one: 'Loop: this track', all: 'Loop: whole playlist' }[P.loop]);
      b.innerHTML = I.loop + (P.loop === 'one' ? '<span class="pf-ibtn__badge" aria-hidden="true">1</span>' : '');
    });
    $$('[data-p="vol"]').forEach((e) => { e.value = P.muted ? 0 : P.vol; e.style.setProperty('--p', `${P.muted ? 0 : P.vol}%`); });
    $$('[data-p="mute"]').forEach((b) => { b.innerHTML = P.muted || P.vol === 0 ? I.mute : I.vol; b.setAttribute('aria-label', P.muted ? 'Unmute' : 'Mute'); b.setAttribute('aria-pressed', String(P.muted)); });
    $$('[data-p="list"]').forEach((ul) => {
      ul.innerHTML = TRACKS.map((x, n) => `<li><button class="pf-trk${n === P.i && P.playing ? ' is-playing' : ''}" type="button" data-p-track="${n}"${n === P.i ? ' aria-current="true"' : ''}>
        <span class="pf-trk__n">${n === P.i ? '<span class="pf-eq" aria-hidden="true"><i></i><i></i><i></i></span><span class="gk-sr-only">Current track</span>' : n + 1}</span>
        <span class="pf-trk__t"><b>${x.t}</b><span>${x.a}</span></span><span class="pf-trk__d">${fmt(x.d)}</span></button></li>`).join('');
    });
    $$('[data-p="state"]').forEach((e) => { e.textContent = P.playing ? 'Playing' : 'Paused'; });
    if (!forced.has('playing')) store.set('pf-player', { i: P.i, loop: P.loop, shuffle: P.shuffle, vol: P.vol, muted: P.muted, pos: P.pos });
  };
  const step = (dir) => {
    if (P.shuffle && dir > 0) { let n = P.i; while (n === P.i && TRACKS.length > 1) n = Math.floor(Math.random() * TRACKS.length); P.i = n; }
    else P.i = (P.i + dir + TRACKS.length) % TRACKS.length;
    P.pos = 0; renderPlayer();
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p], [data-p-track]');
    if (!b) return;
    const k = b.dataset.p;
    if (b.dataset.pTrack) { P.i = +b.dataset.pTrack; P.pos = 0; P.playing = true; }
    else if (k === 'toggle') P.playing = !P.playing;
    else if (k === 'next') step(1);
    else if (k === 'prev') { if (P.pos > 3) P.pos = 0; else step(-1); }
    else if (k === 'shuffle') P.shuffle = !P.shuffle;
    else if (k === 'loop') P.loop = { off: 'all', all: 'one', one: 'off' }[P.loop];
    else if (k === 'mute') P.muted = !P.muted;
    else return;
    renderPlayer();
  });
  document.addEventListener('input', (e) => {
    if (e.target.dataset.p === 'seek') { P.pos = +e.target.value; renderPlayer(); }
    if (e.target.dataset.p === 'vol') { P.vol = +e.target.value; P.muted = P.vol === 0; renderPlayer(); }
  });
  setInterval(() => {
    if (!P.playing) return;
    P.pos += 1;
    if (P.pos >= TRACKS[P.i].d) { if (P.loop === 'one') P.pos = 0; else if (P.loop === 'all' || P.i < TRACKS.length - 1) step(1); else { P.playing = false; P.pos = 0; } }
    renderPlayer();
  }, 1000);
  renderPlayer();

  /* Hero: rotating role line (pausable, stops under reduced motion) */
  const roles = $('.pf-roles');
  if (roles && !reduced) {
    const items = $$('span', roles);
    let n = 0;
    const rotate = () => {
      const cur = items[n];
      cur.classList.add('is-out'); cur.classList.remove('is-on');
      n = (n + 1) % items.length;
      items[n].classList.remove('is-out'); items[n].classList.add('is-on');
      setTimeout(() => cur.classList.remove('is-out'), 450);
    };
    let timer = setInterval(rotate, 2600);
    const pb = $('.pf-hero__pause');
    pb?.addEventListener('click', () => {
      const paused = pb.getAttribute('aria-pressed') === 'true';
      pb.setAttribute('aria-pressed', String(!paused));
      pb.innerHTML = paused ? I.pause : I.play;
      if (paused) timer = setInterval(rotate, 2600); else clearInterval(timer);
    });
    if (pb) pb.innerHTML = I.pause;
  } else if (roles) { $('.pf-hero__pause')?.remove(); }

  /* Hero: the one orchestrated moment, request resolves */
  const req = $('.pf-req[data-animate]');
  if (req && !reduced) {
    $$('.l', req).forEach((l, n) => l.style.setProperty('--i', n));
    req.classList.add('is-loading');
    const code = $('.pf-req__status b', req); const ms = $('.pf-req__ms', req);
    const [c0, m0] = [code.textContent, ms.textContent];
    code.textContent = '...'; ms.textContent = 'pending';
    setTimeout(() => { req.classList.remove('is-loading'); code.textContent = c0; ms.textContent = m0; }, 650);
  }

  /* Tabs (request card, code peeks) */
  $$('[role="tablist"]').forEach((tl) => {
    const tabs = $$('[role="tab"]', tl);
    const select = (t) => {
      tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    };
    tabs.forEach((t, n) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        const m = { ArrowRight: n + 1, ArrowLeft: n - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (m === undefined) return;
        e.preventDefault(); const nt = tabs[(m + tabs.length) % tabs.length]; nt.focus(); select(nt);
      });
    });
  });

  /* Stats: count-up once in view; rail controls only when it overflows */
  const counters = $$('[data-count]');
  const run = (el) => {
    const to = +el.dataset.count; const dec = (el.dataset.count.split('.')[1] || '').length;
    if (reduced) { el.textContent = to.toFixed(dec); return; }
    const t0 = performance.now(); const D = 1100;
    const tick = (t) => { const k = Math.min(1, (t - t0) / D); el.textContent = (to * (1 - (1 - k) ** 3)).toFixed(dec); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    if (!reduced) counters.forEach((c) => { c.textContent = '0'; });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.5 });
    counters.forEach((c) => io.observe(c));
  }
  $$('.pf-stats').forEach((s) => {
    const rail = $('.pf-stats__rail', s); const head = $('.pf-stats__head', s);
    if (!rail || !head) return;
    const upd = () => {
      const over = rail.scrollWidth > rail.clientWidth + 2; head.hidden = !over;
      rail.toggleAttribute('data-more', over && rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
      rail.tabIndex = over ? 0 : -1;
      const [pv, nx] = $$('button', head);
      pv.disabled = rail.scrollLeft < 4; nx.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    };
    $$('button', head).forEach((b, n) => b.addEventListener('click', () => rail.scrollBy({ left: (n ? 1 : -1) * rail.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' })));
    rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  });

  /* Likes, share, copy */
  const toast = (msg) => {
    let t = $('.pf-toast');
    if (!t) { t = document.createElement('div'); t.className = 'pf-toast'; t.setAttribute('role', 'status'); document.body.append(t); }
    t.hidden = false; t.textContent = msg; clearTimeout(t._h); t._h = setTimeout(() => { t.hidden = true; }, 2200);
  };
  $$('.pf-like').forEach((b) => b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    const c = $('.pf-num', b); if (c) c.textContent = String(+c.textContent + (on ? 1 : -1));
  }));
  $$('[data-share]').forEach((b) => {
    const menu = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', async () => {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) { try { await navigator.share({ title: document.title, url: location.href }); } catch { /* dismissed */ } return; }
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); if (menu) menu.hidden = !open;
      if (open) $('button, a', menu)?.focus();
    });
    menu?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { menu.hidden = true; b.setAttribute('aria-expanded', 'false'); b.focus(); } });
  });
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy === 'url' ? location.href : b.dataset.copy); } catch { /* clipboard blocked in file:// */ }
    toast(b.dataset.done || 'Link copied');
  }));

  /* Chat demo: starters hide after first message; reply carries up to 3 follow-ups */
  const REPLY = {
    q: 'Walk me through the banking platform',
    a: ['It is an enterprise banking microservices platform where Gokul was the backend engineer. Services run Java 17 on Spring Boot, ship as Docker images to Kubernetes, and report into Grafana.', 'The measured results: API latency down 30% and 98% uptime. The choice of Spring Boot is written up as ADR-001.'],
    src: [['Banking Microservices Platform', 'projects.html'], ['ADR-001: Use Spring Boot', 'projects.html']],
    next: ['Why Spring Boot instead of Go here?', 'How did the CI pipeline work?', 'What did the Grafana dashboards track?'],
  };
  const toBottom = () => $$('.pf-chat__log').forEach((l) => { l.scrollTop = l.scrollHeight; });
  toBottom(); addEventListener('load', toBottom); document.fonts?.ready.then(toBottom);
  $$('.pf-chat[data-live]').forEach((chat) => {
    const log = $('.pf-chat__log', chat);
    const ask = (q) => {
      $$('.pf-chips', log).forEach((c) => c.remove());
      log.insertAdjacentHTML('beforeend', `<div class="pf-msg pf-msg--user">${q}</div><div class="pf-msg pf-msg--bot" aria-busy="true"><span class="pf-typing" aria-label="Writing an answer"><i></i><i></i><i></i></span></div>`);
      const bot = log.lastElementChild;
      setTimeout(() => {
        bot.removeAttribute('aria-busy');
        bot.innerHTML = REPLY.a.map((p) => `<p>${p}</p>`).join('') + `<div class="pf-msg__src">${REPLY.src.map(([l, h]) => `<a href="${h}">${l}</a>`).join('')}</div>`;
        log.insertAdjacentHTML('beforeend', `<div class="pf-chips" role="group" aria-label="Suggested follow-ups"><span class="pf-chips__label">Ask next</span>${REPLY.next.map((x) => `<button class="pf-chip" type="button">${x}</button>`).join('')}</div>`);
        log.scrollTop = log.scrollHeight;
      }, reduced ? 50 : 900);
      log.scrollTop = log.scrollHeight;
    };
    log.addEventListener('click', (e) => { const c = e.target.closest('.pf-chip'); if (c) ask(c.textContent); });
    $('form', chat)?.addEventListener('submit', (e) => { e.preventDefault(); const ta = $('textarea', chat); if (ta.value.trim()) { ask(ta.value.trim()); ta.value = ''; } });
  });
})();
