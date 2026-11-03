// Local adaptation of the user-supplied 2026 mapping. See SOURCE.md for original-source provenance.
// Vestax TR-1 — Mixxx script
// Move Control A/B/C/D + FX Advanced/Chained LEDs
//
// Si Advance / Chained ne s'allument pas : lance Mixxx avec
//   mixxx --controllerDebug
// appuie sur EFFECT SELECT / ADVANCE-CHAINED, note status + midino,
// et change FX1_ADVANCE / FX1_CHAINED / FX2_* ci-dessous.

var VestaxTR1 = {};

VestaxTR1.connections = [];
VestaxTR1.currentDeck = 1;
VestaxTR1.faderMode = false; // Shift+Sync : tempo = volumes extra decks
VestaxTR1.shiftBendMinusTimer = {};
VestaxTR1.LONG_PRESS_MS = 500;
VestaxTR1.BEND_MINUS = 0x52;
VestaxTR1.BEND_PLUS = 0x53;
VestaxTR1.FADER_MODE_NOTE = 0x5B; // Shift+Sync
VestaxTR1.SHIFT_BEND_MINUS = 0x5E;
VestaxTR1.SHIFT_BEND_PLUS = 0x5F;

// LEDs MOVE CH A/B/C/D (déjà bon sur le TR-1)
VestaxTR1.MOVE_LED_STATUS = 0x98;
VestaxTR1.MOVE_LED_NOTE = 0x68;

// LEDs Advance / Chained — mêmes canaux que tes FX (0x94 = FX1, 0x96 = FX2)
// Notes à ajuster si tes LEDs ne bougent pas (vois le debug).
VestaxTR1.FX1_STATUS = 0x94; // ch5
VestaxTR1.FX2_STATUS = 0x96; // ch7
VestaxTR1.FX_SELECT_LEFT = 0x40;  // E4
VestaxTR1.FX_SELECT_RIGHT = 0x41; // F4
VestaxTR1.FX_MODE_NOTE = 0x42;    // F#4 Advance/Chained

VestaxTR1.numDecks = function () {
    var n = engine.getValue("[App]", "num_decks");
    if (!n) {
        n = engine.getValue("[Master]", "num_decks");
    }
    return n || 4;
};

VestaxTR1.led = function (status, note, on) {
    midi.sendShortMsg(status, note, on ? 0x7F : 0x00);
};

VestaxTR1.updateMoveLeds = function () {
    midi.sendShortMsg(
        VestaxTR1.MOVE_LED_STATUS,
        VestaxTR1.MOVE_LED_NOTE,
        VestaxTR1.currentDeck - 1
    );
};

VestaxTR1.updateFxModeLeds = function (unit) {
    var group = "[EffectRack1_EffectUnit" + unit + "]";
    var advanced = engine.getValue(group, "show_parameters") ? 1 : 0;
    var status = (unit === 1) ? VestaxTR1.FX1_STATUS : VestaxTR1.FX2_STATUS;
    // F#4 Note On 0x7F = LED Advance. Hide = éteinte.
    midi.sendShortMsg(status, VestaxTR1.FX_MODE_NOTE, advanced ? 0x7F : 0x00);
};

VestaxTR1.initDeckLeds = function (deckIndex) {
    var i;
    for (i = 0x4B; i <= 0x56; i++) {
        midi.sendShortMsg(0x90 + deckIndex, i, 0x00);
    }
};

