export type Team = 'player' | 'enemy';
export type CombatState = 'idle' | 'moving' | 'attacking' | 'blocking' | 'dodging' | 'countering' | 'stunned' | 'airborne' | 'knockedDown' | 'recovering' | 'dead';
export type AttackPhase = 'idle' | 'startup' | 'active' | 'recovery' | 'complete';
export type CombatStatusType = 'stun' | 'airborne' | 'knockdown';
export type HitboxShape = 'circle' | 'rectangle' | 'arc';
export interface Vector2Like { x: number; y: number }
export interface HitboxDefinition { shape: HitboxShape; offsetX: number; offsetY: number; radius?: number; width?: number; height?: number; arcDegrees?: number }
export interface HurtboxDefinition { width: number; height: number; offsetX: number; offsetY: number }
export interface StatusApplication { type: CombatStatusType; durationMs: number; power?: number }
export interface AttackMovementDefinition { distance: number; durationMs: number }
export interface InterruptRule { state: CombatState; allowedFromPhase?: AttackPhase[] }
export interface AttackDefinition { id: string; name: string; startupMs: number; activeMs: number; recoveryMs: number; damage: number; hitbox: HitboxDefinition; knockback: number; hitStopMs: number; movement?: AttackMovementDefinition; canTurnDuringStartup?: boolean; canDodgeCancelRecovery?: boolean; unblockable?: boolean; multiHit?: boolean; superArmorDuringActive?: boolean; telegraphMs?: number; appliesStatus?: StatusApplication[]; nextAttackId?: string; comboWindowStartMs?: number; comboWindowEndMs?: number; interruptRules?: InterruptRule[] }
export interface CombatRuntime { id: string; team: Team; health: number; maxHealth: number; guard: number; facing: Vector2Like; position: Vector2Like; state: CombatState; invulnerableMs: number; superArmorMs: number; airHeight: number; verticalVelocity: number; resistance: { knockback: number; stun: number; airborne: number; knockdown: number } }
export interface HitEvent { attackerId: string; targetId: string; attackId: string; damage: number; blocked: boolean; perfectBlocked: boolean; critical: boolean; statusApplied?: CombatStatusType }
