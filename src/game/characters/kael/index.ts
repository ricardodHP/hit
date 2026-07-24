import { CharacterRegistry } from '../CharacterRegistry';
import { KAEL_ATTACKS } from './kael.attacks';
import { KAEL_DEFINITION } from './kael.definition';
import { KAEL_SKILLS } from './kael.skills';
export const CHARACTER_ATTACKS=KAEL_ATTACKS;
export const CHARACTER_SKILLS=KAEL_SKILLS;
export const characterRegistry=new CharacterRegistry('kael');
characterRegistry.register(KAEL_DEFINITION,CHARACTER_ATTACKS,CHARACTER_SKILLS);
export { KAEL_DEFINITION, KAEL_ATTACKS, KAEL_SKILLS };
