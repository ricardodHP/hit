# Ruins of Asteria

A maintainable browser action RPG prototype with original names, local placeholder art, and top-down arena combat patterns. Stage 3 adds a configurable character framework and the first original playable hero, Kael — Swiftblade, on top of the stabilized combat framework.

## Technologies

- Vite, npm, TypeScript strict mode
- Phaser 3 with `Phaser.AUTO` WebGL/canvas fallback
- Vitest for renderer-independent combat logic tests
- ESLint for TypeScript quality checks

## Installation

```bash
npm install
```

## Commands

- `npm run dev` starts the development server.
- `npm run build` type-checks and creates a production build.
- `npm run preview` serves the production build locally.
- `npm run typecheck` validates TypeScript.
- `npm run test` runs unit tests.
- `npm run lint` runs ESLint plus TypeScript validation.

## Controls

- WASD or arrow keys: move.
- J or Space: Kael normal combo / contextual attack / counterattack when `COUNTER READY` is active.
- K: Rising Tempest.
- O: Phantom Rush.
- P: Blade Cyclone.
- L: dodge with startup, invulnerability frames, movement, recovery, and cooldown.
- I: frontal block.
- F2: toggle combat debug overlay.
- R: restart the arena.
- Touch: directional pad plus attack, three skill, dodge, and block buttons on coarse or narrow screens.
- Gamepad: left stick, A, B, R1, and shoulder/trigger block are read when supported.

## Stage 3 character combat

- Kael has a five-hit dual-sword combo: Twin Slash I, Twin Slash II, Cross Cut, Rising Fang, and Falling Edge.
- Attacks are data definitions with `startup`, `active`, and `recovery` phases instead of single cooldown checks.
- Hitboxes and hurtboxes are explicit and support circle, rectangle, and approximate frontal arc checks.
- Damage flows through a central system that validates invulnerability, block direction, perfect block timing, guard cost, stun, knockback, airborne, knockdown, and defeat.
- Perfect block opens a short counter window; attacking during that window triggers a stronger counter instead of the normal combo.
- Enemies use telegraphs before attacks, and the heavy enemy uses a distinct unblockable warning.
- `AttackDirector` limits simultaneous enemy attackers so enemies reposition instead of all attacking at once.

## Current scope

The playable arena remains **Ruins of Asteria**: stone floor, exterior walls, sanctuary door, columns, rubble, animated torches, normal enemies, heavy enemy, player movement, combat, victory, defeat, restart, compact HUD, and debug overlay.

## Known limitations

- Placeholder graphics are generated locally from Phaser shapes and are not final art.
- Enemy movement is still lightweight steering/repositioning, not pathfinding.
- Hit-stop is represented with short camera/impact feedback and entity timing hooks, not a full animation time-scaling layer.
- Stage 2.5 automated stabilization checks pass, but interactive browser QA is blocked in this container and must be repeated locally before declaring the stage fully complete.
- Only Kael is implemented; no second character, campaign, inventory, progression, final audio, backend, monetization, PvP, or online save systems are included.

## Next stage

A future stage can add a second original character on top of the reusable combat definitions, state machine, hitbox/damage pipeline, status effects, guard/counter flow, and enemy attack director without putting combat rules back into scenes.
