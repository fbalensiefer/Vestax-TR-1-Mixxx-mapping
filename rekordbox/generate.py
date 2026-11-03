"""Generate conservative rekordbox 7 native mapping drafts from known TR-1 addresses.

No vendor mapping files or unmodified third-party originals are distributed.
CSV layout/function identifiers were checked against locally installed rekordbox
7.2.19 factory mapping definitions. Import and hardware verification remain open.
"""
import csv
from pathlib import Path

HERE = Path(__file__).resolve().parent
HEADER = ['#name', 'function', 'type', 'input', 'deck1', 'deck2', 'deck3',
          'deck4', 'output', 'deck1', 'deck2', 'deck3', 'deck4', 'option', 'comment']

def generate(leds=False):
    rows = []
    def deck(function, number, kind='Button', comment='', led=False, cc=False,
             numbers=None):
        addresses = [f'{(0xB0 if cc else 0x90)+bank:02X}{(numbers or [number]*4)[bank]:02X}'
                     for bank in range(4)]
        # Empty common input + absolute per-deck codes, as in native CSV examples.
        rows.append([function, function, kind, ''] + addresses + [''] +
                    (addresses if leds and led else ['']*4) + ['', comment])
    def global_control(function, code, kind='Button', comment=''):
        rows.append([function, function, kind, code] + ['']*9 + ['', comment])

    for function, number, label, led in [
        ('PlayPause',0x54,'PLAY / STOP',True),
        ('Cue',0x55,'SET CUE: native rekordbox Cue; no Mixxx cue script',False),
        ('Sync',0x4F,'SYNC',False),
        ('MasterTempo',0x4B,'KEY button: master tempo',True),
        ('HeadphoneCue',0x56,'Headphone CUE',True),
        ('4BeatLoop',0x4C,'LOOP: 4-beat loop',True),
        ('ReloopExit',0x4A,'Reloop / exit',False),
        ('LoopHalf',0x44,'Loop size half',False),
        ('LoopDouble',0x45,'Loop size double',False),
        ('LoopIn',0x46,'Loop in',False),
        ('LoopOut',0x47,'Loop out',False),
        ('4BeatJump<<',0x50,'CUE BACK: 4 beats backward',False),
        ('4BeatJump>>',0x51,'CUE FWD: 4 beats forward',False),
        ('PitchBendDown',0x52,'BEND -: momentary native bend',False),
        ('PitchBendUp',0x53,'BEND +: momentary native bend',False),
        ('Slip',0x57,'SHIFT KEY address: slip',False),
        ('KeySync',0x5B,'SHIFT SYNC: key sync; no extra-deck fader mode',False),
        ('Key-',0x5C,'Shifted address 5C: key down; differs from Mixxx',False),
        ('Key+',0x5D,'Shifted address 5D: key up; differs from Mixxx',False),
    ]:
        deck(function,number,comment=label,led=led)
    deck('Load',0x65,numbers=[0x65,0x66,0x65,0x66],comment='Load selected track into hardware-selected deck bank')
    for function, number, label in [
        ('ChannelFader',0x15,'Channel volume'),('Gain',0x0A,'PAN knob used as gain'),
        ('EQHigh',0x10,'HI'),('EQMid',0x11,'MID'),('EQLow',0x13,'LOW'),
    ]:
        deck(function,number,'KnobSlider',label,cc=True)
    for bank in range(4):
        global_control(f'CFXParameterCH{bank+1}',f'{0xB0+bank:02X}14','KnobSlider',
                       f'Deck {bank+1} FILTER depth; select FILTER in rekordbox')
        global_control(f'FX1Assign{bank+1}',f'{0x90+bank:02X}4D',comment='FX unit 1 deck routing')
        global_control(f'FX2Assign{bank+1}',f'{0x90+bank:02X}4E',comment='FX unit 2 deck routing')
    for unit, channel in [(1,4),(2,6)]:
        for slot in range(1,4):
            global_control(f'FX{unit}-{slot}',f'{0xB0+channel:02X}{0x17+slot:02X}',
                           'KnobSlider',f'FX {unit} knob {slot}: native slot depth')
            global_control(f'FX{unit}-{slot}On',f'{0x90+channel:02X}{0x3B+slot:02X}',
                           comment=f'FX {unit} slot {slot} on/off')
        global_control(f'FX{unit}Beat',f'{0xB0+channel:02X}1B','KnobSlider',
                       'FX knob 4: beat value instead of Mixxx Dry/Wet')
        global_control(f'FX{unit}Tap',f'{0x90+channel:02X}3F',comment='FX button 4: tap tempo')
        global_control(f'FX{unit}-1Select.Up',f'{0x90+channel:02X}40',comment='Previous effect in slot 1')
        global_control(f'FX{unit}-1Select.Down',f'{0x90+channel:02X}41',comment='Next effect in slot 1')
        global_control(f'FX{unit}FXMode',f'{0x90+channel:02X}42',comment='Native unit FX mode')
    global_control('BrowseDown','9863',comment='Browser next track')
    global_control('BrowseUp','9864',comment='Browser previous track')
    return rows


def write_files(directory=HERE):
    for leds, filename in [(False,'Vestax-TR-1-rekordbox7-core.midi.csv'),
                           (True,'Vestax-TR-1-rekordbox7-leds-experimental.midi.csv')]:
        with (directory/filename).open('w',encoding='utf-8',newline='') as file:
            writer=csv.writer(file,lineterminator='\r\n')
            writer.writerow(['@file','1','TR-1']+['']*12)
            writer.writerow(HEADER)
            writer.writerows(generate(leds))
    return len(generate())

if __name__ == '__main__':
    print(f'Generated two draft CSV profiles with {write_files()} function rows each.')
