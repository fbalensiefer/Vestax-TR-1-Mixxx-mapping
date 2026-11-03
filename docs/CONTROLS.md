# Controls and behavior

A/C are the left hardware bank; B/D are the right bank. They correspond to Mixxx decks 1/3 and 2/4. These assignments follow the supplied mapping. For exact MIDI addresses, see [MIDI reference](MIDI-REFERENCE.md).

## Deck and mixer

| Control | Action |
| --- | --- |
| PLAY/STOP | Toggle playback; latch a held cue preview into continued playback. |
| SET CUE | Set the main cue and enable quantize. When paused at the cue, hold to preview; release to return unless PLAY was pressed. |
| CUE BACK/FWD | Beatjump backward/forward using Mixxx's current beatjump size. |
| SYNC | Toggle sync. |
| KEY button | Toggle keylock. |
| LOOP | Activate a beatloop with Mixxx's current loop size. Reloop has its own assignment. |
| Loop/Move controls | Loop halve/double, loop in/out and reloop; shifted assignments include hotcues and looproll. |
| Headphone CUE | Toggle PFL for that deck. |
| Channel fader | Deck volume. |
| HI/MID/LOW | Three-band EQ. |
| PAN | Deck pregain, not stereo pan. |
| FILTER | Deck Quick Effect super knob. |
| TEMPO | 14-bit tempo slider; original mapping direction retained. |
| KEY knob | Original pitch-adjust assignment and inversion option retained. |

Additional shifted MIDI assignments cover hotcues 1–4, slip, looproll, beatjump-size halve/double, cue return and beatgrid translation. The exact logical assignments are listed in the MIDI reference; physical SHIFT behavior beyond the basic capture requires validation.

## Tempo bends and extra-deck fader mode

**SHIFT+SYNC** toggles extra-deck fader mode globally.

| Tempo-fader hardware bank | Normal mode | Extra-deck fader mode |
| --- | --- | --- |
| A | Deck 1 tempo | Deck 3 volume |
| B | Deck 2 tempo | Deck 4 volume |
| C | Deck 3 tempo | Deck 1 volume |
| D | Deck 4 tempo | Deck 2 volume |

| Button | Normal mode | Extra-deck fader mode |
| --- | --- | --- |
| BEND −/+ while playing | Temporary tempo down/up | Beatjump −/+1 beat |
| BEND −/+ while paused | Beatjump −/+1 beat | Beatjump −/+1 beat |
| SHIFT+BEND− | Paused: start of track. Playing: temporary fine tempo down. | Short press: −32 beats. Hold at least 500 ms: start of track. |
| SHIFT+BEND+ | Temporary fine tempo up | +32 beats |

Switching modes cancels pending long-press seeks and clears temporary bends. Soft-takeover is rearmed for rates and volumes when toggling this mode.

## Effects

Each FX section addresses an effect unit (1 or 2):

- Knobs 1–3: meta control for effect slots 1–3.
- Knob 4: unit Dry/Wet mix.
- Buttons 1–3: enable/disable those effect slots.
- Button 4: mix mode.
- EFFECT SELECT left/right: previous/next chain preset.
- ADVANCED/CHAINED: toggle `show_parameters` and update the mode indicator. It changes panel visibility, not knob routing.
- Per-deck FX buttons: route that deck to unit 1 or 2.

## Library, monitoring and indicators

Browser assignments select the previous/next track, load the preview player and load the selected track into the active A/C or B/D bank. Master and headphone level/mix controls are mapped.

MOVE-CH up/down cycles a script-local deck number and sends the corresponding indicator value. That selection is not used to redirect other controls in the inherited script.

The XML includes 60 LED outputs; the script also sends mode/bend/MOVE indicators. Their existence does not establish that all physical LEDs behave correctly. FX-mode LED addresses are marked provisional in the supplied script.
