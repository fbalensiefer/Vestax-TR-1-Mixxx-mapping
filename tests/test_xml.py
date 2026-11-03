"""Validate preserved source routes, releases and script bindings without Mixxx."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
original = ET.parse(ROOT / 'source-2026/Vestax-TR-1-2026.midi.xml')
current = ET.parse(ROOT / 'Vestax-TR-1-2026.midi.xml')

def routes(tree):
    result = {}
    for control in tree.findall('.//controls/control'):
        address = (int(control.findtext('status'), 16), control.findtext('midino'))
        assert address not in result, f'Duplicate input: {address}'
        result[address] = (
            control.findtext('group'), control.findtext('key'),
            tuple(child.tag for child in control.findall('options/*')),
        )
    return result

old, new = routes(original), routes(current)
assert len(old) == 190 and len(new) == 333
assert all(new[address] == target for address, target in old.items())
for (status, note), target in old.items():
    if status & 0xF0 == 0x90:
        assert new[status - 16, note] == target

def outputs(tree):
    return [[(child.tag, child.text.strip() if child.text else '', child.attrib)
             for child in output] for output in tree.findall('.//outputs/output')]

assert outputs(original) == outputs(current)
assert len(outputs(current)) == 60
assert current.findtext('info/name') == 'Vestax TR-1 - 2026 Custom'
script = (ROOT / 'Vestax-TR-1-scripts.js').read_text()
for entry in current.findall('.//scriptfiles/file'):
    assert (ROOT / entry.attrib['filename']).is_file()
for control in current.findall('.//controls/control'):
    if any(option.tag.lower() == 'script-binding'
           for option in control.findall('options/*')):
        assert control.findtext('key') + ' = function' in script
# Relative Markdown links should resolve in the standalone package.
for markdown in ROOT.rglob('*.md'):
    for link in re.findall(r'\]\(([^)]+)\)', markdown.read_text()):
        if '://' not in link and not link.startswith('#'):
            assert (markdown.parent / link.split('#')[0]).exists(), (markdown, link)
print('PASS: 190 original inputs, 143 releases, 60 LED outputs, script handlers and documentation links.')
