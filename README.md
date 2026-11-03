# Vestax TR-1 Custom Mapping for Mixxx

A four-deck MIDI mapping for the **Vestax TR-1**, targeting **Mixxx 2.5**. Based on a user-supplied 2026 mapping, with fixes for MIDI releases, tempo-fader limits and script cleanup.

**[Deutsche Anleitung](README.de.md)** · **[Setup](docs/SETUP.md)** · **[Controls](docs/CONTROLS.md)** · **[MIDI reference](docs/MIDI-REFERENCE.md)**

## Install in five steps

1. Download this repository using **Code → Download ZIP** and extract it.
2. In Mixxx, open **Preferences → Library → Open Mixxx Settings Directory**, then open its `controllers` folder.
3. Copy **both root files** into that folder:
   - `Vestax-TR-1-2026.midi.xml`
   - `Vestax-TR-1-scripts.js`
4. Connect the TR-1, restart Mixxx, and open **Preferences → Controllers → TR-1**.
5. Select **Vestax TR-1 - 2026 Custom**, enable the controller and click **Apply**. Select a four-deck skin to use C/D.

Copy the files from the repository root; `source-2026/` contains the unmodified reference version. Keep the XML and script filenames unchanged. No Python or Node.js installation is needed to use the mapping.

## Features

- A/C and B/D deck banks; volume, three-band EQ, gain and Quick Effect filter.
- Play, custom cue preview with PLAY latch, sync, keylock, loops, beatjump and hotcues.
- Two FX units with three effect meta controls each, Dry/Wet, deck routing and chain-preset selection.
- Browser navigation, deck loading, preview-player loading and headphone controls.
- SHIFT functions, temporary tempo bends and a mode that uses tempo faders for the other two decks' volumes.
- XML LED outputs and scripted mode indicators inherited from the supplied mapping.

## Status

The basic MIDI addresses were checked against a physical TR-1 on macOS. The software tests check all 16,384 tempo-fader values on each deck, extra-deck volume routing, release handling, cue/PLAY latching and timer cleanup. XML tests check that every original input assignment and LED output is retained.

**This is not a claim of complete hardware validation.** FX, SHIFT and LED behavior still need an end-to-end check in Mixxx. Windows and Linux installation steps are documented, but were not tested on those systems. See [known limitations and troubleshooting](docs/SETUP.md#troubleshooting).

## Development

Requires Node.js and Python 3, with no third-party packages:

```sh
node tests/test-mapping.js
python3 tests/test_xml.py
```

The current preset has 190 inherited input routes, 143 additional Note Off routes and 60 XML LED outputs. See [changes](CHANGELOG.md) and [attribution and license status](NOTICE.md). This project does not assign a new license to the supplied mapping.

This is an independent community mapping; no affiliation with Vestax or Mixxx is implied.
