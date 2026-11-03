const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const values = new Map(), writes = [], timers = new Map(), connections = [];
let nextTimer = 1;
const stateKey = (group, key) => group + ':' + key;
const engine = {
    getValue: (group, key) => values.get(stateKey(group, key)) || 0,
    setValue: (group, key, value) => { values.set(stateKey(group, key), value); writes.push([group,key,value]); },
    softTakeover() {}, softTakeoverIgnoreNextValue() {},
    makeConnection(group, key, callback) {
        const c = { disconnected: false, disconnect() { this.disconnected = true; } };
        connections.push(c); return c;
    },
    beginTimer(ms, callback) { const id = nextTimer++; timers.set(id,callback); return id; },
    stopTimer(id) { timers.delete(id); },
};
const context = {engine, midi: {sendShortMsg() {}}, script: {
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
tr1.shiftBendMinus(0,0x5e,127,0x90,'[Channel1]');
assert.equal(timers.size,1);
tr1.shiftBendMinus(0,0x5e,64,0x80,'[Channel1]');
assert.equal(timers.size,0);
assert.equal(engine.getValue('[Channel1]','beatjump_32_backward'),1);
tr1.shiftBendMinus(0,0x5e,127,0x90,'[Channel1]');
tr1.shiftBendPlus(0,0x5b,127,0x90,'[Channel1]');
assert.equal(timers.size,0); // no delayed seek after switching modes
assert(!tr1.faderMode);
engine.setValue('[Channel1]','play',1);
tr1.bend(0,0x52,127,0x90,'[Channel1]');
assert.equal(engine.getValue('[Channel1]','rate_temp_down'),1);
tr1.bend(0,0x52,64,0x80,'[Channel1]');
assert.equal(engine.getValue('[Channel1]','rate_temp_down'),0);
// CUE preview, PLAY latch, and Note Off with nonzero release velocity.
engine.setValue('[Channel1]','track_samples',100000);
engine.setValue('[Channel1]','cue_point',10000);
engine.setValue('[Channel1]','playposition',0.1);
engine.setValue('[Channel1]','play',0);
tr1.cue(0,0x55,127,0x90,'[Channel1]');
assert(tr1.cueHeld['[Channel1]']);
tr1.play(0,0x54,127,0x90,'[Channel1]');
assert(tr1.cueLatched['[Channel1]']);
const before=writes.length;
tr1.cue(0,0x55,64,0x80,'[Channel1]');
assert(!tr1.cueHeld['[Channel1]']);
assert.equal(writes.length,before); // latch must not return to cue
tr1.shiftBendPlus(0,0x5b,127,0x90,'[Channel1]');
tr1.shiftBendMinus(0,0x5e,127,0x90,'[Channel1]');
assert.equal(timers.size,1);
tr1.shutdown();
assert.equal(timers.size,0);
assert(connections.every(c=>c.disconnected));
console.log('PASS: four 14-bit tempo channels; extra-deck volumes; note-off releases; CUE/PLAY latch; mode-switch timer cancellation; shutdown cleanup.');
