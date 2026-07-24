export type Direction = Phaser.Math.Vector2;
export type EnemyVariant = 'normal' | 'heavy';
export type EnemyState = 'Idle' | 'Chase' | 'Attack' | 'Recover' | 'Dead';
export type ArenaStatus = 'Fighting' | 'Completed' | 'Defeated';
export interface Cooldowns { attack: number; skill: number; dodge: number }
export interface EnemyConfig { key: string; maxHealth: number; speed: number; damage: number; attackRange: number; attackCooldown: number; knockbackResistance: number; score: number; scale: number }
export interface InputState { moveX: number; moveY: number; attack: boolean; skill: boolean; dodge: boolean; restart: boolean }
export interface HudState { health: number; maxHealth: number; enemiesRemaining: number; combo: number; score: number; skillCooldown: number; dodgeCooldown: number; status: ArenaStatus }
