export class BootScene extends Phaser.Scene { constructor(){super('BootScene');} create(): void { this.registry.set('arenaName','Ruins of Asteria'); this.scene.start('PreloadScene'); } }
