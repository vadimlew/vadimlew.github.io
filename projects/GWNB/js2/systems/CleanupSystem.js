import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class CleanupSystem extends System {
  update() {
    for (const entity of this.world.entities) {
      if (entity.alive) continue;
      if (!entity.has(C.DISPLAY)) continue;
      const sprite = entity.get(C.DISPLAY).sprite;
      if (sprite && sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
      sprite.destroy({ children: true });
    }
  }
}
