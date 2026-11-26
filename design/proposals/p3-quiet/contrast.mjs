// Measures WCAG 2.x contrast for every p3-quiet colour pair. Run: node contrast.mjs
// Opacity-built neutrals are composited over the background they sit on before measuring.
const T = {
  light: { bg: '#FBFBFA', surface: '#FFFFFF', sunken: '#F3F3F1', ink: [27, 27, 31], muted: 0.72, subtle: 0.64, strong: 0.52,
    accent: '#CC2929', accentHover: '#A82020', onAccent: '#FFFFFF', accentSubtle: '#FBEAE9', onAccentSubtle: '#8F1C1C', ok: '#2E8540',
    danger: '#B42318', dangerSubtle: '#FCE9E7', success: '#2E6B3A', warning: '#855100', warningSubtle: '#FBF0DA' },
  dark: { bg: '#18171A', surface: '#201F23', sunken: '#121114', ink: [237, 235, 239], muted: 0.72, subtle: 0.6, strong: 0.44,
    accent: '#F94C4A', accentHover: '#FF7472', onAccent: '#1B0606', accentSubtle: '#3A1B1C', onAccentSubtle: '#FFC4C1', ok: '#5CC274',
    danger: '#F38479', dangerSubtle: '#3A1A17', success: '#7CC88A', warning: '#E2B45A', warningSubtle: '#33281A' },
};
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (fg, a, bg) => fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
let fails = 0;
console.log('| Theme | Pair | Ratio | Needs | Result |\n|---|---|---|---|---|');
for (const [name, t] of Object.entries(T)) {
  const on = (bgKey) => rgb(t[bgKey]);
  const pairs = [];
  for (const bgKey of ['bg', 'surface', 'sunken']) {
    pairs.push([`text on ${bgKey}`, t.ink, on(bgKey), 4.5]);
    pairs.push([`text-muted on ${bgKey}`, mix(t.ink, t.muted, on(bgKey)), on(bgKey), 4.5]);
    pairs.push([`text-subtle on ${bgKey}`, mix(t.ink, t.subtle, on(bgKey)), on(bgKey), 4.5]);
    pairs.push([`accent text on ${bgKey}`, rgb(t.accent), on(bgKey), 4.5]);
  }
  pairs.push(['border-strong on surface (UI)', mix(t.ink, t.strong, on('surface')), on('surface'), 3]);
  pairs.push(['border-strong on bg (UI)', mix(t.ink, t.strong, on('bg')), on('bg'), 3]);
  pairs.push(['on-accent on accent (button)', rgb(t.onAccent), rgb(t.accent), 4.5]);
  pairs.push(['on-accent on accent-hover', rgb(t.onAccent), rgb(t.accentHover), 4.5]);
  pairs.push(['on-accent-subtle on accent-subtle (Author badge)', rgb(t.onAccentSubtle), rgb(t.accentSubtle), 4.5]);
  pairs.push(['availability dot on surface (UI)', rgb(t.ok), on('surface'), 3]);
  pairs.push(['danger on danger-subtle (alert)', rgb(t.danger), rgb(t.dangerSubtle), 4.5]);
  pairs.push(['warning on warning-subtle (alert)', rgb(t.warning), rgb(t.warningSubtle), 4.5]);
  pairs.push(['success text on bg', rgb(t.success), on('bg'), 4.5]);
  pairs.push(['bg on text (player button, own bubble)', on('bg'), t.ink, 4.5]);
  pairs.push(['focus ring (ink) on bg (UI)', t.ink, on('bg'), 3]);
  for (const [label, fg, bg, need] of pairs) {
    const r = ratio(fg, bg), ok = r >= need; if (!ok) fails++;
    console.log(`| ${name} | ${label} | ${r.toFixed(2)} | ${need} | ${ok ? 'pass' : 'FAIL'} |`);
  }
}
console.log(`\n${fails} failing pairs`);
process.exitCode = fails ? 1 : 0;
