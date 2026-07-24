import { PLAYER } from '../constants/game.constants';
import { incrementCombo, resetCombo, scoreForHit } from '../logic/combatMath';
import type { Enemy } from '../actors/Enemy';
import type { Player } from '../actors/Player';
export class BasicCombatController { combo=0; score=0; constructor(private scene: Phaser.Scene) {}
  basicAttack(player: Player, enemies: Enemy[]): void { if(!player.canAttack()) return; player.markAttack(); const origin=new Phaser.Math.Vector2(player.x,player.y); const center=origin.clone().add(player.facing.clone().scale(PLAYER.attackRange*.7)); let hits=0; enemies.forEach(e=>{if(e.active && Phaser.Math.Distance.Between(center.x,center.y,e.x,e.y)<PLAYER.attackRange){ e.receiveDamage(PLAYER.attackDamage,origin,PLAYER.knockback); hits++; this.score+=scoreForHit(e.config.score,hits>0?this.combo+1:0); this.emitImpact(e.x,e.y);} }); if(hits>0){this.combo=incrementCombo(this.combo); this.scene.cameras.main.shake(55,.003);} else this.combo=resetCombo(); }
  circularSkill(player: Player, enemies: Enemy[]): void { if(!player.canSkill()) return; player.markSkill(); const ring=this.scene.add.image(player.x,player.y,'skill-ring').setDepth(20).setAlpha(.9); this.scene.tweens.add({targets:ring,scale:1.35,alpha:0,duration:260,onComplete:()=>ring.destroy()}); enemies.forEach(e=>{if(e.active && Phaser.Math.Distance.Between(player.x,player.y,e.x,e.y)<PLAYER.skillRadius){e.receiveDamage(PLAYER.skillDamage,new Phaser.Math.Vector2(player.x,player.y),PLAYER.skillKnockback); this.combo=incrementCombo(this.combo); this.score+=scoreForHit(e.config.score,this.combo); this.emitImpact(e.x,e.y);}}); }
  resetCombo(): void { this.combo=0; } reset(): void { this.combo=0; this.score=0; }
  private emitImpact(x:number,y:number): void { for(let i=0;i<7;i++){const p=this.scene.add.image(x,y,'impact-particle').setDepth(20); this.scene.tweens.add({targets:p,x:x+Phaser.Math.Between(-34,34),y:y+Phaser.Math.Between(-28,28),alpha:0,duration:220,onComplete:()=>p.destroy()});} }
}
