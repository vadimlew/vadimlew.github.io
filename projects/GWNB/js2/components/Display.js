import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Display extends Component {
  constructor({ sprite = null, layer = "game", sortOffsetY = 0, sortHeight = 0, shadow = null } = {}) {
    super(C.DISPLAY);
    this.sprite = sprite;
    this.layer = layer;
    this.sortOffsetY = sortOffsetY;
    this.sortHeight = sortHeight;
    this.shadow = shadow;
  }
}
