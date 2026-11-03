"""Validate mapping routes, recorded basic addresses and explicit release pairs."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
current = ET.parse(ROOT / 'Vestax-TR-1-2026.midi.xml')
routes = {}
for control in current.findall('.//controls/control'):
    address = (int(control.findtext('status'), 16), control.findtext('midino'))
    assert address not in routes, f'Duplicate input: {address}'
    routes[address] = (
        control.findtext('group'), control.findtext('key'),
        tuple(child.tag for child in control.findall('options/*')),
    )
assert len(routes) == 333
note_on = {address: target for address, target in routes.items()
           if address[0] & 0xF0 == 0x90}
assert len(note_on) == 143
for (status, note), target in note_on.items():
    assert routes[status - 16, note] == target
# Addresses observed in the basic-control capture on the physical controller.
for bank in range(4):
    group = f'[Channel{bank + 1}]'
    assert routes[0x90 + bank, '0x54'][:2] == (group, 'VestaxTR1.play')
    assert routes[0xB0 + bank, '0x15'][:2] == (group, 'volume')
    assert routes[0xB0 + bank, '0x0A'][:2] == (group, 'pregain')
    assert routes[0xE9 + bank, None][:2] == (group, 'VestaxTR1.rate')
    assert routes[0xE0 + bank, None][:2] == (group, 'pitch_adjust')
    for cc, key in [('0x10', 'parameter3'), ('0x11', 'parameter2'), ('0x13', 'parameter1')]:
        assert routes[0xB0 + bank, cc][:2] == (f'[EqualizerRack1_{group}_Effect1]', key)
outputs = current.findall('.//outputs/output')
assert len(outputs) == 60
assert current.findtext('info/name') == 'Vestax TR-1 - 2026 Custom'
script = (ROOT / 'Vestax-TR-1-scripts.js').read_text()
for entry in current.findall('.//scriptfiles/file'):
    assert (ROOT / entry.attrib['filename']).is_file()
for control in current.findall('.//controls/control'):
    if any(option.tag.lower() == 'script-binding'
           for option in control.findall('options/*')):
        assert control.findtext('key') + ' = function' in script
for markdown in ROOT.rglob('*.md'):
    for link in re.findall(r'\]\(([^)]+)\)', markdown.read_text()):
        if '://' not in link and not link.startswith('#'):
            assert (markdown.parent / link.split('#')[0]).exists(), (markdown, link)
print('PASS: 333 unique routes, 143 release pairs, measured basic addresses, 60 LED outputs, handlers and documentation links.')
