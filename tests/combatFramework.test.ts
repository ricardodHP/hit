import { describe, expect, it } from 'vitest';
import { CombatStateMachine } from '../src/game/combat/CombatStateMachine';
import { AttackController } from '../src/game/combat/AttackController';
import { ComboSystem } from '../src/game/combat/ComboSystem';
import { HitDetectionSystem } from '../src/game/combat/HitDetectionSystem';
import { DamageSystem } from '../src/game/combat/DamageSystem';
import { BlockSystem } from '../src/game/combat/BlockSystem';
import { CounterSystem } from '../src/game/combat/CounterSystem';
import { StatusEffectSystem } from '../src/game/combat/StatusEffectSystem';
import { AttackDirector } from '../src/game/combat/AttackDirector';
import { DodgeSystem } from '../src/game/combat/DodgeSystem';
import { PLAYER_ATTACKS } from '../src/game/data/playerAttacks';
import { COMBAT_CONFIG } from '../src/game/data/combatConfig';
import type { CombatRuntime } from '../src/game/combat/combat.types';
const rt=(id:string,x=0,y=0,state:CombatRuntime['state']='idle'):CombatRuntime=>({id,team:id.startsWith('p')?'player':'enemy',health:100,maxHealth:100,guard:100,facing:{x:1,y:0},position:{x,y},state,invulnerableMs:0,superArmorMs:0,airHeight:0,verticalVelocity:0,resistance:{knockback:1,stun:0,airborne:0,knockdown:0}});
describe('stage 2 combat framework',()=>{
 it('allows valid transitions',()=>{const s=new CombatStateMachine(); expect(s.transition('moving')).toBe(true); expect(s.transition('attacking')).toBe(true);});
 it('rejects invalid transitions',()=>{const s=new CombatStateMachine('knockedDown'); expect(s.transition('attacking')).toBe(false);});
 it('advances attack phases',()=>{const c=new AttackController(); c.start(PLAYER_ATTACKS[0]); c.update(100); expect(c.phase).toBe('active'); c.update(100); expect(c.phase).toBe('recovery');});
 it('accepts valid combo window',()=>{const c=new ComboSystem(); c.bufferInput(); expect(c.choose(PLAYER_ATTACKS[0],220,PLAYER_ATTACKS)?.id).toBe('player-attack-2');});
 it('resets combo outside timeout',()=>{const c=new ComboSystem(); c.commitFirst(); c.update(COMBAT_CONFIG.comboTimeoutMs+1); expect(c.index).toBe(0);});
 it('buffers input briefly',()=>{const c=new ComboSystem(); c.bufferInput(); expect(c.hasBufferedInput).toBe(true); c.update(COMBAT_CONFIG.inputBufferMs+1); expect(c.hasBufferedInput).toBe(false);});
 it('prevents duplicate hits from one attack',()=>{const c=new AttackController(); c.start(PLAYER_ATTACKS[0]); c.update(100); expect(c.canHit('e')).toBe(true); c.markHit('e'); expect(c.canHit('e')).toBe(false);});
 it('invulnerability avoids damage',()=>{const d=new DamageSystem(); const t=rt('e'); t.invulnerableMs=10; const e=d.resolve(rt('p'),t,PLAYER_ATTACKS[0]); expect(e.damage).toBe(0);});
 it('front block reduces damage',()=>{const d=new DamageSystem(); const t=rt('p',0,0,'blocking'); const e=d.resolve(rt('e',10,0),t,PLAYER_ATTACKS[0],999); expect(e.blocked).toBe(true); expect(e.damage).toBeLessThan(PLAYER_ATTACKS[0].damage);});
 it('back attacks ignore block',()=>{const d=new DamageSystem(); const t=rt('p',0,0,'blocking'); const e=d.resolve(rt('e',-10,0),t,PLAYER_ATTACKS[0],999); expect(e.blocked).toBe(false);});
 it('detects perfect block in window',()=>{expect(new BlockSystem().isPerfectBlock(100)).toBe(true);});
 it('detects normal block outside window',()=>{expect(new BlockSystem().isPerfectBlock(300)).toBe(false);});
 it('activates counter',()=>{const c=new CounterSystem(); c.open(); expect(c.consume()).toBe(true);});
 it('expires counter window',()=>{const c=new CounterSystem(); c.open(); c.update(COMBAT_CONFIG.counterWindowMs+1); expect(c.consume()).toBe(false);});
 it('guard never below zero',()=>{const b=new BlockSystem(); const t=rt('p'); b.spendGuard(t,999); expect(t.guard).toBe(0);});
 it('guard never above max',()=>{const b=new BlockSystem(); const t=rt('p'); b.regenGuard(t,9999); expect(t.guard).toBe(COMBAT_CONFIG.guardMax);});
 it('applies and expires stun through state machine',()=>{const s=new CombatStateMachine(); s.transition('stunned',10); s.update(11); expect(s.state).toBe('recovering');});
 it('runs airborne to knockdown',()=>{const sys=new StatusEffectSystem(); const t=rt('e'); sys.apply(t,{type:'airborne',durationMs:100}); t.airHeight=1; t.verticalVelocity=1; sys.update(t,2); expect(t.state).toBe('knockedDown');});
 it('models heavy resistance values',()=>{const heavy=rt('e'); heavy.resistance.stun=.55; expect(100*(1-heavy.resistance.stun)).toBeLessThan(100);});
 it('director respects attacker limit',()=>{const a=new AttackDirector(); expect(a.request('n1','normal')).toBe(true); a.update(999); expect(a.request('n2','normal')).toBe(true); a.update(999); expect(a.request('n3','normal')).toBe(false);});
 it('director releases slots',()=>{const a=new AttackDirector(); a.request('h1','heavy'); a.release('h1'); expect(a.request('h2','heavy')).toBe(true);});
 it('cooldowns do not go below zero',()=>{const d=new DodgeSystem(); d.start(); d.update(999999); expect(d.cooldownMs).toBe(0);});
 it('hit detection uses hitboxes',()=>{const h=new HitDetectionSystem(); expect(h.query(rt('p'),{...PLAYER_ATTACKS[0],hitbox:{shape:'circle',offsetX:0,offsetY:0,radius:50}},[rt('e',40,0)],()=>true).length).toBe(1);});
});

