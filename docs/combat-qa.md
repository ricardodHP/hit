# Combat QA and Stabilization — Stage 2.5

## Execution information

- Date: 2026-07-24
- Commit inspected before changes: `b399a7048bb93593910444bc93fc037ac5760663`
- Browser: BLOCKED in this container; no interactive browser automation or visible browser was available.
- Resolution: NOT RUN interactively. Desktop and mobile viewport checks are documented as BLOCKED.
- Controls used: Automated checks only. Keyboard/touch manual input is BLOCKED.

## Initial investigation summary

| Bug | Probable cause found | Files reviewed | Regression risk |
| --- | --- | --- | --- |
| Player did not reliably die | Lethal damage mutated a `CombatRuntime` snapshot and `CombatScene` only checked health after combat update. Death did not centrally cancel player attack, dodge, counter, enemy slots, or enemy attack controllers. | `DamageSystem`, `Player`, `BasicCombatController`, `CombatScene` | State transitions around active attacks and defeat overlay timing. |
| Enemy attacks pushed player | Normal enemy data declared nonzero knockback and Arcade actor-vs-actor collision could physically push bodies. Damage and knockback were not clearly separated for player hits. | `enemyAttacks`, `BasicCombatController`, `Player`, `Enemy`, `CombatScene`, `knockback` | Collision tuning can affect passive separation near enemies. |
| Restart did not restore health | Restart used scene reconstruction but DOM touch/HUD/debug and combat transient resources were not cleaned up explicitly during shutdown, leaving duplicate UI/listeners and pending combat references/timers possible. | `CombatScene`, `InputController`, `CombatHud`, `CombatDebugOverlay`, `BasicCombatController` | Scene restart cleanup must not remove fresh HUD nodes after restart. |

## Automated result table

| ID | Área | Escenario | Resultado | Evidencia | Bug/nota |
| --- | --- | --- | --- | --- | --- |
| A-AUTO-1 | Muerte | Daño letal fija vida en cero y `dead` | PASS | Vitest stabilization tests | Covers Bug 1 core logic. |
| A-AUTO-2 | Muerte | Overkill no genera vida negativa | PASS | Vitest stabilization tests | Covers Bug 1 overkill. |
| A-AUTO-3 | Muerte | Muerto no puede moverse/atacar/bloquear/esquivar | PASS | Vitest stabilization tests | State-machine guard. |
| A-AUTO-4 | Muerte | Eventos letales repetidos no sacan de `dead` | PASS | Vitest stabilization tests | Defeat idempotence support. |
| A-AUTO-5 | Muerte | Muerte cancela ataque/hitbox activos | PASS | Vitest stabilization tests | Controller reset. |
| B-AUTO-1 | Reinicio | Reset limpia combo, buffer, counter, cooldowns, ataques y slots | PASS | Vitest stabilization tests | Covers Bug 3 transient state. |
| B-AUTO-2 | Reinicio | Dos resets consecutivos producen el mismo estado | PASS | Vitest stabilization tests | Idempotence. |
| C-AUTO-1 | Knockback | Ataque normal enemigo declara `knockback: 0` | PASS | Vitest stabilization tests | Covers Bug 2 data. |
| C-AUTO-2 | Knockback | Daño sin knockback no mueve ni cambia velocidad | PASS | Vitest stabilization tests | Damage/knockback separation. |
| C-AUTO-3 | Knockback | Knockback explícito cambia velocidad | PASS | Vitest stabilization tests | Heavy/configured attacks only. |
| C-AUTO-4 | Knockback | Bloqueo de ataque sin knockback no desplaza | PASS | Vitest stabilization tests | Defensive path. |
| C-AUTO-5 | Knockback | Resolución respeta límites | PASS | Vitest stabilization tests | Clamp helper. |
| G-AUTO-1 | Director | Release/reset liberan slots | PASS | Vitest stabilization tests | Cleanup. |
| G-AUTO-2 | Director | Enemigo muerto/jugador muerto niegan permisos antes del director | PASS | Vitest stabilization tests | Policy check. |
| MAN-A | Muerte y derrota | Matriz A1-A6 en navegador | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-B | Reinicio | Matriz B con diez reinicios | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-C | Knockback y colisiones | Matriz C1-C5 | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-D | Combo | Matriz D | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-E | Bloqueo/counter | Matriz E | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-F | Estados de control | Matriz F | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-G | IA/AttackDirector | Matriz G de dos minutos | BLOCKED | No interactive browser available | Must be repeated locally. |
| MAN-H | Controles | Teclado/touch/gamepad | BLOCKED | No interactive browser available | Must be repeated locally. |

## Bugs found and fixed

### 1. Player does not die when health reaches zero

- Steps to reproduce: Let enemies reduce player HP to zero during normal combat.
- Current result before fix: HP could show zero while combat input, attack phases, dodge/counter state, and enemy attack permissions were still active until later scene status checks.
- Expected result: HP clamps to zero, state becomes `dead`, active combat actions are cancelled, enemies stop starting attacks, and defeat processes once.
- Cause: Lethal damage was resolved on snapshots without a single cleanup path for actor, controllers, and director slots.
- Correction: Added player death cleanup, blocked dead input paths, idempotent defeat handling, attack/counter/dodge/director reset on death, and no further enemy telegraphs when the player is dead.
- Test added: Lethal damage, overkill, dead action restrictions, duplicate lethal events, and active attack/hitbox cancellation tests.
- Final state: PASS in automated tests; manual browser matrix BLOCKED in this environment.

### 2. Enemy attacks push the player

- Steps to reproduce: Receive normal enemy swipes or walk into enemies.
- Current result before fix: Normal enemy swipe data declared knockback and actor-vs-actor Arcade collision could push bodies.
- Expected result: Normal enemy attacks and passive contact do not displace the player; only explicit attack definitions apply knockback.
- Cause: `enemy-normal-swipe` had nonzero knockback and the scene used default actor collision response between enemies and player.
- Correction: Set normal enemy knockback to zero, made actor bodies non-pushable, disabled actor-vs-actor collision response, and introduced explicit knockback helpers used only when power is greater than zero.
- Test added: Zero-knockback no position/velocity change, explicit knockback velocity, blocked zero-knockback no displacement, and bounds clamp tests.
- Final state: PASS in automated tests; manual collision matrix BLOCKED in this environment.

### 3. Restart does not restore health

- Steps to reproduce: Take damage or die, press `R`, and inspect player HP/state/UI.
- Current result before fix: Scene restart reconstructed gameplay, but old HUD/touch/debug DOM nodes and combat resources were not explicitly destroyed/reset, risking stale UI and duplicate inputs.
- Expected result: Restart reconstructs a clean scene with full HP/guard, idle state, empty combat transients, recreated enemies, closed door, and no duplicate listeners.
- Cause: Scene reconstruction strategy lacked shutdown cleanup for UI/input/debug and combat transients.
- Correction: Documented and kept a full scene reconstruction strategy with explicit shutdown cleanup for HUD, touch controls, debug overlay, telegraphs, controller state, and director slots.
- Test added: Reset cleanup and idempotent double-reset tests.
- Final state: PASS in automated tests; manual ten-restart matrix BLOCKED in this environment.

## Manual QA status

Interactive browser validation is required before declaring Stage 2.5 fully complete. This container did not provide a usable interactive browser, so every manual group is marked BLOCKED rather than PASS.

## Known remaining limitations

- Manual browser QA must be repeated locally with desktop and mobile viewport coverage.
- Gamepad validation remains NOT RUN unless hardware/browser support is available.
- Enemy navigation remains lightweight steering rather than pathfinding, as already documented for Stage 2.
