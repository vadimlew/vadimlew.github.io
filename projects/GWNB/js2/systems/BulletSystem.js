import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class BulletSystem extends System {
  constructor(priority = 11) {
    super(priority);
  }

  update(dt) {
    const bullets = this.world.query([C.TRANSFORM, C.BULLET]);
    for (const bulletEntity of bullets) {
      const tr = bulletEntity.get(C.TRANSFORM);
      const bullet = bulletEntity.get(C.BULLET);
      tr.x += bullet.vx * dt;
      tr.y += bullet.vy * dt;
    }
  }
}
