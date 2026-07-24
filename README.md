# Ruins of Asteria

A maintainable Stage 1 foundation for an original browser action RPG prototype inspired by broad top-down arena combat patterns, not by protected HIT assets or names.

## Technologies

- Vite, npm, TypeScript strict mode
- Phaser 3 with `Phaser.AUTO` WebGL/canvas fallback
- Vitest for renderer-independent logic tests
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
- `npm run lint` runs ESLint.

## Controls

- WASD or arrow keys: move.
- J or Space: basic attack.
- K: circular skill.
- L: dodge with brief invulnerability.
- R: restart the arena.
- Touch: directional pad plus attack, skill, and dodge buttons on coarse or narrow screens.
- Gamepad: left stick, A, B, and R1 are read when supported by the browser and Phaser.

## Main structure

`src/game` separates config, scenes, actors, input, combat, world, UI, constants, types, generated textures, and pure logic.

## Current scope

The playable arena is **Ruins of Asteria**: stone floor, exterior walls, a sanctuary door, columns, rubble, animated torches, basic enemies, heavy enemies, player movement, provisional combat, victory, defeat, and restart.

## Known limitations

- Placeholder graphics are generated from simple Phaser shapes.
- Enemy movement uses direct chasing plus arcade collision, not pathfinding.
- Combat hit detection is intentionally coarse and will be replaced later.
- No final RPG systems, campaign, inventory, audio, backend, or monetization are included.

## Next stage

Stage 2 can replace provisional hit checks with structured frame data, expand enemy behavior, improve animation, and add more robust content pipelines while preserving the separated architecture.