VestaxTR1.init = function (id, debug) {
    VestaxTR1.id = id;
    VestaxTR1.debug = debug;
    VestaxTR1.currentDeck = 1;

    VestaxTR1.cueHeld = {};
    VestaxTR1.cueLatched = {};
    VestaxTR1.shiftBendMinusTimer = {};
    for (var deckIndex = 0; deckIndex < 4; deckIndex++) {
        VestaxTR1.initDeckLeds(deckIndex);
    }
    VestaxTR1.updateMoveLeds();
    VestaxTR1.updateFxModeLeds(1);
    VestaxTR1.updateFxModeLeds(2);

    VestaxTR1.connections.push(engine.makeConnection("[EffectRack1_EffectUnit1]", "show_parameters", function () {
        VestaxTR1.updateFxModeLeds(1);
    }));
    VestaxTR1.connections.push(engine.makeConnection("[EffectRack1_EffectUnit2]", "show_parameters", function () {
        VestaxTR1.updateFxModeLeds(2);
    }));

    engine.softTakeover("[Master]", "gain", true);
    engine.softTakeover("[Master]", "headGain", true);
    engine.softTakeover("[Channel1]", "rate", true);
    engine.softTakeover("[Channel2]", "rate", true);
    engine.softTakeover("[Channel3]", "rate", true);
    engine.softTakeover("[Channel4]", "rate", true);
    engine.softTakeover("[Channel1]", "volume", true);
    engine.softTakeover("[Channel2]", "volume", true);
    engine.softTakeover("[Channel3]", "volume", true);
    engine.softTakeover("[Channel4]", "volume", true);

    VestaxTR1.faderMode = false;
    VestaxTR1.setBendLeds(false);
    VestaxTR1.setFaderModeLeds(false);
};

// Cancel delayed seeks and release temporary bends when switching modes/unloading.
VestaxTR1.cancelTransientControls = function () {
    for (var deck = 1; deck <= 4; deck++) {
        var group = "[Channel" + deck + "]";
        var timer = VestaxTR1.shiftBendMinusTimer[group];
        if (timer) {
            engine.stopTimer(timer);
        }
        VestaxTR1.shiftBendMinusTimer[group] = 0;
        ["rate_temp_down", "rate_temp_up", "rate_temp_down_small", "rate_temp_up_small"].forEach(function (key) {
            engine.setValue(group, key, 0);
        });
    }
};

VestaxTR1.shutdown = function () {
    VestaxTR1.cancelTransientControls();
    VestaxTR1.connections.forEach(function (connection) { connection.disconnect(); });
    VestaxTR1.connections = [];
    midi.sendShortMsg(VestaxTR1.FX1_STATUS, VestaxTR1.FX_MODE_NOTE, 0x00);
    midi.sendShortMsg(VestaxTR1.FX2_STATUS, VestaxTR1.FX_MODE_NOTE, 0x00);
    VestaxTR1.setBendLeds(false);
    VestaxTR1.setFaderModeLeds(false);
};

// LEDs Bend − / + sur les 4 canaux deck (0x90–0x93)
VestaxTR1.setBendLeds = function (on) {
    var ch;
    var vel = on ? 0x7F : 0x00;
    for (ch = 0; ch < 4; ch++) {
        midi.sendShortMsg(0x90 + ch, VestaxTR1.BEND_MINUS, vel);
        midi.sendShortMsg(0x90 + ch, VestaxTR1.BEND_PLUS, vel);
    }
};

VestaxTR1.setBendLed = function (status, note, on) {
    midi.sendShortMsg(status, note, on ? 0x7F : 0x00);
};

// LED bleue Shift+Sync (0x5B), comme Key 0x4B
VestaxTR1.setFaderModeLeds = function (on) {
    var ch;
    var vel = on ? 0x7F : 0x00;
    for (ch = 0; ch < 4; ch++) {
        midi.sendShortMsg(0x90 + ch, VestaxTR1.FADER_MODE_NOTE, vel);
        midi.sendShortMsg(0x90 + ch, VestaxTR1.SHIFT_BEND_MINUS, vel);
        midi.sendShortMsg(0x90 + ch, VestaxTR1.SHIFT_BEND_PLUS, vel);
    }
};

// 0x5B : active / coupe le fader mode (LEDs Bend inchangées)
VestaxTR1.shiftBendPlus = function (channel, control, value) {
    if (value !== 0x7F) {
        return;
    }
    VestaxTR1.cancelTransientControls();
    VestaxTR1.faderMode = !VestaxTR1.faderMode;
    VestaxTR1.setBendLeds(VestaxTR1.faderMode);
    VestaxTR1.setFaderModeLeds(VestaxTR1.faderMode);
    engine.softTakeoverIgnoreNextValue("[Channel1]", "rate");
    engine.softTakeoverIgnoreNextValue("[Channel2]", "rate");
    engine.softTakeoverIgnoreNextValue("[Channel3]", "rate");
    engine.softTakeoverIgnoreNextValue("[Channel4]", "rate");
    engine.softTakeoverIgnoreNextValue("[Channel1]", "volume");
    engine.softTakeoverIgnoreNextValue("[Channel2]", "volume");
    engine.softTakeoverIgnoreNextValue("[Channel3]", "volume");
    engine.softTakeoverIgnoreNextValue("[Channel4]", "volume");
};

