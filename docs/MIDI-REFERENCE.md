# MIDI reference

Addresses are from the supplied mapping except where basic inputs were recorded on the TR-1. See the [physical control list and evidence](TR-1-LIVE.de.md). The FX 1 continuous-controller addresses also appear in the [TR-1 service manual](https://www.kevinchant.com/uploads/7/1/0/8/7108231/vsm-tr-1.pdf#page=5).

## Inputs

This table lists the primary input routes from the current XML. Every Note On row has a matching Note Off route at status minus `0x10`. A dash in Note / CC means the whole Pitch Bend message.

| Status | Note / CC | Mixxx group | Key / handler | Options |
| --- | --- | --- | --- | --- |
| `0xB8` | `0x07` | `[Master]` | `gain` | `soft-takeover` |
| `0xB0` | `0x0A` | `[Channel1]` | `pregain` | `normal` |
| `0xB1` | `0x0A` | `[Channel2]` | `pregain` | `soft-takeover` |
| `0xB2` | `0x0A` | `[Channel3]` | `pregain` | `normal` |
| `0xB3` | `0x0A` | `[Channel4]` | `pregain` | `normal` |
| `0xB0` | `0x10` | `[EqualizerRack1_[Channel1]_Effect1]` | `parameter3` | `normal` |
| `0xB1` | `0x10` | `[EqualizerRack1_[Channel2]_Effect1]` | `parameter3` | `normal` |
| `0xB2` | `0x10` | `[EqualizerRack1_[Channel3]_Effect1]` | `parameter3` | `normal` |
| `0xB3` | `0x10` | `[EqualizerRack1_[Channel4]_Effect1]` | `parameter3` | `normal` |
| `0xB0` | `0x11` | `[EqualizerRack1_[Channel1]_Effect1]` | `parameter2` | `normal` |
| `0xB1` | `0x11` | `[EqualizerRack1_[Channel2]_Effect1]` | `parameter2` | `normal` |
| `0xB2` | `0x11` | `[EqualizerRack1_[Channel3]_Effect1]` | `parameter2` | `normal` |
| `0xB3` | `0x11` | `[EqualizerRack1_[Channel4]_Effect1]` | `parameter2` | `normal` |
| `0xB0` | `0x12` | `[Sampler1]` | `pregain` | `normal` |
| `0xB1` | `0x12` | `[Sampler3]` | `pregain` | `normal` |
| `0xB2` | `0x12` | `[Sampler2]` | `pregain` | `normal` |
| `0xB3` | `0x12` | `[Sampler4]` | `pregain` | `normal` |
| `0xB0` | `0x13` | `[EqualizerRack1_[Channel1]_Effect1]` | `parameter1` | `normal` |
| `0xB1` | `0x13` | `[EqualizerRack1_[Channel2]_Effect1]` | `parameter1` | `normal` |
| `0xB2` | `0x13` | `[EqualizerRack1_[Channel3]_Effect1]` | `parameter1` | `normal` |
| `0xB3` | `0x13` | `[EqualizerRack1_[Channel4]_Effect1]` | `parameter1` | `normal` |
| `0xB0` | `0x14` | `[QuickEffectRack1_[Channel1]]` | `super1` | `normal` |
| `0xB1` | `0x14` | `[QuickEffectRack1_[Channel2]]` | `super1` | `normal` |
| `0xB2` | `0x14` | `[QuickEffectRack1_[Channel3]]` | `super1` | `normal` |
| `0xB3` | `0x14` | `[QuickEffectRack1_[Channel4]]` | `super1` | `normal` |
| `0xB0` | `0x15` | `[Channel1]` | `VestaxTR1.volume` | `script-binding` |
| `0xB1` | `0x15` | `[Channel2]` | `VestaxTR1.volume` | `script-binding` |
| `0xB2` | `0x15` | `[Channel3]` | `VestaxTR1.volume` | `script-binding` |
| `0xB3` | `0x15` | `[Channel4]` | `VestaxTR1.volume` | `script-binding` |
| `0xB4` | `0x18` | `[EffectRack1_EffectUnit1_Effect1]` | `VestaxTR1.fxKnob` | `script-binding` |
| `0xB6` | `0x18` | `[EffectRack1_EffectUnit2_Effect1]` | `VestaxTR1.fxKnob` | `script-binding` |
| `0xB4` | `0x19` | `[EffectRack1_EffectUnit1_Effect2]` | `VestaxTR1.fxKnob` | `script-binding` |
| `0xB6` | `0x19` | `[EffectRack1_EffectUnit2_Effect2]` | `VestaxTR1.fxKnob` | `script-binding` |
| `0xB4` | `0x1A` | `[EffectRack1_EffectUnit1_Effect3]` | `VestaxTR1.fxKnob` | `script-binding` |
| `0xB6` | `0x1A` | `[EffectRack1_EffectUnit2_Effect3]` | `VestaxTR1.fxKnob` | `script-binding` |
| `0xB4` | `0x1B` | `[EffectRack1_EffectUnit1]` | `mix` | `soft-takeover` |
| `0xB6` | `0x1B` | `[EffectRack1_EffectUnit2]` | `mix` | `soft-takeover` |
| `0xB8` | `0x1C` | `[Master]` | `headMix` | `normal` |
| `0xB8` | `0x1D` | `[Master]` | `headGain` | `soft-takeover` |
| `0x94` | `0x3C` | `[EffectRack1_EffectUnit1_Effect1]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x3C` | `[EffectRack1_EffectUnit2_Effect1]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x94` | `0x3D` | `[EffectRack1_EffectUnit1_Effect2]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x3D` | `[EffectRack1_EffectUnit2_Effect2]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x94` | `0x3E` | `[EffectRack1_EffectUnit1_Effect3]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x3E` | `[EffectRack1_EffectUnit2_Effect3]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x94` | `0x3F` | `[EffectRack1_EffectUnit1]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x3F` | `[EffectRack1_EffectUnit2]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x94` | `0x40` | `[Master]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x40` | `[Master]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x94` | `0x41` | `[Master]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x41` | `[Master]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x94` | `0x42` | `[Master]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x96` | `0x42` | `[Master]` | `VestaxTR1.fxButton` | `script-binding` |
| `0x90` | `0x44` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x44` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x44` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x44` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x45` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x45` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x45` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x45` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x46` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x46` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x46` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x46` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x47` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x47` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x47` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x47` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x48` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x48` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x48` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x48` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x49` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x49` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x49` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x49` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x4A` | `[Channel1]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x91` | `0x4A` | `[Channel2]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x92` | `0x4A` | `[Channel3]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x93` | `0x4A` | `[Channel4]` | `VestaxTR1.moveControl` | `script-binding` |
| `0x90` | `0x4B` | `[Channel1]` | `keylock` | `normal` |
| `0x91` | `0x4B` | `[Channel2]` | `keylock` | `normal` |
| `0x92` | `0x4B` | `[Channel3]` | `keylock` | `normal` |
| `0x93` | `0x4B` | `[Channel4]` | `keylock` | `normal` |
| `0x90` | `0x4C` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x4C` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x4C` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x4C` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x4D` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x4D` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x4D` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x4D` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x4E` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x4E` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x4E` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x4E` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x4F` | `[Channel1]` | `sync_enabled` | `normal` |
| `0x91` | `0x4F` | `[Channel2]` | `sync_enabled` | `normal` |
| `0x92` | `0x4F` | `[Channel3]` | `sync_enabled` | `normal` |
| `0x93` | `0x4F` | `[Channel4]` | `sync_enabled` | `normal` |
| `0x90` | `0x50` | `[Channel1]` | `beatjump_backward` | `normal` |
| `0x91` | `0x50` | `[Channel2]` | `beatjump_backward` | `normal` |
| `0x92` | `0x50` | `[Channel3]` | `beatjump_backward` | `normal` |
| `0x93` | `0x50` | `[Channel4]` | `beatjump_backward` | `normal` |
| `0x90` | `0x51` | `[Channel1]` | `beatjump_forward` | `normal` |
| `0x91` | `0x51` | `[Channel2]` | `beatjump_forward` | `normal` |
| `0x92` | `0x51` | `[Channel3]` | `beatjump_forward` | `normal` |
| `0x93` | `0x51` | `[Channel4]` | `beatjump_forward` | `normal` |
| `0x90` | `0x52` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x52` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x52` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x52` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x53` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x53` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x53` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x53` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x54` | `[Channel1]` | `VestaxTR1.play` | `script-binding` |
| `0x91` | `0x54` | `[Channel2]` | `VestaxTR1.play` | `script-binding` |
| `0x92` | `0x54` | `[Channel3]` | `VestaxTR1.play` | `script-binding` |
| `0x93` | `0x54` | `[Channel4]` | `VestaxTR1.play` | `script-binding` |
| `0x90` | `0x55` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x55` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x55` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x55` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x56` | `[Channel1]` | `pfl` | `normal` |
| `0x91` | `0x56` | `[Channel2]` | `pfl` | `normal` |
| `0x92` | `0x56` | `[Channel3]` | `pfl` | `normal` |
| `0x93` | `0x56` | `[Channel4]` | `pfl` | `normal` |
| `0x90` | `0x58` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x58` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x58` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x58` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x59` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x59` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x59` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x59` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x5A` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x5A` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x5A` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x5A` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x57` | `[Channel1]` | `slip_enabled` | `normal` |
| `0x91` | `0x57` | `[Channel2]` | `slip_enabled` | `normal` |
| `0x92` | `0x57` | `[Channel3]` | `slip_enabled` | `normal` |
| `0x93` | `0x57` | `[Channel4]` | `slip_enabled` | `normal` |
| `0x90` | `0x5C` | `[Channel1]` | `beatjump_size_halve` | `normal` |
| `0x91` | `0x5C` | `[Channel2]` | `beatjump_size_halve` | `normal` |
| `0x92` | `0x5C` | `[Channel3]` | `beatjump_size_halve` | `normal` |
| `0x93` | `0x5C` | `[Channel4]` | `beatjump_size_halve` | `normal` |
| `0x90` | `0x5D` | `[Channel1]` | `beatjump_size_double` | `normal` |
| `0x91` | `0x5D` | `[Channel2]` | `beatjump_size_double` | `normal` |
| `0x92` | `0x5D` | `[Channel3]` | `beatjump_size_double` | `normal` |
| `0x93` | `0x5D` | `[Channel4]` | `beatjump_size_double` | `normal` |
| `0x90` | `0x5E` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x5E` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x5E` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x5E` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x5B` | `[Channel1]` | `VestaxTR1.shiftBendPlus` | `script-binding` |
| `0x91` | `0x5B` | `[Channel2]` | `VestaxTR1.shiftBendPlus` | `script-binding` |
| `0x92` | `0x5B` | `[Channel3]` | `VestaxTR1.shiftBendPlus` | `script-binding` |
| `0x93` | `0x5B` | `[Channel4]` | `VestaxTR1.shiftBendPlus` | `script-binding` |
| `0x90` | `0x5F` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x5F` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x5F` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x5F` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x90` | `0x60` | `[Channel1]` | `cue_gotoandstop` | `normal` |
| `0x91` | `0x60` | `[Channel2]` | `cue_gotoandstop` | `normal` |
| `0x92` | `0x60` | `[Channel3]` | `cue_gotoandstop` | `normal` |
| `0x93` | `0x60` | `[Channel4]` | `cue_gotoandstop` | `normal` |
| `0x90` | `0x61` | `[Channel1]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x91` | `0x61` | `[Channel2]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x92` | `0x61` | `[Channel3]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x93` | `0x61` | `[Channel4]` | `VestaxTR1.deckButton` | `script-binding` |
| `0x98` | `0x62` | `[PreviewDeck1]` | `LoadSelectedTrackAndPlay` | `normal` |
| `0x98` | `0x63` | `[Playlist]` | `SelectNextTrack` | `normal` |
| `0x98` | `0x64` | `[Playlist]` | `SelectPrevTrack` | `normal` |
| `0x90` | `0x65` | `[Channel1]` | `LoadSelectedTrack` | `normal` |
| `0x92` | `0x65` | `[Channel3]` | `LoadSelectedTrack` | `normal` |
| `0x91` | `0x66` | `[Channel2]` | `LoadSelectedTrack` | `normal` |
| `0x93` | `0x66` | `[Channel4]` | `LoadSelectedTrack` | `normal` |
| `0x98` | `0x68` | `[Master]` | `VestaxTR1.selectDown` | `script-binding` |
| `0x98` | `0x69` | `[Master]` | `VestaxTR1.selectUp` | `script-binding` |
| `0xE0` | — | `[Channel1]` | `pitch_adjust` | `invert` |
| `0xE1` | — | `[Channel2]` | `pitch_adjust` | `invert` |
| `0xE2` | — | `[Channel3]` | `pitch_adjust` | `invert` |
| `0xE3` | — | `[Channel4]` | `pitch_adjust` | `invert` |
| `0xE9` | — | `[Channel1]` | `VestaxTR1.rate` | `script-binding` |
| `0xEA` | — | `[Channel2]` | `VestaxTR1.rate` | `script-binding` |
| `0xEB` | — | `[Channel3]` | `VestaxTR1.rate` | `script-binding` |
| `0xEC` | — | `[Channel4]` | `VestaxTR1.rate` | `script-binding` |

## XML LED outputs

| Status | Note | Mixxx group | Control |
| --- | --- | --- | --- |
| `0x90` | `0x59` | `[Channel1]` | `hotcue_1_status` |
| `0x90` | `0x5A` | `[Channel1]` | `hotcue_2_status` |
| `0x90` | `0x4B` | `[Channel1]` | `keylock` |
| `0x90` | `0x4F` | `[Channel1]` | `sync_enabled` |
| `0x90` | `0x55` | `[Channel1]` | `cue_indicator` |
| `0x91` | `0x55` | `[Channel2]` | `cue_indicator` |
| `0x92` | `0x55` | `[Channel3]` | `cue_indicator` |
| `0x93` | `0x55` | `[Channel4]` | `cue_indicator` |
| `0x91` | `0x4F` | `[Channel2]` | `sync_enabled` |
| `0x92` | `0x4F` | `[Channel3]` | `sync_enabled` |
| `0x93` | `0x4F` | `[Channel4]` | `sync_enabled` |
| `0x90` | `0x4C` | `[Channel1]` | `loop_enabled` |
| `0x90` | `0x56` | `[Channel1]` | `pfl` |
| `0x90` | `0x54` | `[Channel1]` | `play` |
| `0x90` | `0x57` | `[Channel1]` | `slip_enabled` |
| `0x90` | `0x61` | `[Channel1]` | `track_loaded` |
| `0x91` | `0x59` | `[Channel2]` | `hotcue_1_status` |
| `0x91` | `0x5A` | `[Channel2]` | `hotcue_2_status` |
| `0x91` | `0x4B` | `[Channel2]` | `keylock` |
| `0x91` | `0x4C` | `[Channel2]` | `loop_enabled` |
| `0x91` | `0x56` | `[Channel2]` | `pfl` |
| `0x91` | `0x54` | `[Channel2]` | `play` |
| `0x91` | `0x57` | `[Channel2]` | `slip_enabled` |
| `0x91` | `0x61` | `[Channel2]` | `track_loaded` |
| `0x92` | `0x59` | `[Channel3]` | `hotcue_1_status` |
| `0x92` | `0x5A` | `[Channel3]` | `hotcue_2_status` |
| `0x92` | `0x4B` | `[Channel3]` | `keylock` |
| `0x92` | `0x4C` | `[Channel3]` | `loop_enabled` |
| `0x92` | `0x56` | `[Channel3]` | `pfl` |
| `0x92` | `0x54` | `[Channel3]` | `play` |
| `0x92` | `0x57` | `[Channel3]` | `slip_enabled` |
| `0x92` | `0x61` | `[Channel3]` | `track_loaded` |
| `0x93` | `0x59` | `[Channel4]` | `hotcue_1_status` |
| `0x93` | `0x5A` | `[Channel4]` | `hotcue_2_status` |
| `0x93` | `0x4B` | `[Channel4]` | `keylock` |
| `0x93` | `0x4C` | `[Channel4]` | `loop_enabled` |
| `0x93` | `0x56` | `[Channel4]` | `pfl` |
| `0x93` | `0x54` | `[Channel4]` | `play` |
| `0x93` | `0x57` | `[Channel4]` | `slip_enabled` |
| `0x93` | `0x61` | `[Channel4]` | `track_loaded` |
| `0x90` | `0x4D` | `[EffectRack1_EffectUnit1]` | `group_[Channel1]_enable` |
| `0x91` | `0x4D` | `[EffectRack1_EffectUnit1]` | `group_[Channel2]_enable` |
| `0x92` | `0x4D` | `[EffectRack1_EffectUnit1]` | `group_[Channel3]_enable` |
| `0x93` | `0x4D` | `[EffectRack1_EffectUnit1]` | `group_[Channel4]_enable` |
| `0x90` | `0x4E` | `[EffectRack1_EffectUnit2]` | `group_[Channel1]_enable` |
| `0x91` | `0x4E` | `[EffectRack1_EffectUnit2]` | `group_[Channel2]_enable` |
| `0x92` | `0x4E` | `[EffectRack1_EffectUnit2]` | `group_[Channel3]_enable` |
| `0x93` | `0x4E` | `[EffectRack1_EffectUnit2]` | `group_[Channel4]_enable` |

## Scripted feedback

These addresses are inherited. The output values and target logic are tested in software. The physical display and any color changes still need a TR-1 check.

| Status | Note | Feedback |
| --- | --- | --- |
| `0x94`, `0x96` | `0x3C–0x3E` | FX 1/2 slot active in CHAINED, slot selected in ADVANCED |
| `0x94`, `0x96` | `0x3F` | FX 1/2 unit enabled |
| `0x94`, `0x96` | `0x42` | FX 1/2 ADVANCED indicator, address provisional |
| `0x98` | `0x68` | MOVE CH deck index, values `0x00–0x03` for A–D |
| `0x90–0x93` | `0x4A` | Active loop on the selected MOVE deck |
| `0x90–0x93` | `0x52`, `0x53` | BEND indicators in extra-fader mode |
| `0x90–0x93` | `0x5B`, `0x5E`, `0x5F` | Extra-fader mode and shifted BEND indicators |

On/off messages use `0x7F` / `0x00`.
