import { Hitbox } from './Hitbox';
import type { AttackDefinition, CombatRuntime } from './combat.types';
export class HitDetectionSystem { query(attacker: CombatRuntime, attack: AttackDefinition, targets: CombatRuntime[], canHit: (id:string)=>boolean): CombatRuntime[] { const box=new Hitbox(attack,attacker.id,attacker.team); return targets.filter(t=>t.id!==attacker.id && t.team!==attacker.team && t.state!=='dead' && canHit(t.id) && box.contains(attacker.position,attacker.facing,t.position)); } }
