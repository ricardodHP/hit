interface Tintable { setTintFill(color: number): void }
export class CombatEffects { static flash(target: Tintable): void { target.setTintFill(0xffffff); } }
