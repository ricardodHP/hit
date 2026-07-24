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
  make(scene,'player-idle',52,58,g=>{g.fillStyle(0x101018,.35).fillEllipse(26,49,42,14);g.fillStyle(0x3aaed8).fillRoundedRect(16,18,20,28,8);g.fillStyle(0xf6f0d8).fillCircle(26,13,8);g.fillStyle(0xffd166).fillRect(37,24,11,5);});
  make(scene,'player-block',52,58,g=>{g.fillStyle(0x101018,.35).fillEllipse(26,49,42,14);g.fillStyle(0x3aaed8).fillRoundedRect(16,18,20,28,8);g.fillStyle(0xf6f0d8).fillCircle(26,13,8);g.fillStyle(0x8be9fd).fillRoundedRect(35,17,8,30,4);});
  make(scene,'player-attack',64,58,g=>{g.fillStyle(0x101018,.35).fillEllipse(26,49,42,14);g.fillStyle(0x4cc7ff).fillRoundedRect(16,18,20,28,8);g.fillStyle(0xf6f0d8).fillCircle(26,13,8);g.fillStyle(0xffd166).fillTriangle(36,24,62,12,58,20);});
  make(scene,'player-stun',52,58,g=>{g.fillStyle(0x101018,.35).fillEllipse(26,49,42,14);g.fillStyle(0x7dd3ff).fillRoundedRect(16,20,20,26,8);g.fillStyle(0xffff8a).fillCircle(18,8,3).fillCircle(34,8,3);});
  make(scene,'player-down',58,34,g=>{g.fillStyle(0x101018,.35).fillEllipse(29,25,48,12);g.fillStyle(0x3aaed8).fillRoundedRect(12,14,34,12,6);g.fillStyle(0xf6f0d8).fillCircle(48,18,7);});
  for (const suffix of ['idle','attack','stun','down'] as const) make(scene,`enemy-normal-${suffix}`,48,52,g=>{g.fillStyle(0x121014,.35).fillEllipse(24,45,40,12);g.fillStyle(suffix==='stun'?0xe0c15b:0xb95a5a).fillRoundedRect(13,18,22,25,8);g.fillStyle(0xffd0d0).fillCircle(19,17,3).fillCircle(29,17,3); if(suffix==='attack')g.fillStyle(0xffa45b).fillTriangle(31,25,47,18,44,28); if(suffix==='down')g.fillStyle(0x6d3333).fillRoundedRect(8,32,34,9,5);});
  for (const suffix of ['idle','attack','stun','down'] as const) make(scene,`enemy-heavy-${suffix}`,70,68,g=>{g.fillStyle(0x121014,.35).fillEllipse(35,58,58,16);g.fillStyle(suffix==='stun'?0xa89243:0x6f3a83).fillRoundedRect(12,12,46,42,12);g.fillStyle(0xffd0ff).fillCircle(27,28,4).fillCircle(43,28,4); if(suffix==='attack')g.fillStyle(0xff3030).fillRect(52,30,15,8); if(suffix==='down')g.fillStyle(0x482454).fillRoundedRect(10,48,50,10,5);});

  for (const pose of ['idle','run','attack-1','attack-2','cross-cut','rising-fang','falling-edge','block','dodge','counter','stun','airborne','down','dead','skill-1','skill-2','skill-3','context-airborne','context-stun','context-down'] as const) make(scene,`kael-${pose}`,72,66,g=>{g.fillStyle(0x090b12,.35).fillEllipse(34,56,48,14);g.fillStyle(0x264c72).fillRoundedRect(24,20,20,30,8);g.fillStyle(0xf2dfc2).fillCircle(34,14,7);g.lineStyle(4,0xbfe9ff).lineBetween(22,28,pose.includes('attack')||pose.includes('skill')?4:12,pose.includes('rising')?4:44);g.lineStyle(4,0xf7d37a).lineBetween(48,28,pose.includes('cross')||pose.includes('context')?68:58,pose.includes('falling')?10:44); if(pose==='dead'||pose==='down')g.fillStyle(0x264c72).fillRoundedRect(16,44,38,10,5); if(pose==='airborne')g.lineStyle(2,0x8be9fd,.8).strokeCircle(36,26,24); if(pose.includes('skill'))g.lineStyle(3,0x77ddff,.75).strokeCircle(36,34,28);});
  make(scene,'kael-momentum-ring',180,180,g=>{g.lineStyle(7,0x8be9fd,.95).strokeCircle(90,90,72);g.lineStyle(3,0xffd166,.85).strokeCircle(90,90,48);});
  make(scene,'impact-particle',12,12,g=>{g.fillStyle(0xfff1a8).fillCircle(6,6,5);});
  make(scene,'skill-ring',220,220,g=>{g.lineStyle(8,0x77ddff,.9).strokeCircle(110,110,96);g.lineStyle(3,0xffffff,.75).strokeCircle(110,110,70);});
  make(scene,'soft-shadow',80,28,g=>{g.fillStyle(0x000000,.28).fillEllipse(40,14,78,24);});
}
