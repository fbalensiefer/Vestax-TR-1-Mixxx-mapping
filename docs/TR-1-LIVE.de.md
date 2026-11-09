# Vestax TR-1 in Mixxx 2.5

Links wählst du **A/C** (Deck 1/3), rechts **B/D** (Deck 2/4). Transport, Mixer, FX-Zuweisung und LOAD folgen diesen Schaltern. **MOVE CH** wählt separat das Ziel für das gemeinsame MOVE-Feld. Beim Start ist dort A gewählt und MODE steht auf Sprung.

**M** steht für einen früher am TR-1 gemessenen MIDI-Eingang, **V** für eine Adresse aus der Vorlage, **H** für die Zuordnung anhand des Handbuchlayouts, die noch am Gerät geprüft werden muss. Die Buchstaben beziehen sich auf Eingänge. Die LED-Spalte beschreibt die vorgesehene Rückmeldung. Adressen stammen aus der Vorlage und die geänderten LED-Zustände wurden im Softwaretest geprüft. Die physische Anzeige ist noch offen.

## Decks, Mixer und Browser

| Am TR-1 | Direkt | Mit SHIFT derselben Seite | LED / Herkunft |
| --- | --- | --- | --- |
| A/C, B/D | Bank der jeweiligen Seite wählen | — | Schalterstellung. M über die MIDI-Kanäle |
| PLAY/STOP | Wiedergabe. Während SET-CUE-Vorschau übernimmt PLAY die Wiedergabe. | Zum Haupt-Cue und stoppen | Wiedergabe. M auf A–D, SHIFT V |
| SET CUE / GRID | Haupt-Cue setzen und Quantize aktivieren. Am pausierten Cue halten zum Vorhören, loslassen zur Rückkehr. | Bei Pause das Beatgrid zur Abspielposition verschieben | Cue-Status. M auf A, SHIFT V |
| CUE BACK/FWD | Um die eingestellte Beatjump-Weite springen | Beatjump-Weite halbieren/verdoppeln | Keine Ausgabe. M auf A, SHIFT V |
| SYNC | Sync ein/aus | Zusatz-Fader-Modus global umschalten, sobald vier Decks verfügbar sind | Sync und separate Modusanzeige. M auf A, SHIFT V |
| KEY-Taste | Keylock ein/aus | Slip ein/aus | Keylock und Slip. M auf A, SHIFT V |
| Deck-LOOP | Beatloop mit aktueller Länge ein/aus | Looproll, solange gedrückt | Loop aktiv. M auf A, SHIFT V |
| Deck-FX 1 / 2 | Deck an FX 1 / FX 2 senden oder aus der Einheit nehmen | Hotcue 1 / 2 setzen oder auslösen | FX-Zuweisung bzw. Hotcue-Status. V |
| BEND − / + | Spielend temporär langsamer/schneller. Pausiert um einen Beat springen. | Fein-Bend. Minus bei Pause springt zum Trackanfang. | Im Zusatz-Fader-Modus leuchten die BEND-Anzeigen und reagieren auf Druck. V |
| LEVEL-Fader | Decklautstärke | — | M auf A/B. Für stufenlose Werte den vorderen I.F.-CURVE-Regler etwa mittig lassen. |
| TEMPO-Fader | Tempo des Decks, 14 Bit | — | M für Tempo. Im Zusatz-Fader-Modus steuert A → C, B → D, C → A, D → B die Lautstärke. |
| HI, MID, LOW | Drei EQ-Bänder | — | M auf A |
| PAN / MID LOW | Deck-Gain | Die Vorlage enthält für beide SHIFT-Tasten zusammen eine Sampler-Gain-Route. Physische Kombination offen. | PAN-LED ohne Mapping-Ausgabe. Gain M auf A, Sampler V/H |
| FILTER | Quick Effect. In Mixxx einen Filter als Quick Effect wählen. | — | M auf A |
| KEY-Regler | Tonhöhe ändern | — | 14-Bit-Eingang. M auf A |
| Kopfhörer-CUE | Deck auf den Kopfhörer schalten | — | PFL-Status. M auf A |
| Browser UP / DOWN | Vorheriger/nächster Track in der aktuellen Liste | — | V/H |
| PREVIEW | Auswahl im Vorschauplayer laden und starten | — | V |
| LOAD A/C und B/D | Auswahl in das per Schalter gewählte Deck der jeweiligen Seite laden | — | V |
| MASTER LEVEL / MONITOR MIX / MONITOR LEVEL | Masterpegel / Mischung zwischen Kopfhörer-CUE und Master / Kopfhörerpegel | — | V |
| SHIFT, I.F.-CURVE, LED CONTRAST | SHIFT aktiviert die zweite Belegung der Seite. Die beiden Frontregler stellen Fader-Kurve und LED-Helligkeit am Gerät ein. | — | Hardwarefunktion laut Handbuch |

Im **Zusatz-Fader-Modus** springt BEND auch während der Wiedergabe um einen Beat. SHIFT+BEND+ springt 32 Beats vor, SHIFT+BEND− kurz gedrückt 32 Beats zurück und ab 500 ms zum Trackanfang. Nach einem Zielwechsel die Fader bis zum Mixxx-Wert führen, damit die Übernahme ohne Sprung erfolgen kann.

## FX 1 und FX 2

Wähle am Deck die passende **FX-1/2-Taste**. Starte mit wenig **Dry/Wet** und schalte die Einheit mit **Taste 4** ein. Die beiden FX-Felder arbeiten gleich und können in unterschiedlichen Modi stehen. Regler und Tasten sind jeweils von links nach rechts gezählt. Die Adressen sind V, die Regler von FX 1 sind zusätzlich im Servicehandbuch verzeichnet.

