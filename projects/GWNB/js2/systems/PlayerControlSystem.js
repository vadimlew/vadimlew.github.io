import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class PlayerControlSystem extends System {
  constructor(input, priority = 10) {
    super(priority);
    this.input = input;
  }

  update(dt) {
    const players = this.world.query([C.TRANSFORM, C.PLAYER, C.WEAPON]);
    for (const player of players) {
      const tr = player.get(C.TRANSFORM);
      const ctrl = player.get(C.PLAYER);
      const weapon = player.get(C.WEAPON);

      if (ctrl.jumpTimer > 0) {
        ctrl.jumpTimer -= dt;
        tr.x += ctrl.jumpVector.x * ctrl.jumpSpeed * dt;
        tr.y += ctrl.jumpVector.y * ctrl.jumpSpeed * dt;
      } else {
        let nx = 0;
        let ny = 0;
        if (this.input.keys.left) nx -= 1;
        if (this.input.keys.right) nx += 1;
        if (this.input.keys.up) ny -= 1;
        if (this.input.keys.down) ny += 1;

        const norm = nx !== 0 && ny !== 0 ? 0.7071 : 1;
        tr.x += nx * ctrl.speed * norm * dt;
        tr.y += ny * ctrl.speed * norm * dt;

        if (this.input.mouse.right) {
          const dx = this.input.mouse.x - tr.x;
          const dy = this.input.mouse.y - (tr.y - tr.z);
          const dd = Math.hypot(dx, dy) || 1;
          ctrl.jumpVector.x = dx / dd;
          ctrl.jumpVector.y = dy / dd;
          ctrl.jumpTimer = 18;
          this.input.mouse.right = false;
        }
      }

      const wx = this.input.mouse.x - tr.x;
      const wy = this.input.mouse.y - (tr.y - tr.z);
      weapon.rotation = Math.atan2(wy, wx);

      if (this.input.mouse.left) {
        this.world.events.emit("fire-request", { shooter: player });
      }
    }
  }
}
