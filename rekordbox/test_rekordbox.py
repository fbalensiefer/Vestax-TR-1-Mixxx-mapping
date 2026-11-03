"""Structural and hardware-address checks; does not claim rekordbox import success."""
import argparse
import csv
import importlib.util
from pathlib import Path
import tempfile

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('tr1_rekordbox_generator',HERE/'generate.py')
generator=importlib.util.module_from_spec(spec)
spec.loader.exec_module(generator)

def check(path,leds):
    data=path.read_bytes()
    assert b'\r\n' in data and b'\n' not in data.replace(b'\r\n',b'')
    rows=list(csv.reader(path.open(encoding='utf-8',newline='')))
    assert all(len(row)==15 for row in rows)
    assert rows[0][:3]==['@file','1','TR-1']
    assert rows[1]==generator.HEADER
    assert len(rows[2:])==61
    addresses={}
    outputs=[]
    for row in rows[2:]:
        # This design deliberately uses full per-deck codes, not channel offsets.
        for deck,code in enumerate(row[4:8],1):
            if code:
                assert len(code)==4 and int(code,16)
                assert code not in addresses,('conflicting input',code)
                addresses[code]=(row[1],deck,row[2])
        if row[3]:
            assert not any(row[4:8])
            assert len(row[3])==4 and int(row[3],16)
            assert row[3] not in addresses
            addresses[row[3]]=(row[1],None,row[2])
        outputs += [code for code in row[8:13] if code]
    assert len(addresses)==136
    assert len(outputs)==(16 if leds else 0)
    assert len(set(outputs))==len(outputs)
    for bank in range(4):
        assert addresses[f'{0x90+bank:02X}54']==('PlayPause',bank+1,'Button')
        for cc,function in [('15','ChannelFader'),('0A','Gain'),('10','EQHigh'),('11','EQMid'),('13','EQLow')]:
            assert addresses[f'{0xB0+bank:02X}{cc}']==(function,bank+1,'KnobSlider')
    assert not any(code.startswith('E') for code in addresses) # unresolved Pitch Bend codes remain out
    return rows[2:]

rows=check(HERE/'Vestax-TR-1-rekordbox7-core.midi.csv',False)
check(HERE/'Vestax-TR-1-rekordbox7-leds-experimental.midi.csv',True)
with tempfile.TemporaryDirectory() as d:
    generator.write_files(Path(d))
    for filename in ['Vestax-TR-1-rekordbox7-core.midi.csv','Vestax-TR-1-rekordbox7-leds-experimental.midi.csv']:
        assert (Path(d)/filename).read_bytes()==(HERE/filename).read_bytes()
parser=argparse.ArgumentParser()
parser.add_argument('--vendor-dir',type=Path,help='Optional installed rekordbox MidiMappings folder; read only')
args=parser.parse_args()
if args.vendor_dir:
    registry=set()
    for file in args.vendor_dir.glob('*.csv'):
        for row in csv.reader(file.open(encoding='utf-8',errors='replace')):
            if len(row)==15 and row[1] and not row[0].startswith(('#','@')):
                registry.add((row[1],row[2]))
    missing={(row[1],row[2]) for row in rows}-registry
    assert not missing,('Function/type absent from installed registry',missing)
    print('PASS: every emitted function/type exists in installed rekordbox factory definitions.')
print('PASS: two reproducible 15-column CRLF profiles; 136 unique inputs; four deck banks; optional 16 LEDs; unresolved pitch messages omitted.')
