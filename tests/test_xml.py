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
    assert routes[0xB0 + bank, '0x15'][:2] == (group, 'VestaxTR1.volume')
    assert routes[0xB0 + bank, '0x0A'][:2] == (group, 'pregain')
    assert routes[0xE9 + bank, None][:2] == (group, 'VestaxTR1.rate')
    assert routes[0xE0 + bank, None][:2] == (group, 'pitch_adjust')
    for cc, key in [('0x10', 'parameter3'), ('0x11', 'parameter2'), ('0x13', 'parameter1')]:
        assert routes[0xB0 + bank, cc][:2] == (f'[EqualizerRack1_{group}_Effect1]', key)
    for note in range(0x44, 0x4B):
        assert routes[0x90 + bank, f'0x{note:02X}'] == (
            group, 'VestaxTR1.moveControl', ('script-binding',))
    for note in (0x4C, 0x4D, 0x4E, 0x52, 0x53, 0x55, 0x58, 0x59, 0x5A, 0x5E, 0x5F, 0x61):
        assert routes[0x90 + bank, f'0x{note:02X}'] == (
            group, 'VestaxTR1.deckButton', ('script-binding',))
    assert routes[0x90 + bank, '0x65' if bank % 2 == 0 else '0x66'][:2] == (
        group, 'LoadSelectedTrack')
for unit, channel in ((1, 4), (2, 6)):
    group = f'[EffectRack1_EffectUnit{unit}]'
    for slot in range(1, 4):
        effect = f'{group[:-1]}_Effect{slot}]'
        assert routes[0xB0 + channel, f'0x{0x17 + slot:02X}'] == (
            effect, 'VestaxTR1.fxKnob', ('script-binding',))
    assert routes[0xB0 + channel, '0x1B'] == (group, 'mix', ('soft-takeover',))
    for note in range(0x3C, 0x43):
        assert routes[0x90 + channel, f'0x{note:02X}'][1:] == (
            'VestaxTR1.fxButton', ('script-binding',))
assert routes[0x98, '0x62'][:2] == ('[PreviewDeck1]', 'LoadSelectedTrackAndPlay')
assert routes[0x98, '0x63'][:2] == ('[Playlist]', 'SelectNextTrack')
assert routes[0x98, '0x64'][:2] == ('[Playlist]', 'SelectPrevTrack')
assert routes[0x98, '0x68'][:2] == ('[Master]', 'VestaxTR1.selectDown')
assert routes[0x98, '0x69'][:2] == ('[Master]', 'VestaxTR1.selectUp')
outputs = current.findall('.//outputs/output')
assert len(outputs) == 48
scripted_leds = {(status, note) for status in (0x94, 0x96)
                 for note in (0x3C, 0x3D, 0x3E, 0x3F, 0x42)}
scripted_leds.update((status, note) for status in range(0x90, 0x94)
                     for note in (0x4A, 0x52, 0x53, 0x5B, 0x5E, 0x5F))
scripted_leds.add((0x98, 0x68))
assert not scripted_leds.intersection(
    (int(output.findtext('status'), 16), int(output.findtext('midino'), 16))
    for output in outputs)
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
print('PASS: 333 unique routes, 143 release pairs, measured basic addresses, 48 XML LED outputs, FX/MOVE and browser routes, handlers and documentation links.')
