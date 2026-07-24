import { ARENA } from '../constants/game.constants';
import { Player } from '../actors/Player';
import { Enemy } from '../actors/Enemy';
import { InputController } from '../input/InputController';
import { BasicCombatController } from '../combat/BasicCombatController';
import { AsteriaArena } from '../world/AsteriaArena';
import { CombatHud } from '../ui/CombatHud';
import type { ArenaStatus } from '../types/game.types';
export class CombatScene extends Phaser.Scene { private player!: Player; private enemies: Enemy[]=[]; private inputController!: InputController; private combat!: BasicCombatController; private arena!: AsteriaArena; private hud!: CombatHud; private status: ArenaStatus='Fighting'; constructor(){super('CombatScene');}
  create(): void { this.physics.world.setBounds(ARENA.left,ARENA.top,ARENA.right-ARENA.left,ARENA.bottom-ARENA.top); this.arena=new AsteriaArena(this); this.arena.build(); this.player=new Player(this,640,520); this.combat=new BasicCombatController(this); this.inputController=new InputController(this); this.hud=new CombatHud(); this.spawnEnemies(); this.physics.add.collider(this.player,this.arena.obstacles); this.enemies.forEach(e=>{this.physics.add.collider(e,this.arena.obstacles); this.physics.add.collider(e,this.player);}); }
  update(_time:number, delta:number): void { const input=this.inputController.getState(); if(input.restart) this.scene.restart(); this.player.updatePlayer(input,delta); if(input.dodge) this.player.dodge(); if(input.attack) this.combat.basicAttack(this.player,this.enemies); if(input.skill) this.combat.circularSkill(this.player,this.enemies); let attackers=0; this.enemies.forEach(e=>{ if(e.state==='Attack') attackers++; const hit=e.updateEnemy(this.player,delta,attackers); if(hit) this.combat.resetCombo(); }); this.inputController.clearMomentaryTouch(); const remaining=this.enemies.filter(e=>e.active).length; if(remaining===0 && this.status==='Fighting'){this.status='Completed'; this.arena.openDoor();} if(this.player.health<=0) this.status='Defeated'; this.hud.update({health:this.player.health,maxHealth:this.player.maxHealth,enemiesRemaining:remaining,combo:this.combat.combo,score:this.combat.score,skillCooldown:this.player.cooldowns.skill,dodgeCooldown:this.player.cooldowns.dodge,status:this.status}); }
  private spawnEnemies(): void { const data: Array<[number,number,'normal'|'heavy']> = [[320,180,'normal'],[960,180,'normal'],[310,560,'normal'],[980,560,'normal'],[640,210,'heavy']]; this.enemies=data.map(([x,y,v],i)=>new Enemy(this,x,y,v,450+i*220)); }
}
