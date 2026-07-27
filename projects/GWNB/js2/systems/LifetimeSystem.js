import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class LifetimeSystem extends System {
  update(dt) {
    const entities = this.world.query([C.LIFETIME]);
    for (const entity of entities) {
      const life = entity.get(C.LIFETIME);
      life.frames -= dt;
      if (life.frames <= 0) {
        entity.kill();
      }
    }
  }
}
