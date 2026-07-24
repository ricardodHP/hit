# Stage 3.1 QA — Kael Stabilization and Visual Readability

## Manual QA matrix

| ID | Área | Escenario | Resultado | Evidencia | Bug/nota |
|---|---|---|---|---|---|
| A1 | Congelamiento | Ejecutar cada habilidad 15 veces con enemigos | BLOCKED | No interactive browser available in container | Automated lifecycle tests PASS. |
| A2 | Congelamiento | Ejecutar cada habilidad 15 veces sin enemigos | BLOCKED | No interactive browser available in container | Automated no-target completion tests PASS. |
| A3 | Congelamiento | Ejecutar cerca de muros y columnas | BLOCKED | No interactive browser available in container | Collision finalization covered by controller tests. |
| B1 | Rising Tempest | Golpea, falla, mata en hit 1/2, obstáculo, muerte, reinicio por fase | BLOCKED | No interactive browser available in container | Central finish path tested; requires visual playtest. |
| C1 | Phantom Rush | Cuatro direcciones, dash contra obstáculo, cambio de dirección, muerte/reset en dash 1/2/3 | BLOCKED | No interactive browser available in container | Collision finish tests cover dash 1/2/3. |
| D1 | Blade Cyclone | Repetición post-cooldown, grupo/sin enemigos, muro, muerte/reset active | BLOCKED | No interactive browser available in container | Speed cleanup and repeat tests PASS. |
| E1 | Dual-wield | Idle, movement, combo, skills, block, perfect block, counter, dodge, stun, knockdown, death | BLOCKED | No interactive browser available in container | Renderer-independent pose tests PASS. |
| F1 | Selector | 1920x1080, 1366x768, 1280x720, 768x1024, 390x844 | BLOCKED | No interactive browser available in container | Layout safe-area tests PASS. |
| G1 | HUD | Three cooldowns, momentum, compact viewport safety | BLOCKED | No interactive browser available in container | DOM rendering changed; needs browser inspection. |

## Root cause

`SkillController` previously treated skills as a secondary `AttackController` plus cooldown. Normal completion reset the attack, but interruption, death, scene restart, dash collision, timer/tween cancellation, and no-target paths did not converge through a single idempotent cleanup contract. Phantom Rush was the highest-risk skill because multi-step movement can be stopped by collision before every expected step completes; Blade Cyclone risked accumulated temporary speed reduction; Rising Tempest risked a multi-hit sequence ending without the second hit or target.

## Affected abilities

- Rising Tempest: multi-hit completion could depend on the attack phase reaching complete.
- Phantom Rush: dash/collision/tween interruption was most likely to leave movement/input disabled.
- Blade Cyclone: active multi-hit and movement reduction needed guaranteed cleanup.

## Cleanup route and contract

All skills now terminate through `finishSkill(reason)`, with reasons: `completed`, `interrupted`, `collision`, `death`, `scene-reset`, and `cancelled`. The route is idempotent: repeated calls do not restart cooldowns, duplicate transitions, recreate hitboxes, or leave registered timers/tweens alive. Cleanup clears active skill id, active attack, attack phase, registered hitboxes, timers, tweens, speed modifiers, super armor, temporary invulnerability hooks, visual state hooks, and pending callbacks before deciding whether to recover, idle, remain disabled on death, or skip transitions for destroyed scene instances.

## Visual dual-wield change

Kael now has renderer-independent dual-weapon pose data. Idle, run, combo, block, counter, skills, down, and dead poses define separate left/right sword offsets and angles. Twin Slash I leads with the right weapon, Twin Slash II leads with the left, Cross Cut and all three skills use both, and block crosses both blades.

## Layout changes

The selector uses a pure layout calculator with panel safe-area margins, content width, separate skill blocks, wrapped descriptions, and a bounded Start Mission button. HUD rows now show K/O/P cooldowns independently instead of a combined ready label.

## Remaining limitations

Manual browser playtesting and visual validation are BLOCKED in this container. The user should run `npm run dev` locally and execute the manual matrix above in Chrome or Firefox at the listed resolutions before declaring visual QA PASS.
