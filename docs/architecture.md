# Architecture Notes

## Scene cycle

`BootScene` stores minimal global setup and advances to `PreloadScene`. `PreloadScene` loads local raster assets from the central manifest, validates critical textures/animations, and then starts the character selector. `CombatScene` orchestrates the arena runtime: world creation, player/enemy spawning, collisions, input routing, combat system updates, HUD state, victory, defeat, and restart. Restart uses scene reconstruction with explicit shutdown cleanup for HUD/debug DOM, touch controls, telegraphs, combat controllers, and `AttackDirector` slots so no stale actor references remain.

## Responsibilities

- Config: Phaser renderer, scaling, physics, and scene list.
- Actors: `Player` and `Enemy` encapsulate Phaser sprite/body state and expose combat runtime snapshots. Actor-vs-actor combat displacement is explicit attack knockback, not passive Arcade body pushing.
- Input: `InputController` merges keyboard, touch, and optional gamepad into one `InputState`.
- Combat: state machine, attack phases, combo buffering, hit detection, block/guard, counter, dodge, damage, status effects, and attack slot limits.
- AI: enemy behavior follows Approach → Position → Telegraph → Attack → Recover.
- Effects: hit-stop/camera/impact feedback are isolated from damage rules.
- World: `AsteriaArena` builds Ruins of Asteria and exposes collision objects.
- UI: `CombatHud` renders HTML overlay state without owning combat logic.
- Debug: `CombatDebugOverlay` shows combat state only when F2 toggles it.
- Logic: pure helpers stay independent of Phaser rendering for Vitest.

## Combatant state machine

Combatants use explicit states: `idle`, `moving`, `attacking`, `blocking`, `dodging`, `countering`, `stunned`, `airborne`, `knockedDown`, `recovering`, and `dead`. Transitions are validated by `CombatStateMachine`; arbitrary transitions are rejected. Temporary states tick down and return through recovery where appropriate.

## Attack cycle

Attack definitions live in data modules. `AttackController` runs each attack through:

```text
Startup
→ Active
→ Recovery
→ Complete
```

Only the active phase can hit. Recovery blocks immediate spam, while selected attacks can allow dodge cancellation.

## Hitbox and hurtbox

`Hitbox` supports circle, rectangle, and approximate frontal arc geometry. `HitDetectionSystem` filters owner, allies, defeated targets, and duplicate hits before handing an impact to damage resolution. `Hurtbox` defines target receiving areas for future richer broad-phase integration.

## Damage flow

```text
HitDetection
→ DamageSystem
→ Invulnerability check
→ Block/perfect block check
→ Guard and damage application
→ Status/knockback hooks
→ Combat event payload
→ HUD and effects
```

`DamageSystem` returns `HitEvent` data for decoupled scoring, effects, future audio, and telemetry.

## Perfect block and counter flow

```text
Block starts
→ Incoming frontal blockable hit
→ BlockSystem compares elapsed time to config window
→ DamageSystem marks perfect block
→ CounterSystem opens counter window
→ Attack input consumes counter
→ Counter attack definition runs through normal attack phases
```

The counter is not part of the normal combo and can be balanced through its own data definition.

## Control states

Stun prevents action until recovery. Airborne stores logical height and falls into knockdown. Knockdown leaves the target vulnerable before recovery and grants brief get-up invulnerability. Heavy enemies use resistance multipliers rather than full immunity.

## AttackDirector

`AttackDirector` owns enemy attack permissions. It enforces separate normal/heavy attacker caps and a small global delay. Enemies without permission keep moving into position instead of idling. Defeat, reset, death, and interruption paths release slots before new enemy attack permissions can be granted.

## Events

The combat model is prepared around events such as `combat:attack-started`, `combat:attack-active`, `combat:attack-ended`, `combat:hit`, `combat:blocked`, `combat:perfect-block`, `combat:counter-ready`, `combat:counter-used`, `combat:status-applied`, `combat:status-ended`, `combat:entity-defeated`, and `combat:combo-changed`. Current code returns event payloads from logic systems and can wire them to a Phaser event emitter as content grows.

## Future character readiness

Future original characters can reuse attack definitions, combo windows, state restrictions, block/counter logic, dodge rules, status applications, and enemy director policies without adding combat rules to `CombatScene`.


## Stage 3 character framework

`CharacterSelectScene` now sits between preload and combat. It displays registered characters and starts combat with the selected definition. `CharacterDefinition`, `CharacterRegistry`, and `CharacterFactory` keep playable character identity, stats, combo IDs, skill loadout, contextual attacks, visual keys, and optional mechanics out of `CombatScene`. Kael's Momentum mechanic is isolated in `KaelMomentumSystem`; attacks and skills remain data consumed by the existing attack, hit detection, damage, and status pipeline.

## Stage 3.1 skill finalization

Skills now end through `SkillController.finishSkill(reason)`. The contract is central and idempotent: completion, interruption, collision, death, cancellation, and scene reset all clear registered timers, tweens, hitboxes, movement/rotation overrides, speed modifiers, temporary armor/invulnerability hooks, visual state, pending callbacks, active skill id, and attack phase before requesting a safe combat-state transition. Scene shutdown uses the reset reason so destroyed instances are not moved back to idle.
