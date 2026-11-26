// Contrast check for the p1-signal palette. Run: node contrast.mjs
// Mirrors signal-tokens.css: every neutral is the theme ink mixed over the theme paper at a percentage
// (CSS: color-mix(in srgb, var(--pf-ink) N%, var(--pf-paper))). WCAG 2.2: text 4.5:1, large text / UI parts 3:1.

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const mix = (a, b, p) => toHex(hex(a).map((v, i) => v * p + hex(b)[i] * (1 - p)));
const lum = (h) => {
  const [r, g, b] = hex(h).map((v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};


const themes = {
  dark: {
    paper: '#141112', ink: '#F3EEEB', deep: '#0D0B0C',
    ladder: { surface: 0.05, border: 0.14, 'border-strong': 0.46, 'text-subtle': 0.6, 'text-muted': 0.74, text: 1 },
    accent: '#F73B3B', 'accent-hover': '#FF6663', 'on-accent': '#141112',
    accentSubtlePct: 0.15, 'on-accent-subtle': '#FFA9A5',
    success: '#5FCB8C', danger: '#FF8A7A', warning: '#E9B44E',
  },
  light: {
    paper: '#FDFCFC', ink: '#1B1517',
    ladder: { surface: 0.035, sunken: 0.06, border: 0.12, 'border-strong': 0.52, 'text-subtle': 0.66, 'text-muted': 0.78, text: 1 },
    accent: '#C81E1E', 'accent-hover': '#A31616', 'on-accent': '#FFFFFF',
    accentSubtlePct: 0.09, 'on-accent-subtle': '#8F1414',
    success: '#16713A', danger: '#A8200F', warning: '#8A5300',
  },
};

const rows = [];
for (const [name, t] of Object.entries(themes)) {
  const c = { bg: t.paper };
  for (const [k, p] of Object.entries(t.ladder)) c[k] = mix(t.ink, t.paper, p);
  if (t.deep) c.sunken = t.deep;
  Object.assign(c, {
    accent: t.accent, 'accent-hover': t['accent-hover'], 'on-accent': t['on-accent'],
    'accent-subtle': mix(t.accent, t.paper, t.accentSubtlePct), 'on-accent-subtle': t['on-accent-subtle'],
    success: t.success, danger: t.danger, warning: t.warning,
  });
  const pairs = [
    ['text', 'bg', 4.5], ['text', 'surface', 4.5], ['text', 'sunken', 4.5],
    ['text-muted', 'bg', 4.5], ['text-muted', 'surface', 4.5], ['text-muted', 'sunken', 4.5],
    ['text-subtle', 'bg', 4.5], ['text-subtle', 'surface', 4.5], ['text-subtle', 'sunken', 4.5],
    ['border-strong', 'bg', 3], ['border-strong', 'surface', 3],
    ['accent', 'bg', 4.5], ['accent', 'surface', 4.5], ['accent', 'sunken', 4.5], ['accent-hover', 'bg', 4.5],
    ['on-accent', 'accent', 4.5], ['on-accent', 'accent-hover', 4.5],
    ['on-accent-subtle', 'accent-subtle', 4.5], ['text', 'accent-subtle', 4.5],
    ['accent', 'bg', 3, 'focus ring vs bg'], ['accent', 'surface', 3, 'focus ring vs surface'],
    ['success', 'surface', 4.5], ['danger', 'surface', 4.5], ['warning', 'surface', 4.5],
  ];
  for (const [fg, bg, min, note] of pairs) {
    const r = ratio(c[fg], c[bg]);
    rows.push({ theme: name, pair: `${fg} on ${bg}${note ? ` (${note})` : ''}`, fg: c[fg], bg: c[bg], ratio: r.toFixed(2), min, pass: r >= min ? 'pass' : 'FAIL' });
  }
  rows.push({ theme: name, pair: '--- resolved neutrals ---', fg: Object.entries(c).filter(([k]) => k in t.ladder || k === 'bg' || k === 'sunken').map(([k, v]) => `${k}=${v}`).join(' '), bg: '', ratio: '', min: '', pass: '' });
}

const md = process.argv.includes('--md');
if (md) {
  console.log('| Theme | Pair | Fg | Bg | Ratio | Min | Result |\n|---|---|---|---|---|---|---|');
  for (const r of rows) if (r.ratio) console.log(`| ${r.theme} | ${r.pair} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio} | ${r.min} | ${r.pass} |`);
  for (const r of rows) if (!r.ratio) console.log(`\n${r.theme}: ${r.fg}`);
} else {
  console.table(rows);
}
const fails = rows.filter((r) => r.pass === 'FAIL');
console.log(fails.length ? `${fails.length} FAIL` : 'all pairs pass');
process.exit(fails.length ? 1 : 0);
