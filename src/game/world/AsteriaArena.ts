import { DEPTHS, ARENA } from '../constants/game.constants';
import { columns, rubble, walls } from './collisionObjects';
export class AsteriaArena { obstacles: Phaser.Physics.Arcade.StaticGroup; door!: Phaser.GameObjects.Image;
  constructor(private scene: Phaser.Scene){this.obstacles=scene.physics.add.staticGroup();}
  build(): void { for(let x=96;x<1184;x+=64) for(let y=72;y<648;y+=64) this.scene.add.image(x,y,'stone-floor').setDepth(0).setTint(Phaser.Math.Between(0x8b8d94,0xa8aab0)); walls.forEach(w=>{const r=this.scene.add.rectangle(w.x,w.y,w.w,w.h,0x211d27).setDepth(4); this.scene.physics.add.existing(r,true); this.obstacles.add(r);}); this.door=this.scene.add.image(ARENA.doorX,ARENA.doorY,'sanctuary-door').setDepth(5); columns.forEach(c=>this.obstacles.add(this.scene.add.image(c.x,c.y,'column').setDepth(DEPTHS.prop))); rubble.forEach(r=>this.obstacles.add(this.scene.add.image(r.x,r.y,'rubble').setDepth(DEPTHS.prop))); [[170,145],[1110,145],[180,590],[1100,590]].forEach(([x,y])=>{const t=this.scene.add.image(x,y,'torch').setDepth(6); this.scene.tweens.add({targets:t,alpha:.55,duration:280,yoyo:true,repeat:-1});}); this.scene.add.rectangle(640,360,1280,720,0x07040c,.18).setDepth(2).setBlendMode(Phaser.BlendModes.MULTIPLY); this.obstacles.refresh(); }
  openDoor(): void { this.door.setTint(0x8fffd0).setAlpha(.86).setY(this.door.y-16); }
}
