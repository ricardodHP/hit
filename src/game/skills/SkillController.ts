import { AttackController } from '../combat/AttackController';
import { SkillCooldownSystem } from './SkillCooldownSystem';
import type { SkillDefinition } from './SkillDefinition';
import type { SkillLoadout } from './SkillLoadout';
export class SkillController { readonly attack=new AttackController(); readonly cooldowns=new SkillCooldownSystem(); active?:SkillDefinition; constructor(readonly loadout:SkillLoadout){}
 update(delta:number):void{this.attack.update(delta); this.cooldowns.update(delta); if(this.attack.phase==='complete') this.cancel();}
 tryStart(slot:number,cooldownMultiplier=1):SkillDefinition|undefined{ const skill=this.loadout.get(slot); if(!skill || this.attack.isBusy || !this.cooldowns.ready(skill.id)) return undefined; this.active=skill; this.attack.start(skill); this.cooldowns.start(skill.id,skill.cooldownMs,cooldownMultiplier); return skill; }
 cancel():void{this.attack.reset(); this.active=undefined;} reset():void{this.cancel(); this.cooldowns.reset();}
}
