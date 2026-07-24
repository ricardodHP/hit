import { describe, expect, it } from 'vitest';
import { KAEL_DEFINITION, KAEL_SKILLS } from '../src/game/characters/kael';
import { getKaelVisualPose } from '../src/game/characters/kael/KaelVisualController';
import { SkillController } from '../src/game/skills/SkillController';
import { SkillLoadout } from '../src/game/skills/SkillLoadout';
import { computeCharacterSelectLayout } from '../src/game/ui/characterSelectLayout';
const makeSkills = () => new SkillController(new SkillLoadout(KAEL_DEFINITION.equippedSkillIds, KAEL_SKILLS));

describe('stage 3.1 central skill finalization', () => {
  it('completed skill returns through a single idempotent cleanup path and keeps cooldown', () => { const s=makeSkills(); let transitions=0; s.configureCleanup({ transition: state => { transitions += state === 'recovering' ? 1 : 0; } }); const skill=s.tryStart(0); expect(skill?.id).toBe('kael-rising-tempest'); s.update(skill!.startupMs+skill!.activeMs+skill!.recoveryMs+1); expect(s.activeSkillId).toBe(null); expect(s.attack.phase).toBe('idle'); expect(s.diagnostics().hitboxesActive).toBe(0); expect(s.cooldowns.get(skill!.id)).toBeGreaterThan(0); s.finishSkill('completed'); expect(transitions).toBe(1); });
  it('skill without impacts ends idle-clean with movement and input enabled', () => { const s=makeSkills(); s.tryStart(0); s.finishSkill('completed'); expect(s.diagnostics().inputEnabled).toBe(true); expect(s.diagnostics().movementEnabled).toBe(true); expect(s.attack.canHit('enemy')).toBe(false); });
  it('interruption clears active ids, attacks, hitboxes, timers, armor, modifiers, and pending resources', () => { const s=makeSkills(); let timerRemoved=0; let tweenStopped=0; let armorCleaned=0; s.configureCleanup({ clearSuperArmor:()=>armorCleaned++, clearSpeedModifiers:()=>undefined }); s.tryStart(1); s.registerHitbox({}); s.registerTimer({ remove:()=>timerRemoved++ }); s.registerTween({ stop:()=>tweenStopped++ }); s.pushSpeedModifier(.5); s.finishSkill('interrupted'); expect(s.activeSkillId).toBe(null); expect(s.attack.current).toBe(undefined); expect(s.attack.phase).toBe('idle'); expect(s.diagnostics().timersActive).toBe(0); expect(s.diagnostics().hitboxesActive).toBe(0); expect(timerRemoved).toBe(1); expect(tweenStopped).toBe(1); expect(armorCleaned).toBe(1); });
  it('death cancellation remains dead and does not re-enable input', () => { const s=makeSkills(); let transitioned=false; s.configureCleanup({ getActorState:()=> 'dead', transition:()=>{ transitioned=true; } }); s.tryStart(2); s.finishSkill('death'); expect(s.diagnostics().inputEnabled).toBe(false); expect(transitioned).toBe(false); });
  it('scene reset cleans resources without transitioning destroyed instances', () => { const s=makeSkills(); let transitioned=false; s.configureCleanup({ getActorState:()=> 'destroyed', transition:()=>{ transitioned=true; } }); s.tryStart(1); s.finishSkill('scene-reset'); expect(s.activeSkillId).toBe(null); expect(transitioned).toBe(false); });
});

describe('stage 3.1 Kael skill edge cases', () => {
  it('all three skill slots complete all phases without target dependency', () => { for (const slot of [0,1,2]) { const s=makeSkills(); const skill=s.tryStart(slot)!; s.update(skill.startupMs); expect(s.attack.phase === 'startup' || s.attack.phase === 'active').toBe(true); s.update(skill.activeMs); s.update(skill.recoveryMs+1); expect(s.activeSkillId).toBe(null); expect(s.attack.phase).toBe('idle'); } });
  it('phantom rush collision at every dash finalizes instead of waiting', () => { for (const _dash of [1,2,3]) { const s=makeSkills(); s.tryStart(1); s.finishSkill('collision'); expect(s.activeSkillId).toBe(null); expect(s.diagnostics().movementEnabled).toBe(true); } });
  it('blade cyclone repeated cleanup does not accumulate speed reductions', () => { const s=makeSkills(); s.tryStart(2); s.pushSpeedModifier(.65); s.finishSkill('completed'); s.tryStart(2); expect(s.tryStart(2)).toBe(undefined); s.finishSkill('completed'); expect(s.diagnostics().hitboxesActive).toBe(0); });
});

describe('stage 3.1 dual-wield pose logic', () => {
  it('idle has two distinct weapons with valid transforms', () => { const p=getKaelVisualPose('idle'); expect(Number.isFinite(p.leftSwordAngle)).toBe(true); expect(Number.isFinite(p.rightSwordAngle)).toBe(true); expect(p.leftSwordOffset.x === p.rightSwordOffset.x && p.leftSwordOffset.y === p.rightSwordOffset.y).toBe(false); });
  it('combo alternates right, left, then both weapons', () => { expect(getKaelVisualPose('kael-twin-slash-1').leadWeapon).toBe('right'); expect(getKaelVisualPose('kael-twin-slash-2').leadWeapon).toBe('left'); expect(getKaelVisualPose('kael-cross-cut').leadWeapon).toBe('both'); });
  it('block crosses both weapons and skills expose both trails', () => { const b=getKaelVisualPose('block'); expect(Math.abs(b.leftSwordAngle-b.rightSwordAngle)).toBeGreaterThan(.5); for(const id of ['kael-rising-tempest','kael-phantom-rush','kael-blade-cyclone']){ const p=getKaelVisualPose(id); expect(p.leftTrail && p.rightTrail).toBe(true); } });
});

describe('stage 3.1 selector layout', () => {
  it('keeps text blocks and start button within tested safe areas', () => { for (const [w,h] of [[1920,1080],[1366,768],[1280,720],[768,1024],[390,844]]) { const l=computeCharacterSelectLayout(w,h,KAEL_SKILLS); expect(l.contentWidth <= l.panel.width).toBe(true); expect(l.skillBlocks.length).toBe(3); expect(l.skillBlocks.every(b=>b.maxWidth===l.contentWidth)).toBe(true); expect(l.startButton.y+l.startButton.height <= h).toBe(true); expect(l.startButton.x >= 0).toBe(true); } });
});
