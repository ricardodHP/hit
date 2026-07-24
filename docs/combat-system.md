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

F2 toggles a lightweight overlay with player state, attack phase, combo index, invulnerability, guard, counter timer, dodge cooldown, enemy attack slots, AI state, and attacker permission ownership.
