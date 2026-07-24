export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const ARENA = { left: 96, right: 1184, top: 72, bottom: 648, doorX: 640, doorY: 92 } as const;
export const PLAYER = { maxHealth: 120, speed: 245, attackCooldown: 320, skillCooldown: 2200, dodgeCooldown: 900, dodgeDuration: 170, dodgeSpeed: 590, invulnerabilityMs: 260, attackDamage: 22, skillDamage: 48, attackRange: 92, skillRadius: 132, knockback: 210, skillKnockback: 360 } as const;
export const ENEMY = { normal: { key: 'enemy-normal', maxHealth: 58, speed: 112, damage: 13, attackRange: 48, attackCooldown: 1150, knockbackResistance: 0.9, score: 100, scale: 1 }, heavy: { key: 'enemy-heavy', maxHealth: 118, speed: 72, damage: 24, attackRange: 58, attackCooldown: 1550, knockbackResistance: 0.45, score: 230, scale: 1.25 } } as const;
export const DEPTHS = { floor: 0, shadow: 1, prop: 4, actor: 8, fx: 20 } as const;
