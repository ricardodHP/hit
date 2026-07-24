# Stage 3.2 Visual QA

Manual interactive browser QA was not completed in this container. Automated build/tests validate the manifest and static primitive guardrails, but the stage must remain visually BLOCKED until a human checks the game locally.

| ID | Área | Escenario | Resolución | Resultado | Evidencia | Nota |
|---|---|---|---|---|---|---|
| A1 | Kael | Idle/run four directions, two swords visible | 1280×720 | BLOCKED | Not available | Requires browser playtest. |
| A2 | Kael | Five combo attacks, skills, context, block/counter/dodge/death | 1280×720 | BLOCKED | Not available | Verify no visible primitives. |
| B1 | Enemies | Corrupted Soldier/Stone Brute states and death | 1280×720 | BLOCKED | Not available | Verify telegraph vs active poses. |
| C1 | Asteria | Tilemap, walls, columns, rubble, torches, door states | 1280×720 | BLOCKED | Not available | Verify depth sorting. |
| D1 | Effects | Slashes, sparks, momentum, contextual, telegraphs | 1280×720 | BLOCKED | Not available | Verify lifetime/pooling behavior. |
| E1 | Primitive absence | Circles, rectangles, lines, capsules, ellipses, triangles | 1280×720 | BLOCKED | Not available | Debug F2 exceptions only. |
| F1 | Responsive | Character select and HUD | 1920×1080 | BLOCKED | Not available | Local browser required. |
| F2 | Responsive | Character select and HUD | 1366×768 | BLOCKED | Not available | Local browser required. |
| F3 | Responsive | Character select and HUD | 1280×720 | BLOCKED | Not available | Local browser required. |
| F4 | Responsive | Character select and HUD | 768×1024 | BLOCKED | Not available | Local browser required. |
| F5 | Responsive | Character select and HUD | 390×844 | BLOCKED | Not available | Local browser required. |
| G1 | Performance | Five enemies, Blade Cyclone group, ten restarts, two minutes combat | 1280×720 | BLOCKED | Not available | Local browser required. |

## Local validation commands

1. `npm run dev`
2. Open the local Vite URL in Chrome or Firefox.
3. Test the rows above at each listed resolution with F2 both off and on.
4. Confirm normal gameplay art uses only raster sprites/tilemaps; debug hitboxes/telegraphs may use primitives only with F2 enabled.
