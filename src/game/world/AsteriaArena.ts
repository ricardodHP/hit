import { ARENA } from '../constants/game.constants';
const walls=[{x:640,y:60,w:1100,h:40},{x:640,y:660,w:1100,h:40},{x:58,y:360,w:40,h:560},{x:1222,y:360,w:40,h:560}];
const columns=[{x:330,y:210},{x:950,y:210},{x:330,y:515},{x:950,y:515}];
const rubble=[{x:540,y:210},{x:760,y:520},{x:190,y:430},{x:1090,y:360}];
export class AsteriaArena { readonly obstacles: Phaser.Physics.Arcade.StaticGroup; door?: Phaser.GameObjects.Image; constructor(private scene: Phaser.Scene){this.obstacles=scene.physics.add.staticGroup();}
  build(): void { this.scene.add.image(640,360,'asteria-tiles').setDisplaySize(1280,720).setDepth(0); const map=this.scene.make.tilemap({key:'asteria-map'}); const tiles=map.addTilesetImage('asteria-tileset','asteria-tiles'); if(tiles){ for(const name of ['Background','Floor','Floor details','Ground decals','Low props','High props','Lighting','Foreground']) map.createLayer(name,tiles,0,0)?.setDepth(name==='High props'?900:name==='Foreground'?1800:1); }
    walls.forEach(w=>{const img=this.scene.add.image(w.x,w.y,'props-atlas',0).setDisplaySize(w.w,w.h).setAlpha(.95).setDepth(w.y); this.scene.physics.add.existing(img,true); this.obstacles.add(img);});
    this.door=this.scene.add.image(ARENA.doorX,ARENA.doorY,'props-atlas',1).setDisplaySize(128,72).setDepth(ARENA.doorY+20); this.scene.physics.add.existing(this.door,true); this.obstacles.add(this.door);
    columns.forEach(c=>{const shadow=this.scene.add.image(c.x,c.y+34,'shadows-atlas',4).setAlpha(.55).setDepth(c.y-2); shadow.setScale(.9,.35); const img=this.scene.add.image(c.x,c.y,'props-atlas',2).setDisplaySize(96,128).setDepth(c.y+48); this.scene.physics.add.existing(img,true); this.obstacles.add(img);});
    rubble.forEach((r,i)=>{const img=this.scene.add.image(r.x,r.y,'props-atlas',3+i%2).setDisplaySize(96,64).setDepth(r.y); this.scene.physics.add.existing(img,true); this.obstacles.add(img);});
    [[170,145],[1110,145],[180,590],[1100,590]].forEach(([x,y])=>{const t=this.scene.add.sprite(x,y,'props-atlas',5).setDepth(y+20); this.scene.tweens.add({targets:t,alpha:.7,duration:280,yoyo:true,repeat:-1}); this.scene.add.image(x,y,'telegraph-atlas',0).setAlpha(.18).setScale(.7).setDepth(y-1);}); this.obstacles.refresh(); }
  openDoor(): void { this.door?.setFrame(6); this.door?.setTint(0xbff7ff); if(this.door?.body) (this.door.body as Phaser.Physics.Arcade.StaticBody).enable=false; }
}
