"""Measure WCAG 2.x contrast for every Blueprint colour pair (run: python contrast.py).
Opacity-built neutrals are composited over the backdrop they sit on before measuring."""

def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def over(fg, alpha, bg):
    """Composite rgb fg at alpha over opaque rgb bg."""
    return tuple(round(f * alpha + b * (1 - alpha)) for f, b in zip(fg, bg))

def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(v) for v in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

def tohex(c):
    return '#%02X%02X%02X' % c

THEMES = {
    'dark': {
        'bg': '#0D1422', 'ink': '#E6EDF7',
        'surface_a': 0.035,                  # surface = ink at 3.5% over bg
        'accent': '#FF6B5E', 'fill': '#D62B26', 'on_fill': '#FFFFFF',
        'get': '#7EAEEF', 'post': '#5FCB8C', 'put': '#E9B44E',   # = v2 instrument dark info/success/warning
        'on_accent': '#1A0606', 'accent_subtle': '#3A1D24', 'on_accent_subtle': '#FFB4AA',
    },
    'light': {
        'bg': '#F5F7FA', 'ink': '#0D1422',
        'surface': '#FFFFFF',
        'accent': '#C41F1C', 'fill': '#C41F1C', 'on_fill': '#FFFFFF',
        'get': '#1D5BA6', 'post': '#16713A', 'put': '#8A5300',   # = v2 instrument light info/success/warning
        'on_accent': '#FFFFFF', 'accent_subtle': '#FBE6E5', 'on_accent_subtle': '#8E1512',
    },
}
ALPHA = {'text': 0.94, 'muted': 0.72, 'subtle': 0.62, 'border': 0.12, 'border_strong': 0.48, 'grid': 0.05}

def run():
    rows = []
    for name, t in THEMES.items():
        bg = hex2rgb(t['bg']); ink = hex2rgb(t['ink'])
        surface = over(ink, t['surface_a'], bg) if 'surface_a' in t else hex2rgb(t['surface'])
        backs = {'bg': bg, 'surface': surface}
        for role in ('text', 'muted', 'subtle'):
            for bn, b in backs.items():
                rows.append((name, f'{role} (ink {ALPHA[role]:.0%}) on {bn}', ratio(over(ink, ALPHA[role], b), b), 4.5))
        for bn, b in backs.items():
            rows.append((name, f'border-strong (ink {ALPHA["border_strong"]:.0%}) on {bn} [UI]', ratio(over(ink, ALPHA['border_strong'], b), b), 3.0))
        for key in ('accent', 'get', 'post', 'put'):
            for bn, b in backs.items():
                rows.append((name, f'{key} {t[key]} text on {bn}', ratio(hex2rgb(t[key]), b), 4.5))
            # badge text on its own 14% tint over surface
            tint = over(hex2rgb(t[key]), 0.14, surface)
            rows.append((name, f'{key} text on {key} 14% tint {tohex(tint)}', ratio(hex2rgb(t[key]), tint), 4.5))
        rows.append((name, f'on-fill {t["on_fill"]} on fill {t["fill"]} (primary button)', ratio(hex2rgb(t['on_fill']), hex2rgb(t['fill'])), 4.5))
        rows.append((name, f'fill {t["fill"]} vs bg (button edge) [UI]', ratio(hex2rgb(t['fill']), bg), 3.0))
        rows.append((name, f'on-accent {t["on_accent"]} on accent {t["accent"]}', ratio(hex2rgb(t['on_accent']), hex2rgb(t['accent'])), 4.5))
        rows.append((name, f'on-accent-subtle {t["on_accent_subtle"]} on accent-subtle {t["accent_subtle"]}', ratio(hex2rgb(t['on_accent_subtle']), hex2rgb(t['accent_subtle'])), 4.5))
        rows.append((name, f'focus ring = accent vs bg [UI]', ratio(hex2rgb(t['accent']), bg), 3.0))
        print(f'{name}: bg {t["bg"]}, surface {tohex(surface)}, text {tohex(over(ink, ALPHA["text"], bg))}, '
              f'muted {tohex(over(ink, ALPHA["muted"], bg))}, subtle {tohex(over(ink, ALPHA["subtle"], bg))}')
    print()
    print('| Theme | Pair | Ratio | Needs | Result |')
    print('|---|---|---|---|---|')
    fails = 0
    for theme, pair, r, need in rows:
        ok = r >= need
        fails += not ok
        print(f'| {theme} | {pair} | {r:.2f} | {need} | {"pass" if ok else "FAIL"} |')
    # reference: the current primary
    print(f'\nreference #f73b3b on white {ratio(hex2rgb("#f73b3b"), (255,255,255)):.2f}, white on #f73b3b {ratio((255,255,255), hex2rgb("#f73b3b")):.2f}, '
          f'#f73b3b on dark bg {ratio(hex2rgb("#f73b3b"), hex2rgb(THEMES["dark"]["bg"])):.2f}')
    print(f'{len(rows)} pairs, {fails} failing')

if __name__ == '__main__':
    run()
