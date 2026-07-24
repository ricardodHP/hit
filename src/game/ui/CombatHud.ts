import type { HudState } from '../types/game.types';
export class CombatHud { private root: HTMLElement; private panel: HTMLElement;
  constructor(){this.root=document.getElementById('hud-root') ?? document.body; this.panel=document.createElement('div'); this.panel.className='combat-hud'; this.root.prepend(this.panel);}
  update(s: HudState): void { const hp=Math.round((s.health/s.maxHealth)*100); this.panel.innerHTML=`<div class="hud-top"><div class="pill">HP</div><div class="bar"><span style="width:${hp}%"></span></div><div class="pill">Enemies: ${s.enemiesRemaining}</div><div class="pill">Combo: ${s.combo}</div><div class="pill">Score: ${s.score}</div><div class="pill">Skill: ${(s.skillCooldown/1000).toFixed(1)}s</div><div class="pill">Dodge: ${(s.dodgeCooldown/1000).toFixed(1)}s</div><div class="pill">${s.status}</div></div><div class="hud-bottom"><div class="instructions">WASD/Arrows move · J/Space attack · K skill · L dodge · R restart. Touch controls appear on mobile.</div></div>`; }
  destroy(): void { this.panel.remove(); }
}
