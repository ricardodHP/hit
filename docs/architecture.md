# Architecture Notes

## Scene cycle

`BootScene` stores minimal global setup and advances to `PreloadScene`. `PreloadScene` creates all provisional local textures through generated Phaser graphics and then starts `CombatScene`. `CombatScene` owns the arena runtime: world creation, player/enemy spawning, collisions, combat updates, HUD state, victory, defeat, and restart.

## Responsibilities

- Config: Phaser renderer, scaling, physics, and scene list.
- Actors: `Player` and `Enemy` encapsulate mutable arcade bodies and gameplay state.
- Input: `InputController` merges keyboard, touch, and optional gamepad into one `InputState`.
- Combat: `BasicCombatController` handles provisional attacks, skill effects, combo, score, hit-stop-like shake, particles, and knockback.
- World: `AsteriaArena` builds Ruins of Asteria and exposes collision objects.
- UI: `CombatHud` renders HTML overlay state without owning combat logic.
- Logic: pure math helpers stay independent of Phaser rendering for Vitest.

## Input flow

Browser input is read by Phaser keyboard/gamepad APIs and DOM touch buttons. `InputController.getState()` returns movement axes and action booleans. `CombatScene.update()` applies those values to the player and combat controller.

## Provisional combat flow

The player triggers basic attack, circular skill, or dodge when cooldowns allow it. Basic attack checks a point in front of the current facing direction. Circular skill checks a radius around the player. Hits damage enemies, add particles, apply knockback, update combo, and add score.

## Adding a provisional texture

Add a new `make(scene, key, width, height, draw)` call in `src/game/assets/createPlaceholderTextures.ts`. Keep generated art original, local, and reusable by key instead of drawing it repeatedly during `update()`.

## Adding an enemy variant

Add a new entry to `ENEMY` in `src/game/constants/game.constants.ts`, extend the `EnemyVariant` union in `src/game/types/game.types.ts`, create or reuse a texture key in `createPlaceholderTextures`, and spawn it from `CombatScene`.

## Stage 2 extension points

The coarse combat controller, direct-chase enemy AI, placeholder texture generation, and simple HTML HUD are intended to be replaced or extended. The separated input, actor, world, and pure-logic modules are kept stable enough to support that migration.
