import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class EnemyAISystem extends System {
  constructor(priority = 15) {
    super(priority);
  }

  update(dt) {
    const player = this.world.query([C.TRANSFORM, C.PLAYER])[0];
    if (!player) return;

    const pTr = player.get(C.TRANSFORM);
    const enemies = this.world.query([C.TRANSFORM, C.ENEMY]);

    for (const enemy of enemies) {
      const tr = enemy.get(C.TRANSFORM);
      const ai = enemy.get(C.ENEMY);

      const dx = pTr.x - tr.x;
      const dy = pTr.y - tr.y;
      const dd = Math.hypot(dx, dy) || 1;
      ai.active = dd < ai.seekRadius;

      if (!ai.active) continue;

      tr.x += (dx / dd) * ai.speed * dt;
      tr.y += (dy / dd) * ai.speed * dt;

      if (enemy.has(C.WEAPON) && ai.kind === "mimic") {
        const weapon = enemy.get(C.WEAPON);
        weapon.rotation = Math.atan2(dy, dx);
        ai.shootTimer += dt;
        if (ai.shootTimer >= ai.shootCooldown) {
          ai.shootTimer = 0;
          this.world.events.emit("fire-request", { shooter: enemy });
        }
      }
    }
  }
}
