import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { CombatScene } from '../scenes/CombatScene';
import { GAME_HEIGHT, GAME_WIDTH } from '../constants/game.constants';
export const gameConfig: Phaser.Types.Core.GameConfig = { type: Phaser.AUTO, parent: 'game-container', width: GAME_WIDTH, height: GAME_HEIGHT, backgroundColor: '#15121b', physics: { default: 'arcade', arcade: { debug: false } }, scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }, input: { gamepad: true }, scene: [BootScene, PreloadScene, CombatScene] };