VestaxTR1.selectUp = function (channel, control, value) {
    if (value !== 0x7F) {
        return;
    }
    VestaxTR1.currentDeck += 1;
    if (VestaxTR1.currentDeck > VestaxTR1.numDecks()) {
        VestaxTR1.currentDeck = 1;
    }
    VestaxTR1.updateMoveLeds();
};

VestaxTR1.selectDown = function (channel, control, value) {
    if (value !== 0x7F) {
        return;
    }
    VestaxTR1.currentDeck -= 1;
    if (VestaxTR1.currentDeck < 1) {
        VestaxTR1.currentDeck = VestaxTR1.numDecks();
    }
    VestaxTR1.updateMoveLeds();
};

// Bouton mode FX1 : chained <-> advanced (Mixxx = show_parameters)
VestaxTR1.fx1Mode = function (channel, control, value) {
    if (value !== 0x7F) {
        return;
    }
    script.toggleControl("[EffectRack1_EffectUnit1]", "show_parameters");
};

VestaxTR1.fx2Mode = function (channel, control, value) {
    if (value !== 0x7F) {
        return;
    }
    script.toggleControl("[EffectRack1_EffectUnit2]", "show_parameters");
};

// EFFECT SELECT < / >  = effet précédent / suivant de l'unité
VestaxTR1.fx1Prev = function (channel, control, value) {
    if (value === 0x7F) {
        engine.setValue("[EffectRack1_EffectUnit1]", "prev_chain_preset", 1);
    }
};

VestaxTR1.fx1Next = function (channel, control, value) {
    if (value === 0x7F) {
        engine.setValue("[EffectRack1_EffectUnit1]", "next_chain_preset", 1);
    }
};

VestaxTR1.fx2Prev = function (channel, control, value) {
    if (value === 0x7F) {
        engine.setValue("[EffectRack1_EffectUnit2]", "prev_chain_preset", 1);
    }
};

VestaxTR1.fx2Next = function (channel, control, value) {
    if (value === 0x7F) {
        engine.setValue("[EffectRack1_EffectUnit2]", "next_chain_preset", 1);
    }
};

// Tempo slider = pitch bend 14-bit. <invert/> XML ne fonctionne pas dessus.
// Fader mode :
//   0xE9 / 0xEA (A/B) = volume decks 3 / 4
//   0xEB / 0xEC (C/D) = volume decks 1 / 2
VestaxTR1.rate = function (channel, control, value, status, group) {
    // Exact center and endpoints; do not exceed [-1, 1] at raw zero.
    var raw = (value << 7) | control;
    var pitch = raw < 8192 ? (raw - 8192) / 8192 : (raw - 8192) / 8191;
    if (VestaxTR1.faderMode) {
        var volGroup = null;
        if (status === 0xE9) {
            volGroup = "[Channel3]";
        } else if (status === 0xEA) {
            volGroup = "[Channel4]";
        } else if (status === 0xEB) {
            volGroup = "[Channel1]";
        } else if (status === 0xEC) {
            volGroup = "[Channel2]";
        }
        if (volGroup) {
            engine.setValue(volGroup, "volume", (1 - pitch) / 2);
            return;
        }
    }
    engine.setValue(group, "rate", -pitch);
};

// 0x5E = Shift + Bend-
// Hors fader mode : pause = début, play = bend fin down.
// Fader mode : appui court = beatjump 32 back, appui long = début du track.
VestaxTR1.shiftBendMinus = function (channel, control, value, status, group) {
    if (VestaxTR1.faderMode) {
        VestaxTR1.setBendLed(status, control, !value);
    }
    if (!value) {
        engine.setValue(group, "rate_temp_down_small", 0);
        var tid = VestaxTR1.shiftBendMinusTimer[group];
        if (tid) {
            engine.stopTimer(tid);
            VestaxTR1.shiftBendMinusTimer[group] = 0;
            if (VestaxTR1.faderMode) {
                engine.setValue(group, "beatjump_32_backward", 1);
            }
        }
        return;
    }
    if (VestaxTR1.faderMode) {
        VestaxTR1.shiftBendMinusTimer[group] = engine.beginTimer(
            VestaxTR1.LONG_PRESS_MS,
            function () {
                VestaxTR1.shiftBendMinusTimer[group] = 0;
                engine.setValue(group, "start", 1);
            },
            true
        );
        return;
    }
    if (!engine.getValue(group, "play")) {
        engine.setValue(group, "start", 1);
        return;
    }
    engine.setValue(group, "rate_temp_down_small", 1);
};

