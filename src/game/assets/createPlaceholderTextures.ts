const make = (scene: Phaser.Scene, key: string, w: number, h: number, draw: (g: Phaser.GameObjects.Graphics) => void): void => {
  if (scene.textures.exists(key)) return;
  const g = scene.add.graphics(); draw(g); g.generateTexture(key, w, h); g.destroy();
};
export function createPlaceholderTextures(scene: Phaser.Scene): void {
  make(scene,'stone-floor',64,64,g=>{g.fillStyle(0x34313a).fillRect(0,0,64,64);g.lineStyle(2,0x45414c,.8).strokeRect(1,1,62,62);g.fillStyle(0x3d3944,.7).fillRect(8,10,18,12).fillRect(38,34,16,18);});
  make(scene,'wall',64,64,g=>{g.fillStyle(0x211d27).fillRect(0,0,64,64);g.lineStyle(3,0x695d72).strokeRect(3,3,58,58);});
  make(scene,'column',64,82,g=>{g.fillStyle(0x17151b,.45).fillEllipse(32,70,58,18);g.fillStyle(0x77707d).fillRoundedRect(16,8,32,60,8);g.fillStyle(0x9c93a5).fillRect(10,6,44,10).fillRect(10,62,44,10);});
  make(scene,'rubble',74,48,g=>{g.fillStyle(0x17151b,.45).fillEllipse(37,38,68,16);g.fillStyle(0x6d6670).fillCircle(18,28,14).fillCircle(38,22,18).fillCircle(56,30,12);});
  make(scene,'torch',28,60,g=>{g.fillStyle(0x4a2b1c).fillRect(11,22,6,35);g.fillStyle(0xff9a24).fillTriangle(14,0,3,28,25,28);g.fillStyle(0xffe17a).fillTriangle(14,8,8,28,20,28);});
  make(scene,'sanctuary-door',128,52,g=>{g.fillStyle(0x32243c).fillRoundedRect(0,0,128,52,8);g.lineStyle(4,0xb99055).strokeRoundedRect(4,4,120,44,8);});
  make(scene,'player',52,58,g=>{g.fillStyle(0x101018,.35).fillEllipse(26,49,42,14);g.fillStyle(0x4cc7ff).fillCircle(26,22,18);g.fillStyle(0xf6f0d8).fillCircle(26,16,8);g.fillStyle(0xffd166).fillRect(38,24,8,22);});
  make(scene,'enemy-normal',48,52,g=>{g.fillStyle(0x121014,.35).fillEllipse(24,45,40,12);g.fillStyle(0xc45b5b).fillCircle(24,24,17);g.fillStyle(0xffd0d0).fillCircle(18,20,3).fillCircle(30,20,3);});
  make(scene,'enemy-heavy',70,68,g=>{g.fillStyle(0x121014,.35).fillEllipse(35,58,58,16);g.fillStyle(0x7a3b8f).fillRoundedRect(12,12,46,42,12);g.fillStyle(0xffd0ff).fillCircle(27,28,4).fillCircle(43,28,4);});
  make(scene,'impact-particle',12,12,g=>{g.fillStyle(0xfff1a8).fillCircle(6,6,5);});
  make(scene,'skill-ring',220,220,g=>{g.lineStyle(8,0x77ddff,.9).strokeCircle(110,110,96);g.lineStyle(3,0xffffff,.75).strokeCircle(110,110,70);});
  make(scene,'soft-shadow',80,28,g=>{g.fillStyle(0x000000,.28).fillEllipse(40,14,78,24);});
}
