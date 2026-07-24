import { PLAYER } from '../constants/game.constants';
import { clampHealth, tickCooldown } from '../logic/combatMath';
import type { Cooldowns, InputState } from '../types/game.types';
export class Player extends Phaser.Physics.Arcade.Sprite {
  maxHealth: number = PLAYER.maxHealth; health: number = PLAYER.maxHealth; speed = PLAYER.speed; facing = new Phaser.Math.Vector2(1,0); cooldowns: Cooldowns = { attack: 0, skill: 0, dodge: 0 }; invulnerableMs = 0; moving = false; private dodgeMs = 0;
  constructor(scene: Phaser.Scene, x: number, y: number) { super(scene,x,y,'player'); scene.add.existing(this); scene.physics.add.existing(this); this.setCollideWorldBounds(true).setDepth(8); this.body!.setSize(34,38).setOffset(9,16); }
  updatePlayer(input: InputState, delta: number): void { this.cooldowns.attack=tickCooldown(this.cooldowns.attack,delta); this.cooldowns.skill=tickCooldown(this.cooldowns.skill,delta); this.cooldowns.dodge=tickCooldown(this.cooldowns.dodge,delta); this.invulnerableMs=tickCooldown(this.invulnerableMs,delta); this.dodgeMs=tickCooldown(this.dodgeMs,delta); const v=new Phaser.Math.Vector2(input.moveX,input.moveY); if(v.lengthSq()>0){v.normalize(); this.facing.copy(v);} this.moving=v.lengthSq()>0; const speed=this.dodgeMs>0?PLAYER.dodgeSpeed:this.speed; this.setVelocity(v.x*speed,v.y*speed); this.setAlpha(this.invulnerableMs>0?0.62:1); }
  canAttack(): boolean { return this.cooldowns.attack<=0; } markAttack(): void { this.cooldowns.attack=PLAYER.attackCooldown; }
  canSkill(): boolean { return this.cooldowns.skill<=0; } markSkill(): void { this.cooldowns.skill=PLAYER.skillCooldown; }
  dodge(): boolean { if(this.cooldowns.dodge>0) return false; this.cooldowns.dodge=PLAYER.dodgeCooldown; this.dodgeMs=PLAYER.dodgeDuration; this.invulnerableMs=PLAYER.invulnerabilityMs; return true; }
  receiveDamage(damage: number): boolean { if(this.invulnerableMs>0) return false; this.health=clampHealth(this.health,damage); this.invulnerableMs=PLAYER.invulnerabilityMs; return true; }
  resetState(x: number, y: number): void { this.setPosition(x,y); this.health=this.maxHealth; this.cooldowns={attack:0,skill:0,dodge:0}; this.invulnerableMs=0; this.dodgeMs=0; this.setVelocity(0); this.setAlpha(1); }
}
