import type { AttackDefinition, CombatStatusType } from '../combat/combat.types';
import type { SkillDefinition } from '../skills/SkillDefinition';
export interface CharacterStats { maxHealth:number; maxGuard:number; movementSpeed:number; attackPower:number; defense:number; guardRegenRate:number; criticalChance:number }
export interface DodgeConfig { speed:number; cooldownMs:number }
export interface BlockConfig { guardMax:number; guardRegenRate:number }
export interface CharacterVisualDefinition { texturePrefix:string; poses: Record<string,string> }
export interface CharacterDefinition { id:string; displayName:string; archetype:string; description:string; baseStats:CharacterStats; basicCombo:string[]; equippedSkillIds:string[]; contextualAttackIds:Partial<Record<CombatStatusType, string>>; dodgeConfig:DodgeConfig; blockConfig:BlockConfig; mechanicId?:string; visualDefinition:CharacterVisualDefinition }
export interface CharacterRuntimeConfig { definition:CharacterDefinition; attacks:AttackDefinition[]; skills:SkillDefinition[] }
