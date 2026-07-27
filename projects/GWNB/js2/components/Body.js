import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Body extends Component {
  constructor({ mass = 1, friction = 0.9, staticBody = false, gravity = 0 } = {}) {
    super(C.BODY);
    this.mass = Math.max(0.0001, mass);
    this.friction = friction;
    this.staticBody = staticBody;
    this.gravity = gravity;
    this.floor = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.prevX = null;
    this.prevY = null;
    this.prevZ = null;
  }
}
