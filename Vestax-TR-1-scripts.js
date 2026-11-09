// Local adaptation of the user-supplied 2026 mapping. See SOURCE.md for original-source provenance.
// Vestax TR-1 live workflow for Mixxx 2.5.
var VestaxTR1 = {};

VestaxTR1.connections = [];
VestaxTR1.LONG_PRESS_MS = 500;
VestaxTR1.BEND_MINUS = 0x52;
VestaxTR1.BEND_PLUS = 0x53;
VestaxTR1.FADER_MODE_NOTE = 0x5B;
VestaxTR1.SHIFT_BEND_MINUS = 0x5E;
VestaxTR1.SHIFT_BEND_PLUS = 0x5F;

VestaxTR1.numDecks = function () {
    var n = engine.getValue("[App]", "num_decks");
    if (!n) {
        n = engine.getValue("[Master]", "num_decks");
    }
    return Math.min(n || 4, 4);
};

VestaxTR1.led = function (status, note, on) {
    midi.sendShortMsg(status, note, on ? 0x7F : 0x00);
};

VestaxTR1.deckGroup = function (deck) {
    return "[Channel" + deck + "]";
};

VestaxTR1.moveGroup = function () {
    if (VestaxTR1.currentDeck > VestaxTR1.numDecks()) {
        VestaxTR1.currentDeck = 1;
    }
    return VestaxTR1.deckGroup(VestaxTR1.currentDeck);
};

VestaxTR1.updateMoveLeds = function () {
    var group = VestaxTR1.moveGroup();
    midi.sendShortMsg(0x98, 0x68, VestaxTR1.currentDeck - 1);
    var active = engine.getValue(group, "loop_enabled");
    for (var bank = 0; bank < 4; bank++) {
        VestaxTR1.led(0x90 + bank, 0x4A, active);
    }
};

VestaxTR1.fxGroup = function (unit, slot) {
    return "[EffectRack1_EffectUnit" + unit + (slot ? "_Effect" + slot : "") + "]";
};

VestaxTR1.fxFocus = function (unit) {
    var focus = engine.getValue(VestaxTR1.fxGroup(unit), "focused_effect");
    return focus >= 1 && focus <= 3 ? focus : 0;
};

VestaxTR1.updateFxLeds = function (unit) {
    var status = unit === 1 ? 0x94 : 0x96;
    var focus = VestaxTR1.fxFocus(unit);
    for (var slot = 1; slot <= 3; slot++) {
        var effect = VestaxTR1.fxGroup(unit, slot);
        VestaxTR1.led(status, 0x3B + slot, focus ? focus === slot :
            engine.getValue(effect, "loaded") && engine.getValue(effect, "enabled"));
    }
    VestaxTR1.led(status, 0x3F, engine.getValue(VestaxTR1.fxGroup(unit), "enabled"));
    // Inherited address. Verify the physical ADVANCED/CHAINED indicator on the TR-1.
    VestaxTR1.led(status, 0x42, focus !== 0);
};

VestaxTR1.watch = function (group, key, callback) {
    VestaxTR1.connections.push(engine.makeConnection(group, key, callback));
};

VestaxTR1.armFxSlot = function (unit, slot) {
    var group = VestaxTR1.fxGroup(unit, slot);
    ["meta", "parameter1", "parameter2", "parameter3"].forEach(function (key) {
        engine.softTakeoverIgnoreNextValue(group, key);
    });
};

VestaxTR1.setupFx = function (unit) {
    var group = VestaxTR1.fxGroup(unit);
    var update = function () { VestaxTR1.updateFxLeds(unit); };
    engine.setValue(group, "show_focus", VestaxTR1.fxFocus(unit) ? 1 : 0);
    VestaxTR1.watch(group, "enabled", update);
    VestaxTR1.watch(group, "focused_effect", function () {
        var focus = VestaxTR1.fxFocus(unit);
        engine.setValue(group, "show_focus", focus ? 1 : 0);
        if (focus) {
            VestaxTR1.lastFxFocus[unit] = focus;
        }
        for (var slot = 1; slot <= 3; slot++) {
            VestaxTR1.armFxSlot(unit, slot);
        }
        update();
    });
    function watchSlot(slot) {
        var effect = VestaxTR1.fxGroup(unit, slot);
        ["meta", "parameter1", "parameter2", "parameter3"].forEach(function (key) {
            engine.softTakeover(effect, key, true);
        });
        VestaxTR1.watch(effect, "enabled", update);
        VestaxTR1.watch(effect, "loaded", update);
        VestaxTR1.watch(effect, "loaded_effect", function () {
            VestaxTR1.armFxSlot(unit, slot);
            update();
        });
    }
    for (var slot = 1; slot <= 3; slot++) {
        watchSlot(slot);
    }
    update();
};

