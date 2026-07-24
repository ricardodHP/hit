export interface KaelVisualPose {
  bodyRotation: number;
  leftArmAngle: number;
  rightArmAngle: number;
  leftSwordAngle: number;
  rightSwordAngle: number;
  leftSwordOffset: { x: number; y: number };
  rightSwordOffset: { x: number; y: number };
  leftTrail: boolean;
  rightTrail: boolean;
  leadWeapon: 'left' | 'right' | 'both';
}

const pose = (p: KaelVisualPose): KaelVisualPose => p;
const DEG = Math.PI / 180;

export function getKaelVisualPose(action: string): KaelVisualPose {
  const base = pose({ bodyRotation: 0, leftArmAngle: -34 * DEG, rightArmAngle: 34 * DEG, leftSwordAngle: -142 * DEG, rightSwordAngle: -38 * DEG, leftSwordOffset: { x: -19, y: 4 }, rightSwordOffset: { x: 19, y: 4 }, leftTrail: false, rightTrail: false, leadWeapon: 'both' });
  const poses: Record<string, KaelVisualPose> = {
    idle: base,
    run: pose({ ...base, leftArmAngle: -48 * DEG, rightArmAngle: 46 * DEG, leftSwordOffset: { x: -21, y: 7 }, rightSwordOffset: { x: 21, y: 1 } }),
    'kael-twin-slash-1': pose({ ...base, rightArmAngle: -14 * DEG, rightSwordAngle: -72 * DEG, rightSwordOffset: { x: 27, y: -3 }, rightTrail: true, leadWeapon: 'right' }),
    'kael-twin-slash-2': pose({ ...base, leftArmAngle: 14 * DEG, leftSwordAngle: -108 * DEG, leftSwordOffset: { x: -27, y: -3 }, leftTrail: true, leadWeapon: 'left' }),
    'kael-cross-cut': pose({ ...base, leftSwordAngle: -52 * DEG, rightSwordAngle: -128 * DEG, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    'kael-rising-fang': pose({ ...base, bodyRotation: -8 * DEG, leftSwordAngle: -78 * DEG, rightSwordAngle: -88 * DEG, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    'kael-falling-edge': pose({ ...base, bodyRotation: 10 * DEG, leftSwordAngle: -116 * DEG, rightSwordAngle: -64 * DEG, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    block: pose({ ...base, leftSwordAngle: -54 * DEG, rightSwordAngle: -126 * DEG, leftSwordOffset: { x: -8, y: -7 }, rightSwordOffset: { x: 8, y: -7 }, leadWeapon: 'both' }),
    counter: pose({ ...base, leftSwordAngle: -42 * DEG, rightSwordAngle: -138 * DEG, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    'kael-rising-tempest': pose({ ...base, leftSwordAngle: -82 * DEG, rightSwordAngle: -112 * DEG, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    'kael-phantom-rush': pose({ ...base, rightSwordOffset: { x: 31, y: -2 }, leftSwordOffset: { x: -25, y: 9 }, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    'kael-blade-cyclone': pose({ ...base, leftSwordAngle: 0, rightSwordAngle: Math.PI, leftTrail: true, rightTrail: true, leadWeapon: 'both' }),
    down: pose({ ...base, bodyRotation: 90 * DEG, leftSwordOffset: { x: -16, y: 12 }, rightSwordOffset: { x: 16, y: 12 }, leadWeapon: 'both' }),
    dead: pose({ ...base, bodyRotation: 90 * DEG, leftSwordOffset: { x: -18, y: 15 }, rightSwordOffset: { x: 18, y: 10 }, leadWeapon: 'both' })
  };
  return poses[action] ?? base;
}

export class KaelVisualController {
  constructor(private scene: Phaser.Scene) {}
  flashMomentum(x: number, y: number): void { const ring = this.scene.add.image(x, y, 'kael-momentum-ring').setDepth(1001).setAlpha(.9); this.scene.tweens.add({ targets: ring, scale: 1.7, alpha: 0, duration: 420, onComplete: () => ring.destroy() }); }
  poseFor(action: string): KaelVisualPose { return getKaelVisualPose(action); }
}
