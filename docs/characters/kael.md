# Kael — Swiftblade

Kael is an original dual-sword duelist built for fast, precise, aggressive single-target pressure. He is vulnerable when pressure drops because his special mechanic decays after inactivity.

## Stats

- Max health: 100
- Max guard: 80
- Movement speed: 235
- Attack power: 1
- Defense: 0
- Guard regeneration: 18/s
- Critical chance: 0

## Combo

1. Twin Slash I — fast short frontal cut with a small step.
2. Twin Slash II — wider opposite slash.
3. Cross Cut — explicit controlled multi-hit.
4. Rising Fang — ascending cut that applies airborne; heavy enemies resist duration.
5. Falling Edge — high-damage finisher with longer recovery and knockdown.

## Momentum

Momentum ranges from 0 to 100. Basic hits grant 8, Falling Edge grants 14, skills grant 12 per execution, perfect block grants 15, counter grants 20, and contextual attacks grant 18. Taking damage removes 25, guard break removes 40, death/reset return to zero, and after 2.5 seconds without confirmed hits it decays by 12 per second.

Tiers are Normal (0–39), Accelerated (40–79, +4% movement and +8% attack speed), and Overdrive (80–100, +8% movement, +15% attack speed, and 10% skill cooldown reduction). Multipliers are computed from current value and never mutate source definitions.

## Skills

- Rising Tempest (K): two advancing cuts, controlled multi-hit, airborne setup, 6s cooldown.
- Phantom Rush (O): three short rushes, super armor during active frames, final stun, 8s cooldown.
- Blade Cyclone (P): larger circular multi-hit group control, final knockdown, partial super armor, 11s cooldown.

## Contextual attacks

- Sky Reaver against airborne targets.
- Flash Execution against stunned targets.
- Falling Judgment against knocked-down targets.

Selection is deterministic: valid status, in front, within range, closest, and not blocked by the current line-of-action model.

## Cancel limits

Kael can chain only through declared combo windows, dodge-cancel late recovery on the first three attacks, and use skills after valid confirms. Startup and active phases are not freely cancellable.

## Provisional balance and limitations

The full combo is tuned to defeat a normal enemy in roughly two chains. Skills are setup/control tools and should not delete a full-health heavy alone. Visuals are generated local placeholders, not final art.