VestaxTR1.init = function () {
    VestaxTR1.currentDeck = 1;
    VestaxTR1.moveLoop = false;
    VestaxTR1.lastFxFocus = [0, 1, 1];
    VestaxTR1.faderMode = false;
    VestaxTR1.faderTargets = {};
    VestaxTR1.faderSources = {};
    VestaxTR1.heldButtons = {};
    VestaxTR1.cueHeld = {};
    VestaxTR1.cueLatched = {};
    VestaxTR1.shiftBendMinusTimer = {};
    engine.softTakeover("[Master]", "gain", true);
    engine.softTakeover("[Master]", "headGain", true);
    for (var deck = 1; deck <= 4; deck++) {
        var group = VestaxTR1.deckGroup(deck);
        engine.softTakeover(group, "rate", true);
        engine.softTakeover(group, "volume", true);
        VestaxTR1.watch(group, "loop_enabled", VestaxTR1.updateMoveLeds);
    }
    VestaxTR1.watch("[App]", "num_decks", function () {
        if (VestaxTR1.faderMode && VestaxTR1.numDecks() < 4) {
            VestaxTR1.shiftBendPlus(0, VestaxTR1.FADER_MODE_NOTE, 1);
        }
        VestaxTR1.updateMoveLeds();
    });
    VestaxTR1.setupFx(1);
    VestaxTR1.setupFx(2);
    VestaxTR1.updateMoveLeds();
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
    Object.keys(VestaxTR1.heldButtons).forEach(function (button) {
        VestaxTR1.runDeckButton(VestaxTR1.heldButtons[button], 0);
    });
    VestaxTR1.heldButtons = {};
    [0x94, 0x96].forEach(function (status) {
        [0x3C, 0x3D, 0x3E, 0x3F, 0x42].forEach(function (note) {
            VestaxTR1.led(status, note, false);
        });
    });
    for (var bank = 0; bank < 4; bank++) {
        VestaxTR1.led(0x90 + bank, 0x4A, false);
    }
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

VestaxTR1.shiftBendPlus = function (channel, control, value) {
    if (!value || (!VestaxTR1.faderMode && VestaxTR1.numDecks() < 4)) {
        return;
    }
    VestaxTR1.cancelTransientControls();
    VestaxTR1.faderMode = !VestaxTR1.faderMode;
    VestaxTR1.faderTargets = {};
    VestaxTR1.faderSources = {};
    VestaxTR1.setBendLeds(VestaxTR1.faderMode);
    VestaxTR1.setFaderModeLeds(VestaxTR1.faderMode);
};

VestaxTR1.selectUp = function (channel, control, value) {
    if (value) {
        VestaxTR1.moveGroup();
        VestaxTR1.currentDeck = VestaxTR1.currentDeck % VestaxTR1.numDecks() + 1;
        VestaxTR1.updateMoveLeds();
    }
};

VestaxTR1.selectDown = function (channel, control, value) {
    if (value) {
        VestaxTR1.moveGroup();
        VestaxTR1.currentDeck = VestaxTR1.currentDeck === 1 ?
            VestaxTR1.numDecks() : VestaxTR1.currentDeck - 1;
        VestaxTR1.updateMoveLeds();
    }
};

VestaxTR1.toggleLoop = function (group) {
    engine.setValue(group, engine.getValue(group, "loop_enabled") ?
        "reloop_toggle" : "beatloop_activate", 1);
};

VestaxTR1.moveControl = function (channel, control, value) {
    if (!value) {
        return;
    }
    var group = VestaxTR1.moveGroup();
    switch (control) {
    case 0x44:
    case 0x45:
        var size = VestaxTR1.moveLoop ? "loop_" : "beatjump_size_";
        engine.setValue(group, size + (control === 0x44 ? "halve" : "double"), 1);
        break;
    case 0x46:
    case 0x47:
        if (VestaxTR1.moveLoop) {
            if (engine.getValue(group, "loop_enabled")) {
                engine.setValue(group, "loop_move", control === 0x46 ? -1 : 1);
            }
        } else {
            engine.setValue(group, control === 0x46 ? "beatjump_backward" : "beatjump_forward", 1);
        }
        break;
    case 0x48:
    case 0x49:
        VestaxTR1.moveLoop = control === 0x49;
        break;
    case 0x4A:
        VestaxTR1.toggleLoop(group);
        break;
    }
};

VestaxTR1.fxKnob = function (channel, control, value) {
    var unit = channel === 4 ? 1 : 2;
    var knob = control - 0x17;
    var focus = VestaxTR1.fxFocus(unit);
    var group = VestaxTR1.fxGroup(unit, focus || knob);
    var key = focus ? "parameter" + knob : "meta";
    if (engine.getValue(group, focus ? key + "_loaded" : "loaded")) {
        engine.setParameter(group, key, value / 127);
    }
};

VestaxTR1.fxButton = function (channel, control, value) {
    if (!value) {
        return;
    }
    var unit = channel === 4 ? 1 : 2;
    var group = VestaxTR1.fxGroup(unit);
    var focus = VestaxTR1.fxFocus(unit);
    if (control <= 0x3E) {
        var slot = control - 0x3B;
        if (focus) {
            engine.setValue(group, "focused_effect", slot);
        } else {
            var effect = VestaxTR1.fxGroup(unit, slot);
            if (engine.getValue(effect, "loaded")) {
                script.toggleControl(effect, "enabled");
            }
        }
    } else if (control === 0x3F) {
        script.toggleControl(group, "enabled");
    } else if (control === 0x42) {
        if (focus) {
            VestaxTR1.lastFxFocus[unit] = focus;
        }
        engine.setValue(group, "focused_effect", focus ? 0 : VestaxTR1.lastFxFocus[unit]);
        engine.setValue(group, "show_parameters", focus ? 0 : 1);
    } else {
        engine.setValue(focus ? VestaxTR1.fxGroup(unit, focus) : group,
            focus ? "effect_selector" : "chain_preset_selector", control === 0x40 ? -1 : 1);
    }
};

// Each physical fader must pick up again after its target changes, including
// when the level and tempo faders take turns controlling the same volume.
VestaxTR1.writeFader = function (source, group, key, value) {
    var target = group + key;
    if (VestaxTR1.faderTargets[source] !== target || VestaxTR1.faderSources[target] !== source) {
        engine.softTakeoverIgnoreNextValue(group, key);
        VestaxTR1.faderTargets[source] = target;
        VestaxTR1.faderSources[target] = source;
    }
    if (key === "volume") {
        // Use the same normalized audio taper as the native MIDI fader.
        engine.setParameter(group, key, value);
    } else {
        engine.setValue(group, key, value);
    }
};

VestaxTR1.volume = function (channel, control, value, status, group) {
    if (channel < VestaxTR1.numDecks()) {
        VestaxTR1.writeFader("volume" + channel % 2, group, "volume", value / 127);
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
    var bank = status - 0xE9;
    if (bank >= VestaxTR1.numDecks()) {
        return;
    }
    var source = "tempo" + bank % 2;
    var otherDeck = [3, 4, 1, 2][bank];
    if (VestaxTR1.faderMode && otherDeck <= VestaxTR1.numDecks()) {
        VestaxTR1.writeFader(source, VestaxTR1.deckGroup(otherDeck), "volume", (1 - pitch) / 2);
    } else {
        VestaxTR1.writeFader(source, group, "rate", -pitch);
    }
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
        engine.setValue(group, down ? "rate_temp_down" : "rate_temp_up", 0);
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

// A firmware release can arrive under the shifted note or the other deck
// of the same physical side. Keep the action and target from the press.
VestaxTR1.physicalNotes = {
    0x58: 0x4C, 0x59: 0x4D, 0x5A: 0x4E,
    0x5E: 0x52, 0x5F: 0x53, 0x61: 0x55
};
VestaxTR1.momentaryKeys = {
    0x58: "beatlooproll_activate",
    0x59: "hotcue_1_activate",
    0x5A: "hotcue_2_activate"
};

VestaxTR1.deckButton = function (channel, control, value, status, group) {
    var physical = VestaxTR1.physicalNotes[control] || control;
    var button = (channel % 2) + ":" + physical;
    var held = VestaxTR1.heldButtons[button];
    if (!value) {
        if (held) {
            VestaxTR1.runDeckButton(held, 0);
            delete VestaxTR1.heldButtons[button];
        }
        return;
    }
    if (held || channel >= VestaxTR1.numDecks()) {
        return;
    }
    var action = {channel: channel, note: control, group: group};
    VestaxTR1.heldButtons[button] = action;
    VestaxTR1.runDeckButton(action, value);
};

VestaxTR1.runDeckButton = function (action, value) {
    var note = action.note;
    var group = action.group;
    var channel = action.channel;
    var status = 0x90 + channel;
    if (VestaxTR1.momentaryKeys[note]) {
        engine.setValue(group, VestaxTR1.momentaryKeys[note], value ? 1 : 0);
    } else if (note === 0x52 || note === 0x53) {
        VestaxTR1.bend(channel, note, value, status, group);
    } else if (note === 0x5E) {
        VestaxTR1.shiftBendMinus(channel, note, value, status, group);
    } else if (note === 0x5F) {
        VestaxTR1.shiftBendPlusFine(channel, note, value, status, group);
    } else if (note === 0x55) {
        VestaxTR1.cue(channel, note, value, status, group);
    } else if (value && note === 0x4C) {
        VestaxTR1.toggleLoop(group);
    } else if (value && (note === 0x4D || note === 0x4E)) {
        script.toggleControl(VestaxTR1.fxGroup(note === 0x4D ? 1 : 2), "group_" + group + "_enable");
    } else if (value && note === 0x61 && !engine.getValue(group, "play")) {
        engine.setValue(group, "beats_translate_curpos", 1);
    }
};

// Normalize Note Off release velocity at the MIDI entry points.
["fxButton", "moveControl", "deckButton", "selectUp", "selectDown", "shiftBendPlus", "play"].forEach(function (name) {
    var handler = VestaxTR1[name];
    VestaxTR1[name] = function (channel, control, value, status, group) {
        return handler(channel, control, (status & 0xF0) === 0x80 ? 0 : value, status, group);
    };
});
