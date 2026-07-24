# Character Framework — Stage 3

Stage 3 introduces a configurable character layer above the existing combat pipeline. Character data lives outside scenes and actors so future heroes can reuse movement, state validation, hit detection, damage, statuses, dodge, block, counter, HUD, and debug systems.

## Definitions

`CharacterDefinition` describes identity, base stats, normal combo attack IDs, exactly three equipped skill IDs, contextual attack IDs, dodge/block configuration, optional mechanic ID, and visual pose keys. Stats are intentionally minimal: health, guard, movement speed, attack power, defense, guard regeneration, and critical chance.

## Registry

`CharacterRegistry` registers definitions, rejects duplicate IDs, validates attack and skill references, enforces three equipped skills, lists available characters, and exposes the default character. Stage 3 registers only `kael`.

## Factory

`CharacterFactory` receives a definition and creates/configures the Phaser `Player`, loadout, skill controller, and optional injected mechanic. It does not branch with character-specific logic; specific behavior is supplied by data and `CharacterMechanic` implementations.

## Mechanics

Character mechanics implement a small interface with update/reset and event hooks. Kael uses `KaelMomentumSystem`, which emits character events for HUD and visuals. Decay uses scene/game delta passed through the normal update loop, so it pauses with the scene and advances consistently with combat updates rather than wall-clock time.

## Attacks and skills

Character attacks remain `AttackDefinition` data and continue through `AttackController`, `HitDetectionSystem`, `DamageSystem`, and status application. Skills extend attack definitions with cooldown, display text, and visual effect metadata; they do not create a parallel damage system.

## Loadouts

`SkillLoadout` maps the three IDs from `CharacterDefinition` to `SkillDefinition` objects. Controls are fixed for this stage: K, O, P and three touch buttons.

## Events

The stage emits character, skill, contextual, and combat events such as `character:created`, `character:momentum-changed`, `character:momentum-tier-changed`, `character:momentum-max`, `skill:started`, and `contextual:started`.

## Adding another character later

Add a new definition, attacks, skills, visual poses, and optional mechanic implementation. Register it with the registry and supply its mechanic factory. Do not duplicate `DamageSystem`, `AttackController`, scene hitbox logic, HUD logic, or enemy systems.

## Stage 3.1 Kael stabilization

Kael's skills remain data-driven `SkillDefinition` entries, but their runtime ownership is centralized in `SkillController`. The controller exposes diagnostics for debug tooling and accepts cleanup hooks from combat integration instead of embedding Phaser scene logic. Dual-wield readability is represented by renderer-independent pose data in `KaelVisualController`, keeping weapon transforms separate from hitbox geometry and scene orchestration.
