import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class PlayerController extends Component {
  constructor({ speed = 0.28, jumpSpeed = 1.8 } = {}) {
    super(C.PLAYER);
    this.speed = speed;
    this.jumpSpeed = jumpSpeed;
    this.jumpTimer = 0;
    this.jumpVector = { x: 0, y: 0 };
  }
}
