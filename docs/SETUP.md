# Setup and troubleshooting

## Requirements

- Vestax TR-1 connected by USB and powered on.
- Mixxx 2.5. Other versions have not been validated with this adaptation.
- An audio output device; for independent headphone monitoring, configure suitable separate output channels in Mixxx.

The TR-1 must appear as a MIDI input/output device in the operating system. This repository contains a MIDI mapping, not a device driver or audio-interface configuration.

## 1. Download the correct files

Download the repository ZIP and extract it. The installable pair is at the repository root:

```text
Vestax-TR-1-2026.midi.xml
Vestax-TR-1-scripts.js
```

The XML refers to that exact JavaScript filename and the `VestaxTR1` script namespace. Do not rename only one file. Do not install the reference copies in `source-2026/`.

## 2. Find your mapping folder

In Mixxx, open **Preferences → Library**, scroll to the bottom and choose **Open Mixxx Settings Directory**. Open its `controllers` subfolder, creating that subfolder if needed. This is preferable to guessing a path, particularly with Flatpak or multiple installations.

Typical locations from the [Mixxx settings-directory manual](https://manual.mixxx.org/2.5/en/chapters/appendix/settings_directory.html):

| System | Mapping folder |
| --- | --- |
| macOS, sandboxed builds | `~/Library/Containers/org.mixxx.mixxx/Data/Library/Application Support/Mixxx/controllers/` |
| Windows | `%LOCALAPPDATA%\Mixxx\controllers\` |
| Linux, distribution/source install | `~/.mixxx/controllers/` |
| Linux, Flatpak | `~/.var/app/org.mixxx.Mixxx/.mixxx/controllers/` |

Older/custom macOS builds may use `~/Library/Application Support/Mixxx/controllers/`; use the folder opened by your running Mixxx installation.

## 3. Install and enable

1. Close Mixxx after locating the folder.
2. If updating an existing version, keep a backup of both old files outside the active `controllers` folder.
3. Copy the two root mapping files into `controllers`.
4. Connect and power on the TR-1, then launch Mixxx.
5. Open **Preferences → Controllers → TR-1**.
6. Select **Vestax TR-1 - 2026 Custom**, enable the controller and apply the settings.
7. Choose a four-deck skin/layout to use decks C and D.

No developer mode or MIDI learning is required. Each controller entry uses one selected preset; select the Custom preset instead of the earlier `Vestax TR-1 - 4 Decks v1` if that is also installed.

For the general controller workflow, see the [Mixxx controller documentation](https://manual.mixxx.org/2.5/en/chapters/advanced_topics.html).

## 4. Configure sound and effects

Under **Preferences → Sound Hardware**, select your main output and, if needed, headphone output. The mapping does not select a sound card or create output routing.

Select a filter as the deck Quick Effect to make FILTER behave as a filter. The FX sections control effect units 1 and 2; load effect chains/presets in Mixxx before testing the effect selectors. ADVANCED/CHAINED changes parameter visibility in this mapping, rather than remapping its knobs.

## 5. First functional check

Use a loaded test track and a comfortable monitoring level:

1. Check A/B PLAY, CUE, PFL and volume, then switch to C/D and repeat.
2. Check HI/MID/LOW, PAN (gain) and FILTER.
3. Check tempo-fader center and direction. Direction follows the supplied 2026 mapping; this adaptation does not change that preference.
4. Check loop activation, loop size and beatjump size on screen.
5. Test SHIFT+SYNC: the tempo faders should control the other deck pair's volumes. Press it again to restore tempo control.
6. Test FX routing and LEDs separately. Their inherited MIDI addresses are not fully confirmed by the recorded basic-control session.

Soft-takeover may require a physical fader to pass through its current software position before it takes effect.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Preset is absent | Confirm the active settings folder; copy both files; restart Mixxx; remove accidental `.txt` extensions. |
| TR-1 is absent | Check power, USB connection and OS MIDI-device detection. |
| Buttons work but custom functions fail | Check that the JavaScript filename matches the XML; inspect `mixxx.log` in the settings directory for script errors. |
| Tempo slider changes another deck's volume | SHIFT+SYNC has enabled extra-deck fader mode. Toggle it off. |
| A fader appears stuck | Move it through the on-screen value to satisfy soft-takeover. |
| Filter has no effect | Assign the intended Quick Effect in Mixxx. |
| Headphones do not work independently | Configure the headphone audio output and PFL/headphone mix. |
| FX selection has no visible effect | Ensure chains/presets are available in Mixxx and check the FX-unit panel. |
| MOVE-CH LEDs change but another control does not follow | The inherited `currentDeck` selection updates LEDs only; it does not route other controls. |
| ADVANCED/CHAINED LEDs are wrong | The supplied script marks these LED addresses as provisional. They require a hardware check. |

The initial MIDI capture confirmed the basic mixer and deck channel banks on macOS, not all inherited input/output addresses. Mock-engine tests cannot establish LED color, hardware timing or complete Mixxx behavior.

## Update or uninstall

For updates, back up the old pair and replace both files together while Mixxx is closed. To uninstall, disable/select another controller preset in Mixxx, close Mixxx, then remove only this preset's XML/script pair. Leave your library and other controller mappings in place.
