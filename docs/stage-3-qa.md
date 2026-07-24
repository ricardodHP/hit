# Stage 3 QA Matrix

| ID | Área | Escenario | Resultado | Evidencia | Bug/nota |
| --- | --- | --- | --- | --- | --- |
| A1 | Selector | Abrir juego y ver Kael | BLOCKED | No interactive browser available in container | Validate locally. |
| A2 | Selector | Revisar nombre, descripción, habilidades e iniciar misión | BLOCKED | No interactive browser available in container | Validate locally. |
| B1 | Combo | Ejecutar cinco golpes, Cross Cut, Rising Fang, Falling Edge | BLOCKED | No interactive browser available in container | Automated combo data tests PASS. |
| B2 | Combo | Spam, ventana fallida, dirección, columna, morir durante golpes | BLOCKED | No interactive browser available in container | Automated death cleanup PASS. |
| C1 | Momentum | Ganar, tiers 40/80/100, efecto max, decay | BLOCKED | No interactive browser available in container | Automated momentum tests PASS. |
| C2 | Momentum | Daño, guard break, muerte, reinicio | BLOCKED | No interactive browser available in container | Automated momentum reset/loss tests PASS. |
| D1 | Rising Tempest | Uno, grupo, heavy, muro, muerte, reinicio | BLOCKED | No interactive browser available in container | Automated skill data tests PASS. |
| E1 | Phantom Rush | Direcciones, corrección, colisión, daño, stun, cooldown | BLOCKED | No interactive browser available in container | Automated movement bounds metadata PASS. |
| F1 | Blade Cyclone | Grupo, movimiento, multi-hit, knockdown, muerte, reinicio | BLOCKED | No interactive browser available in container | Automated skill tests PASS. |
| G1 | Contextuales | Sky Reaver, Flash Execution, Falling Judgment | BLOCKED | No interactive browser available in container | Automated contextual mapping PASS. |
| G2 | Contextuales | Dos objetivos, obstáculo, objetivo muerto, fuera de alcance | BLOCKED | No interactive browser available in container | Deterministic rules tested in pure model. |
| H1 | Muerte/reinicio | Combo cero, Momentum cero, skills canceladas, cinco reinicios | BLOCKED | No interactive browser available in container | Automated cleanup tests PASS. |

## Local manual instructions

Run `npm run dev`, open the shown local URL in a browser, use a 1280×720 desktop viewport first, then a narrow/touch viewport. Execute every row above and replace BLOCKED with PASS/FAIL and notes.
