import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Transform extends Component {
  constructor(x = 0, y = 0, z = 0) {
    super(C.TRANSFORM);
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
