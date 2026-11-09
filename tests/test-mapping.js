const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const values = new Map(), writes = [], timers = new Map(), connections = [];
const leds = new Map(), pickups = [];
let nextTimer = 1;
const stateKey = (group, key) => group + ':' + key;
const engine = {
    getValue: (group, key) => values.get(stateKey(group, key)) || 0,
    setValue(group, key, value) {
        const previous = this.getValue(group, key);
        values.set(stateKey(group, key), value);
        writes.push([group, key, value]);
        if (previous !== value) {
            for (const c of connections) {
                if (!c.disconnected && c.group === group && c.key === key) c.callback(value);
            }
        }
    },
    setParameter(group, key, value) { this.setValue(group, key, value); },
    softTakeover() {},
    softTakeoverIgnoreNextValue(group, key) { pickups.push([group, key]); },
    makeConnection(group, key, callback) {
        const c = { group, key, callback, disconnected: false, disconnect() { this.disconnected = true; } };
        connections.push(c); return c;
    },
    beginTimer(ms, callback) { const id = nextTimer++; timers.set(id,callback); return id; },
    stopTimer(id) { timers.delete(id); },
};
const context = {engine, midi: {sendShortMsg(status, note, value) { leds.set(status + ":" + note, value); }}, script: {
    toggleControl(group,key) { engine.setValue(group,key,!engine.getValue(group,key)); },
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','Vestax-TR-1-scripts.js'),'utf8'),context);
const tr1 = context.VestaxTR1;
tr1.init('TR-1',false);
for (let bank=0;bank<4;bank++) {
    const group='[Channel'+(bank+1)+']';
    let previous = 2;
    for (let raw=0;raw<16384;raw++) {
        tr1.rate(bank+9,raw&127,raw>>7,0xe9+bank,group);
        const rate=engine.getValue(group,'rate');
        assert(rate >= -1 && rate <= 1 && rate < previous);
        previous=rate;
    }
    tr1.rate(bank+9,0,64,0xe9+bank,group);
    assert.equal(engine.getValue(group,'rate'),0);
}
tr1.shiftBendPlus(0,0x5b,127,0x90,'[Channel1]');
assert(tr1.faderMode);
for (let bank=0;bank<4;bank++) {
    const target='[Channel'+([3,4,1,2][bank])+']';
    for (const [raw,volume] of [[0,1],[8192,0.5],[16383,0]]) {
        tr1.rate(bank+9,raw&127,raw>>7,0xe9+bank,'[Channel'+(bank+1)+']');
        assert.equal(engine.getValue(target,'volume'),volume);
    }
}
tr1.deckButton(0,0x5e,127,0x90,'[Channel1]');
assert.equal(timers.size,1);
tr1.deckButton(0,0x5e,64,0x80,'[Channel1]');
assert.equal(timers.size,0);
assert.equal(engine.getValue('[Channel1]','beatjump_32_backward'),1);
tr1.deckButton(0,0x5e,127,0x90,'[Channel1]');
tr1.shiftBendPlus(0,0x5b,127,0x90,'[Channel1]');
assert.equal(timers.size,0); // no delayed seek after switching modes
assert(!tr1.faderMode);
tr1.deckButton(0,0x52,0,0x90,"[Channel1]"); // release after mode switch
engine.setValue('[Channel1]','play',1);
tr1.deckButton(0,0x52,127,0x90,'[Channel1]');
assert.equal(engine.getValue('[Channel1]','rate_temp_down'),1);
tr1.deckButton(0,0x52,64,0x80,'[Channel1]');
assert.equal(engine.getValue('[Channel1]','rate_temp_down'),0);
// CUE preview, PLAY latch, and Note Off with nonzero release velocity.
engine.setValue('[Channel1]','track_samples',100000);
engine.setValue('[Channel1]','cue_point',10000);
engine.setValue('[Channel1]','playposition',0.1);
engine.setValue('[Channel1]','play',0);
tr1.deckButton(0,0x55,127,0x90,'[Channel1]');
assert(tr1.cueHeld['[Channel1]']);
tr1.play(0,0x54,127,0x90,'[Channel1]');
assert(tr1.cueLatched['[Channel1]']);
const before=writes.length;
tr1.deckButton(0,0x55,64,0x80,'[Channel1]');
assert(!tr1.cueHeld['[Channel1]']);
assert.equal(writes.length,before); // latch must not return to cue
// Releasing BEND after changing SHIFT and A/C must end A's bend only.
engine.setValue("[Channel1]", "play", 1);
tr1.deckButton(0, 0x52, 127, 0x90, "[Channel1]");
tr1.deckButton(0, 0x53, 127, 0x90, "[Channel1]");
tr1.deckButton(2, 0x5E, 64, 0x82, "[Channel3]");
assert.equal(engine.getValue("[Channel1]", "rate_temp_down"), 0);
assert.equal(engine.getValue("[Channel1]", "rate_temp_up"), 1);
tr1.deckButton(2, 0x5F, 0, 0x92, "[Channel3]");
assert.equal(engine.getValue("[Channel1]", "rate_temp_up"), 0);
tr1.deckButton(2, 0x58, 127, 0x92, "[Channel3]");
tr1.deckButton(0, 0x4C, 0, 0x90, "[Channel1]");
assert.equal(engine.getValue("[Channel3]", "beatlooproll_activate"), 0);
tr1.deckButton(2, 0x59, 127, 0x92, "[Channel3]");
tr1.deckButton(0, 0x4D, 0, 0x90, "[Channel1]");
assert.equal(engine.getValue("[Channel3]", "hotcue_1_activate"), 0);
assert.equal(engine.getValue("[EffectRack1_EffectUnit1]", "group_[Channel1]_enable"), 0);

function press(handler, status, note, group) {
    tr1[handler](status & 15, note, 127, status, group);
    tr1[handler](status & 15, note, 64, status - 16, group);
}
for (const [channel, unit] of [[4, 1], [6, 2]]) {
    const fx = "[EffectRack1_EffectUnit" + unit;
    const u = fx + "]";
    const effect = fx + "_Effect2]";
    const status = 0x90 + channel;
    engine.setValue(effect, "loaded", 1);
    engine.setValue(effect, "enabled", 1);
    assert.equal(leds.get(status + ":" + 0x3D), 127);
    press("fxButton", status, 0x3D);
    assert.equal(leds.get(status + ":" + 0x3D), 0);
    press("fxButton", status, 0x3D);
    assert.equal(leds.get(status + ":" + 0x3D), 127);
    tr1.fxKnob(channel, 0x19, 127);
    assert.equal(engine.getValue(effect, "meta"), 1);
    press("fxButton", status, 0x40);
    assert.deepEqual(writes.at(-1), [u, "chain_preset_selector", -1]);
    press("fxButton", status, 0x42);
    press("fxButton", status, 0x3D);
    assert.equal(leds.get(status + ":" + 0x42), 127);
    assert.equal(engine.getValue(u, "show_focus"), 1);
    assert.equal(engine.getValue("[EffectRack1_EffectUnit" + (3 - unit) + "]", "focused_effect"), 0);
    assert.equal(leds.get(status + ":" + 0x3D), 127);
    assert.equal(leds.get(status + ":" + 0x3C), 0);
    assert.deepEqual(pickups.at(-1), [fx + "_Effect3]", "parameter3"]);
    engine.setValue(effect, "parameter1_loaded", 1);
    tr1.fxKnob(channel, 0x18, 64);
    assert.equal(engine.getValue(effect, "parameter1"), 64 / 127);
    const count = writes.length;
    tr1.fxKnob(channel, 0x1A, 64); // absent parameter
    assert.equal(writes.length, count);
    press("fxButton", status, 0x41);
    assert.deepEqual(writes.at(-1), [effect, "effect_selector", 1]);
    press("fxButton", status, 0x3F);
    assert.equal(leds.get(status + ":" + 0x3F), 127);
    press("fxButton", status, 0x42);
    assert.equal(leds.get(status + ":" + 0x42), 0);
    assert.equal(engine.getValue(u, "show_focus"), 0);
    press("fxButton", status, 0x42);
    assert.equal(engine.getValue(u, "focused_effect"), 2);
    press("fxButton", status, 0x42);
}
press("deckButton", 0x93, 0x4E, "[Channel4]");
assert.equal(engine.getValue("[EffectRack1_EffectUnit2]", "group_[Channel4]_enable"), 1);
assert.equal(engine.getValue("[EffectRack1_EffectUnit2]", "group_[Channel2]_enable"), 0);

press("selectUp", 0x98, 0x69);
press("selectUp", 0x98, 0x69);
assert.equal(leds.get(0x98 + ":" + 0x68), 2);
press("moveControl", 0x90, 0x47, "[Channel1]");
assert.deepEqual(writes.at(-1), ["[Channel3]", "beatjump_forward", 1]);
press("moveControl", 0x91, 0x49, "[Channel2]");
press("moveControl", 0x90, 0x44, "[Channel1]");
assert.deepEqual(writes.at(-1), ["[Channel3]", "loop_halve", 1]);
engine.setValue("[Channel3]", "loop_enabled", 1);
assert.equal(leds.get(0x90 + ":" + 0x4A), 127);
press("moveControl", 0x90, 0x46, "[Channel1]");
assert.deepEqual(writes.at(-1), ["[Channel3]", "loop_move", -1]);
press("moveControl", 0x90, 0x4A, "[Channel1]");
assert.deepEqual(writes.at(-1), ["[Channel3]", "reloop_toggle", 1]);
engine.setValue("[App]", "num_decks", 2);
assert.equal(leds.get(0x98 + ":" + 0x68), 0);
press("shiftBendPlus", 0x90, 0x5B, "[Channel1]");
assert.equal(tr1.faderMode, false);
engine.setValue("[App]", "num_decks", 4);
tr1.volume(0, 0x15, 63, 0xB0, "[Channel1]");
tr1.volume(2, 0x15, 50, 0xB2, "[Channel3]");
tr1.volume(0, 0x15, 40, 0xB0, "[Channel1]");
assert.deepEqual(pickups.slice(-3), [
    ["[Channel1]", "volume"], ["[Channel3]", "volume"], ["[Channel1]", "volume"]
]);
assert.equal(engine.getValue("[Channel1]", "volume"), 40 / 127);
tr1.shiftBendPlus(0,0x5b,127,0x90,'[Channel1]');
tr1.deckButton(0,0x5e,127,0x90,'[Channel1]');
assert.equal(timers.size,1);
tr1.shutdown();
assert.equal(timers.size,0);
assert(connections.every(c=>c.disconnected));
for (const status of [0x94, 0x96]) {
    for (const note of [0x3C, 0x3D, 0x3E, 0x3F, 0x42]) {
        assert.equal(leds.get(status + ":" + note), 0);
    }
}
console.log('PASS: tempo and pickup, held-button release across banks/SHIFT, FX modes/routing/LEDs, MOVE target, and cleanup.');
