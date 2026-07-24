import { KAEL_MOMENTUM } from './kael.constants';
export type MomentumTier='Normal'|'Accelerated'|'Overdrive';
export class KaelMomentumSystem { readonly id='kael-momentum'; value=0; tier:MomentumTier='Normal'; private sinceHit=0; private wasMax=false; events:string[]=[]; constructor(private emit:(event:string,payload:unknown)=>void=()=>undefined){}
 update(deltaMs:number):void{ this.sinceHit+=deltaMs; if(this.sinceHit>KAEL_MOMENTUM.decayDelayMs) this.add(-KAEL_MOMENTUM.decayPerSecond*deltaMs/1000); }
 gain(amount:number):void{ this.sinceHit=0; this.add(amount); }
 onHit(type:'basic'|'finisher'|'skill'|'perfectBlock'|'counter'|'contextual'):void{ this.gain(KAEL_MOMENTUM[type]); }
 onDamageTaken():void{ this.add(-KAEL_MOMENTUM.damageLoss); } onGuardBreak():void{ this.add(-KAEL_MOMENTUM.guardBreakLoss); } onDeath():void{ this.reset(); }
 reset():void{ this.value=0; this.sinceHit=0; this.wasMax=false; this.setTier(); this.emit('character:momentum-changed',this.snapshot()); }
 getMultipliers(){ return this.tier==='Overdrive'?{movement:1.08,attackSpeed:1.15,cooldown:0.9}:this.tier==='Accelerated'?{movement:1.04,attackSpeed:1.08,cooldown:1}:{movement:1,attackSpeed:1,cooldown:1}; }
 snapshot(){return {value:this.value,tier:this.tier,decayInMs:Math.max(0,KAEL_MOMENTUM.decayDelayMs-this.sinceHit),...this.getMultipliers()};}
 private add(amount:number):void{ const before=this.value; this.value=Math.max(0,Math.min(KAEL_MOMENTUM.max,this.value+amount)); const old=this.tier; this.setTier(); if(before!==this.value) this.emit('character:momentum-changed',this.snapshot()); if(old!==this.tier)this.emit('character:momentum-tier-changed',this.snapshot()); if(this.value>=100 && !this.wasMax){this.wasMax=true; this.events.push('max'); this.emit('character:momentum-max',this.snapshot());} if(this.value<100)this.wasMax=false; }
 private setTier():void{ this.tier=this.value>=80?'Overdrive':this.value>=40?'Accelerated':'Normal'; }
}
