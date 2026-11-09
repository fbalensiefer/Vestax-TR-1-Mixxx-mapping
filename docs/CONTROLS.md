# Controls and behavior

See the [German live guide](TR-1-LIVE.de.md) for every control, SHIFT functions, MIDI evidence and a short hardware test. The [MIDI reference](MIDI-REFERENCE.md) lists the preset's exact addresses.

- Left deck switch selects A/C (1/3), right selects B/D (2/4). Transport, level, deck FX sends and LOAD follow these switches. Hold SET CUE at the paused main cue to preview, then press PLAY to continue playback or release SET CUE to return.
- MOVE CH independently selects a deck for the shared MOVE block. Left MODE selects beatjumps, right MODE selects loop editing. VALUE halves/doubles the size, MOVE jumps or shifts the active loop, and the shared LOOP button toggles the selected deck's beatloop. The two MODE buttons use the former hotcue 3/4 addresses. MOVE replaces the former dedicated manual loop in/out actions.
- Both FX sections use the same workflow. In CHAINED, knobs 1–3 are per-slot meta knobs, buttons 1–3 enable slots and EFFECT SELECT picks chain presets. In ADVANCED, buttons 1–3 choose a slot, knobs 1–3 control its individual parameters and EFFECT SELECT changes its effect. Knob 4 is Dry/Wet and button 4 toggles the unit in both modes. The slot LEDs show enabled slots in CHAINED and the chosen slot in ADVANCED.
- Browser controls select the previous/next track, start preview, or load into the bank selected on either side.
- SHIFT+SYNC switches the tempo faders between rate and opposite-bank level in a four-deck layout. BEND is temporary rate adjustment during playback and ±1 beat when paused. In the extra-fader mode BEND jumps ±1 beat, and SHIFT+BEND jumps 32 beats. Holding SHIFT+BEND− for half a second seeks to the track start.
- Leave the front I.F.-CURVE control around its midpoint for a gradual level-fader response. After changing deck or fader mode, pass through the current Mixxx level or rate for pickup.

The new FX/MOVE behaviors, deck/SHIFT release paths and scripted LED messages are covered by software tests. The guide lists what remains to check on the hardware.
