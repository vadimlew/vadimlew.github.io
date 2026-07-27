import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class WeaponSystem extends System {
  constructor(priority = 20) {
    super(priority);
    this.unsubscribe = null;
  }

  init() {
    this.unsubscribe = this.world.events.on("fire-request", ({ shooter }) => {
      if (!shooter || !shooter.alive || !shooter.has(C.WEAPON) || !shooter.has(C.TRANSFORM)) return;
      const weapon = shooter.get(C.WEAPON);
      if (!weapon.active || weapon.timer < weapon.cooldown) return;

      const tr = shooter.get(C.TRANSFORM);
      const cos = Math.cos(weapon.rotation);
      const sin = Math.sin(weapon.rotation);

      weapon.timer = 0;
      this.world.events.emit("spawn-bullet", {
        x: tr.x + cos * 14,
        y: tr.y - tr.z + sin * 14,
        vx: cos * weapon.speed,
        vy: sin * weapon.speed,
        damage: weapon.damage,
        type: weapon.bulletType,
        masks: weapon.masks,
        ownerTag: shooter.has(C.PLAYER) ? "player" : "enemy"
      });
    });
  }

  update(dt) {
    const entities = this.world.query([C.WEAPON]);
    for (const entity of entities) {
      const weapon = entity.get(C.WEAPON);
      weapon.timer += dt;
    }
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
