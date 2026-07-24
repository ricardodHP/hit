import type { AttackDefinition } from '../combat/combat.types';
import type { SkillDefinition } from '../skills/SkillDefinition';
import type { CharacterDefinition } from './character.types';
export class CharacterRegistry { private defs=new Map<string,CharacterDefinition>(); constructor(private defaultId:string){}
 register(def:CharacterDefinition, attacks:AttackDefinition[], skills:SkillDefinition[]):void{ if(this.defs.has(def.id)) throw new Error(`Duplicate character id: ${def.id}`); const attackIds=new Set(attacks.map(a=>a.id)); const skillIds=new Set(skills.map(s=>s.id)); for(const id of [...def.basicCombo,...Object.values(def.contextualAttackIds)]) if(id && !attackIds.has(id)) throw new Error(`Character ${def.id} references missing attack ${id}`); for(const id of def.equippedSkillIds) if(!skillIds.has(id)) throw new Error(`Character ${def.id} references missing skill ${id}`); if(def.equippedSkillIds.length!==3) throw new Error(`Character ${def.id} must equip exactly three skills`); this.defs.set(def.id,def); }
 get(id:string):CharacterDefinition{ const def=this.defs.get(id); if(!def) throw new Error(`Unknown character id: ${id}`); return def; }
 list():CharacterDefinition[]{ return [...this.defs.values()]; }
 getDefault():CharacterDefinition{ return this.get(this.defaultId); }
}
