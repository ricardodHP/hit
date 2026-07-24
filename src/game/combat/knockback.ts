import type { Vector2Like } from './combat.types';

export interface KnockbackBody {
  x: number;
  y: number;
  setVelocity(x: number, y: number): void;
}

export interface KnockbackBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export const resolveKnockbackVelocity = (
  target: Vector2Like,
  source: Vector2Like,
  power: number,
  resistance = 1,
): Vector2Like => {
  if (power <= 0) return { x: 0, y: 0 };
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: (dx / len) * power * resistance, y: (dy / len) * power * resistance };
};

export const resolveKnockbackPosition = (
  start: Vector2Like,
  velocity: Vector2Like,
  deltaSeconds: number,
  bounds: KnockbackBounds,
): Vector2Like => ({
  x: Math.min(bounds.right, Math.max(bounds.left, start.x + velocity.x * deltaSeconds)),
  y: Math.min(bounds.bottom, Math.max(bounds.top, start.y + velocity.y * deltaSeconds)),
});

export const applyKnockback = (
  body: KnockbackBody,
  source: Vector2Like,
  power: number,
  resistance = 1,
): Vector2Like => {
  const velocity = resolveKnockbackVelocity(body, source, power, resistance);
  if (power > 0) body.setVelocity(velocity.x, velocity.y);
  return velocity;
};