| Am TR-1 | CHAINED | ADVANCED | LED |
| --- | --- | --- | --- |
| ADVANCED/CHAINED | Wechselt zum zuletzt gewählten Slot in ADVANCED | Wechselt zurück zur Kette | Modusanzeige vorgesehen, genaue Anzeige offen |
| Tasten 1–3 | Geladenen Effekt im jeweiligen Slot ein/aus | Einen der drei Slots für die Bearbeitung wählen | CHAINED zeigt aktive Slots, ADVANCED den gewählten Slot |
| Regler 1–3 | Je ein Meta-Regler pro Slot | Parameter 1–3 des gewählten Slots, soweit der Effekt sie anbietet | — |
| EFFECT SELECT ◀ / ▶ | Vorheriges/nächstes Ketten-Preset | Vorheriger/nächster Effekt im gewählten Slot | — |
| Regler 4 / Taste 4 | Dry/Wet / gesamte Einheit ein/aus | Dry/Wet / gesamte Einheit ein/aus | Taste 4 zeigt den Zustand der Einheit |

Zum Ein- und Ausschalten eines einzelnen Effekts auf CHAINED gehen. Die Positionsübernahme der Regler wird beim Modus- und Slotwechsel erneut aktiviert.

## Gemeinsames MOVE-Feld

| Am TR-1 | MODE links · Sprung | MODE rechts · Loop | LED / Herkunft |
| --- | --- | --- | --- |
| MOVE CH ◀ / ▶ | Vorheriges/nächstes verfügbares Deck | Vorheriges/nächstes verfügbares Deck | A–D-Zielanzeige. V |
| MODE ◀ / ▶ | Links wählt Sprung | Rechts wählt Loop | V/H, keine separate Modusausgabe |
| VALUE ◀ / ▶ | Sprungweite halbieren/verdoppeln | Loop-Länge halbieren/verdoppeln | V/H |
| MOVE ◀ / ▶ | Um die eingestellte Weite springen. Mixxx verschiebt dabei ggf. den aktiven Loop. | Aktiven Loop um einen Beat verschieben | V/H |
| LOOP im MOVE-Feld | Beatloop des MOVE-Zieldecks ein/aus | Beatloop des MOVE-Zieldecks ein/aus | Loop-Status des MOVE-Zieldecks. V/H |

Die bisherigen MOVE-Adressen für manuelles Loop In/Out und Hotcue 3/4 steuern jetzt das gemeinsame MOVE-Feld. Hotcue 1/2 bleibt auf den Deck-FX-Tasten mit SHIFT. Der normale Deck-LOOP und LOOP im MOVE-Feld sind getrennte Tasten mit unterschiedlichen Zielen.

## Kurzer Gerätetest und MIDI-Aufnahme

Zum Testen vier Decks anzeigen, Testtracks laden und die Abhörlautstärke niedrig halten. Falls ein Handgriff abweicht, beim Wiederholen MIDI-Eingang mit Status, Note/CC und Wert mitschneiden. Beim LED-Test zusätzlich notieren, welche physische Anzeige leuchtet.

1. **FX je Seite.** Auf A die Deck-FX-Taste 1 und auf D die Deck-FX-Taste 2 drücken. Oben je FX-Feld Taste 4, Tasten 1–3, EFFECT SELECT links/rechts und ADVANCED/CHAINED einzeln betätigen. In beiden Modi Regler 1–4 nacheinander bewegen. Prüfen, dass Taste 4 den Ton der Einheit umschaltet, Taste 2 im ADVANCED-Modus Slot 2 fokussiert und Regler 1 dort Parameter 1 ändert. Modus- und Slot-LEDs beobachten.
2. **MOVE.** Die linke Deckbank auf A lassen, mit MOVE CH zweimal rechts C wählen. MODE links, VALUE rechts, MOVE rechts drücken. Dann MODE rechts, das gemeinsame LOOP, VALUE links und MOVE links drücken. Nur C soll reagieren. A/C umschalten und prüfen, dass das MOVE-Ziel C bleibt. CH-Anzeige und gemeinsame LOOP-LED beobachten.
3. **Bank und SHIFT.** Auf spielendem A SHIFT+BEND− drücken, SHIFT zuerst loslassen, auf C umschalten, BEND loslassen. A soll zum normalen Tempo zurückkehren. Auf C SHIFT+LOOP ebenso mit SHIFT zuerst loslassen und auf das Ende des Rolls achten. Mit SHIFT+SYNC den Zusatzmodus einschalten, TEMPO auf C bewegen und prüfen, dass nach Positionsübernahme A leiser/lauter wird. SHIFT+SYNC erneut drücken.
4. **Browser und Fader.** UP, DOWN und PREVIEW je einmal drücken. Einen Testtrack mit LOAD A/C nacheinander auf A und C laden. LOAD B/D auf B und D wiederholen. LEVEL A und B bei mittigem I.F.-CURVE-Regler langsam bewegen. Bei Bankwechsel auf das Abholen der Lautstärke achten.

[Installation](../README.de.md#installation) · [MIDI-Adressen](MIDI-REFERENCE.md) · [Vestax-Handbuch, Layout auf Seite 5](https://images.thomann.de/pics/atg/atgdata/document/manual/235054.pdf#page=5) · [Mixxx-2.5-Controls](https://manual.mixxx.org/2.5/en/chapters/appendix/mixxx_controls)
