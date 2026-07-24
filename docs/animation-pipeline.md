# Stage 3.2 Animation Pipeline

Animation declarations live in `src/game/assets/assetManifest.ts`. Each animation declares its source sheet, frame list, frame rate, repeat mode, duration, optional combat sync, and dual-wield hand metadata.

Combat remains authoritative. Sync metadata aligns hit sparks, trails, future audio, and active/recovery cues to combat timing, but `SkillController.finishSkill(reason)` remains the only central skill-finalization path.

The sync contract checks startup, active, recovery, hit frames, movement frames, and fallback duration so missing animation events cannot freeze combat.
