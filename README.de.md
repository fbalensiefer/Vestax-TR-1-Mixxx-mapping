# Vestax TR-1 Custom-Mapping für Mixxx

Vier-Deck-Mapping für den **Vestax TR-1** und **Mixxx 2.5**, auf Grundlage der bereitgestellten 2026-Version.

[English](README.md) · [Ausführliches Setup (Englisch)](docs/SETUP.md) · [Belegung](docs/CONTROLS.md)

## Installation

1. Auf GitHub **Code → Download ZIP** wählen und das Archiv entpacken.
2. In Mixxx **Einstellungen → Bibliothek → Mixxx-Einstellungsordner öffnen** wählen. Darin den Ordner `controllers` öffnen.
3. Diese **beiden Dateien aus dem Hauptordner** hineinkopieren:
   - `Vestax-TR-1-2026.midi.xml`
   - `Vestax-TR-1-scripts.js`
4. Den TR-1 per USB anschließen und einschalten. Mixxx neu starten.
5. Unter **Einstellungen → Controller → TR-1** das Preset **Vestax TR-1 - 2026 Custom** auswählen, den Controller aktivieren und **Anwenden** klicken.
6. Für Deck C/D eine Oberfläche mit vier Decks auswählen. Unter **Sound-Hardware** die eigene Audioausgabe und gegebenenfalls einen separaten Kopfhörerausgang konfigurieren.

Die unveränderten Ausgangsdateien werden nicht veröffentlicht; ihre Herkunft ist in [SOURCE.md](SOURCE.md) dokumentiert. XML und JavaScript müssen zusammenliegen und ihre Dateinamen behalten. Für die Nutzung sind weder Node.js noch Python erforderlich.

## Wichtigste Belegungen

| Bedienelement | Funktion |
| --- | --- |
| Deckwahlschalter | Links A/C, rechts B/D; Mixxx Deck 1/2/3/4 |
| Fader und HI/MID/LOW | Lautstärke und 3-Band-EQ |
| PAN | Gain des Decks |
| FILTER | Quick Effect; Filter in Mixxx als Quick Effect auswählen |
| PLAY / SET CUE | Wiedergabe und eigener Cue-Modus mit Vorhören und PLAY-Latch |
| CUE BACK / FWD | Beatjump in der in Mixxx eingestellten Sprungweite |
| SYNC / KEY | Sync / Keylock |
| LOOP / Move-Tasten | Loop aktivieren, halbieren/verdoppeln, In/Out und Reloop |
| FX-Sektionen | Effekt-Meta-Regler, Dry/Wet, Ein/Aus, Routing und Ketten-Presets |
| SHIFT + SYNC | Zusätzlichen Fader-Modus ein/aus |

Im zusätzlichen Fader-Modus steuern die TEMPO-Fader A/B die Lautstärke von C/D, und die TEMPO-Fader C/D die Lautstärke von A/B. BEND springt dann ±1 Beat. SHIFT+BEND+ springt 32 Beats vor; SHIFT+BEND− springt kurz gedrückt 32 Beats zurück und lang gedrückt zum Trackanfang.

SET CUE aktiviert Quantize. Bei Pause am vorhandenen Cue-Punkt startet gedrücktes CUE eine Vorschau; Loslassen kehrt zum Cue zurück. PLAY während dieser Vorschau hält die Wiedergabe aktiv.

## Wenn etwas nicht reagiert

- **Preset fehlt:** Beide Dateien in den aktiven Mixxx-Einstellungsordner kopieren und neu starten; auf doppelte Dateiendungen wie `.xml.txt` achten.
- **Controller fehlt:** USB-Verbindung und Stromversorgung prüfen, Gerät einschalten und Mixxx erneut öffnen.
- **Regler reagiert erst später:** Soft-Takeover kann aktiv sein. Den physischen Regler über den aktuellen Bildschirmwert bewegen.
- **TEMPO verändert Lautstärke:** SHIFT+SYNC schaltet den zusätzlichen Fader-Modus zurück.
- **Kein Filtereffekt:** In Mixxx einen Filter als Quick Effect auswählen.
- **Kein Ton:** Unter Sound-Hardware die Audioausgänge konfigurieren. Das Mapping richtet kein Audiointerface ein.
- **FX-/Modus-LEDs falsch:** Diese Adressen stammen aus der Vorlage und sind noch nicht vollständig am Gerät bestätigt.

## Prüfstand und Herkunft

Die Grundadressen wurden an einem TR-1 auf macOS erfasst. Automatische Tests prüfen unter anderem die hochauflösenden Tempo-Fader, Releases, Cue/PLAY und Timer-Abbruch. Die vollständige FX-, SHIFT- und LED-Funktion in Mixxx sowie Windows/Linux sind noch nicht praktisch bestätigt.

Die Vorlage nennt Danny Ricard-Lavergne als Autor. Die Originaldateien werden nicht mitveröffentlicht. [Änderungen](CHANGELOG.md) und [Herkunft/Lizenzstatus](NOTICE.md) sind dokumentiert; es wird keine neue Lizenz für fremde Bestandteile vergeben.
