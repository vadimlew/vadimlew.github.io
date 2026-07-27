import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class EnemyAI extends Component {
  constructor({ kind = "crab", seekRadius = 160, speed = 0.22, shootCooldown = 55 } = {}) {
    super(C.ENEMY);
    this.kind = kind;
    this.seekRadius = seekRadius;
    this.speed = speed;
    this.shootCooldown = shootCooldown;
    this.shootTimer = 0;
    this.active = false;
  }
}
