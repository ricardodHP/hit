import type { CharacterDefinition } from './character.types';
export class CharacterController { constructor(readonly definition:CharacterDefinition){} get id():string{return this.definition.id;} }
