# Changelog

## 2026-11-09 — Mixxx 2.5 live workflow

- Give both FX sections distinct CHAINED and ADVANCED knob functions, a unit on/off button, and mode-aware slot LEDs.
- Route the shared MOVE block to the MOVE CH selection for beatjumps and loop editing.
- Track held buttons across SHIFT and deck bank changes, and rearm fader pickup when the physical source or destination changes.
- Document the verified I.F.-CURVE setting and the MIDI and LED checks pending on the controller.

## 2026-11-03 — rekordbox 7 mapping design

- Add separate native CSV drafts: core input profile and optional 16-output LED profile.
- Define 61 function rows / 136 unique input addresses across four decks, mixer, loops, FX and browser.
- Include English/German setup guides, schematic layout, porting decisions and validation gates.
- Validate function/type identifiers against local rekordbox 7.2.19 factory definitions without redistributing vendor files.
- Defer unresolved Pitch Bend encoding for TEMPO and continuous KEY, direct hotcues, preview and audio-level knobs. No importer/hardware validation is claimed.
- Extend CI with deterministic CSV/address checks. Existing Mixxx mappings remain unchanged.

## 2026-11-03 — Initial standalone custom mapping

Based on the supplied 2026 XML/script pair, preserving all 190 original input assignments and 60 XML LED outputs.

- Set the preset name to `Vestax TR-1 - 2026 Custom`, targeting Mixxx 2.5.
- Add 143 explicit Note Off input routes and normalize Note Off velocities in script-bound button handlers.
- Decode 14-bit tempo data with exact endpoints −1/+1 and center 0, keeping the source mapping's direction. Extra-deck volume conversion remains within 0…1.
- Cancel delayed seeks and temporary bends when switching fader modes or unloading the script.
- Disconnect FX-mode engine connections when unloading.
- Initialize all four deck LED banks.
- Add English/German setup documentation, controls, generated MIDI reference, provenance notes and automated tests.
- Keep the unmodified source files out of the public repository; record their provenance and SHA-256 digests separately.

FX, SHIFT, browser, custom cue behavior, fader mode and LED addresses come from the supplied mapping. Their complete end-to-end hardware behavior has not been validated by these changes.
