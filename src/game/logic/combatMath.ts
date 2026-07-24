import type { EnemyState } from '../types/game.types';

export const clampHealth = (current: number, damage: number): number => Math.max(0, current - Math.max(0, damage));
export const tickCooldown = (current: number, deltaMs: number): number => Math.max(0, current - Math.max(0, deltaMs));
export const incrementCombo = (combo: number): number => combo + 1;
export const resetCombo = (): number => 0;
export const scoreForHit = (baseScore: number, combo: number): number => baseScore + Math.max(0, combo - 1) * 15;
export function nextEnemyState(state: EnemyState, distance: number, attackRange: number, canAttack: boolean, isAlive: boolean): EnemyState {
  if (!isAlive) return 'Dead';
  if (state === 'Recover') return 'Recover';
  if (distance <= attackRange && canAttack) return 'Attack';
  if (distance < 460) return 'Chase';
  return 'Idle';
}
