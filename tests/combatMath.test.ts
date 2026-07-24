import { describe, expect, it } from 'vitest';
import { ENEMY } from '../src/game/constants/game.constants';
import { clampHealth, incrementCombo, nextEnemyState, resetCombo, scoreForHit, tickCooldown } from '../src/game/logic/combatMath';

describe('pure combat math', () => {
  it('reduces health without going negative', () => { expect(clampHealth(10, 30)).toBe(0); expect(clampHealth(10, 3)).toBe(7); });
  it('ticks cooldown without going below zero', () => { expect(tickCooldown(120, 200)).toBe(0); });
  it('increments and resets combo', () => { expect(incrementCombo(2)).toBe(3); expect(resetCombo()).toBe(0); });
  it('calculates score with combo bonus', () => { expect(scoreForHit(100, 4)).toBe(145); });
  it('keeps normal and heavy enemy config distinct', () => { const normal=ENEMY.normal; const heavy=ENEMY.heavy; expect(heavy.maxHealth).toBeGreaterThan(normal.maxHealth); expect(heavy.speed).toBeLessThan(normal.speed); });
  it('transitions basic enemy AI states', () => { expect(nextEnemyState('Idle', 40, 50, true, true)).toBe('Attack'); expect(nextEnemyState('Idle', 220, 50, false, true)).toBe('Chase'); expect(nextEnemyState('Chase', 700, 50, false, true)).toBe('Idle'); expect(nextEnemyState('Chase', 1, 50, true, false)).toBe('Dead'); });
});
