import type { InputState } from '../types/game.types';
export class InputController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys: Record<string, Phaser.Input.Keyboard.Key>;
  private touch = { x: 0, y: 0, attack: false, skill: false, dodge: false };
  constructor(private scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.cursors = keyboard.createCursorKeys();
    this.keys = keyboard.addKeys('W,A,S,D,J,K,L,R') as Record<string, Phaser.Input.Keyboard.Key>;
    this.createTouchControls();
  }
  getState(): InputState {
    const pad = this.scene.input.gamepad?.total ? this.scene.input.gamepad.getPad(0) : undefined;
    const moveX = Number(this.cursors.right.isDown || this.keys.D.isDown) - Number(this.cursors.left.isDown || this.keys.A.isDown) + this.touch.x + (pad?.leftStick.x ?? 0);
    const moveY = Number(this.cursors.down.isDown || this.keys.S.isDown) - Number(this.cursors.up.isDown || this.keys.W.isDown) + this.touch.y + (pad?.leftStick.y ?? 0);
    return { moveX: Phaser.Math.Clamp(moveX, -1, 1), moveY: Phaser.Math.Clamp(moveY, -1, 1), attack: Phaser.Input.Keyboard.JustDown(this.keys.J) || Phaser.Input.Keyboard.JustDown(this.cursors.space) || this.touch.attack || Boolean(pad?.A), skill: Phaser.Input.Keyboard.JustDown(this.keys.K) || this.touch.skill || Boolean(pad?.B), dodge: Phaser.Input.Keyboard.JustDown(this.keys.L) || this.touch.dodge || Boolean(pad?.R1), restart: Phaser.Input.Keyboard.JustDown(this.keys.R) };
  }
  clearMomentaryTouch(): void { this.touch.attack = false; this.touch.skill = false; this.touch.dodge = false; }
  private createTouchControls(): void {
    const root = document.getElementById('hud-root'); if (!root) return;
    const wrap = document.createElement('div'); wrap.className = 'touch-controls'; wrap.innerHTML = `<div class="touch-pad"><span></span><button class="touch-button" data-dir="up">▲</button><span></span><button class="touch-button" data-dir="left">◀</button><span></span><button class="touch-button" data-dir="right">▶</button><span></span><button class="touch-button" data-dir="down">▼</button><span></span></div><div class="touch-actions"><button class="touch-button" data-act="attack">J</button><button class="touch-button" data-act="skill">K</button><button class="touch-button" data-act="dodge">L</button></div>`;
    root.appendChild(wrap);
    const setDir = (dir: string, on: boolean) => { const v = on ? 1 : 0; if (dir==='left') this.touch.x=-v; if(dir==='right') this.touch.x=v; if(dir==='up') this.touch.y=-v; if(dir==='down') this.touch.y=v; };
    wrap.querySelectorAll<HTMLButtonElement>('button').forEach(b=>{b.onpointerdown=()=>{const d=b.dataset.dir; const a=b.dataset.act; if(d) setDir(d,true); if(a==='attack') this.touch.attack=true; if(a==='skill') this.touch.skill=true; if(a==='dodge') this.touch.dodge=true;}; b.onpointerup=b.onpointercancel=()=>{const d=b.dataset.dir; if(d) setDir(d,false);};});
  }
}
