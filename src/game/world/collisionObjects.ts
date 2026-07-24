import { ARENA } from '../constants/game.constants';
export const columns = [{x:360,y:250},{x:920,y:250},{x:390,y:505},{x:890,y:505}] as const;
export const rubble = [{x:600,y:250},{x:250,y:415},{x:1030,y:430}] as const;
export const walls = [{x:640,y:50,w:1090,h:42},{x:640,y:670,w:1090,h:42},{x:56,y:360,w:48,h:600},{x:1224,y:360,w:48,h:600}] as const;
export const arenaBounds = ARENA;
