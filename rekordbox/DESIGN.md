# rekordbox port design

## Scope and evidence

The extension is a native CSV starter design, not an emulation of the Mixxx scripting engine. It reuses TR-1 MIDI addresses from this project's adapted mapping and the previously captured deck/mixer bank addresses. Physical SHIFT/FX/browser addresses beyond that capture remain inherited rather than newly measured.

Evidence is separated:

| Layer | Evidence | Remaining check |
| --- | --- | --- |
| TR-1 basic addresses | Physical MIDI capture on macOS | Full input/output hardware coverage |
| Function/type names and CSV schema | Installed rekordbox 7.2.19 factory definitions | Generic-device availability and import/export round-trip |
| CSV encoding and unique routes | Automated checks, 15 columns and CRLF | Actual rekordbox importer |
| Optional LEDs | Addresses inherited from the custom Mixxx outputs | Physical state and on/off polarity |
| Feature entitlement | Official rekordbox 7 FAQ | User's current plan/unlock setup |

Primary sources:

- [MIDI LEARN Operation Guide](https://cdn.rekordbox.com/files/20241203210623/rekordbox7.0.5_midi_learn_operation_guide_EN.pdf): PERFORMANCE mode, types, import/export and single-code assignment.
- [rekordbox 7 FAQ](https://rekordbox.com/en/support/faq/rekordbox7/): current MIDI LEARN entitlement and Hardware Unlock devices.
- Installed factory CSV definitions, inspected read-only. No vendor source files or full templates are redistributed.

## Native CSV strategy

Each file starts with `@file,1,TR-1` and the 15-column header. Deck-scoped rows leave common input empty and specify complete four-digit MIDI codes in deck1–deck4 columns. This handles the TR-1's MIDI channels 1–4 and its differing left/right LOAD note numbers without guessing offset semantics.

The FX units use channels 5 and 7; browser buttons use channel 9. Absolute pots use `KnobSlider` (7-bit). No relative encoder type is assigned to an absolute knob. No Note Off duplicate routes are generated: rekordbox's native Button type owns press/release behavior.

The core profile contains no explicit output codes. The LED alternative adds only PLAY, MasterTempo, HeadphoneCue and 4BeatLoop outputs, using distinct per-deck addresses. Other mode/color/FX feedback is deferred. Some applications may supply their own feedback; absence of explicit CSV output is not a promise that the hardware can never receive data.

Both profiles contain 61 function rows expanding to 136 unique input codes. They are alternatives, not files to merge.

## Porting decisions

| Mixxx behavior | Native rekordbox design | Reason |
| --- | --- | --- |
| A/C + B/D banks | Fixed deck1–deck4 assignments | Hardware already sends distinct channels |
| Custom Cue/PLAY latch | Native Cue + PlayPause | CSV does not execute this project's JavaScript |
| Variable beatjump | Fixed ±4-beat jump | Explicit native functions verified in installed definitions |
| Pause-dependent BEND | Native PitchBendDown/Up | Avoid hidden state and callbacks |
| Extra-deck fader mode | Not implemented; SHIFT+SYNC becomes KeySync | Would require an external stateful translation design |
| SHIFT jump-size controls | Discrete Key−/Key+ on 5C/5D | Clear native alternatives; documented changed behavior |
| Effect meta knobs | Native slot-depth knobs | Different effect engines |
| Dry/Wet knob | Effect beat value | No verified general unit Dry/Wet identifier selected for this draft |
| FX chain preset selection | Previous/next effect in slot 1 | Different preset/slot semantics |
| Continuous KEY | Deferred | No verified native continuous-key target/encoding |
| 14-bit TEMPO | Deferred to MIDI LEARN round-trip | Pitch Bend-to-CSV representation not verified |
| Hotcues/preview/master/headphone knobs | Deferred | Avoid borrowing hardware-specific/PadMode-only identifiers or assuming audio controls work for a generic device |

## Validation gates

1. Back up the selected TR-1 mapping via EXPORT.
2. Import the core draft with MIDI LEARN available; record whether each function is accepted.
3. Export immediately. Compare function identifiers, types, complete addresses and deck columns. Save a separately named confirmed profile only after a successful round-trip.
4. Test all four banks: single press, release, held bend, loop enter/exit, volume/EQ/gain/filter pickup.
5. Learn each TEMPO fader as a 14-bit control where supported; test raw minimum/center/maximum and direction. Do not infer a CSV message from `E9` alone.
6. Test FX slots, FX routing, button mode and browser/loading. Confirm source-only SHIFT addresses on hardware.
7. Import the LED alternative only after the core input test; verify each output separately. Keep rollback exports.

No paid feature activation, live mapping overwrite or MIDI translator installation is performed by generating these artifacts. The live rekordbox UI could not be inspected reliably in this session, so no importer or entitlement test is claimed.

## Build and test

`python3 rekordbox/generate.py` regenerates the two drafts. `python3 rekordbox/test_rekordbox.py` checks deterministic output and invariant addresses. The optional `--vendor-dir` check reads an installed factory mapping folder and confirms that each emitted function/type pair exists there. CI runs the portable structural check only; it does not bundle rekordbox.
