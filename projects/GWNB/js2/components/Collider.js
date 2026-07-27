import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Collider extends Component {
  constructor({ x = 0, y = 0, width = 16, height = 16, type = "common", masks = [] } = {}) {
    super(C.COLLIDER);
    this.localX = x;
    this.localY = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.masks = masks;
    this.touching = new Set();
  }
}
