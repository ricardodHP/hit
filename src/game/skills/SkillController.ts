import { AttackController } from '../combat/AttackController';
import { SkillCooldownSystem } from './SkillCooldownSystem';
import type { SkillDefinition } from './SkillDefinition';
import type { SkillLoadout } from './SkillLoadout';

export type SkillEndReason = 'completed' | 'interrupted' | 'collision' | 'death' | 'scene-reset' | 'cancelled';
export type SkillActorState = 'idle' | 'moving' | 'attacking' | 'recovering' | 'stunned' | 'knockedDown' | 'airborne' | 'blocking' | 'dodging' | 'countering' | 'dead' | 'destroyed';

export interface SkillCleanupHooks {
  clearHitboxes?: () => void;
  clearTimers?: () => void;
  clearTweens?: () => void;
  clearMovementOverride?: () => void;
  clearRotationOverride?: () => void;
  clearSuperArmor?: () => void;
  clearInvulnerability?: () => void;
  clearSpeedModifiers?: () => void;
  clearVisualState?: () => void;
  clearPendingCallbacks?: () => void;
  setVelocitySafe?: () => void;
  transition?: (state: 'idle' | 'recovering') => void;
  getActorState?: () => SkillActorState;
}

export interface SkillDiagnostics {
  activeSkillId: string | null;
  attackPhase: string;
  timersActive: number;
  tweenActive: boolean;
  hitboxesActive: number;
  inputEnabled: boolean;
  movementEnabled: boolean;
  superArmor: boolean;
  finished: boolean;
  endReason: SkillEndReason | null;
}

export class SkillController {
  readonly attack = new AttackController();
  readonly cooldowns = new SkillCooldownSystem();
  active?: SkillDefinition;
  activeSkillId: string | null = null;
  inputEnabled = true;
  movementEnabled = true;
  private hooks: SkillCleanupHooks = {};
  private timers = new Set<{ remove: (dispatchCallback?: boolean) => void }>();
  private tweens = new Set<{ stop: () => void }>();
  private hitboxes = new Set<unknown>();
  private speedModifierStack: number[] = [];
  private finished = false;
  private endReason: SkillEndReason | null = null;

  constructor(readonly loadout: SkillLoadout) {}

  configureCleanup(hooks: SkillCleanupHooks): void { this.hooks = hooks; }
  registerTimer(timer: { remove: (dispatchCallback?: boolean) => void }): void { this.timers.add(timer); }
  unregisterTimer(timer: { remove: (dispatchCallback?: boolean) => void }): void { this.timers.delete(timer); }
  registerTween(tween: { stop: () => void }): void { this.tweens.add(tween); }
  unregisterTween(tween: { stop: () => void }): void { this.tweens.delete(tween); }
  registerHitbox(hitbox: unknown): void { this.hitboxes.add(hitbox); }
  pushSpeedModifier(multiplier: number): void { this.speedModifierStack.push(multiplier); }

  update(delta: number): void {
    if (!this.active) { this.cooldowns.update(delta); return; }
    this.attack.update(delta);
    this.cooldowns.update(delta);
    if (this.attack.phase === 'complete') this.finishSkill('completed');
  }

  tryStart(slot: number, cooldownMultiplier = 1): SkillDefinition | undefined {
    const skill = this.loadout.get(slot);
    if (!skill || this.attack.isBusy || !this.cooldowns.ready(skill.id) || this.activeSkillId) return undefined;
    this.finished = false;
    this.endReason = null;
    this.active = skill;
    this.activeSkillId = skill.id;
    this.inputEnabled = false;
    this.movementEnabled = false;
    this.attack.start(skill);
    this.cooldowns.start(skill.id, skill.cooldownMs, cooldownMultiplier);
    return skill;
  }

  finishSkill(reason: SkillEndReason): void {
    if (this.finished && !this.activeSkillId) return;
    this.finished = true;
    this.endReason = reason;
    const actorState = this.hooks.getActorState?.() ?? 'idle';
    this.timers.forEach(timer => timer.remove(false));
    this.timers.clear();
    this.tweens.forEach(tween => tween.stop());
    this.tweens.clear();
    this.hitboxes.clear();
    this.hooks.clearHitboxes?.();
    this.hooks.clearTimers?.();
    this.hooks.clearTweens?.();
    this.hooks.clearMovementOverride?.();
    this.hooks.clearRotationOverride?.();
    this.hooks.clearSuperArmor?.();
    this.hooks.clearInvulnerability?.();
    this.hooks.clearSpeedModifiers?.();
    this.hooks.clearVisualState?.();
    this.hooks.clearPendingCallbacks?.();
    this.speedModifierStack = [];
    this.attack.reset();
    this.active = undefined;
    this.activeSkillId = null;
    this.inputEnabled = actorState !== 'dead' && actorState !== 'destroyed';
    this.movementEnabled = this.inputEnabled;
    if (actorState !== 'dead' && actorState !== 'destroyed') this.hooks.setVelocitySafe?.();
    if (actorState === 'dead' || actorState === 'destroyed' || actorState === 'stunned' || actorState === 'knockedDown') return;
    if (reason === 'completed') this.hooks.transition?.('recovering');
    else if (actorState === 'attacking' || actorState === 'recovering') this.hooks.transition?.('idle');
  }

  cancel(reason: SkillEndReason = 'cancelled'): void { this.finishSkill(reason); }
  reset(reason: SkillEndReason = 'scene-reset'): void { this.finishSkill(reason); this.cooldowns.reset(); }
  get activeHitboxCount(): number { return this.hitboxes.size + (this.attack.phase === 'active' ? 1 : 0); }
  diagnostics(): SkillDiagnostics { return { activeSkillId: this.activeSkillId, attackPhase: this.attack.phase, timersActive: this.timers.size, tweenActive: this.tweens.size > 0, hitboxesActive: this.activeHitboxCount, inputEnabled: this.inputEnabled, movementEnabled: this.movementEnabled, superArmor: Boolean(this.active?.superArmorDuringActive), finished: this.finished, endReason: this.endReason }; }
}
