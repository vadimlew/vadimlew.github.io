import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

function shouldHit(target, ownerTag) {
  if (ownerTag === "player") return target.has(C.ENEMY);
  if (ownerTag === "enemy") return target.has(C.PLAYER);
  return false;
}

export class DamageSystem extends System {
  constructor(priority = 30) {
    super(priority);
    this.unsubscribe = null;
  }

  init() {
    this.unsubscribe = this.world.events.on("collision", ({ a, b }) => {
      this.#handlePair(a, b);
      this.#handlePair(b, a);
    });
  }

  #handlePair(src, dst) {
    if (!src.has(C.BULLET)) return;

    const bullet = src.get(C.BULLET);
    if (!shouldHit(dst, bullet.ownerTag)) {
      if (dst.has(C.COLLIDER) && dst.get(C.COLLIDER).type === "wall") src.kill();
      return;
    }

    if (dst.has(C.HEALTH)) {
      const hp = dst.get(C.HEALTH);
      hp.value -= bullet.damage;
      if (hp.value <= 0) {
        dst.kill();
      }
    }

    src.kill();
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
