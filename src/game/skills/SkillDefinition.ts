import type { AttackDefinition } from '../combat/combat.types';
export interface SkillDefinition extends AttackDefinition { characterId:string; displayName:string; description:string; cooldownMs:number; momentumGain?:number; visualEffectId:string; damageMultiplier?:number }
