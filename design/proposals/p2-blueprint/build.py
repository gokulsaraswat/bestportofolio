"""Assemble the static mockups: src/<page>.html + src/_*.html partials -> <page>.html (run: python build.py)."""
import pathlib
import re

here = pathlib.Path(__file__).parent
src = here / 'src'
part = {p.stem[1:]: p.read_text(encoding='utf-8') for p in src.glob('_*.html')}

for page in sorted(src.glob('[!_]*.html')):
    text = page.read_text(encoding='utf-8')
    meta = re.search(r'<!--@page title="(.*?)" desc="(.*?)" nav="(.*?)"-->', text)
    title, desc, nav = meta.groups()
    top = re.sub(r'\{\{cur:(\w+)\}\}', lambda m: ' aria-current="page"' if m.group(1) == nav else '', part['top'])
    out = (part['head'].replace('{{title}}', title).replace('{{desc}}', desc) + part['sprite'] + top
           + text[meta.end():].replace('<!--@foot-->', part['foot']) + '</body>\n</html>\n')
    (here / page.name).write_text(out, encoding='utf-8')
    print('built', page.name)