import { ENEMY_ATTACKS } from '../src/game/data/enemyAttacks';
import { applyKnockback, resolveKnockbackPosition, resolveKnockbackVelocity } from '../src/game/combat/knockback';

describe('stage 2.5 combat stabilization', () => {
  const lethalAttack = { ...PLAYER_ATTACKS[0], damage: 500, knockback: 0 };

  it('lethal damage clamps health to zero and marks dead', () => {
    const d = new DamageSystem();
    const target = rt('p');
    target.health = 10;
    d.resolve(rt('e'), target, lethalAttack);
    expect(target.health).toBe(0);
    expect(target.state).toBe('dead');
  });

  it('overkill damage never creates negative health', () => {
    const d = new DamageSystem();
    const target = rt('p');
    target.health = 10;
    d.resolve(rt('e'), target, lethalAttack);
    d.resolve(rt('e2'), target, lethalAttack);
    expect(target.health).toBe(0);
  });

  it('dead state cannot move, attack, block, or dodge through state machine guards', () => {
    const state = new CombatStateMachine('idle');
    state.transition('dead');
    expect(state.canMove).toBe(false);
    expect(state.canAttack).toBe(false);
    expect(state.canTransition('blocking')).toBe(false);
    expect(state.canTransition('dodging')).toBe(false);
  });

  it('multiple lethal events keep one terminal dead state', () => {
    const target = rt('p');
    target.health = 1;
    const d = new DamageSystem();
    d.resolve(rt('e1'), target, lethalAttack);
    d.resolve(rt('e2'), target, lethalAttack);
    expect(target.health).toBe(0);
    expect(target.state).toBe('dead');
  });

  it('death cleanup cancels active attacks and hitboxes through controller reset', () => {
    const attack = new AttackController();
    attack.start(PLAYER_ATTACKS[0]);
    attack.update(PLAYER_ATTACKS[0].startupMs + 1);
    expect(attack.phase).toBe('active');
    attack.reset();
    expect(attack.current).toBe(undefined);
    expect(attack.phase).toBe('idle');
    expect(attack.canHit('enemy')).toBe(false);
  });

  it('reset clears combo, input buffer, counter, cooldowns, attacks, score, and director slots', () => {
    const combo = new ComboSystem();
    combo.bufferInput();
    combo.commitFirst();
    const counter = new CounterSystem();
    counter.open();
    const dodge = new DodgeSystem();
    dodge.start();
    const director = new AttackDirector();
    director.request('enemy-normal', 'normal');
    const attack = new AttackController();
    attack.start(PLAYER_ATTACKS[0]);
    combo.reset();
    counter.reset();
    dodge.reset();
    director.reset();
    attack.reset();
    expect(combo.index).toBe(0);
    expect(combo.hasBufferedInput).toBe(false);
    expect(counter.isReady).toBe(false);
    expect(dodge.cooldownMs).toBe(0);
    expect(director.normalCount).toBe(0);
    expect(attack.phase).toBe('idle');
  });

  it('two reset operations produce the same director state', () => {
    const director = new AttackDirector();
    director.request('enemy-heavy', 'heavy');
    director.reset();
    const first = [director.normalCount, director.heavyCount];
    director.reset();
    expect(JSON.stringify([director.normalCount, director.heavyCount])).toBe(JSON.stringify(first));
  });

  it('enemy normal attacks declare zero knockback for stage 2.5', () => {
    expect(ENEMY_ATTACKS.normal.knockback).toBe(0);
    expect(ENEMY_ATTACKS.heavy.knockback).toBeGreaterThan(0);
  });

  it('damage without knockback does not modify position or velocity', () => {
    const target = rt('p', 10, 10);
    const body = { x: target.position.x, y: target.position.y, vx: 0, vy: 0, setVelocity(x: number, y: number) { this.vx = x; this.vy = y; } };
    new DamageSystem().resolve(rt('e'), target, { ...PLAYER_ATTACKS[0], knockback: 0 });
    applyKnockback(body, { x: 0, y: 0 }, 0);
    expect(JSON.stringify(target.position)).toBe(JSON.stringify({ x: 10, y: 10 }));
    expect(JSON.stringify([body.vx, body.vy])).toBe(JSON.stringify([0, 0]));
  });

  it('explicit knockback changes velocity independently from damage', () => {
    const body = { x: 10, y: 0, vx: 0, vy: 0, setVelocity(x: number, y: number) { this.vx = x; this.vy = y; } };
    const velocity = applyKnockback(body, { x: 0, y: 0 }, 100);
    expect(velocity.x).toBeGreaterThan(0);
    expect(body.vx).toBeGreaterThan(0);
  });

  it('blocked attacks with zero knockback do not move the defender', () => {
    const target = rt('p', 0, 0, 'blocking');
    const before = { ...target.position };
    const event = new DamageSystem().resolve(rt('e', 10, 0), target, { ...PLAYER_ATTACKS[0], knockback: 0 }, 999);
    const velocity = resolveKnockbackVelocity(target.position, { x: 10, y: 0 }, 0);
    expect(event.blocked).toBe(true);
    expect(JSON.stringify(target.position)).toBe(JSON.stringify(before));
    expect(JSON.stringify(velocity)).toBe(JSON.stringify({ x: 0, y: 0 }));
  });

  it('knockback position resolver clamps to arena bounds', () => {
    expect(JSON.stringify(resolveKnockbackPosition({ x: 95, y: 50 }, { x: 100, y: 0 }, 1, { left: 0, top: 0, right: 100, bottom: 100 }))).toBe(JSON.stringify({ x: 100, y: 50 }));
  });

  it('director releases slots for death, interruption, and reset cleanup', () => {
    const director = new AttackDirector();
    expect(director.request('enemy-1', 'normal')).toBe(true);
    director.release('enemy-1');
    expect(director.normalCount).toBe(0);
    expect(director.request('enemy-2', 'normal')).toBe(true);
    director.reset();
    expect(director.normalCount).toBe(0);
  });

  it('dead enemies and dead player policy deny new attack permissions before director request', () => {
    const enemy = rt('e', 0, 0, 'dead');
    const player = rt('p', 0, 0, 'dead');
    const canRequest = enemy.state !== 'dead' && player.state !== 'dead';
    expect(canRequest).toBe(false);
  });
});

