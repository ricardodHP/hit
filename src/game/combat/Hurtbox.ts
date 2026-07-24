import type { HurtboxDefinition, Vector2Like } from './combat.types';
export class Hurtbox { constructor(readonly definition: HurtboxDefinition) {} center(owner: Vector2Like): Vector2Like { return { x: owner.x+this.definition.offsetX, y: owner.y+this.definition.offsetY }; } }
