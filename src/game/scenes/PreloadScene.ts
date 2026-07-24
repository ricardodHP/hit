import { assetManifest } from '../assets/assetManifest';

export class PreloadScene extends Phaser.Scene {
  private failed = new Set<string>();
  constructor(){super('PreloadScene');}
  preload(): void {
    const label=this.add.text(640,330,'Loading raster assets...',{color:'#f6f0d8',fontSize:'20px'}).setOrigin(.5);
    const current=this.add.text(640,366,'',{color:'#cfd7ff',fontSize:'14px'}).setOrigin(.5);
    this.load.on('progress',(v:number)=>label.setText(`Loading raster assets ${Math.round(v*100)}%`));
    this.load.on('fileprogress',(file: { key:string; url?: string })=>current.setText(`${file.key}${file.url?` — ${file.url}`:''}`));
    this.load.on('loaderror',(file: { key:string; src?: string })=>{this.failed.add(file.key); console.error('Critical asset load failed', file.key, file.src);});
    for(const a of assetManifest.assets){
      if(a.kind==='spritesheet') this.load.spritesheet(a.key,a.path,{frameWidth:a.frameWidth!,frameHeight:a.frameHeight!});
      else if(a.kind==='tilemap') this.load.tilemapTiledJSON(a.key,a.path);
      else this.load.image(a.key,a.path);
    }
  }
  create(): void {
    const errors:string[]=[];
    for(const a of assetManifest.assets){ if(a.critical && this.failed.has(a.key)) errors.push(`${a.key} failed at ${a.path}`); if(a.kind!=='tilemap' && !this.textures.exists(a.key)) errors.push(`${a.key} missing texture`); }
    for(const a of assetManifest.assets) for(const anim of a.animations??[]){ if(anim.frames.length===0) errors.push(`${anim.key} has no frames`); if(anim.frameRate<=0) errors.push(`${anim.key} invalid frame rate`); if(anim.repeat===-1 && !/idle|run/.test(anim.key)) errors.push(`${anim.key} one-shot repeats forever`); if(!this.anims.exists(anim.key)) this.anims.create({key:anim.key,frames:anim.frames.map((frame: number)=>({key:anim.assetKey,frame})),frameRate:anim.frameRate,repeat:anim.repeat}); }
    if(errors.length>0){ this.add.image(640,260,'missing-texture').setScale(2); this.add.text(640,380,`Asset validation failed:\n${errors.join('\n')}`,{color:'#ffb0b0',fontSize:'16px',align:'center',wordWrap:{width:760}}).setOrigin(.5); return; }
    this.scene.start('CharacterSelectScene');
  }
}
