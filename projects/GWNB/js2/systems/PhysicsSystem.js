import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class PhysicsSystem extends System {
  update(dt) {
    const entities = this.world.query([C.TRANSFORM, C.BODY]);
    for (const entity of entities) {
      const tr = entity.get(C.TRANSFORM);
      const body = entity.get(C.BODY);

      if (body.staticBody) continue;

      if (body.prevX === null) {
        body.prevX = tr.x;
        body.prevY = tr.y;
        body.prevZ = tr.z;
      }

      body.vx = (tr.x - body.prevX) * body.friction;
      body.vy = (tr.y - body.prevY) * body.friction;

      body.prevX = tr.x;
      body.prevY = tr.y;

      tr.x += body.vx * dt;
      tr.y += body.vy * dt;

      if (body.gravity && tr.z > body.floor) {
        tr.z -= body.gravity * dt;
        body.vz = tr.z - body.prevZ;
        body.prevZ = tr.z;
        tr.z += body.vz * dt;
        if (tr.z < body.floor) tr.z = body.floor;
      }
    }
  }
}