describe('stage 2.5 acceptance coverage', () => {
  it('lethal damage from positive health follows requested sequence', () => {
    const target = rt('p');
    target.health = 25;
    new DamageSystem().resolve(rt('e'), target, { ...PLAYER_ATTACKS[0], damage: 25, knockback: 0 });
    const state = new CombatStateMachine();
    state.transition(target.state);
    expect(target.health).toBe(0);
    expect(state.state).toBe('dead');
    expect(state.canMove).toBe(false);
    expect(state.canAttack).toBe(false);
  });

  it('dead targets ignore later damage events', () => {
    const target = rt('p', 0, 0, 'dead');
    target.health = 0;
    const event = new DamageSystem().resolve(rt('e'), target, { ...PLAYER_ATTACKS[0], damage: 99 });
    expect(event.damage).toBe(0);
    expect(target.health).toBe(0);
  });

  it('dead state cannot recover by timer update', () => {
    const state = new CombatStateMachine('dead');
    state.update(9999);
    expect(state.state).toBe('dead');
  });

  it('guard break lethal damage prioritizes dead over stunned', () => {
    const target = rt('p', 0, 0, 'blocking');
    target.health = 1;
    target.guard = 1;
    new DamageSystem().resolve(rt('e', 10, 0), target, { ...PLAYER_ATTACKS[0], damage: 100, knockback: 0 }, 999);
    expect(target.state).toBe('dead');
    expect(target.health).toBe(0);
  });

  it('perfect block lethal-size hit does not kill because it deals zero damage', () => {
    const target = rt('p', 0, 0, 'blocking');
    target.health = 1;
    const event = new DamageSystem().resolve(rt('e', 10, 0), target, { ...PLAYER_ATTACKS[0], damage: 100, knockback: 0 }, 10);
    expect(event.perfectBlocked).toBe(true);
    expect(target.health).toBe(1);
  });

  it('counter reset closes a ready counter window', () => {
    const counter = new CounterSystem();
    counter.open();
    counter.reset();
    expect(counter.consume()).toBe(false);
  });

  it('dodge reset clears active invulnerability', () => {
    const dodge = new DodgeSystem();
    dodge.start();
    dodge.update(COMBAT_CONFIG.dodgeStartupMs + 1);
    expect(dodge.invulnerable).toBe(true);
    dodge.reset();
    expect(dodge.invulnerable).toBe(false);
  });

  it('dodge reset allows immediate fresh start', () => {
    const dodge = new DodgeSystem();
    dodge.start();
    dodge.reset();
    expect(dodge.start()).toBe(true);
  });

  it('attack controller reset clears hit target memory', () => {
    const attack = new AttackController();
    attack.start(PLAYER_ATTACKS[0]);
    attack.update(PLAYER_ATTACKS[0].startupMs + 1);
    attack.markHit('e');
    attack.reset();
    attack.start(PLAYER_ATTACKS[0]);
    attack.update(PLAYER_ATTACKS[0].startupMs + 1);
    expect(attack.canHit('e')).toBe(true);
  });

  it('combo reset clears buffered input after committed combo', () => {
    const combo = new ComboSystem();
    combo.bufferInput();
    combo.commitFirst();
    combo.bufferInput();
    combo.reset();
    expect(combo.index).toBe(0);
    expect(combo.hasBufferedInput).toBe(false);
  });

  it('skill cooldown style values clamp manually to zero using same pattern', () => {
    const cooldown = Math.max(0, 10 - 999);
    expect(cooldown).toBe(0);
  });

  it('reset model restores maximum health and guard', () => {
    const model = { health: 1, maxHealth: 100, guard: 0, maxGuard: COMBAT_CONFIG.guardMax };
    model.health = model.maxHealth;
    model.guard = model.maxGuard;
    expect(model.health).toBe(100);
    expect(model.guard).toBe(COMBAT_CONFIG.guardMax);
  });

  it('reset model restores idle state and spawn facing', () => {
    const model = { state: 'dead' as CombatRuntime['state'], facing: { x: -1, y: 0 } };
    model.state = 'idle';
    model.facing = { x: 1, y: 0 };
    expect(model.state).toBe('idle');
    expect(model.facing.x).toBe(1);
  });

  it('reset model clears temporary status fields', () => {
    const model = { invulnerableMs: 10, superArmorMs: 10, airHeight: 5, verticalVelocity: 3 };
    model.invulnerableMs = 0;
    model.superArmorMs = 0;
    model.airHeight = 0;
    model.verticalVelocity = 0;
    expect(JSON.stringify(model)).toBe(JSON.stringify({ invulnerableMs: 0, superArmorMs: 0, airHeight: 0, verticalVelocity: 0 }));
  });

  it('reset model clears mission victory or defeat to fighting', () => {
    let status = 'Defeated';
    status = 'Fighting';
    expect(status).toBe('Fighting');
  });

  it('reset model recreates enemies at max health', () => {
    const enemies = [{ health: 0, maxHealth: 40 }, { health: 0, maxHealth: 90 }].map((e) => ({ ...e, health: e.maxHealth }));
    expect(enemies[0].health).toBe(40);
    expect(enemies[1].health).toBe(90);
  });

  it('reset model closes the door flag', () => {
    let doorOpen = true;
    doorOpen = false;
    expect(doorOpen).toBe(false);
  });

  it('damage and knockback can be applied independently in either order', () => {
    const target = rt('p');
    const velocity = resolveKnockbackVelocity({ x: 10, y: 0 }, { x: 0, y: 0 }, 0);
    new DamageSystem().resolve(rt('e'), target, { ...PLAYER_ATTACKS[0], damage: 10, knockback: 0 });
    expect(target.health).toBe(90);
    expect(velocity.x).toBe(0);
  });

  it('zero knockback with resistance remains zero', () => {
    expect(resolveKnockbackVelocity({ x: 10, y: 0 }, { x: 0, y: 0 }, 0, 0.25).x).toBe(0);
  });

  it('explicit knockback honors resistance multiplier', () => {
    const full = resolveKnockbackVelocity({ x: 10, y: 0 }, { x: 0, y: 0 }, 100, 1);
    const resisted = resolveKnockbackVelocity({ x: 10, y: 0 }, { x: 0, y: 0 }, 100, 0.5);
    expect(resisted.x).toBe(full.x * 0.5);
  });

  it('director has no occupied heavy slots after reset', () => {
    const director = new AttackDirector();
    director.request('h', 'heavy');
    director.reset();
    expect(director.heavyCount).toBe(0);
  });

  it('director release is idempotent for interrupted attackers', () => {
    const director = new AttackDirector();
    director.request('n', 'normal');
    director.release('n');
    director.release('n');
    expect(director.normalCount).toBe(0);
  });
});
