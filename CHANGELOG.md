# Changelog

## 2026-11-03 — Initial standalone custom mapping

Based on the supplied 2026 XML/script pair, preserving all 190 original input assignments and 60 XML LED outputs.

- Set the preset name to `Vestax TR-1 - 2026 Custom`, targeting Mixxx 2.5.
- Add 143 explicit Note Off input routes and normalize Note Off velocities in script-bound button handlers.
- Decode 14-bit tempo data with exact endpoints −1/+1 and center 0, keeping the source mapping's direction. Extra-deck volume conversion remains within 0…1.
- Cancel delayed seeks and temporary bends when switching fader modes or unloading the script.
- Disconnect FX-mode engine connections when unloading.
- Initialize all four deck LED banks.
- Add English/German setup documentation, controls, generated MIDI reference, provenance notes and automated tests.

FX, SHIFT, browser, custom cue behavior, fader mode and LED addresses come from the supplied mapping. Their complete end-to-end hardware behavior has not been validated by these changes.
