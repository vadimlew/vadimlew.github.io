import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Weapon extends Component {
  constructor({ bulletType = "player_bullet", masks = ["enemy", "wall"], cooldown = 16, speed = 6, damage = 25 } = {}) {
    super(C.WEAPON);
    this.bulletType = bulletType;
    this.masks = masks;
    this.cooldown = cooldown;
    this.speed = speed;
    this.damage = damage;
    this.timer = cooldown;
    this.active = true;
    this.rotation = 0;
  }
}
