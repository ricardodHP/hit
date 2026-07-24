# Combat System

## Main input-to-impact flow

```text
Input
→ AttackController
→ StateMachine
→ Attack Phase
→ Hitbox Active
→ HitDetection
→ DamageSystem
→ Lethal clamp / death cleanup
→ Explicit knockback only when configured
→ StatusEffect
→ Combat Events
→ HUD / Effects
```

## Player normal combo

```text
Attack button
→ ComboSystem input buffer
→ Attack 1 startup/active/recovery
→ Valid combo window?
  → yes: Attack 2
  → no: timeout resets combo
→ Attack 3 can stun
→ Finisher can knock down normal and heavy enemies with resistance applied
```

## Defense flow

```text
Block input
→ CombatStateMachine enters blocking
→ Incoming hit checks frontal arc
→ BlockSystem checks guard and timing
→ Perfect block?
  → yes: no damage, counter window opens, attacker interrupted
  → no: reduced damage, guard drains
→ Guard reaches zero
→ Long stun represents guard break
```

## Counter flow

```text
Perfect block
→ CounterSystem ready timer starts
→ Attack button inside timer
→ Counter attack data starts
→ Startup / Active / Recovery
→ Strong damage and stun/knockback
```

## Dodge flow

```text
Dodge input
→ DodgeSystem cooldown check
→ State restrictions and attack cancel rule
→ Startup
→ Invulnerability frames
→ Movement with Arcade collision
→ Recovery
```

## Enemy attack flow

Normal enemy attacks declare `knockback: 0`; heavy or future attacks may move the player only when their data definition explicitly declares positive knockback. Passive actor contact is not combat knockback.

```text
Approach
→ Position
→ AttackDirector permission request
→ Telegraph
→ AttackController starts enemy attack
→ Active hitbox checks player hurtbox/block
→ Recover
→ AttackDirector releases slot
```

## Debug overlay

F2 toggles a lightweight overlay with player id, health, guard, state, attack phase/id, combo index, invulnerability, counter readiness, dodge cooldown, knockback velocity, input/dead flags, enemy health/state/AI/active attack/slot/target/velocity, and scene actor/hitbox/slot counts.


## Stage 3 character and skill flow

Kael replaces the generic player combo with five data-defined attacks. Skills are `SkillDefinition` entries with cooldown metadata and are executed through `SkillController`, `AttackController`, `HitDetectionSystem`, `DamageSystem`, and status application rather than a parallel damage path. Death cleanup now resets combo index/timer, input buffer, active attack, attack phase, skill state, cooldown transients where appropriate, counter readiness, and Momentum. Contextual attacks are selected deterministically from enemy control states and reuse the same damage pipeline.

## Stage 3.1 skill lifecycle contract

Skill execution follows `input → startup → active → recovery → complete → idle/recovering`. Every abnormal route calls `finishSkill(reason)` instead of duplicating cleanup in individual abilities. Cooldowns start at skill input and remain active after cleanup. Death keeps the player dead; stun/knockdown are preserved; scene reset skips transitions on destroyed actors. The debug overlay includes a development watchdog warning for possible stuck attacking/recovering skill states when F2 is enabled, but it never forces recovery in production. Stage 3.2 animation sync metadata aligns visual active frames, hit markers, trails, and fallback timing with combat windows while keeping combat state and `finishSkill(reason)` authoritative.
