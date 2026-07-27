import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Bullet extends Component {
  constructor({ vx = 0, vy = 0, damage = 20, ownerTag = "player" } = {}) {
    super(C.BULLET);
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.ownerTag = ownerTag;
  }
}
