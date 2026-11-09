# Vestax TR-1 Custom Mapping for Mixxx

A four-deck MIDI mapping for the **Vestax TR-1**, targeting **Mixxx 2.5**. Based on a user-supplied 2026 mapping, with two FX modes, a shared MOVE block, and deck-safe button releases.

**[Deutsche Anleitung](README.de.md)** · **[Setup](docs/SETUP.md)** · **[Controls](docs/CONTROLS.md)** · **[MIDI reference](docs/MIDI-REFERENCE.md)**

## rekordbox alternative

A separate [rekordbox 7 mapping design](rekordbox/README.md) now includes two native CSV drafts, an annotated layout and setup instructions. Import/hardware validation is pending; tempo and continuous KEY still require a MIDI LEARN round-trip. The Mixxx files below remain the installable Mixxx mapping.

## Install in five steps

1. Check out the desired branch or download its ZIP using **Code → Download ZIP**.
2. In Mixxx, open **Preferences → Library → Open Mixxx Settings Directory**, then open its `controllers` folder.
3. Copy **both root files** into that folder:
   - `Vestax-TR-1-2026.midi.xml`
   - `Vestax-TR-1-scripts.js`
4. Connect the TR-1, restart Mixxx, and open **Preferences → Controllers → TR-1**.
5. Select **Vestax TR-1 - 2026 Custom**, enable the controller and click **Apply**. Select a four-deck skin to use C/D.

Copy the files from the repository root. The unmodified source files are not distributed; their provenance is recorded in [SOURCE.md](SOURCE.md). Keep the XML and script filenames unchanged. No Python or Node.js installation is needed to use the mapping.

## Features

- A/C and B/D deck banks; volume, three-band EQ, gain and Quick Effect filter.
- Play, custom cue preview with PLAY latch, sync, keylock, loops, beatjump and hotcues.
- Two FX units with chain and individual-effect modes, Dry/Wet, unit bypass and per-deck routing.
- Independent MOVE CH target for the shared beatjump and loop controls.
- Browser navigation, deck loading, preview-player loading and headphone controls.
- SHIFT functions, temporary tempo bends and a mode that uses tempo faders for the other two decks' volumes.
- Deck LEDs and scripted FX, MOVE and fader-mode feedback.

## Status

Basic MIDI addresses and the I.F.-CURVE setting for A/B were checked on a physical TR-1 on macOS. Software tests cover the tempo faders, deck and SHIFT releases, FX modes/routing/LED messages, MOVE targeting and fader pickup calls. The [live guide](docs/TR-1-LIVE.de.md) includes a hardware test for the new behavior.

## Development

Requires Node.js and Python 3, with no third-party packages:

```sh
node tests/test-mapping.js
python3 tests/test_xml.py
```

The current preset has 190 primary input routes, 143 explicit Note Off routes and 48 XML LED outputs plus scripted feedback. See [changes](CHANGELOG.md) and [attribution and license status](NOTICE.md). This project does not assign a new license to the supplied mapping.

This is an independent community mapping; no affiliation with Vestax or Mixxx is implied.