// 0x5F = Shift + Bend+
// Fader mode : beatjump 32 forward. Sinon : bend fin up.
VestaxTR1.shiftBendPlusFine = function (channel, control, value, status, group) {
    if (VestaxTR1.faderMode) {
        VestaxTR1.setBendLed(status, control, !value);
    }
    if (!value) {
        engine.setValue(group, "rate_temp_up_small", 0);
        return;
    }
    if (VestaxTR1.faderMode) {
        engine.setValue(group, "beatjump_32_forward", 1);
        return;
    }
    engine.setValue(group, "rate_temp_up_small", 1);
};

// Normal : play = pitch bend, pause = ±1 beat.
// Fader mode : ±1 beat aussi en lecture. LED Bend 0x7F / 0x00 à l'appui.
VestaxTR1.bend = function (channel, control, value, status, group) {
    var down = (control === VestaxTR1.BEND_MINUS);
    if (VestaxTR1.faderMode) {
        VestaxTR1.setBendLed(status, control, !value);
    }
    if (!value) {
        engine.setValue(group, "rate_temp_down", 0);
        engine.setValue(group, "rate_temp_up", 0);
        return;
    }
    if (VestaxTR1.faderMode || !engine.getValue(group, "play")) {
        engine.setValue(group, down ? "beatjump_1_backward" : "beatjump_1_forward", 1);
        return;
    }
    engine.setValue(group, down ? "rate_temp_down" : "rate_temp_up", 1);
};

VestaxTR1.cueHeld = {};
VestaxTR1.cueLatched = {};

VestaxTR1.atCue = function (group) {
    var samples = engine.getValue(group, "track_samples");
    if (!samples) {
        return false;
    }
    var pos = engine.getValue(group, "playposition") * samples;
    var cue = engine.getValue(group, "cue_point");
    return Math.abs(pos - cue) < 2048;
};

// CUE : set cue partout, sauf pause déjà sur le cue = preview (relâche = retour)
VestaxTR1.cue = function (channel, control, value, status, group) {
    var preview = !engine.getValue(group, "play") && VestaxTR1.atCue(group);
    if (!preview && !VestaxTR1.cueHeld[group]) {
        if (value) {
            engine.setValue(group, "quantize", 1);
            engine.setValue(group, "cue_set", 1);
            if (!engine.getValue(group, "play")) {
                engine.setValue(group, "cue_gotoandstop", 1);
            }
        }
        return;
    }
    if (value) {
        VestaxTR1.cueHeld[group] = true;
        VestaxTR1.cueLatched[group] = false;
        engine.setValue(group, "cue_gotoandplay", 1);
        return;
    }
    VestaxTR1.cueHeld[group] = false;
    if (!VestaxTR1.cueLatched[group]) {
        engine.setValue(group, "cue_gotoandstop", 1);
    }
};

VestaxTR1.play = function (channel, control, value, status, group) {
    if (!value) {
        return;
    }
    if (VestaxTR1.cueHeld[group]) {
        VestaxTR1.cueLatched[group] = true;
        return;
    }
    script.toggleControl(group, "play");
};

// Normalize MIDI Note Off release velocity for scripted button routes.
["fx1Prev", "fx1Next", "fx2Prev", "fx2Next", "fx1Mode", "fx2Mode",
 "selectUp", "selectDown", "shiftBendPlus", "shiftBendMinus",
 "shiftBendPlusFine", "bend", "cue", "play"].forEach(function (name) {
    var handler = VestaxTR1[name];
    VestaxTR1[name] = function (channel, control, value, status, group) {
        return handler(channel, control, (status & 0xF0) === 0x80 ? 0 : value, status, group);
    };
});
