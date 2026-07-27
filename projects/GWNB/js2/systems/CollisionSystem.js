import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";
import { aabbIntersect, solveAabb } from "../utils/Collision.js";

function makeBounds(entity) {
  const tr = entity.get(C.TRANSFORM);
  const col = entity.get(C.COLLIDER);
  return {
    x: tr.x + col.localX,
    y: tr.y + col.localY - tr.z,
    width: col.width,
    height: col.height
  };
}

export class CollisionSystem extends System {
  update() {
    const entities = this.world.query([C.TRANSFORM, C.COLLIDER]);

    for (const entity of entities) {
      entity.get(C.COLLIDER).touching.clear();
    }

    for (let i = 0; i < entities.length; i += 1) {
      for (let k = i + 1; k < entities.length; k += 1) {
        const a = entities[i];
        const b = entities[k];

        const colA = a.get(C.COLLIDER);
        const colB = b.get(C.COLLIDER);

        const allowsA = colA.masks.length === 0 || colA.masks.includes(colB.type);
        const allowsB = colB.masks.length === 0 || colB.masks.includes(colA.type);
        if (!allowsA && !allowsB) continue;

        const ba = makeBounds(a);
        const bb = makeBounds(b);

        if (!aabbIntersect(ba, bb)) continue;

        colA.touching.add(b.id);
        colB.touching.add(a.id);
        this.world.events.emit("collision", { a, b, colA, colB });

        const hasBodyA = a.has(C.BODY);
        const hasBodyB = b.has(C.BODY);
        if (!hasBodyA || !hasBodyB) continue;

        const bodyA = a.get(C.BODY);
        const bodyB = b.get(C.BODY);
        if (bodyA.staticBody && bodyB.staticBody) continue;

        const trA = a.get(C.TRANSFORM);
        const trB = b.get(C.TRANSFORM);
        const resolve = solveAabb(ba, bb);

        if (bodyA.staticBody) {
          trB.x += resolve.x;
          trB.y += resolve.y;
          continue;
        }

        if (bodyB.staticBody) {
          trA.x -= resolve.x;
          trA.y -= resolve.y;
          continue;
        }

        const sum = bodyA.mass + bodyB.mass;
        const ratioA = bodyA.mass / sum;
        const ratioB = bodyB.mass / sum;

        trA.x -= resolve.x * ratioB;
        trA.y -= resolve.y * ratioB;
        trB.x += resolve.x * ratioA;
        trB.y += resolve.y * ratioA;
      }
    }
  }
}
