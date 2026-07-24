import { Player } from '../actors/Player';
import { SkillController } from '../skills/SkillController';
import { SkillLoadout } from '../skills/SkillLoadout';
import type { CharacterDefinition } from './character.types';
import type { AttackDefinition } from '../combat/combat.types';
import type { SkillDefinition } from '../skills/SkillDefinition';
import type { CharacterMechanic } from './CharacterMechanic';
export interface CreatedCharacter { player:Player; attacks:AttackDefinition[]; skillController:SkillController; mechanic?:CharacterMechanic }
export class CharacterFactory { constructor(private scene:Phaser.Scene, private mechanics:Record<string,()=>CharacterMechanic>={}){}
 create(def:CharacterDefinition,x:number,y:number,attacks:AttackDefinition[],skills:SkillDefinition[]):CreatedCharacter{ const player=new Player(this.scene,x,y); player.configure(def); const loadout=new SkillLoadout(def.equippedSkillIds,skills); const mechanic=def.mechanicId?this.mechanics[def.mechanicId]?.():undefined; this.scene.events.emit('character:created',{id:def.id}); return {player,attacks,skillController:new SkillController(loadout),mechanic}; }
}
