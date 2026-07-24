# AGENTS.md

- Use strict TypeScript for all source code.
- Keep code and technical names in English.
- Do not introduce protected resources, names, art, audio, or story content from Heroes of Incredible Tales (HIT).
- Keep systems decoupled: scenes, actors, input, combat, world, UI, constants, and pure logic stay separated.
- Run `npm run typecheck`, `npm run test`, and `npm run build` after relevant changes.
- Do not implement features outside the requested stage.
- Prefer simple solutions before premature abstractions.
- Document important architectural decisions.
- Maintain keyboard and touch-control support.
- Attacks must be defined through data in `src/game/data` instead of hard-coded directly in scenes or actors.
- Hitboxes and hurtboxes must not be hard-coded in scenes.
- Combat state transitions must go through validated state-machine logic.
- Every new combat action must include renderer-independent logic tests when practical.
- Do not introduce character-specific mechanics before Stage 3.

- Stage 3 character content must stay data-driven through `src/game/characters` and `src/game/skills`; do not add a second playable character yet.
- Every skill must terminate through the central skill finalization path.
- Every temporary movement, speed, armor, invulnerability, rotation, timer, tween, hitbox, or callback modification must be restored in skill cleanup.
- Skills with timers or tweens must register them for cleanup on death, reset, interruption, collision, and shutdown.
- Every dual-wield character pose must define both weapon transforms.
- Phaser UI text must use explicit bounds, wrapping, and safe-area margins.
