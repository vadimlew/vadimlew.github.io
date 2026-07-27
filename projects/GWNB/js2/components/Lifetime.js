import { Component } from "../core/Component.js";
import { C } from "../utils/ComponentTypes.js";

export class Lifetime extends Component {
  constructor(frames = 60) {
    super(C.LIFETIME);
    this.frames = frames;
  }
}
